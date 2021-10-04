import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import ProjectSettingsSource from '../ProjectSettingsSource/ProjectSettingsSource'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'

import { ARTIFACT_PATH } from '../../components/ProjectSettings/projectSettings.util'

const ProjectSettingsGeneralView = React.forwardRef(
  (
    {
      artifactPath,
      editProject,
      generalParams,
      handleAddNewParameter,
      handleDeleteParameter,
      handleEditParameter,
      handleEditProject,
      handleOnChangeSettings,
      handleOnKeyDown,
      source
    },
    ref
  ) => {
    return (
      <div className="settings__card">
        <div className="card__header">General</div>
        <div className="card__content">
          <ProjectSettingsSource
            editSourceData={editProject.source}
            handleEditProject={handleEditProject}
            handleOnChangeSettings={handleOnChangeSettings}
            handleOnKeyDown={handleOnKeyDown}
            ref={ref}
            settingsSource={source}
          />
          <div className="card__divider" />
          <div
            className="settings__artifact-path"
            onClick={() => handleEditProject(ARTIFACT_PATH)}
          >
            <Input
              floatingLabel
              label="Artifact path"
              onChange={handleOnChangeSettings}
              onKeyDown={handleOnKeyDown}
              ref={ref}
              value={editProject.artifact_path.value ?? artifactPath}
            />
          </div>
          <p className="card__subtitle">Parameters</p>
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
      </div>
    )
  }
)

ProjectSettingsGeneralView.propTypes = {
  artifactPath: PropTypes.string.isRequired,
  editProject: PropTypes.object.isRequired,
  generalParams: PropTypes.array.isRequired,
  handleAddNewParameter: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnChangeSettings: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired
}

export default ProjectSettingsGeneralView
