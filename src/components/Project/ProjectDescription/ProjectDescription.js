import React from 'react'
import PropTypes from 'prop-types'

import TextArea from '../../../common/TextArea/TextArea'

import { DESCRIPTION } from '../../../components/ProjectSettings/projectSettings.util'

const ProjectDescription = ({
  editDescriptionData,
  handleEditProject,
  handleOnBlur,
  handleOnChangeProject,
  projectDescription
}) => {
  return (
    <div
      className="settings__description"
      data-testid="project-description"
      onClick={() => handleEditProject(DESCRIPTION)}
    >
      <TextArea
        floatingLabel
        label="Project description"
        onBlur={() => handleOnBlur(DESCRIPTION)}
        onChange={value => handleOnChangeProject(DESCRIPTION, value)}
        type="text"
        value={editDescriptionData.value ?? projectDescription}
      />
    </div>
  )
}

ProjectDescription.propTypes = {
  editDescriptionData: PropTypes.shape({}).isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleOnBlur: PropTypes.func.isRequired,
  handleOnChangeProject: PropTypes.func.isRequired,
  projectDescription: PropTypes.string.isRequired
}

export default ProjectDescription
