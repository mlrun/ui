import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import FunctionsPanelView from './FunctionsPanelView'

import functionsActions from '../../actions/functions'

const FunctionsPanel = ({
  functionsStore,
  closePanel,
  createFunctionSuccess,
  deployFunction,
  handleDeployFunctionFailure,
  handleDeployFunctionSuccess,
  project,
  match,
  removeFunctionsError,
  createNewFunction,
  setNewFunctionProject
}) => {
  const [isNameValid, setNameValid] = useState(true)
  const [isHandlerValid, setHandlerValid] = useState(true)
  const history = useHistory()

  useEffect(() => {
    if (!functionsStore.newFunction.metadata.project) {
      setNewFunctionProject(match.params.projectName)
    }
  }, [
    functionsStore.newFunction.metadata.project,
    match.params.projectName,
    setNewFunctionProject
  ])

  const handleSave = deploy => {
    if (isNameValid && isHandlerValid) {
      if (functionsStore.newFunction.metadata.name.length === 0) {
        return setNameValid(false)
      }

      if (functionsStore.newFunction.spec.default_handler.length === 0) {
        return setHandlerValid(false)
      }

      if (functionsStore.error) {
        removeFunctionsError()
      }

      createNewFunction(project, functionsStore.newFunction).then(result => {
        if (deploy) {
          return handleDeploy(functionsStore.newFunction)
        }

        createFunctionSuccess().then(() => {
          history.push(
            `/projects/${project}/functions/${result.data.hash_key}/overview`
          )
        })
      })
    }
  }

  const handleDeploy = func => {
    deployFunction(func)
      .then(response => {
        handleDeployFunctionSuccess(response.data.ready)
      })
      .catch(() => {
        handleDeployFunctionFailure()
      })
  }

  return (
    <FunctionsPanelView
      closePanel={closePanel}
      error={functionsStore.error}
      handleSave={handleSave}
      isHandlerValid={isHandlerValid}
      isNameValid={isNameValid}
      loading={functionsStore.loading}
      removeFunctionsError={removeFunctionsError}
      setHandlerValid={setHandlerValid}
      setNameValid={setNameValid}
    />
  )
}

FunctionsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  createFunctionSuccess: PropTypes.func.isRequired,
  handleDeployFunctionFailure: PropTypes.func.isRequired,
  handleDeployFunctionSuccess: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  project: PropTypes.string.isRequired
}

export default connect(({ functionsStore }) => ({ functionsStore }), {
  ...functionsActions
})(FunctionsPanel)
