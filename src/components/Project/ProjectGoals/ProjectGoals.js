import React from 'react'
import PropTypes from 'prop-types'

import TextArea from '../../../common/TextArea/TextArea'

const ProjectGoals = React.forwardRef(
  (
    {
      editGoalsData,
      handleEditProject,
      handleOnChangeProject,
      handleOnKeyDown,
      projectGoals
    },
    ref
  ) => {
    return (
      <div
        className="general-info__description"
        data-testid="project-goals"
        onClick={() => handleEditProject('goals')}
      >
        {editGoalsData.isEdit ? (
          <TextArea
            floatingLabel
            focused
            label="Project goals"
            onChange={handleOnChangeProject}
            onKeyDown={handleOnKeyDown}
            ref={ref}
            value={editGoalsData.value ?? projectGoals}
          />
        ) : (
          <div className="general-info__description-info">
            <span className="general-info__description-title">
              Project goals
            </span>
            <p className="general-info__description-text data-ellipsis">
              {editGoalsData.value ?? projectGoals}
            </p>
          </div>
        )}
      </div>
    )
  }
)

ProjectGoals.propTypes = {
  editGoalsData: PropTypes.shape({}).isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnChangeProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  projectGoals: PropTypes.string.isRequired
}

export default ProjectGoals
