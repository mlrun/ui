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
  isNameNotUnique,
  NUMBER_TYPE,
  parameterTypeOptions
} from './functionsPanelParameters.util'

import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

const AddFunctionParameterRow = ({
  discardChanges,
  handleAddNewParameter,
  newParameter,
  parameters,
  setNewParameter,
  setValidation,
  validation
}) => {
  return (
    <div className="table__body">
      <div className="table__body-column">
        <div className="input-row-wrapper">
          <Input
            className="input-row__item"
            floatingLabel
            invalid={
              isNameNotUnique(newParameter.name, parameters) ||
              !validation.isNameValid
            }
            invalidText={
              isNameNotUnique(newParameter.name, parameters)
                ? 'Name already exists'
                : 'This field is invalid'
            }
            label="Name"
            onChange={name => setNewParameter(state => ({ ...state, name }))}
            required
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isNameValid: value
              }))
            }
          />
          <Select
            className="parameter-type"
            onClick={type => {
              setNewParameter(state => ({
                ...state,
                type,
                value: type === BOOLEAN_TYPE ? 'false' : ''
              }))
              setValidation({
                isNameValid: true,
                isValueValid: true
              })
            }}
            options={parameterTypeOptions}
            selectedId={newParameter.type}
          />
          {newParameter.type === BOOLEAN_TYPE ? (
            <CheckBox
              className="parameter-value"
              item={{ id: 'true' }}
              onChange={value => {
                setNewParameter(state => ({
                  ...state,
                  value: value === state.value ? 'false' : value
                }))
              }}
              selectedId={newParameter.value}
            />
          ) : newParameter.type === NUMBER_TYPE ? (
            <RangeInput
              density="normal"
              invalid={!validation.isValueValid}
              label="Value"
              labelType="floatingLabel"
              onChange={value => {
                setValidation(state => ({
                  ...state,
                  isValueValid: String(value).length > 0
                }))
                setNewParameter(state => ({ ...state, value }))
              }}
              required
              requiredText="This field is required"
              value={newParameter.value}
            />
          ) : (
            <Input
              className="input-row__item"
              floatingLabel
              invalid={!validation.isValueValid}
              label="Value"
              onChange={value =>
                setNewParameter(state => ({ ...state, value }))
              }
              setInvalid={value =>
                setValidation(state => ({
                  ...state,
                  isValueValid: value
                }))
              }
              required
            />
          )}
        </div>
      </div>
      <button
        className="parameters-table__btn btn-add"
        disabled={isNameNotUnique(newParameter.name, parameters)}
        onClick={handleAddNewParameter}
      >
        <Tooltip template={<TextTooltipTemplate text="Add item" />}>
          <Plus />
        </Tooltip>
      </button>
      <button onClick={discardChanges} className="parameters-table__btn">
        <Tooltip template={<TextTooltipTemplate text="Discard changes" />}>
          <Delete />
        </Tooltip>
      </button>
    </div>
  )
}

AddFunctionParameterRow.propTypes = {
  discardChanges: PropTypes.func.isRequired,
  handleAddNewParameter: PropTypes.func.isRequired,
  newParameter: PropTypes.shape({}).isRequired,
  parameters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setNewParameter: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default AddFunctionParameterRow
