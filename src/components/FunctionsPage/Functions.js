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
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import FunctionsView from './FunctionsView'
import JobWizard from '../JobWizard/JobWizard'
import NewFunctionPopUp from '../../elements/NewFunctionPopUp/NewFunctionPopUp'

import {
  TAG_LATEST,
  REQUEST_CANCELED,
  DETAILS_BUILD_LOG_TAB,
  JOB_DEFAULT_OUTPUT_PATH,
  DATES_FILTER,
  NAME_FILTER,
  SHOW_UNTAGGED_FILTER,
  GROUP_BY_NONE,
  ALL_VERSIONS_PATH
} from '../../constants'
import {
  checkForSelectedFunction,
  generateActionsMenu,
  generateFunctionsPageData,
  pollDeletingFunctions,
  searchFunctionItem,
  setFullSelectedFunction
} from './functions.util'
import createFunctionsRowData from '../../utils/createFunctionsRowData'
import functionsActions from '../../actions/functions'
import { DANGER_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { isBackgroundTaskRunning } from '../../utils/poll.util'
import { isDetailsTabExists } from '../../utils/link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseFunctions } from '../../utils/parseFunctions'
import { setFilters } from '../../reducers/filtersReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { useMode } from '../../hooks/mode.hook'
import { useVirtualization } from '../../hooks/useVirtualization.hook'
import { useInitialTableFetch } from '../../hooks/useInitialTableFetch.hook'
import { runNewJob } from '../../reducers/jobReducer'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import {
  ANY_TIME_DATE_OPTION,
  datePickerPastOptions,
  getDatePickerFilterValue,
  PAST_WEEK_DATE_OPTION
} from '../../utils/datePicker.util'
import { toggleYaml } from '../../reducers/appReducer'
import { getSavedSearchParams, transformSearchParams } from '../../utils/filter.util'

import cssVariables from './functions.scss'

const Functions = ({
  deleteFunction,
  deployFunction,
  fetchFunction,
  fetchFunctions,
  functionsStore,
  isAllVersions = false,
  removeFunctionsError,
  removeNewFunction
}) => {
  const [confirmData, setConfirmData] = useState(null)
  const [functions, setFunctions] = useState([])
  const [functionVersions, setFunctionVersions] = useState([])
  const [selectedFunctionMin, setSelectedFunctionMin] = useState({})
  const [selectedFunction, setSelectedFunction] = useState({})
  const [editableItem, setEditableItem] = useState(null)
  const [functionsPanelIsOpen, setFunctionsPanelIsOpen] = useState(false)
  const [jobWizardIsOpened, setJobWizardIsOpened] = useState(false)
  const [jobWizardMode, setJobWizardMode] = useState(null)
  const filtersStore = useSelector(store => store.filtersStore)
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [deletingFunctions, setDeletingFunctions] = useState({})
  const abortControllerRef = useRef(new AbortController())
  const fetchFunctionLogsTimeout = useRef(null)
  const fetchFunctionNuclioLogsTimeout = useRef(null)
  const terminatePollRef = useRef(null)
  const { isDemoMode, isStagingMode } = useMode()
  const params = useParams()
  const [, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const functionsFiltersConfig = useMemo(() => {
    return {
      [NAME_FILTER]: { label: 'Name:', initialValue: '', hidden: isAllVersions },
      [DATES_FILTER]: {
        label: 'Updated:',
        initialValue: getDatePickerFilterValue(
          datePickerPastOptions,
          isAllVersions ? ANY_TIME_DATE_OPTION : PAST_WEEK_DATE_OPTION
        )
      },
      [SHOW_UNTAGGED_FILTER]: {
        label: 'Show untagged:',
        initialValue: true,
        isModal: true,
        hidden: !isAllVersions
      }
    }
  }, [isAllVersions])

  const functionsFilters = useFiltersFromSearchParams(functionsFiltersConfig)

  const terminateDeleteTasksPolling = useCallback(() => {
    terminatePollRef?.current?.()
    setDeletingFunctions({})
  }, [])

  const fetchData = useCallback(
    filters => {
      terminateDeleteTasksPolling()
      abortControllerRef.current = new AbortController()
      const requestParams = {
        format: 'minimal',
        tag: TAG_LATEST
      }

      if (isAllVersions) {
        delete requestParams.tag
        requestParams.name = params.funcName
        setFunctionVersions([])
      } else {
        setFunctions([])
      }

      return fetchFunctions(params.projectName, filters, {
        ui: {
          controller: abortControllerRef.current,
          setRequestErrorMessage
        },
        params: requestParams
      }).then(functions => {
        if (functions?.length > 0) {
          const newFunctions = parseFunctions(functions, params.projectName)
          const deletingFunctions = newFunctions.reduce((acc, func) => {
            if (func.deletion_task_id && !func.deletion_error && !acc[func.deletion_task_id]) {
              acc[func.deletion_task_id] = {
                name: func.name
              }
            }

            return acc
          }, {})

          if (!isEmpty(deletingFunctions)) {
            setDeletingFunctions(deletingFunctions)
            pollDeletingFunctions(
              params.projectName,
              terminatePollRef,
              deletingFunctions,
              () => fetchData(filters),
              dispatch
            )
          }

          if (isAllVersions) {
            setFunctionVersions(newFunctions)
          } else {
            setFunctions(newFunctions)
          }

          return newFunctions
        } else {
          const paramsFunction = searchFunctionItem(
            params.id,
            params.projectName,
            params.funcName,
            [],
            dispatch,
            true
          )

          if (!paramsFunction) {
            navigate(
              `/projects/${params.projectName}/functions${isAllVersions ? getSavedSearchParams(window.location.search) : window.location.search}`,
              {
                replace: true
              }
            )
          }

          if (isAllVersions) {
            setFunctionVersions([])
          } else {
            setFunctions([])
          }
        }
      })
    },
    [
      dispatch,
      fetchFunctions,
      isAllVersions,
      navigate,
      params.funcName,
      params.id,
      params.projectName,
      terminateDeleteTasksPolling
    ]
  )

  const refreshFunctions = useCallback(
    filters => {
      setFunctions([])
      setSelectedFunctionMin({})

      return fetchData(filters)
    },
    [fetchData]
  )

  const tableContent = useMemo(
    () =>
      (isAllVersions ? functionVersions : functions).map(contentItem =>
        createFunctionsRowData(contentItem, params.projectName, Boolean(isAllVersions))
      ),
    [functionVersions, functions, isAllVersions, params.projectName]
  )

  const removeFunction = useCallback(
    func => {
      deleteFunction(func.name, params.projectName).then(response => {
        if (isBackgroundTaskRunning(response)) {
          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: 'Function deletion in progress'
            })
          )

          setDeletingFunctions(prevDeletingFunctions => {
            const newDeletingFunctions = {
              ...prevDeletingFunctions,
              [response.data.metadata.name]: {
                name: func.name
              }
            }

            pollDeletingFunctions(
              params.projectName,
              terminatePollRef,
              newDeletingFunctions,
              () => fetchData(functionsFilters),
              dispatch
            )

            return newDeletingFunctions
          })

          if (!isEmpty(selectedFunction)) {
            setSelectedFunctionMin({})
            navigate(`/projects/${params.projectName}/functions${window.location.search}`, {
              replace: true
            })
          }
        }
      })

      setConfirmData(null)
    },
    [
      deleteFunction,
      dispatch,
      fetchData,
      functionsFilters,
      navigate,
      params.projectName,
      selectedFunction
    ]
  )

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const onRemoveFunction = useCallback(
    func => {
      setConfirmData({
        item: func,
        header: 'Delete function?',
        message: `You try to delete function "${func.name}". Deleted functions cannot be restored.`,
        btnCancelLabel: 'Cancel',
        btnCancelVariant: TERTIARY_BUTTON,
        btnConfirmLabel: 'Delete',
        btnConfirmVariant: DANGER_BUTTON,
        rejectHandler: () => setConfirmData(null),
        confirmHandler: () => removeFunction(func)
      })
    },
    [removeFunction]
  )

  const buildAndRunFunc = useCallback(
    func => {
      const data = {
        function: {
          kind: func.type,
          metadata: {
            credentials: {
              access_key: func.access_key
            },
            labels: func.labels,
            name: func.name,
            project: func.project,
            tag: func.tag
          },
          spec: {
            args: func.args,
            base_spec: func.base_spec,
            build: func.build,
            command: func.command,
            default_class: func.default_class,
            default_handler: func.default_handler,
            description: func.description,
            disable_auto_mount: func.disable_auto_mount,
            env: func.env,
            error_stream: func.error_stream,
            graph: func.graph,
            image: func.image,
            parameters: func.parameters,
            preemption_mode: func.preemption_mode,
            priority_class_name: func.priority_class_name,
            resources: func.resources,
            secret_sources: func.secret_sources,
            track_models: func.track_models,
            volume_mounts: func.volume_mounts,
            volumes: func.volumes
          }
        }
      }

      deployFunction(data)
        .then(result => {
          const data = result.data.data
          const postData = {
            function: {
              metadata: {
                credentials: {
                  access_key: data.metadata.credentials.access_key
                }
              },
              spec: {
                build: data.spec.build,
                env: data.spec.env,
                image: data.spec.image,
                node_selector: data.spec.node_selector,
                preemption_mode: data.spec.preemption_mode,
                priority_class_name: data.spec.priority_class_name,
                resources: data.spec.resources,
                volume_mounts: data.spec.volume_mounts,
                volumes: data.spec.volumes
              }
            },
            task: {
              metadata: {
                labels: data.metadata.labels,
                name: data.metadata.name,
                project: data.metadata.project
              },
              spec: {
                function: `${func.project}/${func.name}@${func.hash}`,
                handler: data.spec.default_handler,
                input_path: '',
                inputs: {},
                output_path: JOB_DEFAULT_OUTPUT_PATH,
                parameters: {}
              }
            }
          }

          return dispatch(runNewJob({ postData }))
        })
        .unwrap()
        .then(() => {
          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: 'Function is built and ran successfully.'
            })
          )
          refreshFunctions(functionsFilters)
        })
        .catch(error => {
          showErrorNotification(dispatch, error, 'Failed to build and run function.', '', () => {
            buildAndRunFunc(func)
          })
        })
    },
    [deployFunction, dispatch, functionsFilters, refreshFunctions]
  )

  const showAllVersions = useCallback(
    funcName => {
      navigate(
        `/projects/${params.projectName}/functions/${funcName}/${ALL_VERSIONS_PATH}?${transformSearchParams(window.location.search)}`
      )
    },
    [navigate, params.projectName]
  )

  const pageData = useMemo(
    () =>
      generateFunctionsPageData(
        dispatch,
        selectedFunction,
        fetchFunctionLogsTimeout,
        fetchFunctionNuclioLogsTimeout,
        navigate,
        fetchData,
        filtersStore,
        isAllVersions ? null : () => showAllVersions(selectedFunction.name)
      ),
    [dispatch, fetchData, filtersStore, navigate, isAllVersions, selectedFunction, showAllVersions]
  )

  const actionsMenu = useMemo(
    () => func =>
      generateActionsMenu(
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
        false,
        isAllVersions,
        showAllVersions
      ),
    [
      dispatch,
      isDemoMode,
      isStagingMode,
      onRemoveFunction,
      toggleConvertedYaml,
      buildAndRunFunc,
      deletingFunctions,
      selectedFunction,
      fetchFunction,
      isAllVersions,
      showAllVersions
    ]
  )

  useEffect(() => {
    setFullSelectedFunction(
      dispatch,
      navigate,
      fetchFunction,
      selectedFunctionMin,
      setSelectedFunction,
      params.projectName
    )
  }, [dispatch, fetchFunction, navigate, params.projectName, selectedFunctionMin])

  useInitialTableFetch({
    fetchData,
    filters: functionsFilters,
    requestTrigger: isAllVersions
  })

  useEffect(() => {
    const abortController = abortControllerRef.current

    return () => {
      setSelectedFunctionMin({})
      setFunctions([])
      setFunctionVersions([])
      abortController.abort(REQUEST_CANCELED)
    }
  }, [params.projectName, isAllVersions])

  useEffect(() => {
    if (params.id && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, pageData.details.menu, location, params.id, params.tab])

  useEffect(() => {
    checkForSelectedFunction(
      isAllVersions ? functionVersions : functions,
      params.id,
      params.funcName,
      navigate,
      params.projectName,
      setSelectedFunctionMin,
      dispatch,
      isAllVersions
    )
  }, [
    dispatch,
    functions,
    navigate,
    params.projectName,
    params.id,
    functionVersions,
    isAllVersions,
    params.funcName
  ])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  const filtersChangeCallback = filters => {
    refreshFunctions(filters)
  }

  const retryRequestCallback = useCallback(() => {
    refreshFunctions(functionsFilters)
  }, [functionsFilters, refreshFunctions])

  const handleSelectFunction = item => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
  }

  const closePanel = () => {
    setFunctionsPanelIsOpen(false)
    setEditableItem(null)
    removeNewFunction()

    if (functionsStore.error) {
      removeFunctionsError()
    }
  }

  const createFunctionSuccess = isEditMode => {
    setEditableItem(null)
    setFunctionsPanelIsOpen(false)
    removeNewFunction()

    return fetchData().then(() => {
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: isEditMode ? 'Function edited successfully' : 'Function created successfully'
        })
      )
    })
  }

  const handleDeployFunctionSuccess = ready => {
    let { name, tag } = functionsStore.newFunction.metadata
    const tab = ready === false ? DETAILS_BUILD_LOG_TAB : 'overview'

    tag ||= TAG_LATEST

    setFunctionsPanelIsOpen(false)
    setEditableItem(null)
    removeNewFunction()

    return fetchData(functionsFilters).then(functions => {
      if (functions.length) {
        const currentItem = functions.find(func => func.name === name && func.tag === tag)

        if (currentItem) {
          // todo need better logic for searching currentItem for cases when the function has no tag
          navigate(
            `/projects/${params.projectName}/functions/${params.funcName}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/@${currentItem.hash}/${tab}${window.location.search}`
          )
        }
        dispatch(
          setNotification({
            status: 200,
            id: Math.random(),
            message: 'Function was deployed'
          })
        )
      }
    })
  }

  const handleDeployFunctionFailure = error => {
    const { name, tag } = functionsStore.newFunction.metadata

    setFunctionsPanelIsOpen(false)
    removeNewFunction()

    return fetchData().then(functions => {
      if (functions) {
        const currentItem = functions.find(func => func.name === name && func.tag === tag)

        showErrorNotification(dispatch, error, '', 'Failed to deploy the function')

        if (currentItem) {
          // todo need better logic for searching currentItem for cases when the function has no tag
          navigate(
            `/projects/${params.projectName}/functions/${params.funcName}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/@${currentItem.hash}/overview${window.location.search}`
          )
        }
      }
    })
  }

  const getPopUpTemplate = useCallback(
    action => {
      return (
        <NewFunctionPopUp
          key={action}
          action={action}
          currentProject={params.projectName}
          isCustomPosition
          setFunctionsPanelIsOpen={setFunctionsPanelIsOpen}
        />
      )
    },
    [params.projectName]
  )

  const handleCancel = () => {
    setSelectedFunctionMin({})
  }

  useEffect(() => {
    if (!jobWizardIsOpened && jobWizardMode) {
      openPopUp(JobWizard, {
        params,
        onWizardClose: () => {
          setJobWizardMode(null)
          setJobWizardIsOpened(false)
        },
        mode: jobWizardMode
      })

      setJobWizardIsOpened(true)
    }
  }, [editableItem, jobWizardIsOpened, jobWizardMode, params])

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: tableContent,
      selectedItem: selectedFunction
    },
    heightData: {
      headerRowHeight: cssVariables.functionsHeaderRowHeight,
      rowHeight: cssVariables.functionsRowHeight,
      rowHeightExtended: cssVariables.functionsRowHeightExtended
    },
    activateTableScroll: true
  })

  return (
    <FunctionsView
      actionsMenu={actionsMenu}
      closePanel={closePanel}
      confirmData={confirmData}
      createFunctionSuccess={createFunctionSuccess}
      editableItem={editableItem}
      filters={functionsFilters}
      filtersChangeCallback={filtersChangeCallback}
      filtersStore={filtersStore}
      functionsFiltersConfig={functionsFiltersConfig}
      functionsPanelIsOpen={functionsPanelIsOpen}
      functionsStore={functionsStore}
      getPopUpTemplate={getPopUpTemplate}
      handleCancel={handleCancel}
      handleDeployFunctionFailure={handleDeployFunctionFailure}
      handleDeployFunctionSuccess={handleDeployFunctionSuccess}
      handleSelectFunction={handleSelectFunction}
      isAllVersions={isAllVersions}
      isDemoMode={isDemoMode}
      pageData={pageData}
      requestErrorMessage={requestErrorMessage}
      retryRequest={retryRequestCallback}
      selectedFunction={selectedFunction}
      setSearchParams={setSearchParams}
      tableContent={tableContent}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

export default connect(({ functionsStore }) => ({ functionsStore }), {
  ...functionsActions
})(React.memo(Functions))
