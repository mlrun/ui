import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { JOBS_PAGE, PROJECTS_PAGE } from '../../constants.js'

const PageActionsMenu = ({ match, onClick, page }) => {
  return (
    <>
      {page === JOBS_PAGE && (
        <div className="page-actions-container">
          <Link
            className="btn_secondary btn_small"
            to={`/projects/${match.params.projectName}/jobs/create-new-job`}
          >
            New Job
          </Link>
        </div>
      )}
      {page === PROJECTS_PAGE && (
        <div className="page-actions-container">
          <button className="btn_secondary btn_small" onClick={onClick}>
            New Project
          </button>
        </div>
      )}
    </>
  )
}

PageActionsMenu.defaultProps = {
  onClick: null
}

PageActionsMenu.propTypes = {
  match: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func,
  page: PropTypes.string.isRequired
}

export default PageActionsMenu
