import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

const ProjectCard = ({ project }) => {
  return (
    <div className="project_card">
      <div className="project_card_header">
        <Tooltip template={<TextTooltipTemplate text={project.name} />}>
          {project.name}
        </Tooltip>
      </div>
      {project?.description && (
        <div className="project_card_description">{project.description}</div>
      )}
      <div className="project_card_links">
        <Link to={`/projects/${project.name}/jobs/monitor`}>
          <div>Jobs</div>
        </Link>
        <Link to={`/projects/${project.name}/artifacts`}>
          <div>Artifacts</div>
        </Link>
        <Link to={`/projects/${project.name}/functions`}>
          <div>Functions</div>
        </Link>
      </div>
    </div>
  )
}

ProjectCard.propTypes = {
  project: PropTypes.shape({}).isRequired
}

export default ProjectCard
