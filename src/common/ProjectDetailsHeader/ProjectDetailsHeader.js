import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { getDateAndTimeByFormat } from '../../utils/'
import { PROJECT_MONITOR } from '../../constants'

import './ProjectDetailsHeader.scss'

const ProjectDetailsHeader = ({ projectData, projectName }) => {
  const location = useLocation()

  return (
    <div className="project-details">
      <div className="project-details__row">
        <div className="project-details__col">
          <div className="project-details__title">
            {projectName}
            <Tooltip template={<TextTooltipTemplate text={projectData.status.state} />}>
              <i className={`state-${projectData.status.state}`} />
            </Tooltip>
          </div>
          <p className="project-details__description">{projectData.spec.description ?? ''}</p>
        </div>
        <ul className="project-details__details">
          <li>
            <span className="project-details__details-label">Created:</span>
            <span>
              {getDateAndTimeByFormat(projectData.metadata.created, 'MM/DD/YYYY, HH:mm:ss A')}
            </span>
          </li>
          <li>
            <span className="project-details__details-label">Owner:</span>
            <span>{projectData.spec.owner}</span>
          </li>
          <li>
            {location.pathname.includes(PROJECT_MONITOR) ? (
              <Link to={`/projects/${projectName}`} className="link">
                Project Home
              </Link>
            ) : (
              <Link to={`/projects/${projectName}/${PROJECT_MONITOR}`} className="link">
                Project Monitoring
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ProjectDetailsHeader
