import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { JOBS_PAGE, PROJECTS_PAGE, ARTIFACTS_PAGE } from '../../constants.js'

const PageActionsMenu = ({ match, onClick, pageData }) => {
  return (
    <>
      {pageData.page === JOBS_PAGE && (
        <div data-testid="actions-link" className="page-actions-container">
          <Link
            className="btn_secondary btn_small"
            to={`/projects/${match.params.projectName}/jobs/${match.params.pageTab}/create-new-job`}
          >
            New Job
          </Link>
        </div>
      )}
      {(pageData.page === PROJECTS_PAGE ||
        pageData.page === ARTIFACTS_PAGE) && (
        <div data-testid="actions-button" className="page-actions-container">
          <button
            className="btn_secondary btn_small btn_register"
            onClick={onClick}
          >
            {pageData.page === PROJECTS_PAGE
              ? 'New Project'
              : pageData.registerArtifactDialogTitle}
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
  pageData: PropTypes.shape({}).isRequired
}

export default PageActionsMenu
