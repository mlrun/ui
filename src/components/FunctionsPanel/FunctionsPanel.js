import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { chain } from 'lodash'

import FunctionsPanelView from './FunctionsPanelView'

import functionsActions from '../../actions/functions'
import { FUNCTION_PANEL_MODE } from '../../types'
import {
  LABEL_BUTTON,
  PANEL_CREATE_MODE,
  SECONDARY_BUTTON
} from '../../constants'

const FunctionsPanel = ({
  functionsStore,
  closePanel,
  createFunctionSuccess,
  defaultData,
  deployFunction,
  getFunction,
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
  const [confirmData, setConfirmData] = useState(null)
  const [validation, setValidation] = useState({
    isNameValid: true,
    isHandlerValid: true,
    isMemoryRequestValid: true,
    isMemoryLimitValid: true,
    isCpuRequestValid: true,
    isCpuLimitValid: true,
    isGpuLimitValid: true
  })
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

  const checkValidation = () => {
    return (
      validation.isNameValid &&
      validation.isHandlerValid &&
      validation.isMemoryRequestValid &&
      validation.isMemoryLimitValid &&
      validation.isCpuRequestValid &&
      validation.isCpuLimitValid &&
      validation.isGpuLimitValid
    )
  }

  const createFunction = deploy => {
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

  const handleSave = deploy => {
    if (validation.isNameValid && validation.isHandlerValid) {
      if (functionsStore.newFunction.metadata.name.length === 0) {
        return setValidation(state => ({ ...state, isNameValid: false }))
      }

      if (functionsStore.newFunction.spec.default_handler.length === 0) {
        return setValidation(state => ({ ...state, isHandlerValid: false }))
      }

      if (functionsStore.error) {
        removeFunctionsError()
      }

      if (mode === PANEL_CREATE_MODE) {
        getFunction(project, functionsStore.newFunction.metadata.name)
          .then(() => {
            setConfirmData({
              title: `Overwrite function "${functionsStore.newFunction.metadata.name}"?`,
              description:
                'The specified function name is already used by another function. Overwrite the other function with this one, or cancel and give this function another name?',
              btnCancelLabel: 'Cancel',
              btnCancelVariant: LABEL_BUTTON,
              btnConfirmLabel: 'Overwrite',
              btnConfirmVariant: SECONDARY_BUTTON,
              rejectHandler: () => setConfirmData(null),
              confirmHandler: () => {
                createFunction(deploy)
                setConfirmData(null)
              }
            })
          })
          .catch(() => {
            createFunction(deploy)
          })
      } else {
        createFunction(deploy)
      }
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
      checkValidation={checkValidation()}
      closePanel={closePanel}
      confirmData={confirmData}
      defaultData={defaultData ?? {}}
      error={functionsStore.error}
      handleSave={handleSave}
      loading={functionsStore.loading}
      mode={mode}
      removeFunctionsError={removeFunctionsError}
      setValidation={setValidation}
      validation={validation}
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
  mode: FUNCTION_PANEL_MODE.isRequired,
  project: PropTypes.string.isRequired
}

export default connect(({ functionsStore }) => ({ functionsStore }), {
  ...functionsActions
})(FunctionsPanel)
