import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableAdvancedRow = ({
  handleEdit,
  selectedItem,
  setSelectedItem,
  table
}) => {
  const dataName = table === 'env' ? 'name' : 'kind'
  const dataValue = table === 'env' ? 'value' : 'source'

  return (
    <div className="table__row edit-row">
      <div className="table__cell">
        <div className="data-ellipsis">{selectedItem.data[dataName].label}</div>
      </div>
      {selectedItem.data[dataValue].isEdit ? (
        <div className="table__cell table__cell_edit">
          <Input
            onChange={value =>
              setSelectedItem({
                ...selectedItem,
                data: {
                  ...selectedItem.data,
                  [dataValue]: {
                    ...selectedItem.data[dataValue],
                    label: value
                  }
                }
              })
            }
            type="text"
            value={selectedItem.data[dataValue].label}
          />
        </div>
      ) : (
        <div className="table__cell table__cell_disabled">
          <div className="data-ellipsis">
            {selectedItem.data[dataValue].label}
          </div>
        </div>
      )}
      <div className="table__cell table__cell-actions">
        <button
          className="apply-edit-btn"
          onClick={() => handleEdit(selectedItem.data, table === 'env')}
        >
          <Checkmark />
        </button>
      </div>
    </div>
  )
}

EditableAdvancedRow.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  table: PropTypes.string.isRequired
}

export default EditableAdvancedRow
