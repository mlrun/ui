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
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import FunctionsView from './FunctionsView'
import JobWizard from '../JobWizard/JobWizard'
import NewFunctionPopUp from '../../elements/NewFunctionPopUp/NewFunctionPopUp'

import {
  FUNCTIONS_PAGE,
  GROUP_BY_NAME,
  TAG_LATEST,
  REQUEST_CANCELED,
  DETAILS_BUILD_LOG_TAB,
  JOB_DEFAULT_OUTPUT_PATH,
  DATES_FILTER,
  NAME_FILTER,
  SHOW_UNTAGGED_FILTER,
  FUNCTION_FILTERS,
  FILTER_MENU,
  FILTER_MENU_MODAL
} from '../../constants'
import {
  checkForSelectedFunction,
  generateActionsMenu,
  generateFunctionsPageData,
  pollDeletingFunctions,
  searchFunctionItem,
  setFullSelectedFunction
} from './functions.util'
import {
  ANY_TIME_DATE_OPTION,
  datePickerPastOptions,
  getDatePickerFilterValue
} from '../../utils/datePicker.util'
import createFunctionsRowData from '../../utils/createFunctionsRowData'
import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import { DANGER_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { getFunctionIdentifier } from '../../utils/getUniqueIdentifier'
import { getFunctionNuclioLogs, getFunctionLogs } from '../../utils/getFunctionLogs'
import { isBackgroundTaskRunning } from '../../utils/poll.util'
import { isDetailsTabExists } from '../../utils/link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseFunctions } from '../../utils/parseFunctions'
import { setFilters, setFiltersValues, setModalFiltersValues } from '../../reducers/filtersReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useMode } from '../../hooks/mode.hook'
import { useVirtualization } from '../../hooks/useVirtualization.hook'
import { useYaml } from '../../hooks/yaml.hook'
import { useInitialTableFetch } from '../../hooks/useInitialTableFetch.hook'

import cssVariables from './functions.scss'

const Functions = ({
  deleteFunction,
  deployFunction,
  fetchFunction,
  fetchFunctionLogs,
  fetchFunctionNuclioLogs,
  fetchFunctions,
  functionsStore,
  removeFunctionsError,
  removeNewFunction,
  runNewJob
}) => {
  const [confirmData, setConfirmData] = useState(null)
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [functions, setFunctions] = useState([])
  const [selectedFunctionMin, setSelectedFunctionMin] = useState({})
  const [selectedFunction, setSelectedFunction] = useState({})
  const [editableItem, setEditableItem] = useState(null)
  const [functionsPanelIsOpen, setFunctionsPanelIsOpen] = useState(false)
  const [jobWizardIsOpened, setJobWizardIsOpened] = useState(false)
  const [jobWizardMode, setJobWizardMode] = useState(null)
  const filtersStore = useSelector(store => store.filtersStore)
  const [selectedRowData, setSelectedRowData] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [deletingFunctions, setDeletingFunctions] = useState({})
  const abortControllerRef = useRef(new AbortController())
  const fetchFunctionLogsTimeout = useRef(null)
  const fetchFunctionNuclioLogsTimeout = useRef(null)
  const terminatePollRef = useRef(null)
  const { isDemoMode, isStagingMode } = useMode()
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const functionsFilters = useMemo(
    () => ({
      ...filtersStore.filterMenu.FUNCTION_FILTERS.values,
      ...filtersStore.filterMenuModal.FUNCTION_FILTERS.values
    }),
    [filtersStore.filterMenu.FUNCTION_FILTERS, filtersStore.filterMenuModal.FUNCTION_FILTERS.values]
  )

  const terminateDeleteTasksPolling = useCallback(() => {
    terminatePollRef?.current?.()
    setDeletingFunctions({})
  }, [])

  const fetchData = useCallback(
    filters => {
      terminateDeleteTasksPolling()
      abortControllerRef.current = new AbortController()

      return fetchFunctions(params.projectName, filters, {
        ui: {
          controller: abortControllerRef.current,
          setRequestErrorMessage
        },
        params: {
          format: 'minimal'
        }
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

          setFunctions(newFunctions)

          return newFunctions
        } else {
          const paramsFunction = searchFunctionItem(
            params.hash,
            params.funcName,
            params.tag,
            params.projectName,
            [],
            dispatch,
            true
          )

          if (!paramsFunction) {
            navigate(`/projects/${params.projectName}/functions`, { replace: true })
          }
          setFunctions([])
        }
      })
    },
    [
      dispatch,
      fetchFunctions,
      navigate,
      params.funcName,
      params.hash,
      params.projectName,
      params.tag,
      terminateDeleteTasksPolling
    ]
  )

  const refreshFunctions = useCallback(
    filters => {
      setFunctions([])
      setSelectedFunctionMin({})
      setSelectedRowData({})

      return fetchData(filters)
    },
    [fetchData]
  )

  const handleExpand = useCallback(
    (func, content) => {
      const funcIdentifier = getFunctionIdentifier(func)

      setSelectedRowData(state => {
        return {
          ...state,
          [funcIdentifier]: {
            content: content[func.name].map(contentItem =>
              createFunctionsRowData(contentItem, params.projectName, false)
            )
          }
        }
      })
    },
    [params.projectName]
  )

  const handleCollapse = useCallback(
    func => {
      const funcIdentifier = getFunctionIdentifier(func.data)
      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newPageDataSelectedRowData[funcIdentifier]

      setSelectedRowData(newPageDataSelectedRowData)
    },
    [selectedRowData]
  )

  const handleExpandAllCallback = (collapse, content) => {
    const newSelectedRowData = {}
    if (collapse) {
      setSelectedRowData({})
    } else {
      Object.entries(content).forEach(([key, value]) => {
        newSelectedRowData[key] = {
          content: value.map(contentItem =>
            createFunctionsRowData(contentItem, params.projectName, false)
          )
        }
      })
    }

    setSelectedRowData(newSelectedRowData)
  }

  const { latestItems, handleExpandRow, expand, handleExpandAll } = useGroupContent(
    functions,
    getFunctionIdentifier,
    handleCollapse,
    handleExpand,
    null,
    FUNCTIONS_PAGE,
    null,
    handleExpandAllCallback
  )

  const tableContent = useMemo(
    () =>
      latestItems.map(contentItem => createFunctionsRowData(contentItem, params.projectName, true)),
    [latestItems, params.projectName]
  )

  const handleRemoveLogs = useCallback(() => {
    clearTimeout(fetchFunctionLogsTimeout.current)
    fetchFunctionLogsTimeout.current = null
  }, [])

  const handleRemoveApplicationLogs = useCallback(() => {
    clearTimeout(fetchFunctionNuclioLogsTimeout.current)
    fetchFunctionNuclioLogsTimeout.current = null
  }, [])

  const handleFetchFunctionLogs = useCallback(
    (item, projectName, setDetailsLogs) => {
      return getFunctionLogs(
        fetchFunctionLogs,
        fetchFunctionLogsTimeout,
        projectName,
        item.name,
        item.tag,
        setDetailsLogs,
        navigate,
        () => fetchData(filtersStore)
      )
    },
    [filtersStore, fetchFunctionLogs, navigate, fetchData]
  )

  const handleFetchFunctionApplicationLogs = useCallback(
    (item, projectName, setDetailsLogs) => {
      return getFunctionNuclioLogs(
        fetchFunctionNuclioLogs,
        fetchFunctionNuclioLogsTimeout,
        projectName,
        item.name,
        item.tag,
        setDetailsLogs
      )
    },
    [fetchFunctionNuclioLogs]
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
            navigate(`/projects/${params.projectName}/functions`, { replace: true })
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

          return runNewJob(postData)
        })
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
    [deployFunction, dispatch, functionsFilters, refreshFunctions, runNewJob]
  )

  const pageData = useMemo(
    () =>
      generateFunctionsPageData(
        selectedFunction,
        handleFetchFunctionLogs,
        handleFetchFunctionApplicationLogs,
        handleRemoveLogs,
        handleRemoveApplicationLogs
      ),
    [
      handleFetchFunctionApplicationLogs,
      handleFetchFunctionLogs,
      handleRemoveApplicationLogs,
      handleRemoveLogs,
      selectedFunction
    ]
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
        fetchFunction
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
      fetchFunction
    ]
  )

  const functionsFiltersConfig = useMemo(() => {
    return {
      [NAME_FILTER]: { label: 'Name:' },
      [DATES_FILTER]: { label: 'Updated:' },
      [SHOW_UNTAGGED_FILTER]: { label: 'Show untagged:' }
    }
  }, [])

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

  const setInitialFilters = useCallback(() => {
    if (params.funcName || (params.hash && params.hash.includes('@'))) {
      const funcName = params.funcName || params.hash.split('@')[0]
      const dateFilterValues = getDatePickerFilterValue(datePickerPastOptions, ANY_TIME_DATE_OPTION)

      dispatch(
        setFiltersValues({
          name: FUNCTION_FILTERS,
          value: {
            [NAME_FILTER]: funcName,
            [DATES_FILTER]: dateFilterValues
          }
        })
      )
      dispatch(
        setModalFiltersValues({
          name: FUNCTION_FILTERS,
          value: {
            [SHOW_UNTAGGED_FILTER]: true
          }
        })
      )
    }
  }, [dispatch, params.funcName, params.hash])

  useInitialTableFetch({
    fetchData,
    setExpandedRowsData: setSelectedRowData,
    createRowData: rowItem => createFunctionsRowData(rowItem, params.projectName),
    setInitialFilters,
    filters: {
      ...filtersStore[FILTER_MENU][FUNCTION_FILTERS].values,
      ...filtersStore[FILTER_MENU_MODAL][FUNCTION_FILTERS].values
    }
  })

  useEffect(() => {
    const abortController = abortControllerRef.current

    return () => {
      setSelectedFunctionMin({})
      setFunctions([])
      setSelectedRowData({})
      abortController.abort(REQUEST_CANCELED)
    }
  }, [params.projectName])

  useEffect(() => {
    if ((params.funcName || params.hash) && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, pageData.details.menu, location, params.hash, params.funcName, params.tab])

  useEffect(() => {
    checkForSelectedFunction(
      params.funcName,
      selectedRowData,
      functions,
      params.hash,
      params.tag,
      navigate,
      params.projectName,
      setSelectedFunctionMin,
      dispatch
    )
  }, [
    dispatch,
    functions,
    navigate,
    params.funcName,
    params.hash,
    params.projectName,
    params.tag,
    selectedRowData
  ])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
  }, [dispatch, params.projectName])

  const filtersChangeCallback = filters => {
    refreshFunctions(filters)
  }

  const retryRequestCallback = () => {
    refreshFunctions(functionsFilters)
  }

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

  const createFunctionSuccess = () => {
    setEditableItem(null)
    setFunctionsPanelIsOpen(false)
    removeNewFunction()

    return fetchData().then(() => {
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Function created successfully'
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

        navigate(`/projects/${params.projectName}/functions/${currentItem.hash}/${tab}`)
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

        navigate(`/projects/${params.projectName}/functions/${currentItem.hash}/overview`)
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
      expandedRowsData: selectedRowData,
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
      convertedYaml={convertedYaml}
      createFunctionSuccess={createFunctionSuccess}
      editableItem={editableItem}
      expand={expand}
      filtersChangeCallback={filtersChangeCallback}
      filtersStore={filtersStore}
      functions={functions}
      functionsFiltersConfig={functionsFiltersConfig}
      functionsPanelIsOpen={functionsPanelIsOpen}
      functionsStore={functionsStore}
      getPopUpTemplate={getPopUpTemplate}
      handleCancel={handleCancel}
      handleDeployFunctionFailure={handleDeployFunctionFailure}
      handleDeployFunctionSuccess={handleDeployFunctionSuccess}
      handleExpandAll={handleExpandAll}
      handleExpandRow={handleExpandRow}
      handleSelectFunction={handleSelectFunction}
      isDemoMode={isDemoMode}
      pageData={pageData}
      retryRequest={retryRequestCallback}
      requestErrorMessage={requestErrorMessage}
      selectedFunction={selectedFunction}
      selectedRowData={selectedRowData}
      tableContent={tableContent}
      toggleConvertedYaml={toggleConvertedYaml}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

export default connect(({ functionsStore }) => ({ functionsStore }), {
  ...functionsActions,
  ...jobsActions
})(React.memo(Functions))
