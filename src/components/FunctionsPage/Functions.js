import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { chain, isEqual, isEmpty } from 'lodash'

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
  initialGroupFilter,
  page,
  tableHeaders
} from './functions.util'
import functionsActions from '../../actions/functions'
import notificationActions from '../../actions/notification'
import jobsActions from '../../actions/jobs'

import { ReactComponent as Delete } from '../../images/delete.svg'
import { ReactComponent as Run } from '../../images/run.svg'

const Functions = ({
  deleteFunction,
  fetchFunctions,
  functionsStore,
  history,
  match,
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
  const [showUntagged, setShowUntagged] = useState('')
  const [taggedFunctions, setTaggedFunctions] = useState([])
  const [functionsPanelIsOpen, setFunctionsPanelIsOpen] = useState(false)
  const pageData = {
    actionsMenu: item => [
      {
        label: 'Run',
        icon: <Run />,
        onClick: func => setEditableItem(func),
        hidden: FUNCTIONS_FAILED_STATES.includes(item?.state)
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
      variant: 'secondary'
    }
  }

  const refreshFunctions = useCallback(
    items => {
      return fetchFunctions(match.params.projectName, items?.name).then(
        functions => {
          const newFunctions = chain(functions)
            .orderBy('metadata.updated', 'desc')
            .map(func => ({
              name: func.metadata.name,
              type: func.kind,
              tag: func.metadata.tag,
              hash: func.metadata.hash,
              codeOrigin: func.spec?.build?.code_origin ?? '',
              updated: new Date(func.metadata.updated),
              command: func.spec?.command,
              image: func.spec?.image,
              description: func.spec?.description,
              state: func.status?.state ?? '',
              functionSourceCode: func.spec?.build?.functionSourceCode ?? ''
            }))
            .value()

          return setFunctions(newFunctions)
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
      !showUntagged ? functions.filter(func => func.tag.length) : functions
    )
  }, [showUntagged, functions])

  useEffect(() => {
    let item = {}

    if (match.params.hash && functions.length > 0) {
      const funcTagIndex = match.params.hash.indexOf(':')

      if (selectedFunction.updated) {
        item = functions.find(func => {
          if (funcTagIndex > 0) {
            return (
              isEqual(func.updated, selectedFunction.updated) &&
              isEqual(func.tag, selectedFunction.tag)
            )
          } else {
            return (
              isEqual(func.updated, selectedFunction.updated) &&
              isEqual(func.hash, selectedFunction.hash)
            )
          }
        })
      } else {
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
      }

      if (!item || Object.keys(item).length === 0) {
        return history.push(`/projects/${match.params.projectName}/functions`)
      }
    }

    setSelectedFunction(item)
  }, [
    functions,
    match.params.hash,
    setSelectedFunction,
    history,
    match.params.projectName,
    selectedFunction.updated,
    selectedFunction.hash,
    selectedFunction.tag
  ])

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
          history.push(`/projects/${match.params.projectName}/functions`)
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

  const toggleShowUntagged = showUntagged => {
    const pathLangsOnFuncScreen = 4
    if (history.location.pathname.split('/').length > pathLangsOnFuncScreen) {
      history.push(`/projects/${match.params.projectName}/functions`)
    }

    setShowUntagged(state => (state === showUntagged ? '' : showUntagged))
  }

  const closePanel = () => {
    setFunctionsPanelIsOpen(false)
    removeNewFunction()

    if (functionsStore.error) {
      removeFunctionsError()
    }
  }

  const createFunctionSuccess = () => {
    setFunctionsPanelIsOpen(false)
    removeNewFunction()

    return refreshFunctions().then(() => {
      setNotification({
        status: 200,
        id: Math.random(),
        message: 'Function created successfully'
      })
    })
  }

  const handleDeployFunctionSuccess = () => {
    setFunctionsPanelIsOpen(false)
    removeNewFunction()

    return refreshFunctions().then(() => {
      setNotification({
        status: 200,
        id: Math.random(),
        message: 'Function deployment initiated successfully'
      })
    })
  }

  const handleDeployFunctionFailure = () => {
    setFunctionsPanelIsOpen(false)
    removeNewFunction()

    return refreshFunctions().then(functions => {
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
        groupFilter={initialGroupFilter}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectFunction}
        loading={functionsStore.loading}
        match={match}
        pageData={pageData}
        refresh={refreshFunctions}
        selectedItem={selectedFunction}
        setLoading={setLoading}
        showUntagged={showUntagged}
        toggleShowUntagged={toggleShowUntagged}
        yamlContent={functionsStore.functions}
      />
      {editableItem && (
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
          project={match.params.projectName}
          redirectToDetailsPane
        />
      )}
      {functionsPanelIsOpen && (
        <FunctionsPanel
          closePanel={closePanel}
          createFunctionSuccess={createFunctionSuccess}
          handleDeployFunctionFailure={handleDeployFunctionFailure}
          handleDeployFunctionSuccess={handleDeployFunctionSuccess}
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

export default connect(functionsStore => functionsStore, {
  ...functionsActions,
  ...notificationActions,
  ...jobsActions
})(React.memo(Functions))
