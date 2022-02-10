import React from 'react'
import PropTypes from 'prop-types'

import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import Loader from '../../common/Loader/Loader'
// import ProjectSecretRow from '../ProjectSecretRow/ProjectSecretRow'

import './ProjectSettingsSecrets.scss'

const ProjectSettingsSecretsView = ({
  error,
  handleAddNewSecret,
  handleSecretDelete,
  handleSecretEdit,
  loading,
  secrets
}) => {
  return (
    <>
      <div className="settings__card">
        {loading ? (
          <Loader />
        ) : error ? (
          <div>
            <h1>{error.message}</h1>
          </div>
        ) : (
          <div className="settings__card-content">
            <p className="settings__card-subtitle">
              These secrets will automatically be available to all jobs
              belonging to this project.
            </p>
            <KeyValueTable
              addNewItem={handleAddNewSecret}
              addNewItemLabel="Add secret"
              className="settings__secrets"
              content={secrets}
              deleteItem={handleSecretDelete}
              editItem={handleSecretEdit}
              isKeyRequired
              isValueRequired
              keyHeader="Key"
              keyLabel="Key"
              keyType="password"
              valueHeader="Value"
              valueLabel="Value"
              withEditMode
            />
          </div>
        )}
      </div>
    </>
  )
}

ProjectSettingsSecretsView.defaultProps = {
  error: null,
  loading: null
}

ProjectSettingsSecretsView.propTypes = {
  error: PropTypes.object,
  handleAddNewSecret: PropTypes.func.isRequired,
  handleSecretDelete: PropTypes.func.isRequired,
  handleSecretEdit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  secrets: PropTypes.array.isRequired
}

export default ProjectSettingsSecretsView
