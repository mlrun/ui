import React from 'react'
import PropTypes from 'prop-types'

import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import Loader from '../../common/Loader/Loader'

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
            <h1>{error.message || error}</h1>
          </div>
        ) : (
          <div className="settings__card-content">
            <div className="settings__card-content-col">
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
                isKeyEditable={false}
                isKeyRequired
                isValueRequired
                keyHeader="Key"
                keyLabel="Key"
                keyType="input"
                valueHeader="Value"
                valueLabel="Value"
                valueType="password"
                withEditMode
              />
            </div>
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
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  handleAddNewSecret: PropTypes.func.isRequired,
  handleSecretDelete: PropTypes.func.isRequired,
  handleSecretEdit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  secrets: PropTypes.array.isRequired
}

export default ProjectSettingsSecretsView
