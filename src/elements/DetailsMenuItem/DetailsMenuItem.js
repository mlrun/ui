import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { FUNCTIONS_PAGE } from '../../constants'

const DetailsMenuItem = ({ hash, id, match, name, page, tab }) => {
  const link = `/projects/${match.params.projectName}/${page.toLowerCase()}/${
    match.params.pageTab ? `${match.params.pageTab}/` : ''
  }${page === FUNCTIONS_PAGE ? hash : id || name}/${tab}`
  const tabClassNames = classnames(
    'menu-tab',
    match.params.tab === tab && 'active-tab'
  )

  return (
    <Link to={link}>
      <li className={tabClassNames}>{tab}</li>
    </Link>
  )
}

DetailsMenuItem.defaultProps = {
  hash: '',
  id: '',
  name: ''
}

DetailsMenuItem.propTypes = {
  hash: PropTypes.string,
  id: PropTypes.string,
  match: PropTypes.shape({}).isRequired,
  name: PropTypes.string,
  page: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired
}

export default DetailsMenuItem
