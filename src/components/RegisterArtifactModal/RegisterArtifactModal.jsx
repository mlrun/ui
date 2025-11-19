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
import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'

import RegisterArtifactModalForm from '../../elements/RegisterArtifactModalForm/RegisterArtifactModalForm'
import { Button, Modal, Loader } from 'igz-controls/components'

import {
  FORBIDDEN_ERROR_STATUS_CODE,
  MODAL_SM,
  TERTIARY_BUTTON,
  PRIMARY_BUTTON
} from 'igz-controls/constants'
import artifactApi from '../../api/artifacts-api'
import { ARTIFACT_TYPE } from '../../constants'
import { convertChipsData } from '../../utils/convertChipsData'
import { createArtifactMessages } from '../../utils/createArtifact.util'
import { setFieldState, isSubmitDisabled } from 'igz-controls/utils/form.util'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { processActionAfterTagUniquesValidation } from '../../utils/artifacts.util'

const RegisterArtifactModal = ({
  actions = null,
  artifactKind,
  isOpen,
  onResolve,
  params,
  refresh,
  title
}) => {
  const [isLoading, setIsLoading] = useState(false)
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
  const [form] = useState(() => {
    return createForm({
      initialValues,
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  })

  const location = useLocation()
  const dispatch = useDispatch()
  const { handleCloseModal, resolveModal } = useModalBlockHistory(onResolve, form)
  const messagesByKind = useMemo(() => {
    return createArtifactMessages[artifactKind.toLowerCase()]
  }, [artifactKind])

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
          name: 'UI',
          uri: window.location.host
        },
        target_path: values.spec.target_path.path
      },
      status: {}
    }

    const handleRegisterArtifact = () => {
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

    return processActionAfterTagUniquesValidation({
      tag: values.metadata.tag ?? 'latest',
      artifact: data,
      projectName: params.projectName,
      dispatch,
      actionCallback: handleRegisterArtifact,
      getCustomErrorMsg: error => {
        return error?.response?.status === FORBIDDEN_ERROR_STATUS_CODE
          ? 'You do not have permission to create a new resource'
          : `${title} failed to initiate`
      },
      onErrorCallback: resolveModal,
      showLoader: () => setIsLoading(true),
      hideLoader: () => setIsLoading(false)
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
            disabled: isSubmitDisabled(formState),
            label: 'Register',
            onClick: formState.handleSubmit,
            variant: PRIMARY_BUTTON
          }
        ]
    return defaultActions.map((action, index) => <Button {...action} key={index} />)
  }

  return (
    <Form form={form} onSubmit={registerArtifact}>
      {formState => {
        return (
          <>
            {isLoading && <Loader />}
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
                messagesByKind={messagesByKind}
                params={params}
                setFieldState={formState.form.mutators.setFieldState}
                showType={artifactKind === ARTIFACT_TYPE}
              />
            </Modal>
          </>
        )
      }}
    </Form>
  )
}

RegisterArtifactModal.propTypes = {
  actions: PropTypes.func,
  artifactKind: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onResolve: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default RegisterArtifactModal
