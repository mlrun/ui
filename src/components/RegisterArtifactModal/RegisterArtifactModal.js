import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'

import RegisterArtifactModalForm from '../../elements/RegisterArtifactModalForm/RegisterArtifactModalForm'
import { Button, Modal } from 'igz-controls/components'

import { messagesByKind } from './messagesByKind'
import notificationActions from '../../actions/notification'
import { MODAL_SM, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'

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
    kind: 'general',
    key: '',
    target_path: ''
  })
  const formRef = React.useRef(
    createForm({
      onSubmit: () => {}
    })
  )
  const location = useLocation()
  const { handleCloseModal } = useModalBlockHistory(onResolve, formRef.current)

  useEffect(() => {
    if (artifactKind !== 'artifact') {
      setInitialValues(state => ({
        ...state,
        kind: artifactKind.toLowerCase()
      }))
    }
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

    if (values.kind === 'model' && values.target_path.includes('/')) {
      const path = values.target_path.split(/([^/]*)$/)

      data.target_path = path[0]
      data.model_file = path[1]
    }

    artifactApi
      .registerArtifact(projectName, data)
      .then(response => {
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
      .finally(() => onResolve())
  }

  const getModalActions = formState => {
    const defaultActions = actions
      ? actions(formState)
      : [
          {
            label: 'Cancel',
            onClick: () => handleCloseModal(formState),
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
            location={location.pathname}
            onClose={handleCloseModal}
            show={isOpen}
            size={MODAL_SM}
            title={title}
          >
            <RegisterArtifactModalForm
              showType={artifactKind === 'artifact'}
              messageByKind={messagesByKind[artifactKind.toLowerCase()]}
            />
          </Modal>
        )
      }}
    </Form>
  )
}

RegisterArtifactModal.defaultProps = {
  title: ''
}

RegisterArtifactModal.propTypes = {
  artifactKind: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
  title: PropTypes.string
}

export default connect(
  ({ filtersStore }) => ({
    filtersStore
  }),
  { setNotification: notificationActions.setNotification }
)(RegisterArtifactModal)
