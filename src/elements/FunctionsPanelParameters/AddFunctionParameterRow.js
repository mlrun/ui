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
  isParameterValid,
  NUMBER_TYPE,
  parameterTypeOptions
} from './functionsPanelParameters.util'

import { ReactComponent as Plus } from '../../images/plus.svg'

const AddFunctionParameterRow = ({
  handleAddNewParameter,
  newParameter,
  parameters,
  setNewParameter
}) => {
  return (
    <div className="table__body">
      <div className="table__body-column">
        <div className="input-row-wrapper">
          <Input
            className="input-row__item"
            floatingLabel
            invalid={isNameNotUnique(newParameter.name, parameters)}
            invalidText="Name already exists"
            label="Name"
            onChange={name => setNewParameter(state => ({ ...state, name }))}
            required
            requiredText="This field is required"
            type="text"
          />
          <Select
            className="parameter-type"
            onClick={type =>
              setNewParameter(state => ({
                ...state,
                type,
                value: type === BOOLEAN_TYPE ? 'false' : ''
              }))
            }
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
              label="Value"
              labelType="floatingLabel"
              onChange={value =>
                setNewParameter(state => ({ ...state, value }))
              }
              required
              value={newParameter.value}
            />
          ) : (
            <Input
              className="input-row__item"
              floatingLabel
              label="Value"
              onChange={value =>
                setNewParameter(state => ({ ...state, value }))
              }
              required
              requiredText="This field is required"
              type="text"
            />
          )}
        </div>
      </div>
      <button
        className="add-input btn-add"
        disabled={
          isNameNotUnique(newParameter.name, parameters) ||
          !isParameterValid(newParameter)
        }
        onClick={handleAddNewParameter}
      >
        <Tooltip template={<TextTooltipTemplate text="Add item" />}>
          <Plus />
        </Tooltip>
      </button>
    </div>
  )
}

AddFunctionParameterRow.propTypes = {
  handleAddNewParameter: PropTypes.func.isRequired,
  newParameter: PropTypes.shape({}).isRequired,
  parameters: PropTypes.arrayOf().isRequired,
  setNewParameter: PropTypes.func.isRequired
}

export default AddFunctionParameterRow
