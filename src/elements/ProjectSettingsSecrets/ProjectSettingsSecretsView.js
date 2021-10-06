import React from 'react'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import ProjectSecretRow from '../ProjectSecretRow/ProjectSecretRow'
import CreateNewSecretPopUp from '../CreateNewSecretPopUp/CreateNewSecretPopUp'

import { ReactComponent as Plus } from '../../images/plus.svg'

const ProjectSettingsSecretsView = ({
  editableSecret,
  error,
  handleEditClick,
  handleSecretDelete,
  isCreateNewSecretDialogOpen,
  loading,
  match,
  secrets,
  setCreateNewSecretDialogOpen,
  setEditableSecret,
  setNotification,
  setProjectSecrets
}) => {
  return (
    <>
      <div className="settings__card">
        {loading ? (
          <Loader />
        ) : error ? (
          <div>
            <h1>{error}</h1>
          </div>
        ) : (
          <>
            <div className="settings__card-header">Secrets</div>
            <div className="settings__card-subtitle">
              These secrets will automatically be available to all jobs
              belonging to this project.
            </div>
            <div className="settings__card-content">
              {secrets?.['secret_keys'] &&
                secrets['secret_keys'].map((secret, index) => (
                  <ProjectSecretRow
                    handleEditClick={handleEditClick}
                    handleSecretDelete={secret =>
                      handleSecretDelete(secret, index)
                    }
                    key={index}
                    secret={secret}
                  />
                ))}
              <div className="secret__row">
                <button
                  className="new-secret__button"
                  onClick={() => {
                    setCreateNewSecretDialogOpen(true)
                  }}
                >
                  <Plus />
                  Add secret
                </button>
              </div>
            </div>
          </>
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
          secretKeys={secrets['secret_keys']}
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

ProjectSettingsSecretsView.defaultProps = {
  error: null,
  loading: null
}

ProjectSettingsSecretsView.propTypes = {
  editableSecret: PropTypes.string.isRequired,
  error: PropTypes.string,
  handleEditClick: PropTypes.func.isRequired,
  handleSecretDelete: PropTypes.func.isRequired,
  isCreateNewSecretDialogOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  match: PropTypes.object.isRequired,
  secrets: PropTypes.object.isRequired,
  setCreateNewSecretDialogOpen: PropTypes.func.isRequired,
  setEditableSecret: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  setProjectSecrets: PropTypes.func.isRequired
}

export default ProjectSettingsSecretsView
