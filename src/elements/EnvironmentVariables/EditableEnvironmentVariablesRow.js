import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import {
  isEditableEnvVariableValid,
  isNameNotUnique,
  secretKeyValidationTip,
  secretNameValidationTip,
  selectTypeOptions
} from './environmentVariables.util'
import {
  ENV_VARIABLE_TYPE_SECRET,
  ENV_VARIABLE_TYPE_VALUE
} from '../../constants'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableEnvironmentVariablesRow = ({
  editEnvVariable,
  envVariables,
  selectedEnvVariable,
  setSelectedEnvVariable
}) => {
  const [secretName, setSecretName] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [validation, setValidation] = useState({
    isNameValid: true,
    isValueValid: true,
    isSecretNameValid: true,
    isSecretKeyValid: true
  })

  useEffect(() => {
    if (selectedEnvVariable.type === ENV_VARIABLE_TYPE_SECRET) {
      const [name, key] = selectedEnvVariable.value.split(':')

      setSecretName(name)
      setSecretKey(key)
    }
  }, [selectedEnvVariable.type, selectedEnvVariable.value])

  return (
    <div className="table__row edit-row">
      <div className="table-cell table-cell__key">
        <Input
          floatingLabel
          invalid={
            (selectedEnvVariable.newName !== selectedEnvVariable.name &&
              isNameNotUnique(selectedEnvVariable.newName, envVariables)) ||
            !validation.isNameValid
          }
          invalidText={
            isNameNotUnique(selectedEnvVariable.newName, envVariables)
              ? 'Name already exists'
              : 'This field is invalid'
          }
          label="Name"
          onChange={name => {
            setSelectedEnvVariable({
              ...selectedEnvVariable,
              newName: name
            })
          }}
          required
          setInvalid={value =>
            setValidation(prevState => ({ ...prevState, isNameValid: value }))
          }
          type="text"
          value={selectedEnvVariable.newName ?? selectedEnvVariable.name}
        />
      </div>
      <div className="table-cell table-cell__type">
        <Select
          onClick={type => {
            setSelectedEnvVariable(state => ({
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
          selectedId={selectedEnvVariable.type}
        />
      </div>
      <div className="table-cell table-cell__value">
        {selectedEnvVariable.type === ENV_VARIABLE_TYPE_SECRET && (
          <div className="table-cell__secret">
            <Input
              floatingLabel
              invalid={!validation.isSecretNameValid}
              label="Secret Name"
              onChange={secretName =>
                setSelectedEnvVariable(state => ({ ...state, secretName }))
              }
              pattern="^(?=[\S\s]{1,253}$)[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?)*$"
              required
              setInvalid={value =>
                setValidation(state => ({ ...state, isSecretNameValid: value }))
              }
              tip={secretNameValidationTip}
              value={secretName}
            />
            <Input
              floatingLabel
              invalid={!validation.isSecretKeyValid}
              label="Secret Key"
              onChange={secretKey =>
                setSelectedEnvVariable(state => ({ ...state, secretKey }))
              }
              pattern="^(?=[\S\s]{1,253}$)(?!\.$)(?!\.\.[\S\s]*$)[-._a-zA-Z0-9]+$"
              setInvalid={value =>
                setValidation(state => ({ ...state, isSecretKeyValid: value }))
              }
              tip={secretKeyValidationTip}
              value={secretKey}
            />
          </div>
        )}
        {selectedEnvVariable.type === ENV_VARIABLE_TYPE_VALUE && (
          <Input
            floatingLabel
            invalid={!validation.isValueValid}
            label="Value"
            onChange={value =>
              setSelectedEnvVariable(state => ({ ...state, value }))
            }
            required
            setInvalid={value =>
              setValidation(state => ({ ...state, isValueValid: value }))
            }
            value={selectedEnvVariable.value}
          />
        )}
      </div>
      <div className="table__cell table__cell-actions">
        <button
          className="apply-edit-btn"
          disabled={
            !isEditableEnvVariableValid(
              selectedEnvVariable,
              envVariables,
              validation
            )
          }
          onClick={editEnvVariable}
        >
          <Checkmark />
        </button>
      </div>
    </div>
  )
}

EditableEnvironmentVariablesRow.propTypes = {
  editEnvVariable: PropTypes.func.isRequired,
  envVariables: PropTypes.array.isRequired,
  selectedEnvVariable: PropTypes.shape({}).isRequired,
  setSelectedEnvVariable: PropTypes.func.isRequired
}

export default EditableEnvironmentVariablesRow
