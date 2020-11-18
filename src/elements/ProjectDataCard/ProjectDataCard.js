import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'

import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'
import ProjectTable from '../../components/ProjectTable/ProjectTable'

const ProjectDataCard = ({
  dataCard,
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
        {!isEmpty(dataCard.data) && (
          <div className="project-data-card__statistics">
            <ProjectStatistics statistics={statistics} />
          </div>
        )}
      </div>
      {dataCard.loading ? (
        <Loader />
      ) : dataCard.error ? (
        <div className="error_container">
          <h1>{dataCard.error}</h1>
        </div>
      ) : isEmpty(dataCard.data) ? (
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
  dataCard: PropTypes.shape({}).isRequired,
  href: PropTypes.string,
  link: PropTypes.string,
  match: PropTypes.shape({}).isRequired,
  statistics: PropTypes.shape({}),
  table: PropTypes.shape({}),
  title: PropTypes.string
}

export default ProjectDataCard
