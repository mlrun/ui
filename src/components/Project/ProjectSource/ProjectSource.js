import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../../common/Input/Input'

import { ReactComponent as Edit } from '../../../images/edit.svg'

const ProjectSource = React.forwardRef(
  (
    {
      editSourceData,
      handleEditProject,
      handleOnChangeProject,
      handleOnKeyDown,
      projectSource
    },
    ref
  ) => {
    return (
      <div
        className="general-info__source"
        onClick={() => handleEditProject('source')}
      >
        {editSourceData.isEdit ? (
          <Input
            focused
            onChange={handleOnChangeProject}
            onKeyDown={handleOnKeyDown}
            ref={ref}
            type="text"
            value={editSourceData.value ?? projectSource}
          />
        ) : (
          <>
            {editSourceData.value || projectSource ? (
              <a
                href={editSourceData.value || projectSource}
                onClick={event => event.stopPropagation()}
                target="_blank"
                rel="noreferrer"
                className="general-info__source-text data-ellipsis"
              >
                {editSourceData.value || projectSource}
              </a>
            ) : (
              <span>Click to add source URL</span>
            )}
            <Edit
              className="general-info__source-edit"
              onClick={() => handleEditProject('source')}
            />
          </>
        )}
      </div>
    )
  }
)

ProjectSource.propTypes = {
  editSourceData: PropTypes.shape({}).isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnChangeProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  projectSource: PropTypes.string.isRequired
}

export default ProjectSource
