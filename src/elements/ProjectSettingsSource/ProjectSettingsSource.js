import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Tip from '../../common/Tip/Tip'

import { SOURCE_URL } from '../../components/ProjectSettings/projectSettings.util'

import { ReactComponent as Edit } from '../../images/edit.svg'

import './projectSettingsSource.scss'

const ProjectSettingsSource = ({
  editSourceData,
  handleEditProject,
  handleOnBlur,
  handleSourceChange,
  setValidation,
  settingsSource,
  validation
}) => {
  return (
    <div
      className="settings__source"
      onClick={() => handleEditProject(SOURCE_URL)}
    >
      <div className="settings__source-link">
        {editSourceData.isEdit ? (
          <Input
            floatingLabel
            invalid={!validation.isSourceValid}
            label="Source URL"
            focused
            onBlur={() => handleOnBlur(SOURCE_URL)}
            onChange={handleSourceChange}
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isSourceValid: value
              }))
            }
            type="text"
            value={editSourceData.value ?? settingsSource}
          />
        ) : editSourceData.value || settingsSource ? (
          <div>
            <p className="settings__card-subtitle">Source URL</p>
            <Tooltip
              template={
                <TextTooltipTemplate
                  text={editSourceData.value || settingsSource}
                />
              }
            >
              <a
                href={editSourceData.value || settingsSource}
                onClick={event => event.stopPropagation()}
                target="_blank"
                rel="noreferrer"
                className="settings__source-text"
              >
                {editSourceData.value || settingsSource}
              </a>
            </Tooltip>
          </div>
        ) : (
          <span>Click to add source URL</span>
        )}
      </div>
      <div className="settings__source-icons">
        {!editSourceData.isEdit && (
          <Tooltip template={<TextTooltipTemplate text="Edit" />}>
            <Edit
              className="settings__source-edit"
              onClick={() => handleEditProject(SOURCE_URL)}
            />
          </Tooltip>
        )}
        <Tip text="Source URL is the Git Repo that is associated with the project. When the user pulls the project it will use the source URL to pull from" />
      </div>
    </div>
  )
}

ProjectSettingsSource.propTypes = {
  editSourceData: PropTypes.shape({}).isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleSourceChange: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  settingsSource: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired
}

export default ProjectSettingsSource
