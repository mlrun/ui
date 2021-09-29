import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../../common/Input/Input'

import { ReactComponent as Edit } from '../../../images/edit.svg'
import { SOURCE_URL } from '../projectSettings.util'

const SettingsSource = React.forwardRef(
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
              <a
                href={editSourceData.value || settingsSource}
                onClick={event => event.stopPropagation()}
                target="_blank"
                rel="noreferrer"
                className="settings__source-text data-ellipsis"
              >
                {editSourceData.value || settingsSource}
              </a>
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
    )
  }
)

SettingsSource.propTypes = {
  editSourceData: PropTypes.shape({}).isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnChangeSettings: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  settingsSource: PropTypes.string.isRequired
}

export default SettingsSource
