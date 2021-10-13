import React from 'react'
import { isNil } from 'lodash'
import {
  ENV_VARIABLE_TYPE_SECRET,
  ENV_VARIABLE_TYPE_VALUE
} from '../../constants'

export const SECRET_KEY = 'secretKey'
export const SECRET_NAME = 'secretName'

export const tableHeaders = [
  { label: 'Name', id: 'name', className: 'table-cell__key' },
  { label: 'Type', id: 'type', className: 'table-cell__type' },
  { label: 'Value', id: 'value', className: 'table-cell__value' }
]

export const validationInitialState = {
  isNameValid: true,
  isValueValid: true,
  isSecretKeyValid: true,
  isSecretNameValid: true
}

export const newVariableInitialState = {
  name: '',
  type: 'value',
  value: '',
  secretName: '',
  secretKey: ''
}

export const selectTypeOptions = [
  { label: 'Value', id: ENV_VARIABLE_TYPE_VALUE },
  { label: 'Secret', id: ENV_VARIABLE_TYPE_SECRET }
]

export const isNameNotUnique = (name, variables) => {
  return variables.some(variable => variable.name === name)
}

export const isEditableEnvVariableValid = (
  envVariable,
  envVariables,
  validation
) => {
  if (!isNil(envVariable.newName) && envVariable.newName !== envVariable.name) {
    return (
      envVariable.newName.length > 0 &&
      !isNameNotUnique(envVariable.newName, envVariables) &&
      (envVariable.value.length > 0 || envVariable.secretName.length > 0)
    )
  } else {
    return envVariable.type === ENV_VARIABLE_TYPE_VALUE ||
      (envVariable.type === ENV_VARIABLE_TYPE_SECRET && !envVariable.secretName)
      ? validation.isValueValid && envVariable.value.length > 0
      : validation.isSecretNameValid &&
          envVariable.secretName.length > 0 &&
          validation.isSecretKeyValid
  }
}

export const secretNameValidationTip = (
  <>
    <span>&bull; Valid characters: A-Z, a-z, 0-9, -, _, .</span>
    <br />
    <span>&bull; Must begin and end with: A-Z, a-z, 0-9</span>
    <br />
    <span>&bull; No consecutive characters: .., .–, –.</span>
    <br />
    <span>&bull; Max length between two periods: 63</span>
    <br />
    <span>&bull; Length - max: 253</span>
  </>
)

export const secretKeyValidationTip = (
  <>
    <span>&bull; Valid characters: A-Z, a-z, 0-9, -, _, .</span>
    <br />
    <span>&bull; Must not start with: ..</span>
    <br />
    <span>&bull; Must not be: ., ..</span>
    <br />
    <span>&bull; Length - max: 253</span>
  </>
)
