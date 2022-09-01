/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as SearchIcon } from 'igz-controls/images/search.svg'

import './breadcrumbsDropdown.scss'

const BreadcrumbsDropdown = ({ link, list, onClick, screen, selectedItem, tab, withSearch }) => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className="breadcrumbs__dropdown-wrapper" data-testid="breadcrumbs-dropdown">
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
              selectedItem === listItem.id && 'breadcrumbs__dropdown-item_selected'
            )

            return (
              !listItem.hidden &&
              (listItem.link ? (
                <a href={listItem.link} key={listItem.id} className={dropdownItemClassNames}>
                  {listItem.label}
                </a>
              ) : (
                <Link
                  to={`${link}/${listItem.id}${screen ? `/${screen}` : ''}${tab ? `/${tab}` : ''}`}
                  data-testid="breadcrumbs-dropdown-item"
                  key={listItem.id}
                  className={dropdownItemClassNames}
                  onClick={onClick}
                >
                  <Tooltip template={<TextTooltipTemplate text={listItem.label} />}>
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
