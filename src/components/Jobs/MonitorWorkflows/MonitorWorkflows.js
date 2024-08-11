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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import classnames from 'classnames'

import FilterMenu from '../../FilterMenu/FilterMenu'
import WorkflowsTable from '../../../elements/WorkflowsTable/WorkflowsTable'

import {
  FILTER_ALL_ITEMS,
  GROUP_BY_NONE,
  GROUP_BY_WORKFLOW,
  JOBS_PAGE,
  MONITOR_WORKFLOWS_TAB,
  REQUEST_CANCELED
} from '../../../constants'
import { generateFilters, monitorWorkflowsActionCreator } from './monitorWorkflows.util'
import { JobsContext } from '../Jobs'
import { createJobsWorkflowsTabContent } from '../../../utils/createJobsContent'
import { datePickerPastOptions, PAST_WEEK_DATE_OPTION } from '../../../utils/datePicker.util'
import { setFilters } from '../../../reducers/filtersReducer'
import { useMode } from '../../../hooks/mode.hook'
import { usePods } from '../../../hooks/usePods.hook'
import detailsActions from '../../../actions/details'

import './monitorWorkflows.scss'

const MonitorWorkflows = ({ deleteWorkflows, fetchFunctionLogs, fetchWorkflows }) => {
  const [selectedFunction, setSelectedFunction] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [workflowsAreLoaded, setWorkflowsAreLoaded] = useState(false)
  const [workflowIsLoaded, setWorkflowIsLoaded] = useState(false)
  const [itemIsSelected, setItemIsSelected] = useState(false)
  const [selectedJob, setSelectedJob] = useState({})
  const workflowsStore = useSelector(state => state.workflowsStore)
  const filtersStore = useSelector(state => state.filtersStore)
  const params = useParams()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
  const abortJobRef = useRef(null)
  const abortControllerRef = useRef(new AbortController())

  usePods(dispatch, detailsActions.fetchJobPods, detailsActions.removePods, selectedJob)

  const filters = useMemo(() => generateFilters(), [])

  const tableContent = useMemo(
    () =>
      createJobsWorkflowsTabContent(
        workflowsStore.workflows.data,
        params.projectName,
        isStagingMode,
        !isEmpty(selectedJob)
      ),
    [isStagingMode, params.projectName, selectedJob, workflowsStore.workflows.data]
  )

  const getWorkflows = useCallback(
    filter => {
      abortControllerRef.current = new AbortController()

      fetchWorkflows(params.projectName, filter, {
        ui: {
          controller: abortControllerRef.current,
          setRequestErrorMessage
        }
      })
    },
    [fetchWorkflows, params.projectName, setRequestErrorMessage]
  )

  useEffect(() => {
    return () => {
      setWorkflowIsLoaded(false)
      setWorkflowsAreLoaded(false)
      setItemIsSelected(false)
      setSelectedJob({})
      setSelectedFunction({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [params.projectName, params.workflowId])

  useEffect(() => {
    return () => {
      deleteWorkflows()
      setWorkflowsAreLoaded(false)
    }
  }, [deleteWorkflows])

  useEffect(() => {
    if (!workflowsAreLoaded) {
      if (params.workflowId) {
        dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
      } else {
        if (filtersStore.saveFilters) {
          const filters = {
            state: filtersStore.state,
            dates: filtersStore.dates,
            saveFilters: false,
            groupBy: GROUP_BY_WORKFLOW
          }

          getWorkflows(filters)
          dispatch(setFilters(filters))
        } else if (workflowsStore.workflows.data.length === 0) {
          const pastWeekOption = datePickerPastOptions.find(
            option => option.id === PAST_WEEK_DATE_OPTION
          )
          const generatedDates = [...pastWeekOption.handler()]

          if (generatedDates.length === 1) {
            generatedDates.push(new Date())
          }
          const filters = {
            dates: {
              value: generatedDates,
              isPredefined: pastWeekOption.isPredefined,
              initialSelectedOptionId: pastWeekOption.id
            },
            state: FILTER_ALL_ITEMS,
            groupBy: GROUP_BY_WORKFLOW
          }

          dispatch(setFilters(filters))
          getWorkflows(filters)
        } else {
          getWorkflows({ ...filtersStore, groupBy: GROUP_BY_WORKFLOW })
          dispatch(setFilters({ groupBy: GROUP_BY_WORKFLOW }))
        }

        setWorkflowsAreLoaded(true)
      }
    }
  }, [
    dispatch,
    getWorkflows,
    params.workflowId,
    params.projectName,
    filtersStore,
    workflowsAreLoaded,
    workflowsStore.workflows.data.length
  ])

  return (
    <>
      <div className="monitor-workflows">
        {!params.workflowId && (
          <p className="monitor-workflows__subtitle">
            View running workflows and previously executed workflows
          </p>
        )}
        <div className="content__action-bar-wrapper">
          <div className={classnames(!params.workflowId && 'action-bar')}>
            <FilterMenu
              filters={filters}
              onChange={getWorkflows}
              page={JOBS_PAGE}
              tab={MONITOR_WORKFLOWS_TAB}
              withoutExpandButton
              hidden={Boolean(params.workflowId)}
            />
          </div>
        </div>
      </div>
      <WorkflowsTable
        backLink={`/projects/${params.projectName}/jobs/${MONITOR_WORKFLOWS_TAB}`}
        context={JobsContext}
        fetchFunctionLogs={fetchFunctionLogs}
        filters={filters}
        getWorkflows={getWorkflows}
        itemIsSelected={itemIsSelected}
        ref={{ abortJobRef }}
        requestErrorMessage={requestErrorMessage}
        selectedFunction={selectedFunction}
        selectedJob={selectedJob}
        setItemIsSelected={setItemIsSelected}
        setSelectedFunction={setSelectedFunction}
        setSelectedJob={setSelectedJob}
        setWorkflowIsLoaded={setWorkflowIsLoaded}
        tableContent={tableContent}
        workflowIsLoaded={workflowIsLoaded}
      />
    </>
  )
}

MonitorWorkflows.propTypes = {}

export default connect(null, {
  ...monitorWorkflowsActionCreator
})(React.memo(MonitorWorkflows))
