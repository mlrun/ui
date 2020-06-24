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
      <div className="table__cell">
        <div className="data-ellipsis">{selectedDataInput.data.name.label}</div>
      </div>
      <div className="table__cell table__cell_edit">
        <Input
          onChange={path =>
            setSelectedDataInput({
              ...selectedDataInput,
              data: {
                ...selectedDataInput.data,
                path: {
                  ...selectedDataInput.data.path,
                  label: path
                }
              }
            })
          }
          type="text"
          value={selectedDataInput.data.path.label}
        />
      </div>
      <div className="table__cell table__cell-actions">
        <button
          className="apply-edit-btn"
          onClick={() => handleEdit(selectedDataInput.data, true)}
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
