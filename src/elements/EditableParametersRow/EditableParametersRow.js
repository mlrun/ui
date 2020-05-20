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
      <div className="table__cell">{selectedParameter.name}</div>
      <div className="table__cell">{selectedParameter.type}</div>
      <div className="table__cell">
        <Input
          onChange={value =>
            setSelectedParameter({ ...selectedParameter, value: value })
          }
          type="text"
          value={selectedParameter.value}
        />
      </div>
      <div className="table__cell">
        <Select
          label={selectedParameter.simple}
          match={match}
          onClick={simple =>
            setSelectedParameter({ ...selectedParameter, simple: simple })
          }
          options={selectOption.parameterType}
        />
      </div>
      <div className="table__cell">
        <button className="apply-edit-btn" onClick={handleEdit}>
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
