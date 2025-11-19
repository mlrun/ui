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
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
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
  ALL_VERSIONS_PATH,
  BE_PAGE,
  BE_PAGE_SIZE
} from '../../constants'
import {
  checkForSelectedFunction,
  generateActionsMenu,
  generateFunctionsPageData,
  pollDeletingFunctions
} from './functions.util'
import {
  ANY_TIME_DATE_OPTION,
  datePickerPastOptions,
  getDatePickerFilterValue,
  PAST_WEEK_DATE_OPTION
} from '../../utils/datePicker.util'
import {
  deleteFunction,
  deployFunction,
  fetchFunction,
  fetchFunctions,
  removeFunctionsError,
  removeNewFunction
} from '../../reducers/functionReducer'
import createFunctionsRowData from '../../utils/createFunctionsRowData'
import { DANGER_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { transformSearchParams } from 'igz-controls/utils/filter.util'
import { isBackgroundTaskRunning } from '../../utils/poll.util'
import { isDetailsTabExists } from '../../utils/link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseFunctions } from '../../utils/parseFunctions'
import { runNewJob } from '../../reducers/jobReducer'
import { setFilters } from '../../reducers/filtersReducer'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { toggleYaml } from '../../reducers/appReducer'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { useMode } from '../../hooks/mode.hook'
import { usePagination } from '../../hooks/usePagination.hook'
import { useTableScroll } from 'igz-controls/hooks/useTable.hook'

const Functions = ({ isAllVersions = false }) => {
  const [confirmData, setConfirmData] = useState(null)
  const [functions, setFunctions] = useState(null)
  const [functionVersions, setFunctionVersions] = useState(null)
  const [selectedFunction, setSelectedFunction] = useState({})
  const [editableItem, setEditableItem] = useState(null)
  const [functionsPanelIsOpen, setFunctionsPanelIsOpen] = useState(false)
  const [jobWizardIsOpened, setJobWizardIsOpened] = useState(false)
  const [jobWizardMode, setJobWizardMode] = useState(null)
  const filtersStore = useSelector(store => store.filtersStore)
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [deletingFunctions, setDeletingFunctions] = useState({})
  const paginationConfigFunctionsRef = useRef({})
  const paginationConfigFunctionVersionsRef = useRef({})
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
  const lastCheckedFunctionIdRef = useRef(null)
  const functionsStore = useSelector(store => store.functionsStore)

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

  const resetFunctions = useCallback(
    funcs => {
      if (isAllVersions) {
        setFunctionVersions(funcs)
      } else {
        setFunctions(funcs)
      }
    },
    [isAllVersions]
  )

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
        setFunctionVersions(null)
      } else {
        setFunctions(null)
      }

      if (!isAllVersions && !isEmpty(paginationConfigFunctionsRef.current)) {
        requestParams.page = paginationConfigFunctionsRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigFunctionsRef.current[BE_PAGE_SIZE]
      }

      if (isAllVersions && !isEmpty(paginationConfigFunctionVersionsRef.current)) {
        requestParams.page = paginationConfigFunctionVersionsRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigFunctionVersionsRef.current[BE_PAGE_SIZE]
      }

      lastCheckedFunctionIdRef.current = null

      return dispatch(
        fetchFunctions({
          project: params.projectName,
          filters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            },
            params: requestParams
          }
        })
      )
        .unwrap()
        .then(response => {
          if (response?.funcs) {
            if (isAllVersions) {
              paginationConfigFunctionVersionsRef.current.paginationResponse = response.pagination
            } else {
              paginationConfigFunctionsRef.current.paginationResponse = response.pagination
            }

            if (response.funcs?.length > 0) {
              const newFunctions = parseFunctions(response.funcs, params.projectName)
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

              resetFunctions(newFunctions)

              return newFunctions
            } else {
              resetFunctions([])
            }
          } else {
            resetFunctions([])
          }
        })
        .catch(() => {
          resetFunctions([])
        })
    },
    [
      dispatch,
      isAllVersions,
      params.funcName,
      params.projectName,
      resetFunctions,
      terminateDeleteTasksPolling
    ]
  )

  const refreshFunctions = useCallback(
    filters => {
      setSelectedFunction({})

      return fetchData(filters)
    },
    [fetchData]
  )

  const removeFunction = useCallback(
    func => {
      dispatch(deleteFunction({ funcName: func.name, project: params.projectName }))
        .unwrap()
        .then(response => {
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
              setSelectedFunction({})
              navigate(`/projects/${params.projectName}/functions${window.location.search}`, {
                replace: true
              })
            }
          }
        })

      setConfirmData(null)
    },
    [dispatch, fetchData, functionsFilters, navigate, params.projectName, selectedFunction]
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

      dispatch(deployFunction({ data }))
        .unwrap()
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
    [dispatch, functionsFilters, refreshFunctions]
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
      isAllVersions,
      showAllVersions
    ]
  )

  useEffect(() => {
    return () => {
      setFunctions(null)
      setFunctionVersions(null)
    }
  }, [params.projectName])

  useEffect(() => {
    const abortController = abortControllerRef.current

    return () => {
      setSelectedFunction({})
      abortController.abort(REQUEST_CANCELED)
    }
  }, [params.projectName])

  useEffect(() => {
    if (params.id && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, pageData.details.menu, location, params.id, params.tab])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  const handleSelectFunction = () => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
  }

  const closePanel = () => {
    setFunctionsPanelIsOpen(false)
    setEditableItem(null)
    dispatch(removeNewFunction())

    if (functionsStore.error) {
      dispatch(removeFunctionsError())
    }
  }

  const createFunctionSuccess = isEditMode => {
    setEditableItem(null)
    setFunctionsPanelIsOpen(false)
    dispatch(removeNewFunction())

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
    dispatch(removeNewFunction())

    return fetchData(functionsFilters).then(functions => {
      if (functions.length) {
        const currentItem = functions.find(func => func.name === name && func.tag === tag)

        if (currentItem) {
          // todo need better logic for searching currentItem for cases when the function has no tag
          navigate(
            `/projects/${params.projectName}/functions/${name ?? params.funcName}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/:${tag}@${currentItem.hash}/${tab}${window.location.search}`
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
    dispatch(removeNewFunction())

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

  const [
    handleRefreshFunctions,
    paginatedFunctions,
    searchFunctionsParams,
    setSearchFunctionsParams
  ] = usePagination({
    hidden: isAllVersions,
    content: functions ?? [],
    refreshContent: refreshFunctions,
    filters: functionsFilters,
    paginationConfigRef: paginationConfigFunctionsRef,
    resetPaginationTrigger: `${params.projectName}`
  })
  const [
    handleRefreshFunctionVersions,
    paginatedFunctionVersions,
    searchFunctionVersionsParams,
    setSearchFunctionVersionsParams
  ] = usePagination({
    hidden: !isAllVersions,
    content: functionVersions ?? [],
    refreshContent: refreshFunctions,
    filters: functionsFilters,
    paginationConfigRef: paginationConfigFunctionVersionsRef,
    resetPaginationTrigger: `${params.projectName}_${isAllVersions}`
  })

  useTableScroll({
    content: isAllVersions ? paginatedFunctionVersions : paginatedFunctions,
    selectedItem: selectedFunction,
    isAllVersions
  })

  const tableContent = useMemo(
    () =>
      (isAllVersions ? paginatedFunctionVersions : paginatedFunctions).map(contentItem =>
        createFunctionsRowData(contentItem, params.projectName, Boolean(isAllVersions))
      ),
    [isAllVersions, paginatedFunctionVersions, paginatedFunctions, params.projectName]
  )

  useEffect(() => {
    checkForSelectedFunction(
      isAllVersions ? paginatedFunctionVersions : paginatedFunctions,
      isAllVersions ? functionVersions : functions,
      params.id,
      params.funcName,
      navigate,
      params.projectName,
      setSelectedFunction,
      dispatch,
      isAllVersions,
      isAllVersions ? searchFunctionVersionsParams : searchFunctionsParams,
      isAllVersions ? paginationConfigFunctionVersionsRef : paginationConfigFunctionsRef,
      isAllVersions ? setSearchFunctionVersionsParams : setSearchFunctionsParams,
      lastCheckedFunctionIdRef
    )
  }, [
    dispatch,
    functionVersions,
    functions,
    isAllVersions,
    navigate,
    paginatedFunctionVersions,
    paginatedFunctions,
    params.funcName,
    params.id,
    params.projectName,
    searchFunctionVersionsParams,
    searchFunctionsParams,
    setSearchFunctionVersionsParams,
    setSearchFunctionsParams,
    lastCheckedFunctionIdRef
  ])

  useEffect(() => {
    if (isEmpty(selectedFunction)) {
      lastCheckedFunctionIdRef.current = null
    }
  }, [selectedFunction])

  return (
    <FunctionsView
      actionsMenu={actionsMenu}
      closePanel={closePanel}
      confirmData={confirmData}
      createFunctionSuccess={createFunctionSuccess}
      editableItem={editableItem}
      filters={functionsFilters}
      filtersStore={filtersStore}
      functionsFiltersConfig={functionsFiltersConfig}
      functionsPanelIsOpen={functionsPanelIsOpen}
      functionsStore={functionsStore}
      getPopUpTemplate={getPopUpTemplate}
      handleCancel={handleCancel}
      handleDeployFunctionFailure={handleDeployFunctionFailure}
      handleDeployFunctionSuccess={handleDeployFunctionSuccess}
      handleRefreshFunctions={
        isAllVersions ? handleRefreshFunctionVersions : handleRefreshFunctions
      }
      handleSelectFunction={handleSelectFunction}
      isAllVersions={isAllVersions}
      isDemoMode={isDemoMode}
      pageData={pageData}
      paginationConfigFunctionsRef={
        isAllVersions ? paginationConfigFunctionVersionsRef : paginationConfigFunctionsRef
      }
      params={params}
      requestErrorMessage={requestErrorMessage}
      selectedFunction={selectedFunction}
      setSearchFunctionsParams={
        isAllVersions ? setSearchFunctionVersionsParams : setSearchFunctionsParams
      }
      setSearchParams={setSearchParams}
      tableContent={tableContent}
    />
  )
}

Functions.propTypes = {
  isAllVersions: PropTypes.bool.isRequired
}

export default React.memo(Functions)
