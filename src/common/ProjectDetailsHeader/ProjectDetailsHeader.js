/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { getDateAndTimeByFormat } from '../../utils/'
import { PROJECT_MONITOR } from '../../constants'

import './ProjectDetailsHeader.scss'

const ProjectDetailsHeader = ({ projectData, projectName }) => {
  const location = useLocation()

  return (
    <div className="project-details">
      <div className="project-details__row">
        <div className="project-details__col">
          <div className="project-details__header">
            <span className="project-details__title">{projectName}</span>
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
            <span className="project-details__details-label">Status:</span>
            <div>
              <i className={`state-${projectData.status.state}`} />
              <span>{projectData.status.state}</span>
            </div>
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
