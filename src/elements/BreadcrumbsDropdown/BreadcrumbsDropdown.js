import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { ReactComponent as SearchIcon } from '../../images/search.svg'

import './breadcrumbsDropdown.scss'

const BreadcrumbsDropdown = ({
  link,
  list,
  screen,
  searchOnChange,
  withSearch
}) => {
  return (
    <div className="breadcrumbs__dropdown">
      {withSearch && (
        <div className="dropdown__search">
          <input
            className="dropdown__search-input input"
            onChange={event => searchOnChange(event.target.value)}
            placeholder="Type to search"
            type="text"
          />
          <SearchIcon />
        </div>
      )}
      {list.map(listItem =>
        listItem.link ? (
          <a
            href={listItem.link}
            key={listItem.id}
            className="breadcrumbs__dropdown-item"
          >
            {listItem.label}
          </a>
        ) : (
          <Link
            to={`${link}/${listItem.id}${screen ? `/${screen}` : ''}`}
            key={listItem.id}
            className="breadcrumbs__dropdown-item"
          >
            {listItem.label}
          </Link>
        )
      )}
    </div>
  )
}

BreadcrumbsDropdown.propTypes = {
  link: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default BreadcrumbsDropdown
