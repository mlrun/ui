import React from 'react'
import PropTypes from 'prop-types'

import TextArea from '../../../common/TextArea/TextArea'

const ProjectDescription = React.forwardRef(
  (
    {
      editDescriptionData,
      handleEditProject,
      handleOnChangeProject,
      handleOnKeyDown,
      projectDescription
    },
    ref
  ) => {
    return (
      <div
        className="general-info__description"
        data-testid="project-description"
        onClick={() => handleEditProject('description')}
      >
        {editDescriptionData.isEdit ? (
          <TextArea
            floatingLabel
            focused
            label="Project summary"
            onChange={handleOnChangeProject}
            onKeyDown={handleOnKeyDown}
            ref={ref}
            value={editDescriptionData.value ?? projectDescription}
          />
        ) : (
          <div className="general-info__description-info">
            <span className="general-info__description-title">
              Project summary
            </span>
            <p className="general-info__description-text data-ellipsis">
              {editDescriptionData.value ?? projectDescription}
            </p>
          </div>
        )}
      </div>
    )
  }
)

ProjectDescription.propTypes = {
  editDescriptionData: PropTypes.shape({}).isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnChangeProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  projectDescription: PropTypes.string.isRequired
}

export default ProjectDescription
