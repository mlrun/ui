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
import { isEqual, isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import FunctionsView from './FunctionsView'
import JobWizard from '../JobWizard/JobWizard'
import NewFunctionPopUp from '../../elements/NewFunctionPopUp/NewFunctionPopUp'

import {
  detailsMenu,
  FUNCTIONS_EDITABLE_STATES,
  FUNCTIONS_READY_STATES,
  infoHeaders,
  page,
  getFunctionsEditableTypes
} from './functions.util'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { getFunctionIdentifier } from '../../utils/getUniqueIdentifier'
import { getFunctionLogs } from '../../utils/getFunctionLogs'
import { parseFunctions } from '../../utils/parseFunctions'
import { setFilters } from '../../reducers/filtersReducer'
import functionsActions from '../../actions/functions'
import { setNotification } from '../../reducers/notificationReducer'
import jobsActions from '../../actions/jobs'
import {
  FUNCTIONS_PAGE,
  GROUP_BY_NAME,
  PANEL_FUNCTION_CREATE_MODE,
  SHOW_UNTAGGED_ITEMS,
  TAG_LATEST
} from '../../constants'
import createFunctionsContent from '../../utils/createFunctionsContent'
import { DANGER_BUTTON, LABEL_BUTTON } from 'igz-controls/constants'
import { functionRunKinds } from '../Jobs/jobs.util'
import { generateContentActionsMenu } from '../../layout/Content/content.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useMode } from '../../hooks/mode.hook'
import { useYaml } from '../../hooks/yaml.hook'

import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const Functions = ({
  deleteFunction,
  fetchFunctionLogs,
  fetchFunctions,
  fetchJobFunction,
  functionsStore,
  removeFunctionsError,
  removeNewFunction
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
  let fetchFunctionLogsTimeout = useRef(null)
  const { isStagingMode } = useMode()
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const refreshFunctions = useCallback(
    filters => {
      return fetchFunctions(params.projectName, filters).then(functions => {
        const newFunctions = parseFunctions(functions, params.projectName)

        setFunctions(newFunctions)

        return newFunctions
      })
    },
    [fetchFunctions, params.projectName]
  )

  const handleExpand = useCallback(
    (func, content) => {
      const funcIdentifier = getFunctionIdentifier(func)

      setSelectedRowData(state => {
        return {
          ...state,
          [funcIdentifier]: {
            content: createFunctionsContent(content[func.name], null, params.projectName, false)
          }
        }
      })
    },
    [params.projectName]
  )

  const handleCollapse = useCallback(
    func => {
      const funcIdentifier = getFunctionIdentifier(func)
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
          content: createFunctionsContent(value, null, params.projectName, false)
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
    () => createFunctionsContent(latestItems, null, params.projectName, true),
    [latestItems, params.projectName]
  )

  const handleFetchFunctionLogs = useCallback(
    (item, projectName, setDetailsLogs, offset) => {
      return getFunctionLogs(
        fetchFunctionLogs,
        fetchFunctionLogsTimeout,
        projectName,
        item.name,
        item.tag,
        setDetailsLogs,
        offset,
        navigate,
        refreshFunctions
      )
    },
    [fetchFunctionLogs, navigate, refreshFunctions]
  )

  const handleRemoveLogs = useCallback(() => {
    clearTimeout(fetchFunctionLogsTimeout.current)
  }, [fetchFunctionLogsTimeout])

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
          refreshFunctions()
        })
        .catch(() => {
          dispatch(
            setNotification({
              status: 400,
              id: Math.random(),
              retry: () => removeFunction(func),
              message: 'Function failed to delete'
            })
          )
        })

      setConfirmData(null)
    },
    [deleteFunction, dispatch, navigate, params.projectName, refreshFunctions, selectedFunction]
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

  const actionsMenu = useMemo(() => {
    return generateContentActionsMenu(
      func => [
        {
          label: 'Run',
          icon: <Run />,
          onClick: func => {
            if (func?.project && func?.name && func?.hash) {
              fetchJobFunction(func.project, func.name, func.hash)
              setJobWizardMode(PANEL_FUNCTION_CREATE_MODE)
            } else {
              dispatch(
                setNotification({
                  status: 400,
                  id: Math.random(),
                  message: 'Failed to fetch the function'
                })
              )
            }
          },
          hidden:
            !functionRunKinds.includes(func?.type) ||
            !FUNCTIONS_READY_STATES.includes(func?.state?.value)
        },
        {
          label: 'Edit',
          icon: <Edit />,
          onClick: func => {
            setFunctionsPanelIsOpen(true)
            setEditableItem(func)
          },
          hidden:
            !getFunctionsEditableTypes(isStagingMode).includes(func?.type) ||
            !FUNCTIONS_EDITABLE_STATES.includes(func?.state?.value)
        },
        {
          label: 'Delete',
          icon: <Delete />,
          className: 'danger',
          onClick: onRemoveFunction
        },
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        }
      ],
      []
    )
  }, [dispatch, fetchJobFunction, isStagingMode, onRemoveFunction, toggleConvertedYaml])

  useEffect(() => {
    refreshFunctions(filtersStore.filters)

    return () => {
      setSelectedFunction({})
      setFunctions([])
    }
  }, [filtersStore.filters, params.projectName, refreshFunctions])

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

  useEffect(() => {
    let item = {}

    if (params.hash && functions.length > 0) {
      const funcTagIndex = params.hash.indexOf(':')

      item = functions.find(func => {
        if (funcTagIndex > 0) {
          return isEqual(func.tag, params.hash.slice(funcTagIndex + 1))
        } else {
          return isEqual(func.hash, params.hash.slice(params.hash.indexOf('@') + 1))
        }
      })

      if (!item || Object.keys(item).length === 0) {
        return navigate(`/projects/${params.projectName}/functions`, { replace: true })
      }
    } else if (params.funcName && params.tag && functions.length > 0) {
      item = functions.find(func => {
        return isEqual(func.tag, params.tag) && isEqual(func.name, params.funcName)
      })

      if (!item || Object.keys(item).length === 0) {
        return navigate(`/projects/${params.projectName}/functions`, { replace: true })
      }
    }

    setSelectedFunction(item)
  }, [functions, navigate, params.funcName, params.hash, params.projectName, params.tag])

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

    setSelectedFunction(item)
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

    return refreshFunctions().then(() => {
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
    const tab = ready === false ? 'build-log' : 'overview'

    tag ||= TAG_LATEST

    setFunctionsPanelIsOpen(false)
    setEditableItem(null)
    removeNewFunction()

    return refreshFunctions().then(functions => {
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

  const handleDeployFunctionFailure = () => {
    const { name, tag } = functionsStore.newFunction.metadata

    setFunctionsPanelIsOpen(false)
    removeNewFunction()

    return refreshFunctions().then(functions => {
      const currentItem = functions.find(func => func.name === name && func.tag === tag)

      navigate(`/projects/${params.projectName}/functions/${currentItem.hash}/overview`)
      dispatch(
        setNotification({
          status: 400,
          id: Math.random(),
          message: 'Function deployment failed to initiate'
        })
      )
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
      pageData={pageData}
      refreshFunctions={refreshFunctions}
      selectedFunction={selectedFunction}
      selectedRowData={selectedRowData}
      tableContent={tableContent}
      taggedFunctions={taggedFunctions}
      toggleConvertedYaml={toggleConvertedYaml}
    />
  )
}

export default connect(({ functionsStore }) => ({ functionsStore }), {
  ...functionsActions,
  ...jobsActions
})(React.memo(Functions))
