import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import ProjectSettingsSource from '../ProjectSettingsSource/ProjectSettingsSource'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import Loader from '../../common/Loader/Loader'

import { ARTIFACT_PATH } from '../../components/ProjectSettings/projectSettings.util'

const ProjectSettingsGeneralView = ({
  artifactPath,
  defaultArtifactPath,
  editProjectData,
  error,
  generalParams,
  handleAddNewParameter,
  handleArtifactPathChange,
  handleDeleteParameter,
  handleEditParameter,
  handleEditProject,
  handleOnBlur,
  handleSourceChange,
  loading,
  setValidation,
  source,
  validation
}) => {
  return (
    <div className="settings__card">
      {loading ? (
        <Loader />
      ) : error ? (
        <div>
          <h1>{error.message}</h1>
        </div>
      ) : (
        <>
          <div className="settings__card-header">General</div>
          <div className="settings__card-content">
            <ProjectSettingsSource
              editSourceData={editProjectData.source}
              handleEditProject={handleEditProject}
              handleOnBlur={handleOnBlur}
              handleSourceChange={handleSourceChange}
              setValidation={setValidation}
              settingsSource={source}
              validation={validation}
            />
            <div className="settings__card-divider" />
            <div
              className="settings__artifact-path"
              onClick={() => handleEditProject(ARTIFACT_PATH)}
            >
              <Input
                floatingLabel
                invalid={!validation.isPathValid}
                label="Artifact path"
                onBlur={() => handleOnBlur(ARTIFACT_PATH)}
                onChange={value =>
                  handleArtifactPathChange(value, validation.isPathValid)
                }
                placeholder={defaultArtifactPath ?? ''}
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isPathValid: value
                  }))
                }
                value={editProjectData.artifact_path.value ?? artifactPath}
              />
              <span className="settings__artifact-path-link">
                Enter the default path for saving the artifacts within your
                project.
                <a
                  className="link"
                  href="https://docs.mlrun.org/en/latest/store/artifacts.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read more
                </a>
              </span>
            </div>
            <p className="settings__card-subtitle">Parameters</p>
            <p>
              The parameters enable users to pass key/value to the project
              context that can later be used for running jobs & pipelines
            </p>
            <KeyValueTable
              addNewItem={handleAddNewParameter}
              addNewItemLabel="Add parameter"
              className="settings__params"
              content={generalParams}
              deleteItem={handleDeleteParameter}
              editItem={handleEditParameter}
              isKeyRequired={true}
              isValueRequired={true}
              keyHeader="Key"
              keyLabel="Key"
              valueHeader="Value"
              valueLabel="Value"
              withEditMode
            />
          </div>
        </>
      )}
    </div>
  )
}

ProjectSettingsGeneralView.defaultProps = {
  error: null,
  loading: null
}

ProjectSettingsGeneralView.propTypes = {
  artifactPath: PropTypes.string.isRequired,
  defaultArtifactPath: PropTypes.string,
  editProjectData: PropTypes.object.isRequired,
  error: PropTypes.object,
  generalParams: PropTypes.array.isRequired,
  handleAddNewParameter: PropTypes.func.isRequired,
  handleArtifactPathChange: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  handleSourceChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setValidation: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired
}

export default ProjectSettingsGeneralView
