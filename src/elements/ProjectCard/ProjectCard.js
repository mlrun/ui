import React from 'react'
import { Link } from 'react-router-dom'

import artifactIcon from '../../images/file-chart.png'
import jobsIcon from '../../images/check-all.png'

const ProjectCard = ({ project }) => {
  return (
    <div className="project_card">
      <div className="project_card_header">{project}</div>
      <div className="project_card_links">
        <Link to={`/projects/${project}/jobs`}>
          <img src={jobsIcon} alt="jobs" />
          <div>Jobs</div>
        </Link>
        <Link to={`/projects/${project}/artifacts`}>
          <img src={artifactIcon} alt="artifact" />
          <div>Artifacts</div>
        </Link>
      </div>
    </div>
  )
}

export default ProjectCard
