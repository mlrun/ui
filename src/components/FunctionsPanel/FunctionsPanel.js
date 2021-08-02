import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { chain } from 'lodash'

import FunctionsPanelView from './FunctionsPanelView'

import functionsActions from '../../actions/functions'

const FunctionsPanel = ({
  functionsStore,
  closePanel,
  createFunctionSuccess,
  defaultData,
  deployFunction,
  handleDeployFunctionFailure,
  handleDeployFunctionSuccess,
  project,
  match,
  mode,
  removeFunctionsError,
  createNewFunction,
  setNewFunction,
  setNewFunctionProject
}) => {
  const [isNameValid, setNameValid] = useState(true)
  const [isHandlerValid, setHandlerValid] = useState(true)
  const history = useHistory()

  useEffect(() => {
    if (defaultData) {
      setNewFunction({
        kind: defaultData.type,
        metadata: {
          labels: defaultData.labels,
          name: defaultData.name,
          project: defaultData.project,
          tag: defaultData.tag
        },
        spec: {
          args: defaultData.args,
          build: {
            base_image: defaultData.build?.base_image ?? '',
            commands: defaultData.build?.commands ?? [],
            functionSourceCode: defaultData.build?.functionSourceCode ?? '',
            image: defaultData.build?.image ?? ''
          },
          default_handler: defaultData.default_handler,
          description: defaultData.description,
          env: defaultData.env,
          image: defaultData.image,
          volume_mounts:
            chain(defaultData.volume_mounts)
              .flatten()
              .unionBy('name')
              .value() ?? [],
          volumes: defaultData.volumes,
          resources: {
            limits: defaultData.resources.limits ?? {},
            requests: defaultData.resources.requests ?? {}
          },
          secret_sources: defaultData.secret_sources
        }
      })
    }
  }, [defaultData, setNewFunction])

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
      defaultData={defaultData ?? {}}
      error={functionsStore.error}
      handleSave={handleSave}
      isHandlerValid={isHandlerValid}
      isNameValid={isNameValid}
      loading={functionsStore.loading}
      mode={mode}
      removeFunctionsError={removeFunctionsError}
      setHandlerValid={setHandlerValid}
      setNameValid={setNameValid}
    />
  )
}

FunctionsPanel.defaultProps = {
  defaultData: null
}

FunctionsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  createFunctionSuccess: PropTypes.func.isRequired,
  defaultData: PropTypes.shape({}),
  handleDeployFunctionFailure: PropTypes.func.isRequired,
  handleDeployFunctionSuccess: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  mode: PropTypes.string.isRequired,
  project: PropTypes.string.isRequired
}

export default connect(({ functionsStore }) => ({ functionsStore }), {
  ...functionsActions
})(FunctionsPanel)
