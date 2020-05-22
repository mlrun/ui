import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const DetailsMenuItem = ({ hash, id, match, name, page, tab }) => {
  const link = `/projects/${match.params.projectName}/${page.toLowerCase()}/${
    page.toLowerCase() === 'functions' ? hash : id || name
  }/${tab}`
  const classNames = classnames(
    'menu-tab',
    match.params.tab === tab && 'active-tab'
  )

  return (
    <Link to={link}>
      <li className={classNames}>{tab}</li>
    </Link>
  )
}

DetailsMenuItem.defaultProps = {
  name: '',
  id: ''
}

DetailsMenuItem.propTypes = {
  id: PropTypes.string,
  match: PropTypes.shape({}).isRequired,
  name: PropTypes.string,
  page: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired
}

export default DetailsMenuItem
