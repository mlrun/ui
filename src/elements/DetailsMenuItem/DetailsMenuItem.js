import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { FUNCTIONS_PAGE } from '../../constants'

const DetailsMenuItem = ({
  hash,
  id,
  iter,
  match,
  name,
  onClick,
  page,
  tab
}) => {
  const link = `/projects/${match.params.projectName}/${page.toLowerCase()}/${
    match.params.pageTab ? `${match.params.pageTab}/` : ''
  }${page === FUNCTIONS_PAGE ? hash : id || name}/${
    match.params.tag ? `${match.params.tag}/` : ''
  }${isNaN(parseInt(iter)) ? '' : `${iter}/`}${tab.id}`
  const tabClassNames = classnames(
    'menu-tab',
    match.params.tab === tab.id && 'active-tab'
  )

  return (
    <Link to={link} onClick={onClick}>
      <li className={tabClassNames}>{tab.label}</li>
    </Link>
  )
}

DetailsMenuItem.defaultProps = {
  hash: '',
  id: '',
  iter: null,
  name: '',
  onClick: () => {}
}

DetailsMenuItem.propTypes = {
  hash: PropTypes.string,
  id: PropTypes.string,
  iter: PropTypes.number,
  match: PropTypes.shape({}).isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func,
  page: PropTypes.string.isRequired,
  tab: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    hidden: PropTypes.bool
  }).isRequired
}

export default DetailsMenuItem
