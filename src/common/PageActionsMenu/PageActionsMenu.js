import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Button from '../Button/Button'

import { PRIMARY_BUTTON } from '../../constants'

const PageActionsMenu = ({
  createJob,
  match,
  onClick,
  registerDialog,
  registerDialogHeader
}) => {
  return (
    <>
      {createJob && (
        <div data-testid="actions-link" className="page-actions-container">
          <Link
            to={`/projects/${match.params.projectName}/jobs/${match.params.pageTab}/create-new-job`}
          >
            <Button variant={PRIMARY_BUTTON} label="New Job" />
          </Link>
        </div>
      )}
      {registerDialog && (
        <div data-testid="actions-button" className="page-actions-container">
          <Button
            variant={PRIMARY_BUTTON}
            label={registerDialogHeader}
            className="btn_register"
            onClick={onClick}
          />
        </div>
      )}
    </>
  )
}

PageActionsMenu.defaultProps = {
  createJob: false,
  onClick: null,
  registerDialog: false,
  registerDialogHeader: ''
}

PageActionsMenu.propTypes = {
  createJob: PropTypes.bool,
  match: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func,
  registerDialog: PropTypes.bool,
  registerDialogHeader: PropTypes.string
}

export default PageActionsMenu
