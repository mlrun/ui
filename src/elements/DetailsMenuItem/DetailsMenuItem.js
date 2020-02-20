import React from 'react'
import { Link } from 'react-router-dom'

const DetailsMenuItem = ({ page, id, match, tab, name }) => {
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

export default DetailsMenuItem
