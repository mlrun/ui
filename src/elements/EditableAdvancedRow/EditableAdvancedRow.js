import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableAdvancedRow = ({
  handleEdit,
  selectedEnvironmentVariable,
  setSelectedEnvironmentVariable,
  table
}) => {
  const selectedItem = table === 'env' ? selectedEnvironmentVariable : ''
  const setSelectedItem =
    table === 'env' ? setSelectedEnvironmentVariable : null

  return (
    <div className="table__row edit-row">
      <div className="table__cell">
        <div className="data-ellipsis">{selectedItem.data.name}</div>
      </div>
      <div className="table__cell table__cell_edit">
        <Input
          onChange={value =>
            setSelectedItem({
              ...selectedItem,
              data: { ...selectedItem.data, value: value }
            })
          }
          type="text"
          value={selectedItem.data.value}
        />
      </div>
      <div className="table__cell table__cell-actions">
        <button
          className="apply-edit-btn"
          onClick={() => handleEdit(selectedItem.data, true)}
        >
          <Checkmark />
        </button>
      </div>
    </div>
  )
}

EditableAdvancedRow.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  selectedEnvironmentVariable: PropTypes.shape({}).isRequired,
  setSelectedEnvironmentVariable: PropTypes.func.isRequired,
  table: PropTypes.string.isRequired
}

export default EditableAdvancedRow
