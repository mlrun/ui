import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import Loader from '../../common/Loader/Loader'
import ProjectGoals from '../../components/Project/ProjectGoals/ProjectGoals'
import ProjectDescription from '../../components/Project/ProjectDescription/ProjectDescription'
import ProjectLabels from '../../components/Project/ProjectLabels/ProjectLabels'
import ProjectSettingsSource from '../ProjectSettingsSource/ProjectSettingsSource'

import { ARTIFACT_PATH } from '../../components/ProjectSettings/projectSettings.util'

const ProjectSettingsGeneralView = ({
  artifactPath,
  defaultArtifactPath,
  description,
  editProjectData,
  error,
  generalParams,
  goals,
  handleAddProjectLabel,
  handleAddNewParameter,
  handleDeleteParameter,
  handleEditParameter,
  handleEditProject,
  handleOnBlur,
  handleOnChange,
  handleUpdateProjectLabels,
  labels,
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
              handleSourceChange={handleOnChange}
              setValidation={setValidation}
              settingsSource={source}
              validation={validation}
            />
            <div
              className="settings__artifact-path"
              onClick={() => handleEditProject(ARTIFACT_PATH)}
            >
              <Input
                floatingLabel
                invalid={!validation.isPathValid}
                label="Artifact path"
                onBlur={() => handleOnBlur(ARTIFACT_PATH)}
                onChange={value => handleOnChange(ARTIFACT_PATH, value)}
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
            <ProjectDescription
              editDescriptionData={editProjectData.description}
              handleEditProject={handleEditProject}
              handleOnChangeProject={handleOnChange}
              handleOnBlur={handleOnBlur}
              projectDescription={
                editProjectData.description.value ?? description
              }
              // ref={ref}
            />
            <ProjectGoals
              editGoalsData={editProjectData.goals}
              handleEditProject={handleEditProject}
              handleOnChangeProject={handleOnChange}
              handleOnBlur={handleOnBlur}
              // handleOnKeyDown={handleOnKeyDown}
              projectGoals={editProjectData.goals.value ?? goals}
              // ref={ref}
            />
            <div className="settings__labels">
              <label
                data-testid="label"
                className="input__label input__label-floating active-label"
              >
                Labels
              </label>
              <ProjectLabels
                addProjectLabel={handleAddProjectLabel}
                isEditMode
                labels={labels}
                updateProjectLabel={handleUpdateProjectLabels}
                visibleChipsMaxLength="all"
              />
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
  description: PropTypes.string,
  editProjectData: PropTypes.object.isRequired,
  error: PropTypes.object,
  generalParams: PropTypes.array.isRequired,
  goals: PropTypes.string.isRequired,
  handleAddProjectLabel: PropTypes.func.isRequired,
  handleAddNewParameter: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleUpdateProjectLabels: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setValidation: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired
}

export default ProjectSettingsGeneralView
