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
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import ProjectStatisticsCounter from '../ProjectStatisticsCounter/ProjectStatisticsCounter'

import './projectStatistics.scss'

const ProjectStatistics = ({ statistics }) => {
  return Object.keys(statistics).map((key, index) => {
    return (
      <div key={key + index} className="project-data-card__statistics-item">
        {statistics[key].href ? (
          <a
            href={statistics[key].href}
            target="_top"
            className="project-data-card__statistics-link"
          >
            <ProjectStatisticsCounter counterObject={statistics[key]} />
          </a>
        ) : statistics[key].link ? (
          <Link
            className="project-data-card__statistics-link"
            to={statistics[key].link}
          >
            <ProjectStatisticsCounter counterObject={statistics[key]} />
          </Link>
        ) : (
          <div className="project-data-card__statistics-data">
            <ProjectStatisticsCounter counterObject={statistics[key]} />
          </div>
        )}
      </div>
    )
  })
}

ProjectStatistics.propTypes = {
  statistics: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectStatistics)
