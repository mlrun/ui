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
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEqual, isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import FunctionsView from './FunctionsView'
import JobWizard from '../JobWizard/JobWizard'
import NewFunctionPopUp from '../../elements/NewFunctionPopUp/NewFunctionPopUp'

import {
  FUNCTIONS_PAGE,
  GROUP_BY_NAME,
  SHOW_UNTAGGED_ITEMS,
  TAG_LATEST,
  REQUEST_CANCELED,
  DETAILS_BUILD_LOG_TAB,
  JOB_DEFAULT_OUTPUT_PATH
} from '../../constants'
import createFunctionsContent from '../../utils/createFunctionsContent'
import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import { DANGER_BUTTON, LABEL_BUTTON } from 'igz-controls/constants'
import { detailsMenu, infoHeaders, page, generateActionsMenu } from './functions.util'
import { getFunctionIdentifier } from '../../utils/getUniqueIdentifier'
import { getFunctionLogs } from '../../utils/getFunctionLogs'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseFunctions } from '../../utils/parseFunctions'
import { setFilters } from '../../reducers/filtersReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useMode } from '../../hooks/mode.hook'
import { useVirtualization } from '../../hooks/useVirtualization.hook'
import { useYaml } from '../../hooks/yaml.hook'

import cssVariables from './functions.scss'

const Functions = ({
  deleteFunction,
  deployFunction,
  fetchFunctionLogs,
  fetchFunctions,
  functionsStore,
  removeFunctionsError,
  removeNewFunction,
  runNewJob
}) => {
  const [confirmData, setConfirmData] = useState(null)
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [functions, setFunctions] = useState([])
  const [selectedFunction, setSelectedFunction] = useState({})
  const [editableItem, setEditableItem] = useState(null)
  const [taggedFunctions, setTaggedFunctions] = useState([])
  const [functionsPanelIsOpen, setFunctionsPanelIsOpen] = useState(false)
  const [jobWizardIsOpened, setJobWizardIsOpened] = useState(false)
  const [jobWizardMode, setJobWizardMode] = useState(null)
  const filtersStore = useSelector(store => store.filtersStore)
  const [selectedRowData, setSelectedRowData] = useState({})
  const [largeRequestErrorMessage, setLargeRequestErrorMessage] = useState('')
  const abortControllerRef = useRef(new AbortController())
  const fetchFunctionLogsTimeout = useRef(null)
  const tableBodyRef = useRef(null)
  const tableRef = useRef(null)
  const { isDemoMode, isStagingMode } = useMode()
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      return fetchFunctions(params.projectName, filters, {
        ui: {
          controller: abortControllerRef.current,
          setLargeRequestErrorMessage
        }
      }).then(functions => {
        if (functions) {
          const newFunctions = parseFunctions(functions, params.projectName)

          setFunctions(newFunctions)

          return newFunctions
        }
      })
    },
    [fetchFunctions, params.projectName]
  )

  const refreshFunctions = useCallback(
    filters => {
      setFunctions([])
      setSelectedFunction({})

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
            content: createFunctionsContent(content[func.name], params.projectName, false)
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
          content: createFunctionsContent(value, params.projectName, false)
        }
      })
    }

    setSelectedRowData(newSelectedRowData)
  }

  const { latestItems, handleExpandRow, expand, handleExpandAll } = useGroupContent(
    taggedFunctions,
    getFunctionIdentifier,
    handleCollapse,
    handleExpand,
    null,
    FUNCTIONS_PAGE,
    null,
    handleExpandAllCallback
  )

  const tableContent = useMemo(
    () => createFunctionsContent(latestItems, params.projectName, true),
    [latestItems, params.projectName]
  )

  const handleRemoveLogs = useCallback(() => {
    clearTimeout(fetchFunctionLogsTimeout.current)
    fetchFunctionLogsTimeout.current = null
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
        fetchData
      )
    },
    [fetchFunctionLogs, navigate, fetchData]
  )

  const removeFunction = useCallback(
    func => {
      deleteFunction(func.name, params.projectName)
        .then(() => {
          if (!isEmpty(selectedFunction)) {
            setSelectedFunction({})
            navigate(`/projects/${params.projectName}/functions`, { replace: true })
          }

          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: 'Function deleted successfully'
            })
          )
          fetchData()
        })
        .catch(error => {
          showErrorNotification(dispatch, error, 'Function failed to delete', '', () => {
            removeFunction(func)
          })
        })

      setConfirmData(null)
    },
    [deleteFunction, dispatch, navigate, params.projectName, fetchData, selectedFunction]
  )

  const onRemoveFunction = useCallback(
    func => {
      setConfirmData({
        item: func,
        header: 'Delete function?',
        message: `You try to delete function "${func.name}". Deleted functions cannot be restored.`,
        btnCancelLabel: 'Cancel',
        btnCancelVariant: LABEL_BUTTON,
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
          refreshFunctions(filtersStore)
        })
        .catch(error => {
          showErrorNotification(dispatch, error, 'Failed to build and run function.', '', () => {
            buildAndRunFunc(func)
          })
        })
    },
    [deployFunction, dispatch, filtersStore, refreshFunctions, runNewJob]
  )

  const pageData = {
    page,
    details: {
      menu: detailsMenu,
      infoHeaders,
      refreshLogs: handleFetchFunctionLogs,
      removeLogs: handleRemoveLogs,
      withLogsRefreshBtn: false,
      type: FUNCTIONS_PAGE
    }
  }

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
        buildAndRunFunc
      ),
    [buildAndRunFunc, dispatch, isDemoMode, isStagingMode, onRemoveFunction, toggleConvertedYaml]
  )

  useEffect(() => {
    fetchData(filtersStore.filters)

    return () => {
      setSelectedFunction({})
      setFunctions([])
      abortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [filtersStore.filters, params.projectName, fetchData])

  useEffect(() => {
    setTaggedFunctions(
      !filtersStore.showUntagged ? functions.filter(func => func.tag.length) : functions
    )
  }, [filtersStore.showUntagged, functions])

  useEffect(() => {
    if (params.hash && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, pageData.details.menu, location, params.hash, params.tab])

  useLayoutEffect(() => {
    const checkFunctionExistence = item => {
      if (!item || Object.keys(item).length === 0) {
        showErrorNotification(dispatch, {}, 'This function either does not exist or was deleted')
        navigate(`/projects/${params.projectName}/functions`, { replace: true })
      }
    }

    let item = {}

    handleRemoveLogs()

    if (params.hash && functions.length > 0) {
      const funcTagIndex = params.hash.indexOf(':')

      item = functions.find(func => {
        if (funcTagIndex > 0) {
          return isEqual(func.tag, params.hash.slice(funcTagIndex + 1))
        } else {
          return isEqual(func.hash, params.hash.slice(params.hash.indexOf('@') + 1))
        }
      })

      checkFunctionExistence(item)
    } else if (params.funcName && params.tag && functions.length > 0) {
      item = functions.find(func => {
        return isEqual(func.tag, params.tag) && isEqual(func.name, params.funcName)
      })

      checkFunctionExistence(item)
    }

    setSelectedFunction(item ?? {})
  }, [
    dispatch,
    functions,
    handleRemoveLogs,
    navigate,
    params.funcName,
    params.hash,
    params.projectName,
    params.tag
  ])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NAME, showUntagged: SHOW_UNTAGGED_ITEMS }))
  }, [dispatch, params.projectName])

  const filtersChangeCallback = filters => {
    if (
      !filters.showUntagged &&
      filters.showUntagged !== filtersStore.showUntagged &&
      selectedFunction.hash
    ) {
      navigate(`/projects/${params.projectName}/functions`)
    } else if (filters.showUntagged === filtersStore.showUntagged) {
      refreshFunctions(filters)
    }
  }

  const handleSelectFunction = item => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }

    queueMicrotask(() => {
      setSelectedFunction(item)
    })
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

    return fetchData().then(functions => {
      const currentItem = functions.find(func => func.name === name && func.tag === tag)

      navigate(`/projects/${params.projectName}/functions/${currentItem.hash}/${tab}`)
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Function deployment initiated successfully'
        })
      )
    })
  }

  const handleDeployFunctionFailure = error => {
    const { name, tag } = functionsStore.newFunction.metadata

    setFunctionsPanelIsOpen(false)
    removeNewFunction()

    return fetchData().then(functions => {
      const currentItem = functions.find(func => func.name === name && func.tag === tag)

      showErrorNotification(dispatch, error, '', 'Function deployment failed to initiate')

      navigate(`/projects/${params.projectName}/functions/${currentItem.hash}/overview`)
    })
  }

  const getPopUpTemplate = useCallback(
    action => {
      return (
        <NewFunctionPopUp
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
    setSelectedFunction({})
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
    tableRef,
    tableBodyRef,
    rowsData: {
      content: tableContent,
      expandedRowsData: selectedRowData,
      selectedItem: selectedFunction
    },
    heightData: {
      headerRowHeight: cssVariables.functionsHeaderRowHeight,
      rowHeight: cssVariables.functionsRowHeight,
      rowHeightExtended: cssVariables.functionsRowHeightExtended
    }
  })

  return (
    <FunctionsView
      actionsMenu={actionsMenu}
      closePanel={closePanel}
      createFunctionSuccess={createFunctionSuccess}
      confirmData={confirmData}
      convertedYaml={convertedYaml}
      editableItem={editableItem}
      expand={expand}
      filtersChangeCallback={filtersChangeCallback}
      filtersStore={filtersStore}
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
      largeRequestErrorMessage={largeRequestErrorMessage}
      pageData={pageData}
      ref={{ tableRef, tableBodyRef }}
      refreshFunctions={refreshFunctions}
      selectedFunction={selectedFunction}
      selectedRowData={selectedRowData}
      tableContent={tableContent}
      taggedFunctions={taggedFunctions}
      toggleConvertedYaml={toggleConvertedYaml}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

export default connect(({ functionsStore }) => ({ functionsStore }), {
  ...functionsActions,
  ...jobsActions
})(React.memo(Functions))
