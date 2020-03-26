import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Plus } from '../../images/plus.svg'

const JobsPanelTableAddItemRow = ({ onClick }) => {
  return (
    <div className="table__row">
      <div className="table__cell" onClick={() => onClick(true)}>
        <button className="add-input">
          <Plus />
          Add input
        </button>
      </div>
    </div>
  )
}

JobsPanelTableAddItemRow.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default JobsPanelTableAddItemRow
