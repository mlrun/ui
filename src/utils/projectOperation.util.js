/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { CONFLICT_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

import orcaProjectsApi from '../api/projects-orca-api'
import { removeProject, setProjectTransition } from '../reducers/projectReducer'
import { pollTask } from './poll.util'
import {
  FAILED_STATE,
  IS_MF_MODE,
  PROJECT_CREATING_STATE,
  PROJECT_DELETING_STATE,
  SUCCEEDED_STATE
} from '../constants'

const SYNC_PROJECT_ACTION_TYPE = 'sync-project'
const PROJECTS_SUBDOMAIN = 'projects'
const POLL_DELAY = 2000
const MINUTE = 60 * 1000
const POLL_TIMEOUT_BY_OPERATION = {
  [PROJECT_CREATING_STATE]: 2 * MINUTE,
  [PROJECT_DELETING_STATE]: 15 * MINUTE
}

// ML-12907 documents the execution state as a name, while the OpenAPI spec exposes it as an int
// enum because the endpoint is a gRPC proxy. Accept either form.
const EXECUTION_STATE_BY_CODE = {
  1: 'created',
  2: 'dispatched',
  3: 'running',
  4: SUCCEEDED_STATE,
  5: FAILED_STATE
}

const readOpId = project => project?.status?.opId ?? project?.status?.op_id

/**
 * Reads `status.opId` (or the snake_case `status.op_id`) from either an axios response or a bare
 * project body, since the thunks unwrap them differently.
 * @param {Object} [payload] - the mutation's axios response or project body.
 * @returns {string|undefined} the operation id, or `undefined` when none is present.
 */
export const getProjectOperationId = payload => readOpId(payload?.data ?? payload)

/**
 * Whether an error is the compare-and-swap 409 the leader returns when another mutation raced
 * ahead. Always `false` outside ORIS.
 * @param {Object} [error] - an axios error.
 * @returns {boolean}
 */
export const isProjectOperationConflict = error =>
  IS_MF_MODE && error?.response?.status === CONFLICT_ERROR_STATUS_CODE

/**
 * Records that a lifecycle operation has been requested for a project, so its card can be shown as
 * transitional from the moment the request leaves the client rather than only once a later read of
 * the leader reflects it. A no-op outside ORIS.
 * @param {function} dispatch
 * @param {string} projectName
 * @param {string} operation - `'creating'`, `'deleting'` or `'updating'`.
 * @param {Object} [project] - parsed project snapshot kept until the leader lists it.
 */
export const startProjectTransition = (dispatch, projectName, operation, project) => {
  if (IS_MF_MODE) {
    dispatch(
      setProjectTransition({
        projectName,
        operation,
        polling: true,
        ...(project && { project })
      })
    )
  }
}

/**
 * Releases the project back to its normal look, whether the operation completed or never began.
 * A no-op outside ORIS.
 * @param {function} dispatch
 * @param {string} projectName
 */
export const endProjectTransition = (dispatch, projectName) => {
  if (IS_MF_MODE) {
    dispatch(setProjectTransition({ projectName, operation: null }))
  }
}

const readExecutionStatus = response => response?.data?.items?.[0]?.status

const getExecutionState = status => {
  const state = status?.state

  return typeof state === 'number' ? EXECUTION_STATE_BY_CODE[state] : state
}

// Previous attempts left a lastError or a non-empty attempts list, but the execution is still
// running: the driver is retrying. That is the issues tooltip, not a terminal outcome.
const executionHasRetrySignal = status =>
  Boolean(status?.lastError) || Boolean(status?.attempts?.length)

/**
 * Polls the trackable-action execution that carries out a project operation until it reaches a
 * terminal state. Hitting the operation deadline (or giving up on the execution endpoint) stops
 * this poll but leaves the card dimmed; a later list read reports that the project has settled.
 *
 * TODO: the poll is bounded by the operation deadline but is not cancelled on unmount, so leaving
 * the projects page mid-delete keeps it running for the rest of its 15 minute window. Wire the
 * page's existing terminatePollRef through here.
 * @param {string} opId - the operation id taken from `status.opId` of the mutation's 202 response.
 * @param {Object} options
 * @param {string} options.projectName
 * @param {function} options.dispatch
 * @param {string} [options.successMessage] - notification shown once the execution succeeds.
 * @param {string} [options.failureMessage] - fallback notification when the execution fails.
 * @param {function} [options.onSettled] - invoked with the terminal state (`succeeded` / `failed`).
 * @param {boolean} [options.removeProjectOnSuccess] - drop the project from the list before
 *     undimming, so a deleted card cannot flash as online while the list refresh is still in flight.
 * @param {string} [options.operation] - lifecycle operation; selects the poll timeout
 *     (2 minutes for create, 15 minutes for delete).
 * @returns {Promise} resolved with the last polling cycle's result, or rejected when the
 *     execution endpoint itself fails.
 */
const trackProjectOperation = (
  opId,
  {
    projectName,
    dispatch,
    successMessage,
    failureMessage,
    onSettled,
    removeProjectOnSuccess,
    operation
  }
) => {
  const deadline =
    Date.now() +
    (POLL_TIMEOUT_BY_OPERATION[operation] ?? POLL_TIMEOUT_BY_OPERATION[PROJECT_CREATING_STATE])
  let reportedIssue = false

  const markIssue = () => {
    if (reportedIssue) return

    reportedIssue = true
    dispatch(setProjectTransition({ projectName, hasSyncIssue: true }))
  }

  const stopPolling = () => dispatch(setProjectTransition({ projectName, polling: false }))

  const settle = (state, response) => {
    endProjectTransition(dispatch, projectName)

    if (state === SUCCEEDED_STATE && removeProjectOnSuccess) {
      dispatch(removeProject(projectName))
    }

    if (state === SUCCEEDED_STATE) {
      if (successMessage) {
        dispatch(setNotification({ status: 200, id: Math.random(), message: successMessage }))
      }
    } else {
      const lastError = response?.data?.items?.[0]?.status?.lastError

      showErrorNotification(dispatch, {}, '', lastError || failureMessage)
    }

    onSettled?.(state)
  }

  const isDone = response => {
    const status = readExecutionStatus(response)
    const state = getExecutionState(status)

    if ([SUCCEEDED_STATE, FAILED_STATE].includes(state)) {
      settle(state, response)

      return true
    }

    if (executionHasRetrySignal(status)) {
      markIssue()
    }

    if (Date.now() >= deadline) {
      markIssue()
      stopPolling()

      return true
    }

    return false
  }

  return pollTask(
    () =>
      orcaProjectsApi.getActionExecutions({
        correlationId: opId,
        actionType: SYNC_PROJECT_ACTION_TYPE,
        subdomain: PROJECTS_SUBDOMAIN,
        limit: 1
      }),
    isDone,
    { delay: POLL_DELAY }
  ).catch(error => {
    markIssue()
    stopPolling()

    throw error
  })
}

/**
 * Starts tracking a project mutation when the leader answered with an operation to follow. Returns
 * `false` when there is nothing to track — in ORIS the mutation is asynchronous and carries an
 * `opId`, while MLRun answers synchronously — so callers can keep their existing behaviour.
 * @param {Object} payload - the mutation's axios response or project body.
 * @param {Object} options - see `trackProjectOperation`.
 * @returns {boolean} whether an operation is being tracked.
 */
export const trackProjectMutation = (payload, options) => {
  if (!IS_MF_MODE) return false

  const opId = getProjectOperationId(payload)

  if (!opId) {
    endProjectTransition(options.dispatch, options.projectName)

    return false
  }

  // Giving up on the execution endpoint says nothing about the operation, which keeps converging on
  // its own. The card stays dimmed until a later list read reports that it has settled.
  trackProjectOperation(opId, options).catch(() => {})

  return true
}

/**
 * Copies `status.opId` from `latest` onto `project` without mutating either. Used after a 409 so
 * the retry carries the leader's current witness rather than the stale one.
 * @param {Object} project
 * @param {Object} latest - a project body or axios response carrying a fresh opId.
 * @returns {Object} a new project object.
 */
export const withLatestOpId = (project, latest) => ({
  ...project,
  status: {
    ...project?.status,
    opId: getProjectOperationId(latest)
  }
})

/**
 * Handles the compare-and-swap rejection the leader returns when another mutation raced ahead of
 * this one. Re-reads the project for a fresh opId, then lets the user retry.
 * @param {Object} error - an axios error.
 * @param {string} projectName
 * @param {function} dispatch
 * @param {function} [retry] - invoked with the freshly read project when the user retries.
 * @returns {boolean} whether the error was a conflict and has been reported.
 */
export const handleProjectOperationConflict = (error, projectName, dispatch, retry) => {
  if (!isProjectOperationConflict(error)) return false

  showErrorNotification(
    dispatch,
    error,
    '',
    `The project "${projectName}" was modified by another operation. Please review the latest state and retry.`,
    retry
      ? () =>
          orcaProjectsApi
            .getProject(projectName)
            .then(latest => retry(latest))
            .catch(readError =>
              showErrorNotification(
                dispatch,
                readError,
                '',
                `Failed to reload the project "${projectName}"`
              )
            )
      : undefined
  )

  return true
}
