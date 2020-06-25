import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'
import Select from '../../common/Select/Select'
import { selectOptions } from '../../components/JobsPanelAdvanced/jobsPanelAdvanced.util'

const EditableAdvancedRow = ({
  handleEdit,
  match,
  selectedItem,
  setSelectedItem,
  table
}) => {
  const dataValue = table === 'env' ? 'value' : 'source'

  return (
    <div className="table__row edit-row">
      <div className="table__cell table__cell_edit">
        {table === 'env' ? (
          <Input
            onChange={name =>
              setSelectedItem({
                ...selectedItem,
                newName: name
              })
            }
            type="text"
            value={selectedItem.newName || selectedItem.data.name}
          />
        ) : (
          <Select
            match={match}
            onClick={kind =>
              setSelectedItem({
                ...selectedItem,
                newKind: kind
              })
            }
            label={
              selectedItem.newKind
                ? selectedItem.newKind
                : selectedItem.data.kind
            }
            options={selectOptions.secretKind}
          />
        )}
      </div>
      <div className="table__cell table__cell_edit">
        <Input
          onChange={value =>
            setSelectedItem({
              ...selectedItem,
              data: { ...selectedItem.data, [dataValue]: value }
            })
          }
          type="text"
          value={selectedItem.data[dataValue]}
        />
      </div>
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
  match: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  table: PropTypes.string.isRequired
}

export default EditableAdvancedRow
