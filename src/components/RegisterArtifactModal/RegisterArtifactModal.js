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
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'

import RegisterArtifactModalForm from '../../elements/RegisterArtifactModalForm/RegisterArtifactModalForm'
import { Button, Modal } from 'igz-controls/components'

import { messagesByKind } from './messagesByKind'
import notificationActions from '../../actions/notification'
import { MODAL_SM, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { setFieldState } from 'igz-controls/utils/form.util'
import { convertChipsData } from '../../utils/convertChipsData'

import artifactApi from '../../api/artifacts-api'

const RegisterArtifactModal = ({
  actions,
  artifactKind,
  filtersStore,
  isOpen,
  onResolve,
  projectName,
  refresh,
  setNotification,
  title
}) => {
  const initialValues = {
    description: '',
    kind: artifactKind !== 'artifact' ? artifactKind.toLowerCase() : 'general',
    key: '',
    labels: [],
    target_path: ''
  }

  const formRef = React.useRef(
    createForm({
      initialValues,
      onSubmit: () => {},
      mutators: { ...arrayMutators, setFieldState }
    })
  )
  const location = useLocation()
  const { handleCloseModal, resolveModal } = useModalBlockHistory(onResolve, formRef.current)

  const registerArtifact = values => {
    const uid = uuidv4()
    const data = {
      uid,
      key: values.key,
      db_key: values.key,
      tree: uid,
      target_path: values.target_path,
      description: values.description,
      kind: values.kind === 'general' ? '' : values.kind,
      labels: convertChipsData(values.labels),
      project: projectName,
      producer: {
        kind: 'api',
        uri: window.location.host
      }
    }

    return artifactApi
      .registerArtifact(projectName, data)
      .then(response => {
        resolveModal()
        refresh(filtersStore)
        setNotification({
          status: response.status,
          id: Math.random(),
          message: `${title} initiated successfully`
        })
      })
      .catch(() => {
        resolveModal()
        setNotification({
          status: 400,
          id: Math.random(),
          message: `${title} failed to initiate`,
          retry: registerArtifact
        })
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
              showType={artifactKind === 'artifact'}
              initialValues={initialValues}
              messageByKind={messagesByKind[artifactKind.toLowerCase()]}
            />
          </Modal>
        )
      }}
    </Form>
  )
}

RegisterArtifactModal.propTypes = {
  artifactKind: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default connect(
  ({ filtersStore }) => ({
    filtersStore
  }),
  { setNotification: notificationActions.setNotification }
)(RegisterArtifactModal)
