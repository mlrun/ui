import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'

import projectApi from '../../api/projects-api'
import { LABEL_BUTTON, PRIMARY_BUTTON } from '../../constants'

import './createNewSecretPopUp.scss'

const CreateNewSecretPopUp = ({
  editableSecret,
  match,
  popUpTitle,
  secretKeys,
  setCreateNewSecretDialogOpen,
  setEditableSecret,
  setNotification,
  setProjectSecrets
}) => {
  const [createSecretData, setCreateSecretData] = useState({
    key: '',
    value: ''
  })
  const [validation, setValidation] = useState({
    isKeyValid: true,
    isValueValid: true
  })

  const resetCreateSecretForm = useCallback(() => {
    setCreateSecretData({
      key: '',
      value: ''
    })
  }, [])

  const closePopupDialog = useCallback(() => {
    setCreateNewSecretDialogOpen(false)
    resetCreateSecretForm()
    setEditableSecret('')
  }, [setEditableSecret, setCreateNewSecretDialogOpen, resetCreateSecretForm])

  const isKeyNotUnique = (newKey, keys) => {
    return keys.some(key => newKey === key)
  }

  const createSecrets = useCallback(() => {
    if (
      (editableSecret.length === 0 &&
        (createSecretData.key.trim().length === 0 ||
          createSecretData.value.trim().length === 0)) ||
      (editableSecret.length > 0 && createSecretData.value.trim().length === 0)
    ) {
      return setValidation({
        isKeyValid:
          editableSecret.length > 0 ||
          (createSecretData.key.trim().length > 0 && validation.isKeyValid),
        isValueValid:
          createSecretData.value.trim().length > 0 && validation.isValueValid
      })
    }

    const data =
      editableSecret.length === 0
        ? {
            provider: 'kubernetes',
            secrets: {
              [createSecretData.key]: createSecretData.value
            }
          }
        : {
            provider: 'kubernetes',
            secrets: {
              [editableSecret]: createSecretData.value
            }
          }

    if (editableSecret.length === 0) {
      secretKeys.push(createSecretData.key)
      setProjectSecrets(secretKeys)
    }

    closePopupDialog()

    projectApi
      .setProjectSecret(match.params.projectName, data)
      .then(() => {
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Secret created successfully'
        })
      })
      .catch(err => {
        setNotification({
          status: 400,
          id: Math.random(),
          message: err.message
        })
      })
  }, [
    closePopupDialog,
    createSecretData.key,
    createSecretData.value,
    editableSecret,
    match.params.projectName,
    secretKeys,
    setNotification,
    setProjectSecrets,
    validation.isKeyValid,
    validation.isValueValid
  ])

  return (
    <PopUpDialog headerText={popUpTitle} closePopUp={closePopupDialog}>
      {editableSecret.length === 0 && (
        <div className="secrets__form-input">
          <Input
            density="chunky"
            floatingLabel
            invalid={
              !validation.isKeyValid ||
              isKeyNotUnique(createSecretData.key, secretKeys)
            }
            invalidText={
              isKeyNotUnique(createSecretData.key, secretKeys)
                ? 'Name already exists'
                : 'This field is invalid'
            }
            label="Key"
            onChange={value =>
              setCreateSecretData(prevData => ({ ...prevData, key: value }))
            }
            required
            requiredText="This field is required"
            setInvalid={value =>
              setValidation(state => ({ ...state, isKeyValid: value }))
            }
            type="text"
            value={createSecretData.key}
          />
        </div>
      )}
      <div className="secrets__form-input">
        <Input
          density="chunky"
          floatingLabel
          invalid={!validation.isValueValid}
          invalidText="This field is invalid"
          label="Value"
          onChange={value =>
            setCreateSecretData(prevData => ({ ...prevData, value: value }))
          }
          required
          requiredText="This field is required"
          setInvalid={value =>
            setValidation(state => ({ ...state, isValueValid: value }))
          }
          type="password"
          value={createSecretData.value}
        />
      </div>
      <div className="secrets__footer-container">
        <Button
          label="Cancel"
          onClick={closePopupDialog}
          variant={LABEL_BUTTON}
        />
        <Button label="Save" onClick={createSecrets} variant={PRIMARY_BUTTON} />
      </div>
    </PopUpDialog>
  )
}

CreateNewSecretPopUp.propTypes = {
  editableSecret: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  popUpTitle: PropTypes.string.isRequired,
  secretKeys: PropTypes.array.isRequired,
  setCreateNewSecretDialogOpen: PropTypes.func.isRequired,
  setEditableSecret: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  setProjectSecrets: PropTypes.func.isRequired
}

export default CreateNewSecretPopUp
