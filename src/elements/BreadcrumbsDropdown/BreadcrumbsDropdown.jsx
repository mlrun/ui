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
import HomepageIcon from 'igz-controls/images/navbar/mlrun-project-home.svg?react'

import './breadcrumbsDropdown.scss'

const BreadcrumbsDropdown = forwardRef(
  (
    {
      id = '',
      link = '',
      list = [],
      onClick = () => { },
      searchValue = '',
      setSearchValue,
      selectedItem,
      urlParts,
      withSearch = false,
      withAllProjects = false
    },
    ref
  ) => {
    return (
      <div className="breadcrumbs__dropdown-wrapper" data-testid={id}>
        {withSearch && (
          <div className="breadcrumbs__dropdown-search" data-testid="breadcrumbs-search">
            <input
              name="projects-search"
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
              listItem.id.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
            )
            .map(listItem => {
              const isItemSelected = selectedItem === listItem.id
              const dropdownItemClassNames = classnames(
                'breadcrumbs__dropdown-item',
                'data-ellipsis',
                isItemSelected && 'breadcrumbs__dropdown-item_selected'
              )

              return (
                listItem.link ? (
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
                      listItem.linkTo || urlParts?.screen?.link?.replace(urlParts?.pathItems[1], listItem.id) || link
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
                )
              )
            })}
        </div>
        {withAllProjects && (
          <>
            <div className="navbar__separator"></div>
            <div className="breadcrumbs__dropdown-all-projects">
              <Link
                to="/"
                id="all-projects"
                data-testid="breadcrumbs-dropdown-item-all-projects"
                key="all-projects"
                className="breadcrumbs__dropdown-item"
              >
                <HomepageIcon />
                <span>All Projects</span>
              </Link>
            </div>
          </>
        )}
      </div>
    )
  }
)

BreadcrumbsDropdown.displayName = 'BreadcrumbsDropdown'

BreadcrumbsDropdown.propTypes = {
  id: PropTypes.string,
  link: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func,
  searchValue: PropTypes.string.isRequired,
  selectedItem: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  urlParts: PropTypes.object,
  withSearch: PropTypes.bool,
  withAllProjects: PropTypes.bool
}

export default BreadcrumbsDropdown
