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
  isUserAllowed,
  loading,
  secrets,
}) => {
  return (
    <>
      <div className="settings__card">
        {loading ? (
          <Loader />
        ) : !isUserAllowed ? (
          <div>
            <h1>You don't have access to this project's secrets</h1>
          </div>
        ) : (
          <div className="settings__card-content">
            <div className="settings__card-content-col">
              <p className="settings__card-subtitle">
                These secrets are automatically available to all jobs belonging
                to this project that are not executed locally. See{' '}
                <a
                  href="https://docs.mlrun.org/en/latest/secrets.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Secrets
                </a>
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
  isUserAllowed: true,
  loading: null,
}

ProjectSettingsSecretsView.propTypes = {
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  handleAddNewSecret: PropTypes.func.isRequired,
  handleSecretDelete: PropTypes.func.isRequired,
  handleSecretEdit: PropTypes.func.isRequired,
  isUserAllowed: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  secrets: PropTypes.array.isRequired,
}

export default ProjectSettingsSecretsView
