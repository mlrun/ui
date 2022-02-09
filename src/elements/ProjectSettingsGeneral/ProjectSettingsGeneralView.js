import React from 'react'
import { useSelector } from 'react-redux'
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
  defaultArtifactPath,
  editProjectData,
  error,
  generalParams,
  handleAddProjectLabel,
  handleAddNewParameter,
  handleDeleteParameter,
  handleEditParameter,
  handleEditProject,
  handleOnBlur,
  handleOnChange,
  handleUpdateProjectLabels,
  loading,
  setValidation,
  validation
}) => {
  const projectData = useSelector(store => store.projectStore.project.data)

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
              settingsSource={projectData?.spec.source ?? ''}
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
                value={
                  editProjectData.artifact_path.value ||
                  projectData?.spec.artifact_path ||
                  ''
                }
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
              projectDescription={projectData?.spec.description ?? ''}
              // ref={ref}
            />
            <ProjectGoals
              editGoalsData={editProjectData.goals}
              handleEditProject={handleEditProject}
              handleOnChangeProject={handleOnChange}
              handleOnBlur={handleOnBlur}
              // handleOnKeyDown={handleOnKeyDown}
              projectGoals={projectData?.spec.goals ?? ''}
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
                labels={projectData?.metadata.labels ?? {}}
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
  defaultArtifactPath: PropTypes.string,
  editProjectData: PropTypes.object.isRequired,
  error: PropTypes.object,
  generalParams: PropTypes.array.isRequired,
  handleAddProjectLabel: PropTypes.func.isRequired,
  handleAddNewParameter: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  handleEditProject: PropTypes.func.isRequired,
  // handleOnKeyDown: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleUpdateProjectLabels: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default ProjectSettingsGeneralView
