/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useRef, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { selectOptions as selectOption } from '../../components/JobsPanelParameters/jobsPanelParameters.util'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'
import { SELECT_OPTIONS } from '../../types'

import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark.svg'

const EditableParametersRow = ({
  content,
  handleEdit,
  parameterTypeOptions,
  selectedParameter,
  setEditItem,
  setSelectedParameter
}) => {
  const [validation, setValidation] = useState({
    isNameValid: true,
    isValueValid: true
  })
  const tableRowRef = useRef(null)

  const nameIsNotUnique = isNameNotUnique(selectedParameter.newName, content)

  const handleDocumentClick = useCallback(
    event => {
      if (!tableRowRef.current?.contains(event.target)) {
        setEditItem(false)
        setSelectedParameter({})
      }
    },
    [setEditItem, setSelectedParameter]
  )

  useEffect(() => {
    if (tableRowRef.current) {
      window.addEventListener('click', handleDocumentClick)

      return () => {
        window.removeEventListener('click', handleDocumentClick)
      }
    }
  }, [handleDocumentClick, tableRowRef])

  return (
    <div className="table__row edit-row" ref={tableRowRef}>
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
              invalid={
                (selectedParameter.newName !== selectedParameter.data.name &&
                  nameIsNotUnique) ||
                !validation.isNameValid
              }
              invalidText={
                nameIsNotUnique
                  ? 'Name already exists'
                  : 'This field is invalid'
              }
              onChange={name => {
                setSelectedParameter({
                  ...selectedParameter,
                  newName: name
                })
              }}
              setInvalid={value =>
                setValidation(state => ({
                  ...state,
                  isNameValid: value
                }))
              }
              type="text"
              value={selectedParameter.newName ?? selectedParameter.data.name}
              required
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
          label={selectedParameter.data.parameterType}
          onClick={parameterType =>
            setSelectedParameter({
              ...selectedParameter,
              data: { ...selectedParameter.data, parameterType: parameterType }
            })
          }
          options={parameterTypeOptions}
        />
      </div>
      <div className="table__cell table__cell_edit">
        <Input
          density="dense"
          invalid={!validation.isValueValid}
          onChange={value => {
            setSelectedParameter({
              ...selectedParameter,
              data: {
                ...selectedParameter.data,
                value: value
              }
            })
          }}
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isValueValid: value
            }))
          }
          type="text"
          value={`${selectedParameter.data.value}`}
          required
        />
      </div>
      <div className="table__cell table__cell-actions">
        <button
          className="apply-edit-btn"
          disabled={
            (selectedParameter.newName !== selectedParameter.data.name &&
              nameIsNotUnique) ||
            !validation.isNameValid ||
            !validation.isValueValid
          }
          onClick={() => handleEdit(selectedParameter, false)}
        >
          <Tooltip template={<TextTooltipTemplate text="Apply" />}>
            <Checkmark />
          </Tooltip>
        </button>
      </div>
    </div>
  )
}

EditableParametersRow.propTypes = {
  content: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  parameterTypeOptions: SELECT_OPTIONS.isRequired,
  selectedParameter: PropTypes.shape({}).isRequired,
  setEditItem: PropTypes.func.isRequired,
  setSelectedParameter: PropTypes.func.isRequired
}

export default EditableParametersRow
