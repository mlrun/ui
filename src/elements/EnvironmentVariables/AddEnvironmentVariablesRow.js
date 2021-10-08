import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import {
  isNameNotUnique,
  secretKeyValidationTip,
  secretNameValidationTip,
  selectTypeOptions
} from './environmentVariables.util'
import { ENV_VARIABLE_TYPE_SECRET } from '../../constants'

import { ReactComponent as Delete } from '../../images/delete.svg'
import { ReactComponent as Plus } from '../../images/plus.svg'

const AddEnvironmentVariablesRow = ({
  addEnvVariable,
  discardChanges,
  envVariables,
  newEnvVariable,
  setNewEnvVariable,
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
              isNameNotUnique(newEnvVariable.name, envVariables) ||
              !validation.isNameValid
            }
            invalidText={
              isNameNotUnique(newEnvVariable.name, envVariables)
                ? 'Name already exists'
                : 'This field is invalid'
            }
            label="Name"
            onChange={name => setNewEnvVariable(state => ({ ...state, name }))}
            required
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isNameValid: value
              }))
            }
          />
          <Select
            onClick={type => {
              setNewEnvVariable(state => ({
                ...state,
                type,
                value: '',
                secretName: '',
                secretKey: ''
              }))
              setValidation(prevState => ({
                ...prevState,
                isNameValid: true,
                isValueValid: true,
                isSecretKeyValid: true,
                isSecretNameValid: true
              }))
            }}
            options={selectTypeOptions}
            selectedId={newEnvVariable.type}
          />
          {newEnvVariable.type === ENV_VARIABLE_TYPE_SECRET ? (
            <div className="input-row__item-secret">
              <Input
                className="secret-item"
                floatingLabel
                invalid={!validation.isSecretNameValid}
                label="Secret Name"
                onChange={secretName =>
                  setNewEnvVariable(state => ({ ...state, secretName }))
                }
                pattern="^(?=[\S\s]{1,253}$)[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?)*$"
                required
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isSecretNameValid: value
                  }))
                }
                tip={secretNameValidationTip}
              />
              <Input
                className="secret-item"
                floatingLabel
                invalid={!validation.isSecretKeyValid}
                label="Secret Key"
                onChange={secretKey =>
                  setNewEnvVariable(state => ({ ...state, secretKey }))
                }
                pattern="^(?=[\S\s]{1,253}$)(?!\.$)(?!\.\.[\S\s]*$)[-._a-zA-Z0-9]+$"
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isSecretKeyValid: value
                  }))
                }
                tip={secretKeyValidationTip}
              />
            </div>
          ) : (
            <Input
              className="input-row__item"
              floatingLabel
              invalid={!validation.isValueValid}
              label="Value"
              onChange={value =>
                setNewEnvVariable(state => ({ ...state, value }))
              }
              required
              setInvalid={value =>
                setValidation(state => ({
                  ...state,
                  isValueValid: value
                }))
              }
            />
          )}
        </div>
      </div>
      <button
        className="variables-table__btn btn-add"
        disabled={isNameNotUnique(newEnvVariable.name, envVariables)}
        onClick={addEnvVariable}
      >
        <Tooltip template={<TextTooltipTemplate text="Add item" />}>
          <Plus />
        </Tooltip>
      </button>
      <button onClick={discardChanges} className="variables-table__btn">
        <Tooltip template={<TextTooltipTemplate text="Discard changes" />}>
          <Delete />
        </Tooltip>
      </button>
    </div>
  )
}

AddEnvironmentVariablesRow.propTypes = {
  addEnvVariable: PropTypes.func.isRequired,
  discardChanges: PropTypes.func.isRequired,
  envVariables: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  newEnvVariable: PropTypes.shape({}).isRequired,
  setNewEnvVariable: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default AddEnvironmentVariablesRow
