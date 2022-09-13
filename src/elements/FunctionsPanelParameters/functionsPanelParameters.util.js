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
import { isNil } from 'lodash'

export const STRING_TYPE = 'string'
export const NUMBER_TYPE = 'number'
export const BOOLEAN_TYPE = 'boolean'
export const JSON_TYPE = 'json'

export const parameterTypeOptions = [
  { label: 'String', id: STRING_TYPE },
  { label: 'Number', id: NUMBER_TYPE },
  { label: 'Boolean', id: BOOLEAN_TYPE },
  { label: 'JSON', id: JSON_TYPE }
]

export const tableHeaders = [
  { label: 'Name', id: 'name' },
  { label: 'Type', id: 'type' },
  { label: 'Value', id: 'value' }
]

export const isNameNotUnique = (name, parameters) => {
  return parameters.some(route => route.data.name === name)
}

export const isParameterValid = parameter => {
  return parameter.name.length > 0 && String(parameter.value).length > 0
}

export const isEditableParameterValid = (parameter, parameters) => {
  if (!isNil(parameter.newName) && parameter.newName !== parameter.data.name) {
    return (
      parameter.newName.length > 0 &&
      !isNameNotUnique(parameter.newName, parameters) &&
      String(parameter.value).length > 0
    )
  } else {
    return isParameterValid(parameter.data)
  }
}

export const setFunctionParameters = (
  parameter,
  key,
  setNewFunctionParameters,
  parameters
) => {
  switch (parameter.type) {
    case NUMBER_TYPE:
      setNewFunctionParameters({
        ...parameters,
        [key]: Number(parameter.value)
      })
      break
    case BOOLEAN_TYPE:
      setNewFunctionParameters({
        ...parameters,
        [key]: parameter.value !== 'false'
      })
      break
    case JSON_TYPE:
      setNewFunctionParameters({
        ...parameters,
        [key]: JSON.parse(parameter.value)
      })
      break
    default:
      setNewFunctionParameters({
        ...parameters,
        [key]: parameter.value
      })
  }
}

export const getParameterType = parameterValue => {
  switch (typeof parameterValue) {
    case STRING_TYPE:
      return STRING_TYPE
    case NUMBER_TYPE:
      return NUMBER_TYPE
    case BOOLEAN_TYPE:
      return BOOLEAN_TYPE
    default:
      return JSON_TYPE
  }
}

export const validationInitialState = {
  isNameValid: true,
  isValueValid: true,
  isEditNameValid: true,
  isEditValueValid: true
}

export const newParameterInitialState = {
  name: '',
  type: 'string',
  value: ''
}
