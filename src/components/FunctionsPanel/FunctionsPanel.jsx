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
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { chain, cloneDeep } from 'lodash'
import { Form, FormSpy } from 'react-final-form'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'

import FunctionsPanelView from './FunctionsPanelView'

import {
  createNewFunction,
  deployFunction,
  fetchFunction,
  removeFunctionsError,
  setNewFunction,
  setNewFunctionProject
} from '../../reducers/functionReducer'
import { FUNCTION_PANEL_MODE } from '../../types'

import {
  EXISTING_IMAGE,
  NEW_IMAGE
} from '../../elements/FunctionsPanelCode/functionsPanelCode.util'
import { setFieldState } from 'igz-controls/utils/form.util'
import { convertChipsData, parseChipsData } from '../../utils/convertChipsData'
import {
  FUNCTION_TYPE_SERVING,
  PANEL_CREATE_MODE,
  PANEL_DEFAULT_ACCESS_KEY,
  PANEL_EDIT_MODE
} from '../../constants'
import { LABEL_BUTTON, NOTFOUND_ERROR_STATUS_CODE, PRIMARY_BUTTON } from 'igz-controls/constants'

const FunctionsPanel = ({
  closePanel,
  createFunctionSuccess,
  defaultData = null,
  handleDeployFunctionFailure,
  handleDeployFunctionSuccess,
  mode
}) => {
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const [confirmData, setConfirmData] = useState(null)
  const [validation, setValidation] = useState({
    areLabelsValid: true,
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
  const [form] = useState(() => {
    return createForm({
      initialValues: {
        labels: parseChipsData(defaultData?.labels || {}, frontendSpec.internal_labels)
      },
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  })
  const dispatch = useDispatch()
  const functionsStore = useSelector(store => store.functionsStore)
  const appStore = useSelector(store => store.appStore)

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

      dispatch(setNewFunction(data))
    }
  }, [defaultData, dispatch])

  useEffect(() => {
    if (!functionsStore.newFunction.metadata.project) {
      dispatch(setNewFunctionProject(params.projectName))
    }
  }, [dispatch, functionsStore.newFunction.metadata.project, params.projectName])

  const createFunction = deploy => {
    const functionPayload = cloneDeep(functionsStore.newFunction)
    const funcTag = functionPayload.metadata.tag || 'latest'

    functionPayload.labels = convertChipsData(formRef.current.getFieldState('labels')?.value)

    dispatch(createNewFunction({ project: params.projectName, data: functionPayload }))
      .unwrap()
      .then(result => {
        if (deploy) {
          const with_mlrun = functionsStore.newFunction.spec.build.requirements.includes(
            appStore.frontendSpec?.function_deployment_mlrun_requirement
          )
          const skip_deployed = imageType === EXISTING_IMAGE

          const data = {
            function: {
              ...functionsStore.newFunction,
              spec: {
                ...functionsStore.newFunction.spec,
                build: {
                  ...functionsStore.newFunction.spec.build,
                  requirements:
                    with_mlrun && functionsStore.newFunction.spec.build.requirements.length === 1
                      ? []
                      : functionsStore.newFunction.spec.build.requirements
                }
              },
              metadata: {
                ...functionsStore.newFunction.metadata,
                labels: convertChipsData(formRef.current.getFieldState('labels')?.value)
              }
            },
            skip_deployed,
            with_mlrun
          }

          return handleDeploy(data)
        }

        if (result) {
          createFunctionSuccess(mode === PANEL_EDIT_MODE).then(() => {
            navigate(
              `/projects/${params.projectName}/functions/${functionPayload.metadata.name}/:${funcTag}@${result.data.hash_key}/overview`
            )
          })
        }
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
        functionsStore.newFunction.spec.build.base_image.length === 0
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
        dispatch(removeFunctionsError())
      }

      if (mode === PANEL_CREATE_MODE) {
        dispatch(
          fetchFunction({
            project: params.projectName,
            name: functionsStore.newFunction.metadata.name,
            hash: null,
            tag: functionsStore.newFunction.metadata.tag
          })
        )
          .unwrap()
          .then(() => {
            setConfirmData({
              header: 'Overwrite function?',
              message: `The specified function name is already in use. Are you sure you want to overwrite the function "${functionsStore.newFunction.metadata.name}"?`,
              btnCancelLabel: 'Cancel',
              btnCancelVariant: LABEL_BUTTON,
              btnConfirmLabel: 'Overwrite',
              btnConfirmVariant: PRIMARY_BUTTON,
              rejectHandler: () => setConfirmData(null),
              confirmHandler: () => {
                createFunction(deploy)
                setConfirmData(null)
              }
            })
          })
          .catch(error => {
            if (error.response.status === NOTFOUND_ERROR_STATUS_CODE) {
              dispatch(removeFunctionsError())
            }

            createFunction(deploy)
          })
      } else {
        createFunction(deploy)
      }
    }
  }

  const handleDeploy = data => {
    dispatch(deployFunction({ data }))
      .unwrap()
      .then(response => {
        handleDeployFunctionSuccess(response.data.ready)
      })
      .catch(error => {
        handleDeployFunctionFailure(error)
      })
  }

  const checkValidation = () => {
    return Object.values(validation).every(value => value)
  }

  return createPortal(
    <Form form={form} onSubmit={() => {}}>
      {formState => {
        return (
          <>
            <FunctionsPanelView
              checkValidation={checkValidation}
              closePanel={closePanel}
              confirmData={confirmData}
              defaultData={defaultData ?? {}}
              error={functionsStore.error}
              formState={formState}
              frontendSpec={frontendSpec}
              functionsStore={functionsStore}
              handleSave={handleSave}
              imageType={imageType}
              loading={functionsStore.loading || functionsStore.funcLoading}
              mode={mode}
              newFunction={functionsStore.newFunction}
              setImageType={setImageType}
              setValidation={setValidation}
              validation={validation}
            />
            <FormSpy
              subscription={{ valid: true }}
              onChange={() => {
                setValidation(prevState => ({
                  ...prevState,
                  areLabelsValid: formRef.current?.getFieldState?.('labels')?.valid ?? true
                }))
              }}
            />
          </>
        )
      }}
    </Form>,
    document.getElementById('overlay_container')
  )
}

FunctionsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  createFunctionSuccess: PropTypes.func.isRequired,
  defaultData: PropTypes.object,
  handleDeployFunctionFailure: PropTypes.func.isRequired,
  handleDeployFunctionSuccess: PropTypes.func.isRequired,
  mode: FUNCTION_PANEL_MODE.isRequired,
  project: PropTypes.string.isRequired
}

export default FunctionsPanel
