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

import NoData from '../../common/NoData/NoData'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'
import SectionTable from '../SectionTable/SectionTable'
import { Tip, Loader } from 'igz-controls/components'

import ClockIcon from 'igz-controls/images/clock.svg?react'

const ProjectDataCard = ({
  content,
  footerLinkText = 'See all',
  headerLink = '',
  hasUpdateDate = false,
  href = '',
  link = '',
  params,
  statistics = {},
  subTitle,
  table = {},
  tip = null,
  title
}) => {
  return (
    <div className="project-data-card">
      <div className="project-data-card__header table-header">
        <div className="project-data-card__header-text data-ellipsis">
          <span>
            {href ? (
              <a href={href} target="_top">
                {title}
              </a>
            ) : (
              <Link to={headerLink || link}>{title}</Link>
            )}
            {tip && <Tip className="project-data-card__header-tip" text={tip} />}
          </span>
          {hasUpdateDate && (
            <span className="project-data-card__header-info">
              <ClockIcon className="project-data-card__header-info-icon" />
              <span>Last 24 hrs</span>
            </span>
          )}
        </div>
        <div className="project-data-card__statistics">
          <ProjectStatistics statistics={statistics} />
        </div>
      </div>
      <div className="project-data-card__recent-text">
        {subTitle && <span>{subTitle}</span>}
        {hasUpdateDate && <span className="text-sm">(last 7 days)</span>}
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
          <SectionTable params={params} table={table} />
          {href ? (
            <a href={href} target="_top" className="link project-data-card__see-all-link">
              {footerLinkText}
            </a>
          ) : (
            <Link className="link project-data-card__see-all-link" to={link}>
              {footerLinkText}
            </Link>
          )}
        </>
      )}
    </div>
  )
}

ProjectDataCard.propTypes = {
  content: PropTypes.object.isRequired,
  footerLinkText: PropTypes.string,
  headerLink: PropTypes.string,
  hasUpdateDate: PropTypes.bool,
  href: PropTypes.string,
  link: PropTypes.string,
  params: PropTypes.object.isRequired,
  statistics: PropTypes.object,
  subTitle: PropTypes.string,
  table: PropTypes.object,
  tip: PropTypes.string,
  title: PropTypes.string
}

export default ProjectDataCard
