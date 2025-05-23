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
import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import SearchIcon from 'igz-controls/images/search.svg?react'
import CheckmarkIcon from 'igz-controls/images/checkmark.svg?react'

import './breadcrumbsDropdown.scss'

const BreadcrumbsDropdown = forwardRef(
  (
    {
      link,
      list = [],
      onClick = () => {},
      screen = '',
      searchValue,
      setSearchValue,
      selectedItem,
      tab = '',
      withSearch = false
    },
    ref
  ) => {
    return (
      <div className="breadcrumbs__dropdown-wrapper" data-testid="breadcrumbs-dropdown">
        {withSearch && (
          <div className="breadcrumbs__dropdown-search" data-testid="breadcrumbs-search">
            <input
              className="input"
              onChange={event => setSearchValue(event.target.value)}
              placeholder="Type to search"
              type="text"
              autoFocus
            />
            <SearchIcon />
          </div>
        )}
        <div className="breadcrumbs__dropdown" ref={ref}>
          {list
            .filter(listItem =>
              listItem.id.toLocaleLowerCase().startsWith(searchValue.toLocaleLowerCase())
            )
            .map(listItem => {
              const isItemSelected = selectedItem === listItem.id
              const dropdownItemClassNames = classnames(
                'breadcrumbs__dropdown-item',
                'data-ellipsis',
                isItemSelected && 'breadcrumbs__dropdown-item_selected'
              )

              return (
                !listItem.hidden &&
                (listItem.link ? (
                  <a
                    href={listItem.link}
                    id={listItem.id}
                    data-testid={`breadcrumbs-dropdown-item-${listItem.id}`}
                    key={listItem.id}
                    className={dropdownItemClassNames}
                  >
                    <span>{listItem.label}</span>
                    {isItemSelected && <CheckmarkIcon className="checkmark" />}
                  </a>
                ) : (
                  <Link
                    to={
                      listItem.linkTo ||
                      `${link}/${listItem.id}${screen ? `/${screen}` : ''}${tab ? `/${tab}` : ''}`
                    }
                    onClick={event => {
                      isItemSelected ? event.preventDefault() : onClick(event)
                    }}
                    id={listItem.id}
                    data-testid={`breadcrumbs-dropdown-item-${listItem.id}`}
                    key={listItem.id}
                    className={dropdownItemClassNames}
                  >
                    <Tooltip template={<TextTooltipTemplate text={listItem.label} />}>
                      {listItem.label}
                    </Tooltip>
                    {isItemSelected && <CheckmarkIcon className="checkmark" />}
                  </Link>
                ))
              )
            })}
        </div>
      </div>
    )
  }
)

BreadcrumbsDropdown.displayName = 'BreadcrumbsDropdown'

BreadcrumbsDropdown.propTypes = {
  link: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func,
  screen: PropTypes.string,
  searchValue: PropTypes.string.isRequired,
  selectedItem: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  tab: PropTypes.string,
  withSearch: PropTypes.bool
}

export default BreadcrumbsDropdown
