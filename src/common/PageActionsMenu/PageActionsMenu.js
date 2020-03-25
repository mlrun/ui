import React from 'react'
import PropTypes from 'prop-types'

import Select from '../Select/Select'

import './pageActionsMenu.scss'

const PageActionsMenu = ({ match, page }) => {
  return (
    <div className="page-actions-container">
      <Select match={match} page={page} option="create" value="Split Button" />
    </div>
  )
}

PageActionsMenu.propTypes = {
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired
}

export default PageActionsMenu
