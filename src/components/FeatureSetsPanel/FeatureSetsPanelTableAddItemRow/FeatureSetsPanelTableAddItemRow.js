import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'

const FeatureSetsPanelTableAddItemRow = ({ onClick, text }) => {
  return (
    <div className="table__row no-hover">
      <div className="table__cell" onClick={onClick}>
        <button className="add-input">
          <Plus />
          Add {text}
        </button>
      </div>
    </div>
  )
}

FeatureSetsPanelTableAddItemRow.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default FeatureSetsPanelTableAddItemRow
