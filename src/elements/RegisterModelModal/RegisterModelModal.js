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
under the Apache 2.0 license is conditioned upon your` compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { createForm } from 'final-form'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { v4 as uuidv4 } from 'uuid'
import { isEmpty } from 'lodash'

import { ConfirmDialog } from 'igz-controls/components'
import TargetPath from '../../common/TargetPath/TargetPath'
import { Button, Modal, FormChipCell, FormInput, FormTextarea } from 'igz-controls/components'

import artifactApi from '../../api/artifacts-api'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'
import { MODAL_SM, SECONDARY_BUTTON, TERTIARY_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'
import { convertChipsData } from '../../utils/convertChipsData'
import { getChipOptions } from '../../utils/getChipOptions'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { createModelMessages } from '../../utils/createArtifact.util'
import { setFieldState } from 'igz-controls/utils/form.util'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'

import './RegisterModelModal.scss'

function RegisterModelModal({ actions, isOpen, onResolve, params, refresh }) {
  const initialValues = {
    metadata: {
      description: undefined,
      labels: [],
      key: undefined
    },
    spec: {
      target_path: {
        fieldInfo: {
          pathType: ''
        },
        path: ''
      }
    }
  }
  const formRef = React.useRef(
    createForm({
      initialValues,
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )
  const location = useLocation()
  const { handleCloseModal, resolveModal } = useModalBlockHistory(onResolve, formRef.current)
  const dispatch = useDispatch()

  const registerModel = values => {
    const data = {
      kind: 'model',
      metadata: {
        ...values.metadata,
        labels: convertChipsData(values.metadata.labels),
        project: params.projectName,
        tree: uuidv4()
      },
      spec: {
        db_key: values.metadata.key,
        producer: {
          kind: 'api',
          uri: window.location.host
        },
        target_path: values.spec.target_path.path
      },
      status: {}
    }

    if (values.spec.target_path?.path?.includes('/')) {
      const path = values.spec.target_path.path.split(/([^/]*)$/)

      data.spec.target_path = path[0]
      data.spec.model_file = path[1]
    }

    const handleRegisterModel = () => {
      return artifactApi.registerArtifact(params.projectName, data).then(response => {
        resolveModal()
        refresh()
        dispatch(
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Model initiated successfully'
          })
        )
      })
    }

    return artifactApi
      .getArtifact(params.projectName, values.metadata.key, values.metadata.tag ?? 'latest')
      .then(response => {
        if (response?.data) {
          if (!isEmpty(response.data.artifacts)) {
            openPopUp(ConfirmDialog, {
              confirmButton: {
                label: 'Overwrite',
                variant: PRIMARY_BUTTON,
                handler: handleRegisterModel
              },
              cancelButton: {
                label: 'Cancel',
                variant: TERTIARY_BUTTON
              },
              header: createModelMessages.overwriteConfirmTitle,
              message: createModelMessages.overwriteConfirmMessage
            })
          } else {
            return handleRegisterModel()
          }
        }
      })
      .catch(error => {
        showErrorNotification(dispatch, error, '', 'Model failed to initiate', () =>
          registerModel(values)
        )
        resolveModal()
      })
  }

  const getModalActions = formState => {
    const defaultActions = actions
      ? actions(formState, handleCloseModal)
      : [
          {
            label: 'Cancel',
            onClick: () => handleCloseModal(),
            variant: TERTIARY_BUTTON
          },
          {
            disabled: formState.submitting || (formState.invalid && formState.submitFailed),
            label: 'Register',
            onClick: formState.handleSubmit,
            variant: SECONDARY_BUTTON
          }
        ]
    return defaultActions.map(action => <Button {...action} />)
  }

  return (
    <Form form={formRef.current} onSubmit={registerModel}>
      {formState => {
        return (
          <Modal
            actions={getModalActions(formState)}
            className="register-model form"
            location={location}
            onClose={handleCloseModal}
            show={isOpen}
            size={MODAL_SM}
            title="Register model"
          >
            <div className="form-row">
              <div className="form-col-2">
                <FormInput
                  async
                  label="Name"
                  name="metadata.key"
                  required
                  validationRules={getValidationRules('artifact.name')}
                />
              </div>
              <div className="form-col-1">
                <FormInput
                  label="Tag"
                  name="metadata.tag"
                  validationRules={getValidationRules('common.tag')}
                  placeholder="latest"
                />
              </div>
            </div>
            <div className="form-row">
              <FormTextarea name="metadata.description" label="Description" maxLength={500} />
            </div>
            <div className="form-row">
              <TargetPath
                formState={formState}
                formStateFieldInfo="spec.target_path.fieldInfo"
                hiddenSelectOptionsIds={[MLRUN_STORAGE_INPUT_PATH_SCHEME]}
                label="Target Path"
                name="spec.target_path.path"
                params={params}
                required
                selectPlaceholder="Path Scheme"
                setFieldState={formState.form.mutators.setFieldState}
              />
            </div>
            <div className="form-row">
              <FormChipCell
                chipOptions={getChipOptions('metrics')}
                formState={formState}
                initialValues={initialValues}
                isEditable
                label="labels"
                name="metadata.labels"
                shortChips
                visibleChipsMaxLength="all"
                validationRules={{
                  key: getValidationRules('common.tag'),
                  value: getValidationRules('common.tag')
                }}
              />
            </div>
          </Modal>
        )
      }}
    </Form>
  )
}

RegisterModelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  params: PropTypes.shape({}).isRequired,
  refresh: PropTypes.func.isRequired
}

export default RegisterModelModal
