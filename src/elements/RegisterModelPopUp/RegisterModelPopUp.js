import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { createForm } from 'final-form'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { v4 as uuidv4 } from 'uuid'

import { Button, Modal, FormInput, FormTextarea } from 'igz-controls/components'
import FormChipCell from '../../common/FormChipCell/FormChipCell'

import { getChipOptions } from '../../utils/getChipOptions'
import { setFieldState } from 'igz-controls/utils/form.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { MODAL_SM, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import notificationActions from '../../actions/notification'

import artifactApi from '../../api/artifacts-api'

import './registerModelPopUp.scss'

function RegisterModelPopUp({ filtersStore, isOpen, onResolve, projectName, refresh, setNotification }) {
  const initialValues = {
    description: '',
    labels: [],
    modelName: '',
    targetPath: ''
  }
  const formRef = React.useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators, setFieldState },
      initialValues: initialValues
    })
  )
  const location = useLocation()
  const { handleCloseModal } = useModalBlockHistory(onResolve, formRef.current)

  const registerModel = value => {
    const labelsList = value.labels.reduce((list, label) => {
      list[label.key] = label.value
      return list
    }, {})

    const uid = uuidv4()
    const data = {
      uid: uid,
      key: value.modelName,
      db_key: value.modelName,
      labels: labelsList,
      tree: uid,
      target_path: value.targetPath,
      description: value.description,
      kind: 'model',
      project: projectName,
      producer: {
        kind: 'api',
        uri: window.location.host
      }
    }

    if (value.targetPath.includes('/')) {
      const path = value.targetPath.split(/([^/]*)$/)

      data.target_path = path[0]
      data.model_file = path[1]
    }

    artifactApi
      .registerArtifact(projectName, data)
      .then(response => {
        formRef.current = null
        refresh(filtersStore)
        return setNotification({
          status: response.status,
          id: Math.random(),
          message: 'Model initiated successfully'
        })
      })
      .catch(() => {
        return setNotification({
          status: 400,
          id: Math.random(),
          message: 'Model failed to initiate',
          retry: registerModel
        })
      })
      .finally(() => {
        onResolve()
      })
  }

  const getModalActions = formState => {
    const actions = [
      {
        label: 'Cancel',
        onClick: handleCloseModal,
        variant: TERTIARY_BUTTON
      },
      {
        disabled: formState.submitting || (formState.invalid && formState.submitFailed),
        label: 'Register',
        onClick: formState.handleSubmit,
        variant: SECONDARY_BUTTON
      }
    ]
    return actions.map(action => <Button {...action} />)
  }

  return (
    <Form
      form={formRef.current}
      onSubmit={registerModel}
    >
      {formState => {
        return (
          <Modal
            actions={getModalActions(formState)}
            className="register-model"
            location={location.pathname}
            onClose={handleCloseModal}
            show={isOpen}
            size={MODAL_SM}
            title="Register model"
          >
            <div className="register-model__row">
              <FormInput
                label="Name"
                name="modelName"
                required
                tip="Artifacts names in the same project must be unique."
              />
            </div>
            <div className="register-model__row">
              <FormInput name="targetPath" label="Target path" required />
            </div>
            <div className="register-model__row">
              <FormTextarea name="description" label="Description" />
            </div>
            <div className="register-model__row">
              <FormChipCell
                chipOptions={getChipOptions('metrics')}
                formState={formState}
                isEditMode
                name="labels"
                shortChips
                visibleChipsMaxLength="all"
              />
            </div>
          </Modal>
        )
      }}
    </Form>
  )
}

RegisterModelPopUp.defaultProps = {}

RegisterModelPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.shape({}).isRequired,
  projectName: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired
}

export default connect(
  ({ filtersStore }) => ({
    filtersStore
  }),
  { setNotification: notificationActions.setNotification }
)(RegisterModelPopUp)
