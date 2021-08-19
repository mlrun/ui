import { isNil } from 'lodash'
import { stringToBoolean } from '../../utils/stringToBoolean'

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
      !isNameNotUnique(parameter.newName, parameters)
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
        [key]: stringToBoolean(parameter.value)
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
