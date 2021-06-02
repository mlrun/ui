import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import { selectOptions as selectOption } from '../../components/JobsPanelParameters/jobsPanelParameters.util'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableParametersRow = ({
  content,
  disabledOptions,
  handleEdit,
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
              density="dense"
              onChange={name => {
                setSelectedParameter({
                  ...selectedParameter,
                  newName: name
                })
              }}
              required={
                selectedParameter.newName !== selectedParameter.data.name &&
                isNameNotUnique(selectedParameter.newName, content)
              }
              requiredText="Name already exists"
              type="text"
              value={selectedParameter.newName ?? selectedParameter.data.name}
            />
          </div>
          <div className="table__cell table__cell_edit">
            <Select
              density="dense"
              label={selectedParameter.data.valueType}
              onClick={valueType =>
                setSelectedParameter({
                  ...selectedParameter,
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
          density="dense"
          disabledOptions={disabledOptions}
          label={selectedParameter.data.parameterType}
          onClick={parameterType =>
            setSelectedParameter({
              ...selectedParameter,
              data: { ...selectedParameter.data, parameterType: parameterType }
            })
          }
          options={selectOption.parameterType}
        />
      </div>
      <div className="table__cell table__cell_edit">
        <Input
          density="dense"
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
          disabled={
            selectedParameter.newName !== selectedParameter.data.name &&
            isNameNotUnique(selectedParameter.newName, content)
          }
          onClick={() => handleEdit(selectedParameter, false)}
        >
          <Checkmark />
        </button>
      </div>
    </div>
  )
}

EditableParametersRow.propTypes = {
  content: PropTypes.array.isRequired,
  disabledOptions: PropTypes.array,
  handleEdit: PropTypes.func.isRequired,
  selectedParameter: PropTypes.shape({}).isRequired,
  setSelectedParameter: PropTypes.func.isRequired
}

export default EditableParametersRow
