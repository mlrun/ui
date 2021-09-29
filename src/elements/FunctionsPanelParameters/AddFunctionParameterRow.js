import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import CheckBox from '../../common/CheckBox/CheckBox'
import RangeInput from '../../common/RangeInput/RangeInput'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import {
  BOOLEAN_TYPE,
  isNameNotUnique,
  NUMBER_TYPE,
  parameterTypeOptions
} from './functionsPanelParameters.util'

import { ReactComponent as Plus } from '../../images/plus.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

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
