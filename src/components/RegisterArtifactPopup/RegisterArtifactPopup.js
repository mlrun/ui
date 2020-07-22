import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import RegisterArtifactForm from '../../elements/RegisterArtifactForm/RegisterArtifactForm'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'

import { v4 as uuidv4 } from 'uuid'

import artifactApi from '../../api/artifacts-api'

import './registerArtifactPopup.scss'

const RegisterArtifactPopup = ({ match, refresh, setIsPopupDialogOpen }) => {
  const [registerArtifactData, setRegisterArtifactData] = useState({
    description: {
      value: '',
      required: false
    },
    kind: { value: 'general', required: false },
    key: {
      value: '',
      required: false
    },
    target_path: {
      value: '',
      required: false
    },
    error: {
      message: ''
    }
  })

  const resetRegisterArtifactForm = useCallback(() => {
    setRegisterArtifactData({
      description: {
        value: '',
        required: false
      },
      kind: { value: 'general', required: false },
      key: {
        value: '',
        required: false
      },
      target_path: {
        value: '',
        required: false
      },
      error: {
        message: ''
      }
    })
  }, [])

  const registerArtifact = useCallback(() => {
    if (
      !registerArtifactData.key.value ||
      !registerArtifactData.target_path.value
    ) {
      return setRegisterArtifactData(prevData => ({
        ...prevData,
        key: {
          ...prevData.key,
          required: !registerArtifactData.key.value
        },
        target_path: {
          ...prevData.target_path,
          required: !registerArtifactData.target_path.value
        }
      }))
    }

    if (registerArtifactData.error.message) {
      setRegisterArtifactData(prevData => ({
        ...prevData,
        error: { ...prevData.error, message: '' }
      }))
    }

    const uid = uuidv4()
    const data = {
      uid: uid,
      key: registerArtifactData.key.value,
      db_key: registerArtifactData.key.value,
      tree: uid,
      target_path: registerArtifactData.target_path.value,
      description: registerArtifactData.description.value,
      kind:
        registerArtifactData.kind.value === 'general'
          ? ''
          : registerArtifactData.kind.value,
      project: match.params.projectName,
      producer: {
        kind: 'api',
        uri: window.location.host
      }
    }

    if (registerArtifactData.kind.value === 'model') {
      const {
        target_path,
        model_file
      } = registerArtifactData.target_path.value.match(
        /^(?:(?<target_path>.+\/))?(?<model_file>.+)$/
      )?.groups

      data.target_path = target_path
      data.model_file = model_file
    }

    artifactApi
      .registerArtifact(match.params.projectName, data)
      .then(() => {
        setIsPopupDialogOpen(false)
        resetRegisterArtifactForm()
        refresh({ tag: 'latest', project: match.params.projectName })
      })
      .catch(err => {
        setRegisterArtifactData(prevData => ({
          ...prevData,
          error: {
            ...prevData.error,
            message: err.message
          }
        }))
      })
  }, [
    match.params.projectName,
    refresh,
    registerArtifactData,
    resetRegisterArtifactForm,
    setIsPopupDialogOpen
  ])

  const closePopupDialog = useCallback(() => {
    setIsPopupDialogOpen(false)
    resetRegisterArtifactForm()
  }, [resetRegisterArtifactForm, setIsPopupDialogOpen])

  const closeErrorMessage = useCallback(() => {
    setRegisterArtifactData(prevData => ({
      ...prevData,
      error: {
        ...prevData.error,
        message: ''
      }
    }))
  }, [])

  return (
    <PopUpDialog headerText="Register artifact" closePopUp={closePopupDialog}>
      <RegisterArtifactForm
        match={match}
        registerArtifactData={registerArtifactData}
        onChange={setRegisterArtifactData}
      />
      <div className="pop-up-dialog__footer-container">
        {registerArtifactData.error.message && (
          <ErrorMessage
            closeError={closeErrorMessage}
            message={registerArtifactData.error.message}
          />
        )}
        <button
          className="btn_default pop-up-dialog__btn_cancel"
          onClick={closePopupDialog}
        >
          Cancel
        </button>
        <button className="btn_primary btn_success" onClick={registerArtifact}>
          Register
        </button>
      </div>
    </PopUpDialog>
  )
}

RegisterArtifactPopup.propTypes = {
  match: PropTypes.shape({}).isRequired,
  refresh: PropTypes.func.isRequired,
  setIsPopupDialogOpen: PropTypes.func.isRequired
}

export default RegisterArtifactPopup
