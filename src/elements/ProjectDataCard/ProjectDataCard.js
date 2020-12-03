import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'

import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'
import ProjectTable from '../../components/ProjectTable/ProjectTable'

const ProjectDataCard = ({
  content,
  href,
  link,
  match,
  statistics,
  table,
  title
}) => {
  return (
    <div className="project-data-card">
      <div className="project-data-card__header">
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
        <Loader />
      ) : content.error ? (
        <div className="error_container">
          <h1>{content.error}</h1>
        </div>
      ) : isEmpty(content.data) ? (
        <NoData />
      ) : (
        <>
          <ProjectTable match={match} table={table} />
          {href ? (
            <a
              href={href}
              target="_top"
              className="project-data-card__see-all-link"
            >
              See all
            </a>
          ) : (
            <Link className="project-data-card__see-all-link" to={link}>
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
  match: PropTypes.shape({}).isRequired,
  statistics: PropTypes.shape({}),
  table: PropTypes.shape({}),
  title: PropTypes.string
}

export default ProjectDataCard
