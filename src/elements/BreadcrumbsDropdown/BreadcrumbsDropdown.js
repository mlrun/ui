import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'

import { ReactComponent as SearchIcon } from '../../images/search.svg'

import './breadcrumbsDropdown.scss'

const BreadcrumbsDropdown = ({
  link,
  list,
  onClick,
  screen,
  searchOnChange,
  selectedItem,
  withSearch
}) => {
  return (
    <div className="breadcrumbs__dropdown" data-testid="breadcrumbs-dropdown">
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
      {list.map(listItem => {
        const dropdownItemClassNames = classnames(
          'breadcrumbs__dropdown-item',
          'data-ellipsis',
          selectedItem === listItem.id && 'breadcrumbs__dropdown-item_selected'
        )

        return listItem.link ? (
          <a
            href={listItem.link}
            key={listItem.id}
            className={dropdownItemClassNames}
          >
            {listItem.label}
          </a>
        ) : (
          <Link
            to={`${link}/${listItem.id}${screen ? `/${screen}` : ''}`}
            data-testid="breadcrumbs-dropdown-item"
            key={listItem.id}
            className={dropdownItemClassNames}
            onClick={onClick}
          >
            <Tooltip template={<TextTooltipTemplate text={listItem.label} />}>
              {listItem.label}
            </Tooltip>
          </Link>
        )
      })}
    </div>
  )
}

BreadcrumbsDropdown.defaultProps = {
  onClick: () => {},
  screen: '',
  searchOnChange: () => {},
  withSearch: false
}

BreadcrumbsDropdown.propTypes = {
  link: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onClick: PropTypes.func,
  screen: PropTypes.string,
  searchOnChange: PropTypes.func,
  selectedItem: PropTypes.string.isRequired,
  withSearch: PropTypes.bool
}

export default BreadcrumbsDropdown
