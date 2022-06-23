import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'

const JobsPanelTableAddItemRow = ({ isPanelEditMode, onClick, text}) => {
  const classNames = classnames('add-input', isPanelEditMode && 'disabled')

  return (
    <div className="table__row no-hover">
      <div className="table__cell" onClick={() => !isPanelEditMode && onClick(true)}>
        <button className={classNames}>
          <Plus />
          Add {text}
        </button>
      </div>
    </div>
  )
}

JobsPanelTableAddItemRow.defaultProps = {
  isPanelEditMode: false
}

JobsPanelTableAddItemRow.propTypes = {
  isPanelEditMode: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default JobsPanelTableAddItemRow
