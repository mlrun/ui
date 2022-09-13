/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
  secrets
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
                These secrets are automatically available to all jobs belonging to this project that
                are not executed locally. See{' '}
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
  loading: null
}

ProjectSettingsSecretsView.propTypes = {
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  handleAddNewSecret: PropTypes.func.isRequired,
  handleSecretDelete: PropTypes.func.isRequired,
  handleSecretEdit: PropTypes.func.isRequired,
  isUserAllowed: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  secrets: PropTypes.array.isRequired
}

export default ProjectSettingsSecretsView
