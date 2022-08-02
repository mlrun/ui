import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { createForm } from 'final-form'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { v4 as uuidv4 } from 'uuid'

import { Button, Modal, FormChipCell, FormInput, FormTextarea } from 'igz-controls/components'

import { getChipOptions } from '../../utils/getChipOptions'
import { convertChipsData } from '../../utils/convertChipsData'
import { setFieldState } from 'igz-controls/utils/form.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { MODAL_SM, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import notificationActions from '../../actions/notification'

import artifactApi from '../../api/artifacts-api'

import './registerModelPopUp.scss'

function RegisterModelPopUp({ isOpen, onResolve, projectName, refresh }) {
  const initialValues = {
    description: undefined,
    labels: [],
    modelName: undefined,
    targetPath: undefined
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
  const filtersStore = useSelector(store => store.filtersStore)
  const dispatch = useDispatch()

  const registerModel = value => {
    const uid = uuidv4()
    const data = {
      uid: uid,
      key: value.modelName,
      db_key: value.modelName,
      labels: convertChipsData(value.labels),
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

        return dispatch(notificationActions.setNotification({
          status: response.status,
          id: Math.random(),
          message: 'Model initiated successfully'
        }))
      })
      .catch(() => {
        return dispatch(notificationActions.setNotification({
          status: 400,
          id: Math.random(),
          message: 'Model failed to initiate',
          retry: registerModel
        }))
      })
      .finally(() => {
        onResolve()
      })
  }

  const getModalActions = formState => {
    const actions = [
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
    return actions.map(action => <Button {...action} />)
  }

  return (
    <Form form={formRef.current} onSubmit={registerModel}>
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
                initialValues={initialValues}
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

RegisterModelPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  projectName: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired
}

export default RegisterModelPopUp
