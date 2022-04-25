import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { isEqual, isEmpty } from 'lodash'

import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'
import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'
import JobsPanel from '../JobsPanel/JobsPanel'
import FunctionsPanel from '../FunctionsPanel/FunctionsPanel'
import NewFunctionPopUp from '../../elements/NewFunctionPopUp/NewFunctionPopUp'

import {
  detailsMenu,
  filters,
  FUNCTIONS_EDITABLE_STATES,
  FUNCTIONS_READY_STATES,
  infoHeaders,
  page,
  getFunctionsEditableTypes,
  getTableHeaders
} from './functions.util'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { getFunctionIdentifier } from '../../utils/getUniqueIdentifier'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { getFunctionLogs } from '../../utils/getFunctionLogs'
import { parseFunctions } from '../../utils/parseFunctions'
import functionsActions from '../../actions/functions'
import notificationActions from '../../actions/notification'
import jobsActions from '../../actions/jobs'
import {
  DANGER_BUTTON,
  FUNCTIONS_PAGE,
  LABEL_BUTTON,
  PANEL_CREATE_MODE,
  PANEL_EDIT_MODE,
  SECONDARY_BUTTON,
  TAG_LATEST
} from '../../constants'
import { useMode } from '../../hooks/mode.hook'

import { ReactComponent as Delete } from '../../images/delete.svg'
import { ReactComponent as Run } from '../../images/run.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const Functions = ({
  deleteFunction,
  fetchFunctionLogs,
  fetchFunctions,
  filtersStore,
  functionsStore,
  removeFunctionLogs,
  removeFunctionsError,
  removeNewFunction,
  removeNewJob,
  setNotification
}) => {
  const [confirmData, setConfirmData] = useState(null)
  const [functions, setFunctions] = useState([])
  const [selectedFunction, setSelectedFunction] = useState({})
  const [editableItem, setEditableItem] = useState(null)
  const [taggedFunctions, setTaggedFunctions] = useState([])
  const [functionsPanelIsOpen, setFunctionsPanelIsOpen] = useState(false)
  let fetchFunctionLogsTimeout = useRef(null)
  const { isStagingMode } = useMode()
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

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

  const handleFetchFunctionLogs = useCallback(
    (projectName, name, tag, offset) => {
      return getFunctionLogs(
        fetchFunctionLogs,
        fetchFunctionLogsTimeout,
        projectName,
        name,
        tag,
        offset,
        navigate,
        refreshFunctions
      )
    },
    [fetchFunctionLogs, navigate, refreshFunctions]
  )

  const handleRemoveLogs = useCallback(() => {
    clearTimeout(fetchFunctionLogsTimeout.current)
    removeFunctionLogs()
  }, [fetchFunctionLogsTimeout, removeFunctionLogs])

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

  const pageData = {
    actionsMenu: item => [
      {
        label: 'Run',
        icon: <Run />,
        onClick: func => setEditableItem(func),
        hidden: !FUNCTIONS_READY_STATES.includes(item?.state?.value)
      },
      {
        label: 'Edit',
        icon: <Edit />,
        onClick: func => {
          setFunctionsPanelIsOpen(true)
          setEditableItem(func)
        },
        hidden:
          !getFunctionsEditableTypes(isStagingMode).includes(item?.type) ||
          !FUNCTIONS_EDITABLE_STATES.includes(item?.state?.value)
      },
      {
        label: 'Delete',
        icon: <Delete />,
        onClick: onRemoveFunction
      }
    ],
    details: {
      menu: detailsMenu,
      infoHeaders,
      refreshLogs: handleFetchFunctionLogs,
      removeLogs: handleRemoveLogs,
      withLogsRefreshBtn: false,
      type: FUNCTIONS_PAGE
    },
    filters,
    page,
    tableHeaders: getTableHeaders(!isEveryObjectValueEmpty(selectedFunction)),
    hidePageActionMenu: true,
    filterMenuActionButton: {
      getCustomTemplate: getPopUpTemplate,
      label: 'New',
      variant: SECONDARY_BUTTON
    }
  }

  useEffect(() => {
    refreshFunctions()

    return () => {
      setSelectedFunction({})
      setFunctions([])
    }
  }, [params.projectName, refreshFunctions])

  useEffect(() => {
    setTaggedFunctions(
      !filtersStore.showUntagged ? functions.filter(func => func.tag.length) : functions
    )
  }, [filtersStore.showUntagged, functions])

  useEffect(() => {
    if (params.hash && pageData.details.menu.length > 0) {
      isDetailsTabExists(FUNCTIONS_PAGE, params, pageData.details.menu, navigate, location)
    }
  }, [navigate, params, pageData.details.menu, location])

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
    }

    setSelectedFunction(item)
  }, [functions, navigate, params.hash, params.projectName])

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

  const handleCancel = () => {
    setSelectedFunction({})
  }

  const removeFunction = func => {
    deleteFunction(func.name, params.projectName)
      .then(() => {
        if (!isEmpty(selectedFunction)) {
          setSelectedFunction({})
          navigate(`/projects/${params.projectName}/functions`, { replace: true })
        }

        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Function deleted successfully'
        })
        refreshFunctions()
      })
      .catch(() => {
        setNotification({
          status: 400,
          id: Math.random(),
          retry: () => removeFunction(func),
          message: 'Function failed to delete'
        })
      })

    setConfirmData(null)
  }

  const onRemoveFunction = func => {
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
    setFunctionsPanelIsOpen(false)
    setEditableItem(null)
    removeNewFunction()

    return refreshFunctions().then(() => {
      setNotification({
        status: 200,
        id: Math.random(),
        message: 'Function created successfully'
      })
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
      setNotification({
        status: 200,
        id: Math.random(),
        message: 'Function deployment initiated successfully'
      })
    })
  }

  const handleDeployFunctionFailure = () => {
    const { name, tag } = functionsStore.newFunction.metadata

    setFunctionsPanelIsOpen(false)
    removeNewFunction()

    return refreshFunctions().then(functions => {
      const currentItem = functions.find(func => func.name === name && func.tag === tag)

      navigate(`/projects/${params.projectName}/functions/${currentItem.hash}/overview`)
      setNotification({
        status: 400,
        id: Math.random(),
        message: 'Function deployment failed to initiate'
      })
    })
  }

  return (
    <div className="content-wrapper">
      {confirmData && (
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: confirmData.btnCancelLabel,
            variant: confirmData.btnCancelVariant
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: () => confirmData.confirmHandler(confirmData.item),
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmVariant
          }}
          header={confirmData.header}
          message={confirmData.message}
        />
      )}
      {functionsStore.loading && <Loader />}
      <Content
        content={taggedFunctions}
        filtersChangeCallback={filtersChangeCallback}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectFunction}
        loading={functionsStore.loading}
        pageData={pageData}
        refresh={refreshFunctions}
        selectedItem={selectedFunction}
        getIdentifier={getFunctionIdentifier}
      />
      {editableItem && !functionsPanelIsOpen && (
        <JobsPanel
          closePanel={() => {
            setEditableItem(null)
            removeNewJob()
          }}
          groupedFunctions={{
            name: editableItem.name,
            tag: editableItem.tag,
            functions: functionsStore.functions.filter(
              func =>
                func.metadata.name === editableItem.name && func.metadata.hash === editableItem.hash
            )
          }}
          mode={PANEL_EDIT_MODE}
          project={params.projectName}
          redirectToDetailsPane
        />
      )}
      {functionsPanelIsOpen && (
        <FunctionsPanel
          closePanel={closePanel}
          createFunctionSuccess={createFunctionSuccess}
          defaultData={editableItem}
          handleDeployFunctionFailure={handleDeployFunctionFailure}
          handleDeployFunctionSuccess={handleDeployFunctionSuccess}
          mode={editableItem ? PANEL_EDIT_MODE : PANEL_CREATE_MODE}
          project={params.projectName}
        />
      )}
    </div>
  )
}

export default connect(({ functionsStore, filtersStore }) => ({ functionsStore, filtersStore }), {
  ...functionsActions,
  ...notificationActions,
  ...jobsActions
})(React.memo(Functions))
