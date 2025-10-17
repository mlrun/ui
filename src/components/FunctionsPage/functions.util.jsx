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
import { debounce, get, isEmpty, isEqual } from 'lodash'

import {
  DETAILS_BUILD_LOG_TAB,
  FUNCTION_CREATING_STATE,
  ERROR_STATE,
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
  PANEL_FUNCTION_CREATE_MODE,
  FAILED_STATE,
  ALL_VERSIONS_PATH,
  BE_PAGE,
  FE_PAGE
} from '../../constants'
import tasksApi from '../../api/tasks-api'
import { BG_TASK_FAILED, BG_TASK_SUCCEEDED, pollTask } from '../../utils/poll.util'
import { fetchFunction } from '../../reducers/functionReducer'
import { generateObjectNotInTheListMessage } from '../../utils/generateMessage.util'
import { getFunctionLogs, getFunctionNuclioLogs } from '../../utils/getFunctionLogs'
import { parseFunction } from '../../utils/parseFunction'
import { parseIdentifier } from '../../utils'
import { setJobFunction } from '../../reducers/jobReducer'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

import Delete from 'igz-controls/images/delete.svg?react'
import Run from 'igz-controls/images/run.svg?react'
import Edit from 'igz-controls/images/edit.svg?react'
import Yaml from 'igz-controls/images/yaml.svg?react'
import DeployIcon from 'igz-controls/images/deploy-icon.svg?react'
import HistoryIcon from 'igz-controls/images/history.svg?react'

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
export const FUNCTIONS_FAILED_STATES = [FAILED_STATE, ERROR_STATE]
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
export const TRANSIENT_FUNCTION_STATUSES = [FUNCTION_PENDINDG_STATE, FUNCTION_RUNNING_STATE]

const handleFetchFunctionLogs = (
  dispatch,
  item,
  projectName,
  setDetailsLogs,
  fetchFunctionLogsTimeout,
  navigate,
  fetchData,
  filtersStore
) => {
  return getFunctionLogs(
    dispatch,
    fetchFunctionLogsTimeout,
    projectName,
    item.name,
    item.tag,
    setDetailsLogs,
    navigate,
    () => fetchData(filtersStore)
  )
}

const handleFetchFunctionApplicationLogs = (
  dispatch,
  item,
  projectName,
  setDetailsLogs,
  fetchFunctionNuclioLogsTimeout
) => {
  return getFunctionNuclioLogs(
    dispatch,
    fetchFunctionNuclioLogsTimeout,
    projectName,
    item.name,
    item.tag,
    setDetailsLogs
  )
}

const handleRemoveLogs = fetchFunctionLogsTimeout => {
  clearTimeout(fetchFunctionLogsTimeout.current)
  fetchFunctionLogsTimeout.current = null
}

const handleRemoveApplicationLogs = fetchFunctionNuclioLogsTimeout => {
  clearTimeout(fetchFunctionNuclioLogsTimeout.current)
  fetchFunctionNuclioLogsTimeout.current = null
}

export const generateFunctionsPageData = (
  dispatch,
  selectedFunction,
  fetchFunctionLogsTimeout,
  fetchFunctionNuclioLogsTimeout,
  navigate,
  fetchData,
  filtersStore
  // showAllVersion
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
      refreshLogs: (item, projectName, setDetailsLogs) => {
        if (selectedFunction.tag) {
          return handleFetchFunctionLogs(
            dispatch,
            item,
            projectName,
            setDetailsLogs,
            fetchFunctionLogsTimeout,
            navigate,
            fetchData,
            filtersStore
          )
        }
      },
      refreshAdditionalLogs: (item, projectName, setDetailsLogs) => {
        if (showAdditionalLogs && selectedFunction.tag) {
          return handleFetchFunctionApplicationLogs(
            dispatch,
            item,
            projectName,
            setDetailsLogs,
            fetchFunctionNuclioLogsTimeout
          )
        }
      },
      removeLogs: () => handleRemoveLogs(fetchFunctionLogsTimeout),
      removeAdditionalLogs: () => {
        if (showAdditionalLogs) {
          return () => handleRemoveApplicationLogs(fetchFunctionNuclioLogsTimeout)
        }
      },
      withLogsRefreshBtn: false,
      type: FUNCTIONS_PAGE
      // showAllVersions // todo uncomment or remove button from details when we decide about this btn in details
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
    { label: 'Image', id: 'image', hidden: selectedFunction.type === FUNCTION_TYPE_APPLICATION },
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
    {
      label: 'Code origin',
      id: 'codeOrigin',
      hidden: selectedFunction.type === FUNCTION_TYPE_APPLICATION
    },
    { label: 'Updated', id: 'updated' },
    {
      label: 'Default handler',
      id: 'defaultHandler',
      hidden: selectedFunction.type === FUNCTION_TYPE_APPLICATION
    },
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
  fetchFunction,
  isDetailsPopUp = false,
  isAllVersions,
  showAllVersions
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
              dispatch(setJobFunction(func.ui.originalContent))
              setJobWizardMode(PANEL_FUNCTION_CREATE_MODE)
            } else {
              showErrorNotification(dispatch, {}, '', 'Failed to retrieve function data')
            }
          })
        },
        hidden:
          !FUNCTION_RUN_KINDS.includes(func?.type) ||
          !FUNCTIONS_READY_STATES.includes(func?.state?.value) ||
          isDetailsPopUp
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
          !FUNCTIONS_EDITABLE_STATES.includes(func?.state?.value) ||
          isDetailsPopUp
      },
      {
        label: 'View YAML',
        icon: <Yaml />,
        disabled: functionIsDeleting,
        onClick: funcMin =>
          getFullFunction(funcMin).then(func => !isEmpty(func) && toggleConvertedYaml(func))
      },
      {
        label: 'Delete all versions',
        icon: <Delete />,
        className: 'danger',
        disabled: functionIsDeleting,
        onClick: onRemoveFunction,
        hidden: isDetailsPopUp || isAllVersions
      }
    ],
    [
      {
        id: 'show-all-versions',
        label: 'Show all versions',
        icon: <HistoryIcon />,
        disabled: functionIsDeleting,
        onClick: () => showAllVersions(func.name),
        hidden: isDetailsPopUp || isAllVersions
      },
      {
        id: 'build-and-run',
        label: 'Build and run',
        icon: <DeployIcon />,
        disabled: functionIsDeleting,
        onClick: funcMin =>
          getFullFunction(funcMin).then(func => !isEmpty(func) && buildAndRunFunc(func)),
        // todo: move out of "demo" mode and make additional changes as needed after the BE part is implemented.
        hidden:
          !isDemoMode ||
          func?.type !== FUNCTION_TYPE_JOB ||
          (func?.type === FUNCTION_TYPE_JOB && func?.state?.value !== FUNCTION_INITIALIZED_STATE) ||
          isDetailsPopUp
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
        hidden: !isDemoMode || func?.type !== FUNCTION_TYPE_SERVING || isDetailsPopUp
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
  (
    dispatch,
    navigate,
    fetchFunction,
    selectedFunctionMin,
    setSelectedFunction,
    projectName,
    functionId
  ) => {
    if (isEmpty(selectedFunctionMin) || !functionId) {
      setSelectedFunction({})
    } else {
      const { uid: paramsHash } = parseIdentifier(functionId)
      const { name, hash, tag } = selectedFunctionMin

      if (paramsHash === hash) {
        fetchAndParseFunction(dispatch, fetchFunction, projectName, name, hash, tag, true)
          .then(parsedFunction => {
            setSelectedFunction(parsedFunction)
          })
          .catch(() => {
            setSelectedFunction({})
            navigate(`/projects/${projectName}/functions${window.location.search}`, {
              replace: true
            })
          })
      }
    }
  },
  20
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
  return dispatch(
    fetchFunction({ project: projectName, name: funcName, hash: funcHash, tag: funcTag })
  )
    .unwrap()
    .then(func => {
      return parseFunction(func, projectName)
    })
    .catch(error => {
      showErrorNotification(dispatch, error)

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

export const checkForSelectedFunction = debounce(
  (
    paginatedFunctions,
    functions,
    funcId,
    funcNameParam,
    navigate,
    projectName,
    setSelectedFunction,
    dispatch,
    isAllVersions,
    searchParams,
    paginationConfigRef,
    setSearchParams,
    lastCheckedFunctionIdRef
  ) => {
    if (funcId) {
      const searchBePage = parseInt(searchParams.get(BE_PAGE))
      const configBePage = paginationConfigRef.current[BE_PAGE]

      if (
        functions &&
        searchBePage === configBePage &&
        lastCheckedFunctionIdRef.current !== funcId
      ) {
        const { tag, uid: hash } = parseIdentifier(funcId)
        lastCheckedFunctionIdRef.current = funcId

        fetchAndParseFunction(dispatch, fetchFunction, projectName, funcNameParam, hash, tag).then(
          selectedFunction => {
            if (!selectedFunction) {
              navigate(
                `/projects/${projectName}/functions${isAllVersions ? `/${funcNameParam}/${ALL_VERSIONS_PATH}` : ''}${window.location.search}`,
                { replace: true }
              )
            } else {
              const findFunctionIndex = functions => {
                return functions.findIndex(func => {
                  const funcData = func.data ?? func

                  if (tag) {
                    return isEqual(funcData.tag, tag) && isEqual(funcData.name, funcNameParam)
                  } else {
                    return isEqual(funcData.hash, hash) && isEqual(funcData.name, funcNameParam)
                  }
                })
              }

              const itemIndexInPaginatedList = findFunctionIndex(paginatedFunctions)
              const itemIndexInMainList =
                itemIndexInPaginatedList !== -1
                  ? itemIndexInPaginatedList
                  : findFunctionIndex(functions)

              if (itemIndexInPaginatedList === -1) {
                if (itemIndexInMainList > -1) {
                  const { fePageSize } = paginationConfigRef.current

                  setSearchParams(prevSearchParams => {
                    prevSearchParams.set(FE_PAGE, Math.ceil((itemIndexInMainList + 1) / fePageSize))

                    return prevSearchParams
                  })
                } else {
                  selectedFunction.ui.infoMessage = generateObjectNotInTheListMessage('function')
                }
              }

              setSelectedFunction(prevState => {
                return isEqual(prevState, selectedFunction) ? prevState : selectedFunction
              })
            }
          }
        )
      }
    } else {
      setSelectedFunction({})
    }
  },
  30
)
