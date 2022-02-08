import React from 'react'
import PropTypes from 'prop-types'

import TextArea from '../../../common/TextArea/TextArea'

import { GOALS } from '../../../components/ProjectSettings/projectSettings.util'

const ProjectGoals = React.forwardRef(
  (
    {
      editGoalsData,
      handleEditProject,
      handleOnBlur,
      handleOnChangeProject,
      // handleOnKeyDown,
      projectGoals
    },
    ref
  ) => {
    return (
      <div
        className="settings__goals"
        data-testid="project-goals"
        onClick={() => handleEditProject(GOALS)}
      >
        <TextArea
          floatingLabel
          label="Project goals"
          // onKeyDown={handleOnKeyDown}
          onBlur={() => handleOnBlur(GOALS)}
          onChange={value => handleOnChangeProject(GOALS, value)}
          // ref={ref}
          value={editGoalsData.value ?? projectGoals}
        />
      </div>
    )
  }
)

ProjectGoals.propTypes = {
  editGoalsData: PropTypes.shape({}).isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  handleOnChangeProject: PropTypes.func.isRequired,
  projectGoals: PropTypes.string.isRequired
}

export default ProjectGoals
