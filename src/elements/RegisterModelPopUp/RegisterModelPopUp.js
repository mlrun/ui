import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { v4 as uuidv4 } from 'uuid'

import { Button, ConfirmDialog, Modal, FormInput, FormTextarea } from 'igz-controls/components'

import { getChipOptions } from '../../utils/getChipOptions'
import FormChipCell from '../../common/FormChipCell/FormChipCell'
import { openPopUp } from 'igz-controls/utils/common.util'
import { setFieldState } from 'igz-controls/utils/form.util'
import artifactApi from '../../api/artifacts-api'

import { MODAL_SM, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'

import './registerModelPopUp.scss'

function RegisterModelPopUp({ filtersStore, isOpen, onResolve, params, refresh }) {
  const initialValues = {
    labels: [],
    modelName: '',
    description: '',
    targetPath: ''
  }

  const location = useLocation()

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
      project: params.projectName,
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
      .registerArtifact(params.projectName, data)
      .then(() => {
        refresh(filtersStore)
        onResolve()
      })
  }

  const getModalActions = formState => {
    const actions = [
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
    return actions.map(action => <Button {...action} />)
  }

  const handleCloseModal = formState => {
    if (formState && formState.dirty) {
      openPopUp(ConfirmDialog, {
        cancelButton: {
          label: 'Cancel',
          variant: TERTIARY_BUTTON
        },
        confirmButton: {
          handler: onResolve,
          label: 'OK',
          variant: SECONDARY_BUTTON
        },
        header: 'Are you sure?',
        message: 'All changes will be lost'
      })
    } else {
      onResolve()
    }
  }

  return (
    <Form
      initialValues={initialValues}
      mutators={{ ...arrayMutators, setFieldState }}
      onSubmit={registerModel}
    >
      {formState => {
        return (
          <Modal
            actions={getModalActions(formState)}
            className="register-model"
            location={location.pathname}
            onClose={() => handleCloseModal(formState)}
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
              <FormChipCell
                chipOptions={getChipOptions('metrics')}
                formState={formState}
                isEditMode
                name="labels"
                shortChips
                visibleChipsMaxLength="all"
              />
            </div>
            <div className="register-model__row">
              <FormTextarea name="description" label="Description" />
            </div>
            <div className="register-model__row">
              <FormInput name="targetPath" label="Target path" required />
            </div>
          </Modal>
        )
      }}
    </Form>
  )
}

RegisterModelPopUp.defaultProps = {
  onResolve: () => {}
}

RegisterModelPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  model: PropTypes.shape({}).isRequired,
  onResolve: PropTypes.func,
  refresh: PropTypes.func.isRequired
}

export default connect(
  ({ filtersStore }) => ({
    filtersStore
  }),
  null
)(RegisterModelPopUp)
