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
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

const TagFilterDropdown = ({
  handleSelectFilter,
  setIsDropDownMenuOpen,
  tagFilter,
  tagFilterOptions = []
}) => {
  return (
    <div className="tag-filter__dropdown" onClick={() => setIsDropDownMenuOpen(false)}>
      {tagFilterOptions.map(tag => {
        const dropdownItemClassName = classnames(
          'tag-filter__dropdown-item',
          tagFilter.length !== 0 && tagFilter === tag.id && 'tag-filter__dropdown-item_selected'
        )

        return (
          <div
            key={tag.id}
            className={dropdownItemClassName}
            onClick={event => handleSelectFilter(event, tag)}
          >
            <Tooltip template={<TextTooltipTemplate text={tag.label} />}>
              <span>{tag.label}</span>
            </Tooltip>
          </div>
        )
      })}
    </div>
  )
}

TagFilterDropdown.propTypes = {
  handleSelectFilter: PropTypes.func.isRequired,
  setIsDropDownMenuOpen: PropTypes.func.isRequired,
  tagFilter: PropTypes.string.isRequired,
  tagFilterOptions: PropTypes.array
}

export default TagFilterDropdown
