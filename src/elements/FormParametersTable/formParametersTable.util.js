export const getParameterTypeOptions = paramFile => {
  return [
    { label: 'Simple', id: 'Simple' },
    { label: 'Hyper', id: 'Hyper', disabled: Boolean(paramFile) }
  ]
}

export const parameterTypeList = 'list'
export const parameterTypeMap = 'map'

export const parametersValueTypeOptions = [
  {
    label: 'str',
    id: 'str'
  },
  {
    label: 'int',
    id: 'int'
  },
  {
    label: 'float',
    id: 'float'
  },
  {
    label: 'bool',
    id: 'bool'
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
