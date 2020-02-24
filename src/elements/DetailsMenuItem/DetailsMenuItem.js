import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const DetailsMenuItem = ({ id, match, name, page, tab }) => {
  const link = `/projects/${match.params.projectName}/${
    page === 'jobs' ? 'jobs' : 'artifacts'
  }/${id || name}/${tab}`
  return (
    <Link to={link}>
      <li
        className={`table__item__menu_item ${match.params.tab === tab &&
          'active'}`}
      >
        {tab}
      </li>
    </Link>
  )
}

DetailsMenuItem.defaultProps = {
  name: ''
}

DetailsMenuItem.propTypes = {
  id: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  name: PropTypes.string,
  page: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired
}

export default DetailsMenuItem
