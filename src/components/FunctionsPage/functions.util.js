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
import React from 'react'
import { debounce, get, isEmpty } from 'lodash'

import {
  DETAILS_BUILD_LOG_TAB,
  FUNCTION_CREATING_STATE,
  FUNCTION_ERROR_STATE,
  FUNCTION_FAILED_STATE,
  FUNCTION_INITIALIZED_STATE,
  FUNCTION_PENDINDG_STATE,
  FUNCTION_READY_STATE,
  FUNCTION_RUN_KINDS,
  FUNCTION_RUNNING_STATE,
  FUNCTION_TYPE_APPLICATION,
  FUNCTION_TYPE_JOB,
  FUNCTION_TYPE_LOCAL,
  FUNCTION_TYPE_NUCLIO,
  FUNCTION_TYPE_REMOTE,
  FUNCTION_TYPE_SERVING,
  FUNCTIONS_PAGE,
  NAME_FILTER,
  PANEL_FUNCTION_CREATE_MODE,
  SHOW_UNTAGGED_FILTER
} from '../../constants'
import jobsActions from '../../actions/jobs'
import tasksApi from '../../api/tasks-api'
import { BG_TASK_FAILED, BG_TASK_SUCCEEDED, pollTask } from '../../utils/poll.util'
import { parseFunction } from '../../utils/parseFunction'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'

import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'
import { ReactComponent as DeployIcon } from 'igz-controls/images/deploy-icon.svg'

export const page = 'FUNCTIONS'
export const detailsMenu = [
  {
    id: 'overview',
    label: 'overview'
  },
  {
    id: 'code',
    label: 'code'
  },
  {
    id: DETAILS_BUILD_LOG_TAB,
    label: 'build log'
  }
]
export const FUNCTIONS_FAILED_STATES = [FUNCTION_FAILED_STATE, FUNCTION_ERROR_STATE]
export const FUNCTIONS_READY_STATES = [FUNCTION_READY_STATE]
export const FUNCTIONS_EDITABLE_STATES = [
  FUNCTION_CREATING_STATE,
  FUNCTION_INITIALIZED_STATE,
  ...FUNCTIONS_READY_STATES,
  ...FUNCTIONS_FAILED_STATES
]
export const infoHeaders = [
  { label: 'Name', id: 'name' },
  { label: 'Kind', id: 'type' },
  { label: 'Hash', id: 'hash' },
  { label: 'Version tag', id: 'tag' },
  { label: 'Code origin', id: 'codeOrigin' },
  { label: 'Updated', id: 'updated' },
  { label: 'Code Entry Point', id: 'command' },
  { label: 'Default handler', id: 'defaultHandler' },
  { label: 'Image', id: 'image' },
  { label: 'Description', id: 'description' }
]
export const filters = [
  { type: NAME_FILTER, initialValue: '', label: 'Name:' },
  { type: SHOW_UNTAGGED_FILTER, label: 'Show untagged' }
]
export const TRANSIENT_FUNCTION_STATUSES = [FUNCTION_PENDINDG_STATE, FUNCTION_RUNNING_STATE]

export const generateFunctionsPageData = (
  selectedFunction,
  handleFetchFunctionLogs,
  handleFetchFunctionApplicationLogs,
  handleRemoveLogs,
  handleRemoveApplicationLogs
) => {
  const showAdditionalLogs = selectedFunction.type === FUNCTION_TYPE_APPLICATION

  return {
    page,
    details: {
      additionalLogsTitle: 'Function',
      logsTitle: 'Application',
      menu: generateFunctionsDetailsMenu(selectedFunction),
      infoHeaders: generateFunctionsInfoHeaders(selectedFunction),
      logsNoDataMessage: selectedFunction.tag
        ? 'No data to show'
        : 'Cannot show build logs for an untagged function.',
      refreshLogs: Boolean(selectedFunction.tag) && handleFetchFunctionLogs,
      refreshAdditionalLogs:
        showAdditionalLogs && Boolean(selectedFunction.tag) && handleFetchFunctionApplicationLogs,
      removeLogs: handleRemoveLogs,
      removeAdditionalLogs: showAdditionalLogs && handleRemoveApplicationLogs,
      withLogsRefreshBtn: false,
      type: FUNCTIONS_PAGE
    }
  }
}

const generateFunctionsDetailsMenu = selectedFunction => [
  {
    id: 'overview',
    label: 'overview'
  },
  {
    id: 'code',
    label: 'code',
    hidden: selectedFunction.type === FUNCTION_TYPE_APPLICATION
  },
  {
    id: DETAILS_BUILD_LOG_TAB,
    label: 'build log'
  }
]

const generateFunctionsInfoHeaders = selectedFunction => {
  return [
    { label: 'Name', id: 'name' },
    { label: 'Kind', id: 'type' },
    { label: 'Code entry point', id: 'command' },
    {
      label: 'Internal URL',
      id: 'internalUrl',
      hidden: selectedFunction.type !== FUNCTION_TYPE_APPLICATION
    },
    { label: 'Image', id: 'image' },
    {
      label: 'Application image',
      id: 'applicationImage',
      hidden: selectedFunction.type !== FUNCTION_TYPE_APPLICATION
    },
    { label: 'Version tag', id: 'tag' },
    { label: 'Hash', id: 'hash' },
    {
      label: 'Internal port',
      id: 'internalPort',
      hidden: selectedFunction.type !== FUNCTION_TYPE_APPLICATION
    },
    { label: 'Code origin', id: 'codeOrigin' },
    { label: 'Updated', id: 'updated' },
    { label: 'Default handler', id: 'defaultHandler' },
    { label: 'Description', id: 'description' }
  ]
}

export const getFunctionsEditableTypes = isStagingMode => {
  const editableTypes = [FUNCTION_TYPE_JOB, FUNCTION_TYPE_LOCAL, '']

  if (isStagingMode) {
    editableTypes.push(FUNCTION_TYPE_SERVING)
  }

  return editableTypes
}
export const getFunctionImage = func => {
  return func.type === FUNCTION_TYPE_NUCLIO ||
    func.type === FUNCTION_TYPE_SERVING ||
    func.type === FUNCTION_TYPE_REMOTE
    ? func.container_image
    : func.image
}

export const generateActionsMenu = (
  dispatch,
  func,
  isDemoMode,
  isStagingMode,
  setJobWizardMode,
  setFunctionsPanelIsOpen,
  setEditableItem,
  onRemoveFunction,
  toggleConvertedYaml,
  buildAndRunFunc,
  deletingFunctions,
  selectedFunction,
  fetchFunction
) => {
  const functionIsDeleting = isFunctionDeleting(func, deletingFunctions)
  const getFullFunction = funcMin => {
    return chooseOrFetchFunction(selectedFunction, dispatch, fetchFunction, funcMin)
  }

  return [
    [
      {
        id: 'run',
        label: 'Run',
        icon: <Run />,
        disabled: functionIsDeleting,
        onClick: funcMin => {
          getFullFunction(funcMin).then(func => {
            if (func?.project && func?.name && func?.hash && func?.ui?.originalContent) {
              dispatch(jobsActions.fetchJobFunctionSuccess(func.ui.originalContent))
              setJobWizardMode(PANEL_FUNCTION_CREATE_MODE)
            } else {
              showErrorNotification(dispatch, {}, '', 'Failed to retrieve function data')
            }
          })
        },
        hidden:
          !FUNCTION_RUN_KINDS.includes(func?.type) ||
          !FUNCTIONS_READY_STATES.includes(func?.state?.value)
      },
      {
        label: 'Edit',
        icon: <Edit />,
        disabled: functionIsDeleting,
        onClick: funcMin => {
          getFullFunction(funcMin).then(func => {
            if (!isEmpty(func)) {
              setFunctionsPanelIsOpen(true)
              setEditableItem(func)
            }
          })
        },
        hidden:
          !isDemoMode ||
          !getFunctionsEditableTypes(isStagingMode).includes(func?.type) ||
          !FUNCTIONS_EDITABLE_STATES.includes(func?.state?.value)
      },
      {
        label: 'View YAML',
        icon: <Yaml />,
        disabled: functionIsDeleting,
        onClick: funcMin =>
          getFullFunction(funcMin).then(func => !isEmpty(func) && toggleConvertedYaml(func))
      },
      {
        label: 'Delete',
        icon: <Delete />,
        className: 'danger',
        disabled: functionIsDeleting,
        onClick: onRemoveFunction
      }
    ],
    [
      {
        id: 'build-and-run',
        label: 'Build and run',
        icon: <DeployIcon />,
        disabled: functionIsDeleting,
        onClick: funcMin =>
          getFullFunction(funcMin).then(func => !isEmpty(func) && buildAndRunFunc(func)),
        hidden:
          func?.type !== FUNCTION_TYPE_JOB ||
          (func?.type === FUNCTION_TYPE_JOB && func?.state?.value !== FUNCTION_INITIALIZED_STATE)
      },
      {
        id: 'deploy',
        label: 'Deploy',
        icon: <DeployIcon />,
        disabled: functionIsDeleting,
        onClick: funcMin => {
          getFullFunction(funcMin).then(func => {
            if (!isEmpty(func)) {
              setFunctionsPanelIsOpen(true)
              setEditableItem(func)
            }
          })
        },
        hidden: !isDemoMode || func?.type !== FUNCTION_TYPE_SERVING
      }
    ]
  ]
}

export const pollDeletingFunctions = (
  project,
  terminatePollRef,
  deletingFunctions,
  refresh,
  dispatch
) => {
  const taskIds = Object.keys(deletingFunctions)

  const pollMethod = () => {
    if (taskIds.length === 1) {
      return tasksApi.getProjectBackgroundTask(project, taskIds[0])
    }

    return tasksApi.getProjectBackgroundTasks(project)
  }

  const isDone = result => {
    const tasks = taskIds.length === 1 ? [result.data] : get(result, 'data.background_tasks', [])
    const finishedTasks = tasks.filter(
      task =>
        deletingFunctions?.[task.metadata.name] &&
        [BG_TASK_SUCCEEDED, BG_TASK_FAILED].includes(task.status?.state)
    )

    if (finishedTasks.length > 0) {
      finishedTasks.forEach(task => {
        if (task.status.state === BG_TASK_SUCCEEDED) {
          functionDeletingSuccessHandler(dispatch, deletingFunctions[task.metadata.name])
        } else {
          showErrorNotification(dispatch, {}, task.status.error || 'Failed to delete the function')
        }
      })

      refresh(project)
    }

    return finishedTasks.length > 0
  }

  terminatePollRef?.current?.()
  terminatePollRef.current = null

  pollTask(pollMethod, isDone, { terminatePollRef })
}

export const setFullSelectedFunction = debounce(
  (dispatch, navigate, fetchFunction, selectedFunctionMin, setSelectedFunction, projectName) => {
    if (isEmpty(selectedFunctionMin)) {
      setSelectedFunction({})
    } else {
      const { name, hash, tag } = selectedFunctionMin

      fetchAndParseFunction(dispatch, fetchFunction, projectName, name, hash, tag, true)
        .then(parsedFunction => {
          setSelectedFunction(parsedFunction)
        })
        .catch(error => {
          setSelectedFunction({})
          navigate(`/projects/${projectName}/functions`, { replace: true })
        })
    }
  },
  10
)

const functionDeletingSuccessHandler = (dispatch, func) => {
  dispatch(
    setNotification({
      status: 200,
      id: Math.random(),
      message: `Function ${func.name} is successfully deleted`
    })
  )
}

const isFunctionDeleting = (func, deletingFunctions) => {
  return Object.values(deletingFunctions).some(deletingFunction => {
    return deletingFunction.name === func?.name
  })
}

const fetchAndParseFunction = (
  dispatch,
  fetchFunction,
  projectName,
  funcName,
  funcHash,
  funcTag,
  returnError
) => {
  return fetchFunction(projectName, funcName, funcHash, funcTag)
    .then(func => {
      return parseFunction(func, projectName)
    })
    .catch(error => {
      showErrorNotification(dispatch, error, '', 'Failed to retrieve function data')

      if (returnError) {
        return Promise.reject(error)
      }
    })
}

const chooseOrFetchFunction = (selectedFunction, dispatch, fetchFunction, funcMin) => {
  if (!isEmpty(selectedFunction)) return Promise.resolve(selectedFunction)

  return fetchAndParseFunction(
    dispatch,
    fetchFunction,
    funcMin?.project,
    funcMin?.name,
    funcMin?.hash,
    funcMin?.tag
  )
}
