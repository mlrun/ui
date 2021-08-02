import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { chain, isEqual, isEmpty } from 'lodash'
import { useLocation } from 'react-router-dom'

import Button from '../../common/Button/Button'
import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'
import JobsPanel from '../JobsPanel/JobsPanel'
import FunctionsPanel from '../FunctionsPanel/FunctionsPanel'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'

import {
  detailsMenu,
  filters,
  FUNCTIONS_FAILED_STATES,
  infoHeaders,
  page,
  tableHeaders,
  TRANSIENT_FUNCTION_STATUSES
} from './functions.util'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { getFunctionIdentifier } from '../../utils/getUniqueIdentifier'
import getState from '../../utils/getState.js'
import functionsActions from '../../actions/functions'
import notificationActions from '../../actions/notification'
import jobsActions from '../../actions/jobs'
import {
  FUNCTIONS_PAGE,
  PANEL_CREATE_MODE,
  PANEL_EDIT_MODE
} from '../../constants'

import { ReactComponent as Delete } from '../../images/delete.svg'
import { ReactComponent as Run } from '../../images/run.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'

const Functions = ({
  deleteFunction,
  fetchFunctionLogs,
  fetchFunctions,
  filtersStore,
  functionsStore,
  history,
  match,
  removeFunctionLogs,
  removeFunctionsError,
  removeNewFunction,
  removeNewJob,
  setLoading,
  setNotification
}) => {
  const [confirmData, setConfirmData] = useState(null)
  const [functions, setFunctions] = useState([])
  const [selectedFunction, setSelectedFunction] = useState({})
  const [editableItem, setEditableItem] = useState(null)
  const [taggedFunctions, setTaggedFunctions] = useState([])
  const [functionsPanelIsOpen, setFunctionsPanelIsOpen] = useState(false)
  const location = useLocation()
  let fetchFunctionLogsTimeout = useRef(null)

  const handleFetchFunctionLogs = useCallback(
    (projectName, name, tag, offset) => {
      return fetchFunctionLogs(projectName, name, tag, offset).then(result => {
        if (
          TRANSIENT_FUNCTION_STATUSES.includes(
            result.headers?.['x-mlrun-function-status']
          )
        ) {
          fetchFunctionLogsTimeout.current = setTimeout(() => {
            let currentOffset = offset
              ? offset + result.data.length
              : result.data.length

            handleFetchFunctionLogs(projectName, name, tag, currentOffset)
          }, 2000)
        } else {
          clearTimeout(fetchFunctionLogsTimeout.current)
        }
      })
    },
    [fetchFunctionLogs]
  )

  const handleRemoveLogs = useCallback(() => {
    clearTimeout(fetchFunctionLogsTimeout.current)
    removeFunctionLogs()
  }, [fetchFunctionLogsTimeout, removeFunctionLogs])

  const pageData = {
    actionsMenu: item => [
      {
        label: 'Run',
        icon: <Run />,
        onClick: func => setEditableItem(func),
        hidden: FUNCTIONS_FAILED_STATES.includes(item?.state?.value)
      },
      {
        label: 'Edit',
        icon: <Edit />,
        onClick: func => {
          setFunctionsPanelIsOpen(true)
          setEditableItem(func)
        },
        hidden: item?.type !== 'job'
      },
      {
        label: 'Delete',
        icon: <Delete />,
        onClick: onRemoveFunction
      }
    ],
    detailsMenu,
    filters,
    page,
    tableHeaders,
    infoHeaders,
    filterMenuActionButton: {
      label: 'New',
      onClick: () => setFunctionsPanelIsOpen(true),
      variant: 'secondary',
      hidden: new URLSearchParams(location.search).get('demo') !== 'true'
    },
    refreshLogs: handleFetchFunctionLogs,
    removeLogs: handleRemoveLogs,
    withLogsRefreshBtn: false
  }

  const refreshFunctions = useCallback(
    filters => {
      return fetchFunctions(match.params.projectName, filters?.name).then(
        functions => {
          const newFunctions = chain(functions)
            .orderBy('metadata.updated', 'desc')
            .map(func => ({
              args: func.spec?.args ?? [],
              build: func.spec?.build ?? {},
              command: func.spec?.command,
              description: func.spec?.description ?? '',
              default_handler: func.spec?.default_handler ?? '',
              env: func.spec?.env ?? [],
              hash: func.metadata.hash,
              image: func.spec?.image ?? '',
              labels: func.metadata?.labels ?? {},
              name: func.metadata.name,
              project: func.metadata?.project || match.params.projectName,
              resources: func.spec?.resources ?? {},
              secret_sources: func.spec?.secret_sources ?? [],
              state: getState(func.status?.state, page),
              tag: func.metadata.tag,
              type: func.kind,
              volume_mounts: func.spec?.volume_mounts ?? [],
              volumes: func.spec?.volumes ?? [],
              updated: new Date(func.metadata.updated),
              ui: {
                originalContent: func
              }
            }))
            .value()

          setFunctions(newFunctions)

          return newFunctions
        }
      )
    },
    [fetchFunctions, match.params.projectName]
  )

  useEffect(() => {
    refreshFunctions()

    return () => {
      setSelectedFunction({})
      setFunctions([])
    }
  }, [history, match.params.projectName, refreshFunctions])

  useEffect(() => {
    setTaggedFunctions(
      !filtersStore.showUntagged
        ? functions.filter(func => func.tag.length)
        : functions
    )
  }, [filtersStore.showUntagged, functions])

  useEffect(() => {
    if (match.params.hash && pageData.detailsMenu.length > 0) {
      isDetailsTabExists(
        FUNCTIONS_PAGE,
        match.params,
        pageData.detailsMenu,
        history
      )
    }
  }, [history, match.params, pageData.detailsMenu])

  useEffect(() => {
    let item = {}

    if (match.params.hash && functions.length > 0) {
      const funcTagIndex = match.params.hash.indexOf(':')

      item = functions.find(func => {
        if (funcTagIndex > 0) {
          return isEqual(func.tag, match.params.hash.slice(funcTagIndex + 1))
        } else {
          return isEqual(
            func.hash,
            match.params.hash.slice(match.params.hash.indexOf('@') + 1)
          )
        }
      })

      if (!item || Object.keys(item).length === 0) {
        return history.replace(
          `/projects/${match.params.projectName}/functions`
        )
      }
    }

    setSelectedFunction(item)
  }, [functions, history, match.params.hash, match.params.projectName])

  const filtersChangeCallback = filters => {
    if (
      !filters.showUntagged &&
      filters.showUntagged !== filtersStore.showUntagged &&
      selectedFunction.hash
    ) {
      history.push(`/projects/${match.params.projectName}/functions`)
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
    deleteFunction(func.name, match.params.projectName)
      .then(() => {
        if (!isEmpty(selectedFunction)) {
          setSelectedFunction({})
          history.replace(`/projects/${match.params.projectName}/functions`)
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
      title: `Delete function "${func.name}"?`,
      description: 'Deleted functions cannot be restored.',
      btnCancelLabel: 'Cancel',
      btnCancelVariant: 'label',
      btnConfirmLabel: 'Delete',
      btnConfirmVariant: 'danger',
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
    const { name, tag } = functionsStore.newFunction.metadata
    const tab = ready === false ? 'logs' : 'overview'

    setFunctionsPanelIsOpen(false)
    setEditableItem(null)
    removeNewFunction()

    return refreshFunctions().then(functions => {
      const currentItem = functions.find(
        func => func.name === name && func.tag === tag
      )

      history.push(
        `/projects/${match.params.projectName}/functions/${currentItem.hash}/${tab}`
      )
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
      const currentItem = functions.find(
        func => func.name === name && func.tag === tag
      )

      history.push(
        `/projects/${match.params.projectName}/functions/${currentItem.hash}/overview`
      )
      setNotification({
        status: 400,
        id: Math.random(),
        message: 'Function deployment failed to initiate'
      })
    })
  }

  return (
    <>
      {confirmData && (
        <PopUpDialog
          headerText={confirmData.title}
          closePopUp={confirmData.rejectHandler}
        >
          <div>{confirmData.description}</div>
          <div className="pop-up-dialog__footer-container">
            <Button
              label={confirmData.btnCancelLabel}
              onClick={confirmData.rejectHandler}
              variant={confirmData.btnCancelVariant}
            />
            <Button
              label={confirmData.btnConfirmLabel}
              onClick={() => confirmData.confirmHandler(confirmData.item)}
              variant={confirmData.btnConfirmVariant}
            />
          </div>
        </PopUpDialog>
      )}
      {functionsStore.loading && <Loader />}
      <Content
        content={taggedFunctions}
        filtersChangeCallback={filtersChangeCallback}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectFunction}
        loading={functionsStore.loading}
        match={match}
        pageData={pageData}
        refresh={refreshFunctions}
        selectedItem={selectedFunction}
        setLoading={setLoading}
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
              func => func.metadata.name === editableItem.name
            )
          }}
          match={match}
          mode={PANEL_EDIT_MODE}
          project={match.params.projectName}
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
          match={match}
          mode={editableItem ? PANEL_EDIT_MODE : PANEL_CREATE_MODE}
          project={match.params.projectName}
        />
      )}
    </>
  )
}

Functions.propTypes = {
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ functionsStore, filtersStore }) => ({ functionsStore, filtersStore }),
  {
    ...functionsActions,
    ...notificationActions,
    ...jobsActions
  }
)(React.memo(Functions))
