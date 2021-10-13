import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { chain } from 'lodash'

import FunctionsPanelView from './FunctionsPanelView'

import functionsActions from '../../actions/functions'
import { FUNCTION_PANEL_MODE } from '../../types'
import { FUNCTION_TYPE_SERVING } from '../../constants'
import {
  EXISTING_IMAGE,
  NEW_IMAGE
} from '../../elements/FunctionsPanelCode/functionsPanelCode.util'
import {
  LABEL_BUTTON,
  PANEL_CREATE_MODE,
  SECONDARY_BUTTON
} from '../../constants'

const FunctionsPanel = ({
  appStore,
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
  setNewFunctionCredentialsAccessKey,
  setNewFunctionProject
}) => {
  const [confirmData, setConfirmData] = useState(null)
  const [validation, setValidation] = useState({
    isHandlerValid: true,
    isCodeImageValid: true,
    isBaseImageValid: true,
    isBuildCommandsValid: true,
    isMemoryRequestValid: true,
    isMemoryLimitValid: true,
    isCpuRequestValid: true,
    isCpuLimitValid: true,
    isGpuLimitValid: true
  })
  const [imageType, setImageType] = useState(
    (defaultData?.build?.image ||
      defaultData?.build?.base_image ||
      defaultData?.build?.commands?.length > 0) &&
      defaultData.image?.length === 0
      ? NEW_IMAGE
      : ''
  )
  const history = useHistory()

  useEffect(() => {
    if (defaultData) {
      let data = {
        kind: defaultData.type,
        metadata: {
          credentials: {
            access_key: defaultData.access_key
          },
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
          }
        }
      }

      if (defaultData.type === FUNCTION_TYPE_SERVING) {
        data = {
          ...data,
          spec: {
            ...data.spec,
            default_class: defaultData.default_class,
            error_stream: defaultData.error_stream,
            graph: defaultData.graph,
            parameters: defaultData.parameters,
            secret_sources: defaultData.secret_sources,
            track_models: defaultData.track_models ?? false
          }
        }
      } else {
        data = {
          ...data,
          spec: {
            ...data.spec,
            default_handler: defaultData.default_handler
          }
        }
      }

      setNewFunction(data)
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

  const createFunction = deploy => {
    createNewFunction(project, functionsStore.newFunction).then(result => {
      if (deploy) {
        const data = {
          function: { ...functionsStore.newFunction },
          with_mlrun: functionsStore.newFunction.spec.build.commands.includes(
            appStore.frontendSpec.function_deployment_mlrun_command
          )
        }

        return handleDeploy(data)
      }

      createFunctionSuccess().then(() => {
        history.push(
          `/projects/${project}/functions/${result.data.hash_key}/overview`
        )
      })
    })
  }

  const handleSave = deploy => {
    if (checkValidation()) {
      if (
        functionsStore.newFunction.kind !== FUNCTION_TYPE_SERVING &&
        functionsStore.newFunction.spec.default_handler.length === 0
      ) {
        return setValidation(state => ({ ...state, isHandlerValid: false }))
      }

      if (
        functionsStore.newFunction.spec.image.length === 0 &&
        imageType === EXISTING_IMAGE
      ) {
        return setValidation(state => ({
          ...state,
          isCodeImageValid: false
        }))
      }

      if (
        imageType === NEW_IMAGE &&
        (functionsStore.newFunction.spec.build.base_image.length === 0 ||
          functionsStore.newFunction.spec.build.commands.length === 0)
      ) {
        return setValidation(state => ({
          ...state,
          isBaseImageValid:
            functionsStore.newFunction.spec.build.base_image.length > 0,
          isBuildCommandsValid:
            functionsStore.newFunction.spec.build.commands.length > 0
        }))
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

  const handleDeploy = data => {
    deployFunction(data)
      .then(response => {
        handleDeployFunctionSuccess(response.data.ready)
      })
      .catch(() => {
        handleDeployFunctionFailure()
      })
  }

  const checkValidation = () => {
    return Object.values(validation).find(value => value === false) ?? true
  }

  return (
    <FunctionsPanelView
      checkValidation={checkValidation}
      closePanel={closePanel}
      confirmData={confirmData}
      defaultData={defaultData ?? {}}
      error={functionsStore.error}
      functionsStore={functionsStore}
      handleSave={handleSave}
      imageType={imageType}
      loading={functionsStore.loading}
      match={match}
      mode={mode}
      newFunction={functionsStore.newFunction}
      removeFunctionsError={removeFunctionsError}
      setImageType={setImageType}
      setNewFunctionCredentialsAccessKey={setNewFunctionCredentialsAccessKey}
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

export default connect(
  ({ appStore, functionsStore }) => ({ appStore, functionsStore }),
  {
    ...functionsActions
  }
)(FunctionsPanel)
