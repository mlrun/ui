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
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'

import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'
import ProjectTable from '../ProjectTable/ProjectTable'

const ProjectDataCard = ({ content, href, link, params, statistics, table, title }) => {
  return (
    <div className="project-data-card">
      <div className="project-data-card__header table-header">
        <div className="project-data-card__header-text data-ellipsis">
          {href ? (
            <a href={href} target="_top">
              {title}
            </a>
          ) : (
            <Link to={link}>{title}</Link>
          )}
        </div>
        {!content.loading && (
          <div className="project-data-card__statistics">
            <ProjectStatistics statistics={statistics} />
          </div>
        )}
      </div>
      {content.loading ? (
        <Loader section />
      ) : content.error ? (
        <div className="error-container">
          <h1>{content.error}</h1>
        </div>
      ) : isEmpty(content.data) ? (
        <NoData />
      ) : (
        <>
          <ProjectTable params={params} table={table} />
          {href ? (
            <a href={href} target="_top" className="link project-data-card__see-all-link">
              See all
            </a>
          ) : (
            <Link className="link project-data-card__see-all-link" to={link}>
              See all
            </Link>
          )}
        </>
      )}
    </div>
  )
}

ProjectDataCard.defaultProps = {
  href: '',
  link: '',
  statistics: {},
  table: {}
}

ProjectDataCard.propTypes = {
  content: PropTypes.shape({}).isRequired,
  href: PropTypes.string,
  link: PropTypes.string,
  params: PropTypes.shape({}).isRequired,
  statistics: PropTypes.shape({}),
  table: PropTypes.shape({}),
  title: PropTypes.string
}

export default ProjectDataCard
