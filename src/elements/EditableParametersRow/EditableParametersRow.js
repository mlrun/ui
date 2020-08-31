import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import { selectOptions as selectOption } from '../../components/JobsPanelParameters/jobsPanelParameters.util'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableParametersRow = ({
  disabledOptions,
  handleEdit,
  match,
  selectedParameter,
  setSelectedParameter
}) => {
  return (
    <div className="table__row edit-row">
      {selectedParameter.isDefault ? (
        <>
          <div className="table__cell table__cell_disabled">
            <div className="data-ellipsis">{selectedParameter.data.name}</div>
          </div>
          <div className="table__cell table__cell_disabled">
            <div className="data-ellipsis">
              {selectedParameter.data.valueType}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="table__cell table__cell_edit">
            <Input
              onChange={name => {
                setSelectedParameter({
                  ...selectedParameter,
                  newName: name
                })
              }}
              type="text"
              value={selectedParameter.newName || selectedParameter.data.name}
            />
          </div>
          <div className="table__cell table__cell_edit">
            <Select
              label={selectedParameter.data.valueType}
              onClick={valueType =>
                setSelectedParameter({
                  ...selectedParameter.data,
                  data: {
                    ...selectedParameter.data,
                    valueType: valueType
                  }
                })
              }
              options={selectOption.parametersValueType}
            />
          </div>
        </>
      )}
      <div className="table__cell table__cell_edit">
        <Select
          disabledOptions={disabledOptions}
          label={selectedParameter.data.parameterType}
          onClick={parameterType =>
            setSelectedParameter({
              ...selectedParameter.data,
              data: { ...selectedParameter.data, parameterType: parameterType }
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
          value={`${selectedParameter.data.value}`}
        />
      </div>
      <div className="table__cell table__cell-actions">
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
  disabledOptions: PropTypes.array,
  handleEdit: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  selectedParameter: PropTypes.shape({}).isRequired,
  setSelectedParameter: PropTypes.func.isRequired
}

export default EditableParametersRow
