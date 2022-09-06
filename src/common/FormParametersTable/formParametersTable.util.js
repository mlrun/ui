export const getParameterTypeOptions = paramFile => {
  return [
    { label: 'Simple', id: 'Simple' },
    { label: 'Hyper', id: 'Hyper', disabled: Boolean(paramFile) }
  ]
}

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
    id: 'list'
  },
  {
    label: 'map',
    id: 'map'
  }
]
