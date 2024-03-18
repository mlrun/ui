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
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { isEmpty } from 'lodash'

import RegisterArtifactModalForm from '../../elements/RegisterArtifactModalForm/RegisterArtifactModalForm'
import { Button, Modal } from 'igz-controls/components'

import {
  FORBIDDEN_ERROR_STATUS_CODE,
  MODAL_SM,
  SECONDARY_BUTTON,
  TERTIARY_BUTTON
} from 'igz-controls/constants'
import artifactApi from '../../api/artifacts-api'
import { ARTIFACT_TYPE } from '../../constants'
import { convertChipsData } from '../../utils/convertChipsData'
import { createArtifactMessages } from '../../utils/createArtifact.util'
import { setFieldState } from 'igz-controls/utils/form.util'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'

const RegisterArtifactModal = ({
  actions,
  artifactKind,
  isOpen,
  onResolve,
  params,
  refresh,
  title
}) => {
  const initialValues = {
    kind: artifactKind,
    metadata: {
      description: '',
      key: '',
      labels: []
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
  const [uniquenessErrorIsShown, setUniquenessErrorIsShown] = useState(false)
  const formRef = React.useRef(
    createForm({
      initialValues,
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )
  const location = useLocation()
  const dispatch = useDispatch()
  const { handleCloseModal, resolveModal } = useModalBlockHistory(onResolve, formRef.current)

  const registerArtifact = values => {
    const data = {
      kind: values.kind,
      metadata: {
        description: values.metadata.description,
        labels: convertChipsData(values.metadata.labels),
        key: values.metadata.key,
        tag: values.metadata.tag,
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

    return artifactApi
      .getArtifact(params.projectName, values.metadata.key, values.metadata.tag)
      .then(response => {
        if (response?.data) {
          if (!isEmpty(response.data.artifacts)) {
            setUniquenessErrorIsShown(true)

            return null
          } else {
            setUniquenessErrorIsShown(false)

            return artifactApi.registerArtifact(params.projectName, data).then(response => {
              resolveModal()
              refresh()
              dispatch(
                setNotification({
                  status: response.status,
                  id: Math.random(),
                  message: `${title} initiated successfully`
                })
              )

              return response
            })
          }
        }
      })
      .catch(error => {
        const customErrorMsg =
          error.response.status === FORBIDDEN_ERROR_STATUS_CODE
            ? 'You are not permitted to create a new resource'
            : `${title} failed to initiate`

        showErrorNotification(dispatch, error, '', customErrorMsg, () => registerArtifact(values))

        setUniquenessErrorIsShown(false)
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
    <Form form={formRef.current} onSubmit={registerArtifact}>
      {formState => {
        return (
          <Modal
            data-testid="register-artifact"
            actions={getModalActions(formState)}
            className="artifact-register-form"
            location={location}
            onClose={handleCloseModal}
            show={isOpen}
            size={MODAL_SM}
            title={title}
          >
            <RegisterArtifactModalForm
              formState={formState}
              initialValues={initialValues}
              messagesByKind={createArtifactMessages[artifactKind.toLowerCase()]}
              params={params}
              setFieldState={formState.form.mutators.setFieldState}
              setUniquenessErrorIsShown={setUniquenessErrorIsShown}
              showType={artifactKind === ARTIFACT_TYPE}
              uniquenessErrorIsShown={uniquenessErrorIsShown}
            />
          </Modal>
        )
      }}
    </Form>
  )
}

RegisterArtifactModal.propTypes = {
  artifactKind: PropTypes.string.isRequired,
  params: PropTypes.shape({}).isRequired,
  refresh: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default RegisterArtifactModal
