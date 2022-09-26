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
import React, { useState, useEffect } from 'react'
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
  const [initialValues, setInitialValues] = useState({
    description: '',
    kind: '',
    key: '',
    target_path: {
      fieldInfo: {
        pathType: ''
      },
      path: ''
    }
  })
  const formRef = React.useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators, setFieldState }
    })
  )
  const location = useLocation()
  const { handleCloseModal } = useModalBlockHistory(onResolve, formRef.current)

  useEffect(() => {
    setInitialValues(state => ({
      ...state,
      kind: artifactKind !== 'artifact' ? artifactKind.toLowerCase() : 'general'
    }))
  }, [artifactKind])

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
      project: projectName,
      producer: {
        kind: 'api',
        uri: window.location.host
      }
    }

    return artifactApi
      .registerArtifact(projectName, data)
      .then(response => {
        formRef.current = null

        refresh(filtersStore)
        setNotification({
          status: response.status,
          id: Math.random(),
          message: `${title} initiated successfully`
        })
      })
      .catch(err => {
        setNotification({
          status: 400,
          id: Math.random(),
          message: `${title} failed to initiate`,
          retry: registerArtifact
        })
      })
      .finally(() => {
        onResolve()
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
    <Form form={formRef.current} initialValues={initialValues} onSubmit={registerArtifact}>
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
              messageByKind={messagesByKind[artifactKind.toLowerCase()]}
              setFieldState={formState.form.mutators.setFieldState}
              showType={artifactKind === 'artifact'}
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
