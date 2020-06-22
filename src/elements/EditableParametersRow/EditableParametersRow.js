import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import { selectOptions as selectOption } from '../../components/JobsPanelParameters/jobsPanelParameters.util'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableParametersRow = ({
  handleEdit,
  match,
  selectedParameter,
  setSelectedParameter
}) => {
  return (
    <div className="table__row edit-row">
      <div className="table__cell table__cell_disabled">
        <div className="data-ellipsis">{selectedParameter.data.name}</div>
      </div>
      <div className="table__cell table__cell_disabled">
        {selectedParameter.data.valueType}
      </div>
      <div className="table__cell table__cell_edit">
        <Select
          label={selectedParameter.data.parameterType}
          match={match}
          onClick={parameterType =>
            setSelectedParameter({
              ...selectedParameter.data,
              data: {
                ...selectedParameter.data,
                parameterType: parameterType
              }
            })
          }
          options={selectOption.parameterType}
        />
      </div>
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
  selectedParameter: PropTypes.shape({}).isRequired,
  setSelectedParameter: PropTypes.func.isRequired
}

export default EditableParametersRow
