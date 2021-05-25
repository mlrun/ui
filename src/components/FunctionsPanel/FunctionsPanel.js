import React, { useState } from 'react'
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
  removeFunctionsError,
  createNewFunction
}) => {
  const [isNameValid, setNameValid] = useState(true)
  const [isTagValid, setTagValid] = useState(true)
  const history = useHistory()

  const handleSave = deploy => {
    if (isNameValid && isTagValid) {
      if (functionsStore.newFunction.metadata.name.length === 0) {
        return setNameValid(false)
      }

      if (functionsStore.newFunction.metadata.tag.length === 0) {
        return setTagValid(false)
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
      .then(() => {
        handleDeployFunctionSuccess()
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
      isNameValid={isNameValid}
      isTagValid={isTagValid}
      loading={functionsStore.loading}
      removeFunctionsError={removeFunctionsError}
      setNameValid={setNameValid}
      setTagValid={setTagValid}
    />
  )
}

FunctionsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  createFunctionSuccess: PropTypes.func.isRequired,
  handleDeployFunctionFailure: PropTypes.func.isRequired,
  handleDeployFunctionSuccess: PropTypes.func.isRequired,
  project: PropTypes.string.isRequired
}

export default connect(({ functionsStore }) => ({ functionsStore }), {
  ...functionsActions
})(FunctionsPanel)
