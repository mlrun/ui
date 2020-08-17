import React from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'

const ProjectCard = ({ project }) => {
  const history = useHistory()

  return (
    <div
      className="project_card"
      onClick={event => {
        if (event.target.tagName !== 'A') {
          history.push(`/projects/${project.name}`)
        }
      }}
    >
      <div className="project_card_header">{project.name}</div>
      {project?.description && (
        <div className="project_card_description">{project.description}</div>
      )}
      <div className="project_card_links">
        <Link to={`/projects/${project.name}/jobs/monitor`}>Jobs</Link>
        <Link to={`/projects/${project.name}/artifacts`}>Artifacts</Link>
        <Link to={`/projects/${project.name}/functions`}>Functions</Link>
      </div>
    </div>
  )
}

ProjectCard.propTypes = {
  project: PropTypes.shape({}).isRequired
}

export default ProjectCard
