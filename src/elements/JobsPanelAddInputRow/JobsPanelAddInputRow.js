import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Plus } from '../../images/plus.svg'

const JobsPanelAddInputRow = ({
  handleAddNewInput,
  setNewInputName,
  setNewInputPath
}) => {
  return (
    <div className="input-wrapper">
      <div>
        <input
          type="text"
          className="input-wrapper__item"
          placeholder="Set input name"
          onChange={e => setNewInputName(e.target.value)}
        />
        <input
          type="text"
          className="input-wrapper__item"
          placeholder="Set input path"
          onChange={e => setNewInputPath(e.target.value)}
        />
      </div>
      <button className="add-input" onClick={handleAddNewInput}>
        <Plus />
      </button>
    </div>
  )
}

JobsPanelAddInputRow.propTypes = {
  handleAddNewInput: PropTypes.func.isRequired,
  setNewInputName: PropTypes.func.isRequired,
  setNewInputPath: PropTypes.func.isRequired
}

export default JobsPanelAddInputRow
