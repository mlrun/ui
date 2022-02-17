import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { SOURCE_URL } from '../../constants'

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
        link={{
          show: editSourceData.value ?? settingsSource,
          url: editSourceData.value ?? settingsSource
        }}
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
    </div>
  )
}

ProjectSettingsSource.propTypes = {
  editSourceData: PropTypes.shape({}).isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  handleSourceChange: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  settingsSource: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired
}

export default ProjectSettingsSource
