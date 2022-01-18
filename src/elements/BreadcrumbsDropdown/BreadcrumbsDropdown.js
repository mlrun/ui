import React, { useState } from 'react'
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
  selectedItem,
  tab,
  withSearch
}) => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div
      className="breadcrumbs__dropdown-wrapper"
      data-testid="breadcrumbs-dropdown"
    >
      {withSearch && (
        <div className="breadcrumbs__dropdown-search">
          <input
            className="input"
            onChange={event => setSearchValue(event.target.value)}
            placeholder="Type to search"
            type="text"
          />
          <SearchIcon />
        </div>
      )}
      <div className="breadcrumbs__dropdown">
        {list
          .filter(project => project.id.startsWith(searchValue))
          .map(listItem => {
            const dropdownItemClassNames = classnames(
              'breadcrumbs__dropdown-item',
              'data-ellipsis',
              selectedItem === listItem.id &&
                'breadcrumbs__dropdown-item_selected'
            )

            return (
              !listItem.hidden &&
              (listItem.link ? (
                <a
                  href={listItem.link}
                  key={listItem.id}
                  className={dropdownItemClassNames}
                >
                  {listItem.label}
                </a>
              ) : (
                <Link
                  to={`${link}/${listItem.id}${screen ? `/${screen}` : ''}${
                    tab ? `/${tab}` : ''
                  }`}
                  data-testid="breadcrumbs-dropdown-item"
                  key={listItem.id}
                  className={dropdownItemClassNames}
                  onClick={onClick}
                >
                  <Tooltip
                    template={<TextTooltipTemplate text={listItem.label} />}
                  >
                    {listItem.label}
                  </Tooltip>
                </Link>
              ))
            )
          })}
      </div>
    </div>
  )
}

BreadcrumbsDropdown.defaultProps = {
  onClick: () => {},
  screen: '',
  searchOnChange: () => {},
  tab: '',
  withSearch: false
}

BreadcrumbsDropdown.propTypes = {
  link: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onClick: PropTypes.func,
  screen: PropTypes.string,
  selectedItem: PropTypes.string.isRequired,
  tab: PropTypes.string,
  withSearch: PropTypes.bool
}

export default BreadcrumbsDropdown
