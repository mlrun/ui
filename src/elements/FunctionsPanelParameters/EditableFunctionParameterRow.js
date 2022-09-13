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
import React from 'react'
import PropTypes from 'prop-types'

import CheckBox from '../../common/CheckBox/CheckBox'
import Input from '../../common/Input/Input'
import RangeInput from '../../common/RangeInput/RangeInput'
import Select from '../../common/Select/Select'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import {
  BOOLEAN_TYPE,
  isEditableParameterValid,
  isNameNotUnique,
  NUMBER_TYPE,
  parameterTypeOptions
} from './functionsPanelParameters.util'

import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark.svg'

const EditableFunctionParameterRow = ({
  handleEdit,
  parameters,
  selectedParameter,
  setSelectedParameter,
  setValidation,
  validation
}) => {
  return (
    <div className="table__row edit-row">
      <div className="table__cell table__cell_edit">
        <Input
          floatingLabel
          invalid={
            (selectedParameter.newName !== selectedParameter.data.name &&
              isNameNotUnique(selectedParameter.newName, parameters)) ||
            !validation.isEditNameValid
          }
          invalidText={
            isNameNotUnique(selectedParameter.newName, parameters)
              ? 'Name already exists'
              : 'This field is invalid'
          }
          label="Name"
          onChange={name => {
            setSelectedParameter({
              ...selectedParameter,
              newName: name
            })
          }}
          required
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isEditNameValid: value
            }))
          }
          type="text"
          value={selectedParameter.newName ?? selectedParameter.data.name}
        />
      </div>
      <div className="table__cell table__cell_edit">
        <Select
          onClick={type =>
            setSelectedParameter(state => ({
              ...state,
              data: {
                ...state.data,
                type,
                value: type === BOOLEAN_TYPE ? 'false' : ''
              }
            }))
          }
          options={parameterTypeOptions}
          selectedId={selectedParameter.data.type}
        />
      </div>
      <div className="table__cell table__cell_edit">
        {selectedParameter.data.type === BOOLEAN_TYPE ? (
          <CheckBox
            className="parameter-value"
            item={{ id: 'true' }}
            onChange={value => {
              setSelectedParameter(state => ({
                ...state,
                data: {
                  ...state.data,
                  value: value === state.data.value ? 'false' : value
                }
              }))
            }}
            selectedId={selectedParameter.data.value}
          />
        ) : selectedParameter.data.type === NUMBER_TYPE ? (
          <RangeInput
            density="normal"
            label="Value"
            labelType="floatingLabel"
            onChange={value =>
              setSelectedParameter(state => ({
                ...state,
                data: {
                  ...state.data,
                  value
                }
              }))
            }
            required
            value={selectedParameter.data.value}
          />
        ) : (
          <Input
            floatingLabel
            invalid={!validation.isEditValueValid}
            label="Value"
            onChange={value => {
              setSelectedParameter({
                ...selectedParameter,
                data: {
                  ...selectedParameter.data,
                  value
                }
              })
            }}
            required
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isEditValueValid: value
              }))
            }
            type="text"
            value={selectedParameter.data.value}
          />
        )}
      </div>
      <div className="table__cell table__cell-actions">
        <button
          className="apply-edit-btn"
          disabled={!isEditableParameterValid(selectedParameter, parameters)}
          onClick={handleEdit}
        >
          <Tooltip template={<TextTooltipTemplate text="Apply" />}>
            <Checkmark />
          </Tooltip>
        </button>
      </div>
    </div>
  )
}

EditableFunctionParameterRow.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  parameters: PropTypes.array.isRequired,
  selectedParameter: PropTypes.shape({}).isRequired,
  setSelectedParameter: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default EditableFunctionParameterRow
