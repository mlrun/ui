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
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { chain } from 'lodash'

import FunctionsPanelView from './FunctionsPanelView'

import functionsActions from '../../actions/functions'
import { FUNCTION_PANEL_MODE } from '../../types'
import { FUNCTION_TYPE_SERVING, PANEL_DEFAULT_ACCESS_KEY } from '../../constants'
import {
  EXISTING_IMAGE,
  NEW_IMAGE
} from '../../elements/FunctionsPanelCode/functionsPanelCode.util'
import { PANEL_CREATE_MODE } from '../../constants'
import { NOTFOUND_ERROR_STATUS_CODE, LABEL_BUTTON, SECONDARY_BUTTON } from 'igz-controls/constants'

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
    isDefaultCLassValid: true,
    isCodeImageValid: true,
    isBaseImageValid: true,
    isBuildCommandsValid: true,
    isBuildRequirementValid: true,
    isBuildImageValid: true,
    isMemoryRequestValid: true,
    isMemoryLimitValid: true,
    isCpuRequestValid: true,
    isCpuLimitValid: true,
    isGpuLimitValid: true,
    isAccessKeyValid: true,
    isErrorStreamPathValid: true
  })
  const [imageType, setImageType] = useState(
    (defaultData?.build?.image ||
      defaultData?.build?.base_image ||
      defaultData?.build?.commands?.length > 0) &&
      defaultData.image?.length === 0
      ? NEW_IMAGE
      : ''
  )
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (defaultData) {
      let data = {
        kind: defaultData.type,
        metadata: {
          credentials: {
            access_key: defaultData.access_key || PANEL_DEFAULT_ACCESS_KEY
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
            requirements: defaultData.build?.requirements ?? [],
            functionSourceCode: defaultData.build?.functionSourceCode ?? '',
            image: defaultData.build?.image ?? ''
          },
          description: defaultData.description,
          env: defaultData.env,
          image: defaultData.image,
          priority_class_name: defaultData.priority_class_name,
          preemption_mode: defaultData.preemption_mode,
          volume_mounts: chain(defaultData.volume_mounts).flatten().unionBy('name').value() ?? [],
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
      setNewFunctionProject(params.projectName)
    }
  }, [functionsStore.newFunction.metadata.project, params.projectName, setNewFunctionProject])

  const createFunction = deploy => {
    createNewFunction(params.projectName, functionsStore.newFunction).then(result => {
      if (deploy) {
        const with_mlrun = functionsStore.newFunction.spec.build.requirements.includes(
          appStore.frontendSpec?.function_deployment_mlrun_requirement
        )

        const data = {
          function: {
            ...functionsStore.newFunction,
            spec: {
              ...functionsStore.newFunction.spec,
              build:{
                ...functionsStore.newFunction.spec.build,
                requirements:
                  with_mlrun &&
                  functionsStore.newFunction.spec.build.requirements.length === 1 ?
                  []
                  : functionsStore.newFunction.spec.build.requirements
              }
            }
          },
          with_mlrun
        }

        return handleDeploy(data)
      }

      createFunctionSuccess().then(() => {
        navigate(`/projects/${params.projectName}/functions/${result.data.hash_key}/overview`)
      })
    })
  }

  const handleSave = deploy => {
    if (checkValidation()) {
      if (functionsStore.newFunction.spec.image.length === 0 && imageType === EXISTING_IMAGE) {
        return setValidation(state => ({
          ...state,
          isCodeImageValid: false
        }))
      }

      if (
        imageType === NEW_IMAGE &&
        (functionsStore.newFunction.spec.build.base_image.length === 0)
      ) {
        return setValidation(state => ({
          ...state,
          isBaseImageValid: functionsStore.newFunction.spec.build.base_image.length > 0
        }))
      }

      if (functionsStore.newFunction.metadata.credentials.access_key.length === 0) {
        return setValidation(state => ({
          ...state,
          isAccessKeyValid: false
        }))
      }

      if (functionsStore.error) {
        removeFunctionsError()
      }

      if (mode === PANEL_CREATE_MODE) {
        getFunction(params.projectName, functionsStore.newFunction.metadata.name)
          .then(() => {
            setConfirmData({
              header: 'Overwrite function?',
              message: `You try to overwrite function "${functionsStore.newFunction.metadata.name}". The specified function name is already used by another function. Overwrite the other function with this one, or cancel and give this function another name?`,
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
          .catch(error => {
            if (error.response.status === NOTFOUND_ERROR_STATUS_CODE) {
              removeFunctionsError()
            }

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
    return Object.values(validation).every(value => value)
  }

  return createPortal(
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
      mode={mode}
      newFunction={functionsStore.newFunction}
      removeFunctionsError={removeFunctionsError}
      setImageType={setImageType}
      setNewFunctionCredentialsAccessKey={setNewFunctionCredentialsAccessKey}
      setValidation={setValidation}
      validation={validation}
    />,
    document.getElementById('overlay_container')
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
  mode: FUNCTION_PANEL_MODE.isRequired,
  project: PropTypes.string.isRequired
}

export default connect(({ appStore, functionsStore }) => ({ appStore, functionsStore }), {
  ...functionsActions
})(FunctionsPanel)
