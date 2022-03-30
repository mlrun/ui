import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import { messagesByKind } from './messagesByKind'

import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import RegisterArtifactForm from '../../elements/RegisterArtifactForm/RegisterArtifactForm'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import Button from '../../common/Button/Button'

import { PRIMARY_BUTTON, TERTIARY_BUTTON } from '../../constants'

import artifactApi from '../../api/artifacts-api'
import { useParams } from 'react-router-dom'

const RegisterArtifactPopup = ({
  artifactKind,
  filtersStore,
  refresh,
  setIsPopupOpen,
  title
}) => {
  const [registerArtifactData, setRegisterArtifactData] = useState({
    description: '',
    kind: 'general',
    key: '',
    target_path: '',
    error: ''
  })
  const [validation, setValidation] = useState({
    isNameValid: true,
    isTargetPathValid: true
  })
  const params = useParams()

  useEffect(() => {
    if (artifactKind !== 'artifact') {
      setRegisterArtifactData(state => ({
        ...state,
        kind: artifactKind.toLowerCase()
      }))
    }
  }, [artifactKind])

  const resetRegisterArtifactForm = useCallback(() => {
    setRegisterArtifactData({
      description: '',
      kind: 'general',
      key: '',
      target_path: '',
      error: ''
    })
  }, [])

  const registerArtifact = useCallback(() => {
    const name = registerArtifactData.key.trim()
    const path = registerArtifactData.target_path.trim()

    if (name.length === 0 || path.length === 0) {
      return setValidation(state => ({
        ...state,
        isNameValid: name.length !== 0,
        isTargetPathValid: path.length !== 0
      }))
    } else if (
      registerArtifactData.key.trim().length === 0 ||
      !validation.isNameValid
    ) {
      return setValidation(state => ({ ...state, isNameValid: false }))
    } else if (
      registerArtifactData.target_path.trim().length === 0 ||
      !validation.isTargetPathValid
    ) {
      return setValidation(state => ({ ...state, isTargetPathValid: false }))
    }

    if (registerArtifactData.error.length > 0) {
      setRegisterArtifactData(prevData => ({ ...prevData, error: '' }))
    }

    const uid = uuidv4()
    const data = {
      uid: uid,
      key: registerArtifactData.key,
      db_key: registerArtifactData.key,
      tree: uid,
      target_path: registerArtifactData.target_path,
      description: registerArtifactData.description,
      kind:
        registerArtifactData.kind === 'general'
          ? ''
          : registerArtifactData.kind,
      project: params.projectName,
      producer: {
        kind: 'api',
        uri: window.location.host
      }
    }

    if (registerArtifactData.kind === 'model') {
      const groups = registerArtifactData.target_path.match(
        /^(?:(?<target_path>.+\/))?(?<model_file>.+)$/
      )

      data.target_path = groups?.target_path
      data.model_file = groups?.model_file
    }

    artifactApi
      .registerArtifact(params.projectName, data)
      .then(() => {
        resetRegisterArtifactForm()
        setIsPopupOpen(false)
        refresh(filtersStore)
      })
      .catch(err => {
        setRegisterArtifactData(prevData => ({
          ...prevData,
          error: err.message
        }))
      })
  }, [
    filtersStore,
    params.projectName,
    refresh,
    registerArtifactData.description,
    registerArtifactData.error.length,
    registerArtifactData.key,
    registerArtifactData.kind,
    registerArtifactData.target_path,
    resetRegisterArtifactForm,
    setIsPopupOpen,
    validation.isNameValid,
    validation.isTargetPathValid
  ])

  const closePopupDialog = useCallback(() => {
    setIsPopupOpen(false)
    resetRegisterArtifactForm()
  }, [resetRegisterArtifactForm, setIsPopupOpen])

  const closeErrorMessage = useCallback(() => {
    setRegisterArtifactData(prevData => ({ ...prevData, error: '' }))
  }, [])

  return (
    <PopUpDialog
      data-testid="register-artifact"
      headerText={title}
      closePopUp={closePopupDialog}
    >
      <RegisterArtifactForm
        registerArtifactData={registerArtifactData}
        onChange={setRegisterArtifactData}
        setValidation={setValidation}
        showType={artifactKind === 'artifact'}
        validation={validation}
        messageByKind={messagesByKind[artifactKind.toLowerCase()]}
      />
      {registerArtifactData.error && (
        <ErrorMessage
          closeError={closeErrorMessage}
          message={registerArtifactData.error}
        />
      )}
      <div className="pop-up-dialog__footer-container">
        <Button
          variant={TERTIARY_BUTTON}
          label="Cancel"
          className="pop-up-dialog__btn_cancel"
          onClick={closePopupDialog}
        />
        <Button
          variant={PRIMARY_BUTTON}
          label="Register"
          onClick={registerArtifact}
          disabled={!validation.isNameValid || !validation.isTargetPathValid}
        />
      </div>
    </PopUpDialog>
  )
}

RegisterArtifactPopup.defaultProps = {
  title: ''
}

RegisterArtifactPopup.propTypes = {
  artifactKind: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
  setIsPopupOpen: PropTypes.func.isRequired,
  title: PropTypes.string
}

export default connect(
  ({ filtersStore }) => ({
    filtersStore
  }),
  null
)(RegisterArtifactPopup)
