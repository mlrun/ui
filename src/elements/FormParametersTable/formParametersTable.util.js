import { PARAMETER_TYPE_HYPER, PARAMETER_TYPE_SIMPLE } from '../../constants'

export const getParameterTypeOptions = paramFile => {
  return [
    { label: 'Simple', id: PARAMETER_TYPE_SIMPLE },
    { label: 'Hyper', id: PARAMETER_TYPE_HYPER, disabled: Boolean(paramFile) }
  ]
}

export const parameterTypeStr = 'str'
export const parameterTypeInt = 'int'
export const parameterTypeFloat = 'float'
export const parameterTypeBool = 'bool'
export const parameterTypeList = 'list'
export const parameterTypeMap = 'map'

export const parametersValueTypeOptions = [
  {
    label: 'str',
    id: parameterTypeStr
  },
  {
    label: 'int',
    id: parameterTypeInt
  },
  {
    label: 'float',
    id: parameterTypeFloat
  },
  {
    label: 'bool',
    id: parameterTypeBool
  },
  {
    label: 'list',
    id: parameterTypeList
  },
  {
    label: 'map',
    id: parameterTypeMap
  }
]
