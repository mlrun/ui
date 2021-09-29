import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import Button from '../../common/Button/Button'
import SecretRow from '../../components/ProjectSettings/SecretRow/SecretRow'
import CreateNewSecretPopUp from '../../components/ProjectSettings/CreateNewSecretPopUp/CreateNewSecretPopUp'
import notificationAction from '../../actions/notification'
import projectApi from '../../api/projects-api'
import { PRIMARY_BUTTON } from '../../constants'
import projectsAction from '../../actions/projects'

const SettingsSecrets = ({
  match,
  projectStore,
  setNotification,
  setProjectSecrets
}) => {
  const [isCreateNewSecretDialogOpen, setCreateNewSecretDialogOpen] = useState(
    false
  )
  const [editableSecret, setEditableSecret] = useState('')

  const handleEditClick = secret => {
    setEditableSecret(secret)
    setCreateNewSecretDialogOpen(true)
  }

  const handleSecretDelete = (secret, index) => {
    const filteredArray = projectStore.project.secrets?.data[
      'secret_keys'
    ].filter((element, elementIndex) => elementIndex !== index)

    setProjectSecrets(filteredArray)

    projectApi
      .deleteSecret(match.params.projectName, secret)
      .then(() => {
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Secret deleted successfully'
        })
      })
      .catch(err => {
        setNotification({
          status: 400,
          id: Math.random(),
          message: err.message
        })
      })
  }

  return (
    <>
      <div className="settings__card">
        <div className="card__header">Secrets</div>
        <div className="card__description">
          These secrets will automatically be available to all jobs belonging to
          this project.
        </div>
        {projectStore.project.secrets?.loading ? (
          <Loader />
        ) : projectStore.project.secrets?.error ? (
          <div>
            <h1>{projectStore.project.secrets?.error}</h1>
          </div>
        ) : (
          <div className="card__content">
            {projectStore.project.secrets?.data['secret_keys'] &&
              projectStore.project.secrets?.data[
                'secret_keys'
              ].map((secret, index) => (
                <SecretRow
                  handleEditClick={handleEditClick}
                  handleSecretDelete={secret =>
                    handleSecretDelete(secret, index)
                  }
                  key={index}
                  secret={secret}
                />
              ))}
            <div className="new-secret__button">
              <Button
                label="New"
                onClick={() => setCreateNewSecretDialogOpen(true)}
                variant={PRIMARY_BUTTON}
              />
            </div>
          </div>
        )}
      </div>
      {isCreateNewSecretDialogOpen && (
        <CreateNewSecretPopUp
          editableSecret={editableSecret}
          match={match}
          popUpTitle={
            editableSecret.length === 0
              ? 'Create new secret'
              : `Edit secret ${editableSecret}`
          }
          secretKeys={projectStore.project.secrets?.data['secret_keys']}
          setCreateNewSecretDialogOpen={() =>
            setCreateNewSecretDialogOpen(false)
          }
          setEditableSecret={setEditableSecret}
          setNotification={setNotification}
          setProjectSecrets={setProjectSecrets}
        />
      )}
    </>
  )
}

SettingsSecrets.propTypes = {
  match: PropTypes.object.isRequired
}

export default connect(
  ({ projectStore }) => ({
    projectStore
  }),
  { ...notificationAction, ...projectsAction }
)(SettingsSecrets)
