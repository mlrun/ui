import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableParametersRow = ({
  handleEdit,
  match,
  selectOption,
  selectedParameter,
  setSelectedParameter
}) => {
  return (
    <div className="table__row edit-row">
      <div className="table__cell">
        <div className="data-ellipsis">{selectedParameter.data.name}</div>
      </div>
      <div className="table__cell">{selectedParameter.data.type}</div>
      <div className="table__cell table__cell_edit">
        <Input
          onChange={value => {
            setSelectedParameter({
              ...selectedParameter,
              data: {
                ...selectedParameter.data,
                value: value
              }
            })
          }}
          type="text"
          value={selectedParameter.data.value}
        />
      </div>
      <div className="table__cell table__cell_edit">
        <Select
          label={selectedParameter.data.simple}
          match={match}
          onClick={simple =>
            setSelectedParameter({
              ...selectedParameter.data,
              data: {
                ...selectedParameter.data,
                simple: simple
              }
            })
          }
          options={selectOption.parameterType}
        />
      </div>
      <div className="table__cell cell-btn-wrapper">
        <button
          className="apply-edit-btn"
          onClick={() => handleEdit(selectedParameter, false)}
        >
          <Checkmark />
        </button>
      </div>
    </div>
  )
}

EditableParametersRow.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  selectOption: PropTypes.shape({}).isRequired,
  selectedParameter: PropTypes.shape({}).isRequired,
  setSelectedParameter: PropTypes.func.isRequired
}

export default EditableParametersRow
