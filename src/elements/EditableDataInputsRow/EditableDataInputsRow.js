import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableDataInputsRow = ({
  handleEdit,
  isDefault,
  selectedDataInput,
  setSelectedDataInput
}) => {
  return (
    <div className="table__row edit-row">
      {isDefault ? (
        <div className="table__cell table__cell_disabled">
          <div className="data-ellipsis">{selectedDataInput.data.name}</div>
        </div>
      ) : (
        <div className="table__cell table__cell_edit">
          <Input
            onChange={name =>
              setSelectedDataInput({
                ...selectedDataInput,
                newDataInputName: name
              })
            }
            type="text"
            value={
              selectedDataInput.newDataInputName || selectedDataInput.data.name
            }
          />
        </div>
      )}
      <div className="table__cell table__cell_edit">
        <Input
          onChange={path =>
            setSelectedDataInput({
              ...selectedDataInput,
              data: { ...selectedDataInput.data, path: path }
            })
          }
          type="text"
          value={selectedDataInput.data.path}
        />
      </div>
      <div className="table__cell table__cell-actions">
        <button
          className="apply-edit-btn"
          onClick={() => handleEdit(selectedDataInput, true)}
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
