import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { SOURCE_URL } from '../../components/ProjectSettings/projectSettings.util'

import './projectSettingsSource.scss'

const ProjectSettingsSource = ({
  editSourceData,
  handleEditProject,
  handleOnBlur,
  handleOnKeyDown,
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
      <Input
        floatingLabel
        invalid={!validation.isSourceValid}
        label="Source URL"
        focused
        onBlur={() => handleOnBlur(SOURCE_URL)}
        onChange={value => handleSourceChange(SOURCE_URL, value)}
        onKeyDown={handleOnKeyDown}
        setInvalid={value =>
          setValidation(state => {
            return {
              ...state,
              isSourceValid: value
            }
          })
        }
        tip="Source URL is the Git Repo that is associated with the project. When the user pulls the project it will use the source URL to pull from"
        type="text"
        value={editSourceData.value ?? settingsSource}
      />

      {(editSourceData.value || settingsSource) && (
        <div className="settings__source-text">
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
            >
              {editSourceData.value || settingsSource}
            </a>
          </Tooltip>
        </div>
      )}
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
