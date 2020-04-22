import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableDataInputsRow = ({
  handleEdit,
  selectedDataInput,
  setSelectedDataInput
}) => {
  return (
    <div className="table__row edit-row">
      <div className="table__cell">{selectedDataInput.name}</div>
      <div className="table__cell">
        <Input
          onChange={path =>
            setSelectedDataInput({ ...selectedDataInput, path: path })
          }
          type="text"
          value={selectedDataInput.path}
        />
      </div>
      <div className="table__cell">
        <button
          className="apply-edit-btn"
          onClick={() => handleEdit(null, true)}
        >
          <Checkmark />
        </button>
      </div>
    </div>
  )
}

EditableDataInputsRow.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  selectedDataInput: PropTypes.shape({}).isRequired,
  setSelectedDataInput: PropTypes.func.isRequired
}

export default EditableDataInputsRow
