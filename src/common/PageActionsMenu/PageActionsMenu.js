import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { JOBS_PAGE } from '../../constants.js'

import './pageActionsMenu.scss'

const PageActionsMenu = ({ match, page }) => {
  return (
    page === JOBS_PAGE && (
      <div className="page-actions-container">
        <Link
          className="select__item"
          to={`/projects/${match.params.projectName}/jobs/create-new-job`}
        >
          New Job
        </Link>
      </div>
    )
  )
}

PageActionsMenu.propTypes = {
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired
}

export default PageActionsMenu
