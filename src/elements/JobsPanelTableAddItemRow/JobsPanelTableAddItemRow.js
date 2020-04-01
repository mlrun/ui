import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Plus } from '../../images/plus.svg'

const JobsPanelTableAddItemRow = ({ onClick, text }) => {
  return (
    <div className="table__row">
      <div className="table__cell" onClick={() => onClick(true)}>
        <button className="add-input">
          <Plus />
          Add {text}
        </button>
      </div>
    </div>
  )
}

JobsPanelTableAddItemRow.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default JobsPanelTableAddItemRow
