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
      {items.map(tree => {
        return (
          <div
            key={tree.id}
            className={`drop_down_menu_item
            ${
              filterTree.length !== 0
                ? RegExp(`^${filterTree}`, 'i').test(tree.id) && ' select_item'
                : ''
            }
        `}
            onClick={() => {
              handleSelectFilter(tree)
            }}
          >
            {tree.label}
          </div>
        )
      })}
    </div>
  )
}

ArtifactFilterTreeDropDown.defaultProps = {
  items: []
}

ArtifactFilterTreeDropDown.propTypes = {
  items: PropTypes.array.isRequired,
  setIsDropDownMenu: PropTypes.func.isRequired,
  filterTree: PropTypes.string.isRequired,
  handleSelectFilter: PropTypes.func.isRequired
}

export default ArtifactFilterTreeDropDown
