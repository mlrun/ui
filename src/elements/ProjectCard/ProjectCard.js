import React from 'react'
import { Link } from 'react-router-dom'

const ProjectCard = ({ project }) => {
  return (
    <div className="project_card">
      <div className="project_card_header">{project.name}</div>
      {project?.description && (
        <div className="project_card_description">{project.description}</div>
      )}
      <div className="project_card_links">
        <Link to={`/projects/${project.name}/jobs`}>
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

export default ProjectCard
