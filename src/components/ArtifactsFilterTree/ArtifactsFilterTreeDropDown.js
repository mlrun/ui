import React from 'react'
import PropTypes from 'prop-types'

const ArtifactFilterTreeDropDown = ({
  items,
  setIsDropDownMenu,
  filterTree,
  handleSelectFilter
}) => {
  return (
    <div className="drop_down_menu" onClick={() => setIsDropDownMenu(false)}>
      {items.map(item => {
        return (
          <div
            key={item}
            className={`drop_down_menu_item
            ${
              filterTree.length !== 0
                ? RegExp(`^${filterTree}`, 'i').test(item) && ' select_item'
                : ''
            }
        `}
            onClick={() => {
              handleSelectFilter(item)
            }}
          >
            {item}
          </div>
        )
      })}
    </div>
  )
}

ArtifactFilterTreeDropDown.propTypes = {
  item: PropTypes.array,
  setIsDropDownMenu: PropTypes.func,
  filterTree: PropTypes.string,
  handleSelectFilter: PropTypes.func
}

export default ArtifactFilterTreeDropDown
