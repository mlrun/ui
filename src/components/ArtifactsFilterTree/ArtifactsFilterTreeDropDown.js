import React from 'react'
import PropTypes from 'prop-types'

const ArtifactFilterTreeDropDown = ({
  filterTree,
  filterTreeOptions,
  handleSelectFilter,
  setIsDropDownMenu
}) => {
  return (
    <div className="drop_down_menu" onClick={() => setIsDropDownMenu(false)}>
      {filterTreeOptions.map(tree => {
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
  filterTreeOptions: []
}

ArtifactFilterTreeDropDown.propTypes = {
  filterTree: PropTypes.string.isRequired,
  filterTreeOptions: PropTypes.array,
  handleSelectFilter: PropTypes.func.isRequired,
  setIsDropDownMenu: PropTypes.func.isRequired
}

export default ArtifactFilterTreeDropDown
