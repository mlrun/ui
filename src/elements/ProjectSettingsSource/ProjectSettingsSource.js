import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { SOURCE_URL } from '../../components/ProjectSettings/projectSettings.util'

import { ReactComponent as Edit } from '../../images/edit.svg'

import './projectSettingsSource.scss'

const ProjectSettingsSource = React.forwardRef(
  (
    {
      editSourceData,
      handleEditProject,
      handleOnChangeSettings,
      handleOnKeyDown,
      settingsSource
    },
    ref
  ) => {
    return (
      <>
        <div
          className="settings__source"
          onClick={() => handleEditProject(SOURCE_URL)}
        >
          {editSourceData.isEdit ? (
            <Input
              floatingLabel
              label="Source URL"
              focused
              onChange={handleOnChangeSettings}
              onKeyDown={handleOnKeyDown}
              ref={ref}
              type="text"
              value={editSourceData.value ?? settingsSource}
            />
          ) : (
            <>
              {editSourceData.value || settingsSource ? (
                <div>
                  <p className="settings__card-subtitle">Source URL</p>
                  <a
                    href={editSourceData.value || settingsSource}
                    onClick={event => event.stopPropagation()}
                    target="_blank"
                    rel="noreferrer"
                    className="settings__source-text data-ellipsis"
                  >
                    {editSourceData.value || settingsSource}
                  </a>
                </div>
              ) : (
                <span>Click to add source URL</span>
              )}
              <Edit
                className="settings__source-edit"
                onClick={() => handleEditProject(SOURCE_URL)}
              />
            </>
          )}
        </div>
      </>
    )
  }
)

ProjectSettingsSource.propTypes = {
  editSourceData: PropTypes.shape({}).isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnChangeSettings: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  settingsSource: PropTypes.string.isRequired
}

export default ProjectSettingsSource
