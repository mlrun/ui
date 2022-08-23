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

import ChangeOwnerPopUp from '../../elements/ChangeOwnerPopUp/ChangeOwnerPopUp'
import Input from '../../common/Input/Input'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import Loader from '../../common/Loader/Loader'
import ProjectGoals from '../../components/Project/ProjectGoals/ProjectGoals'
import ProjectDescription from '../../components/Project/ProjectDescription/ProjectDescription'
import ProjectLabels from '../../components/Project/ProjectLabels/ProjectLabels'
import ProjectSettingsSource from '../ProjectSettingsSource/ProjectSettingsSource'

import { ARTIFACT_PATH } from '../../constants'

const ProjectSettingsGeneralView = ({
  changeOwnerCallback,
  defaultArtifactPath,
  editProjectData,
  generalParams,
  handleAddProjectLabel,
  handleAddNewParameter,
  handleDeleteParameter,
  handleEditParameter,
  handleEditProject,
  handleOnBlur,
  handleOnChange,
  handleOnKeyDown,
  handleUpdateProjectLabels,
  membersState,
  project,
  projectMembershipIsEnabled,
  projectOwnerIsShown,
  setNotification,
  setValidation,
  validation
}) => {
  return (
    <div className="settings__card">
      {project.loading ? (
        <Loader />
      ) : project.error ? (
        <div>
          <h1>{project.error.message}</h1>
        </div>
      ) : (
        <div className="settings__card-content">
          <div className="settings__card-content-col">
            <ProjectSettingsSource
              editSourceData={editProjectData.source}
              handleEditProject={handleEditProject}
              handleOnBlur={handleOnBlur}
              handleOnKeyDown={handleOnKeyDown}
              handleSourceChange={handleOnChange}
              setValidation={setValidation}
              settingsSource={project.data?.spec.source ?? ''}
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
                onKeyDown={handleOnKeyDown}
                placeholder={defaultArtifactPath ?? ''}
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isPathValid: value
                  }))
                }
                value={
                  editProjectData.artifact_path.value ??
                  project.data?.spec.artifact_path ??
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
              projectDescription={project.data?.spec.description ?? ''}
            />
            <ProjectGoals
              editGoalsData={editProjectData.goals}
              handleEditProject={handleEditProject}
              handleOnChangeProject={handleOnChange}
              handleOnBlur={handleOnBlur}
              projectGoals={project.data?.spec.goals ?? ''}
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
                labels={project.data?.metadata.labels ?? {}}
                updateProjectLabel={handleUpdateProjectLabels}
                visibleChipsMaxLength="all"
              />
            </div>
          </div>
          <div className="settings__card-content-col">
            <div className="settings__owner">
              <div className="settings__owner-row">
                <div className="row-value">
                  <span className="row-label">Owner:</span>
                  <span className="row-name">
                    {membersState.projectInfo?.owner?.username ||
                      project.data?.spec?.owner}
                  </span>
                </div>
              </div>
              {projectMembershipIsEnabled && projectOwnerIsShown && (
                <ChangeOwnerPopUp
                  changeOwnerCallback={changeOwnerCallback}
                  projectId={membersState.projectInfo.id}
                  setNotification={setNotification}
                />
              )}
            </div>
            <div>
              <p className="settings__card-title">Parameters</p>
              <p className="settings__card-subtitle">
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
                isKeyRequired
                isValueRequired
                keyHeader="Key"
                keyLabel="Key"
                valueHeader="Value"
                valueLabel="Value"
                withEditMode
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

ProjectSettingsGeneralView.defaultProps = {
  error: null,
  loading: null
}

ProjectSettingsGeneralView.propTypes = {
  changeOwnerCallback: PropTypes.func.isRequired,
  defaultArtifactPath: PropTypes.string,
  editProjectData: PropTypes.object.isRequired,
  generalParams: PropTypes.array.isRequired,
  handleAddProjectLabel: PropTypes.func.isRequired,
  handleAddNewParameter: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleUpdateProjectLabels: PropTypes.func.isRequired,
  membersState: PropTypes.shape({}).isRequired,
  project: PropTypes.object.isRequired,
  projectMembershipIsEnabled: PropTypes.bool.isRequired,
  projectOwnerIsShown: PropTypes.bool.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default ProjectSettingsGeneralView
