import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const TagFilterDropdown = ({
  handleSelectFilter,
  setIsDropDownMenuOpen,
  tagFilter,
  tagFilterOptions
}) => {
  return (
    <div
      className="tag-filter__dropdown"
      onClick={() => setIsDropDownMenuOpen(false)}
    >
      {tagFilterOptions.map(tag => {
        const dropdownItemClassName = classnames(
          'tag-filter__dropdown-item',
          tagFilter.length !== 0 &&
            tagFilter === tag.id &&
            'tag-filter__dropdown-item_selected'
        )

        return (
          <div
            key={tag.id}
            className={dropdownItemClassName}
            onClick={() => handleSelectFilter(tag)}
          >
            {tag.label}
          </div>
        )
      })}
    </div>
  )
}

TagFilterDropdown.defaultProps = {
  tagFilterOptions: []
}

TagFilterDropdown.propTypes = {
  handleSelectFilter: PropTypes.func.isRequired,
  setIsDropDownMenuOpen: PropTypes.func.isRequired,
  tagFilter: PropTypes.string.isRequired,
  tagFilterOptions: PropTypes.array
}

export default TagFilterDropdown
