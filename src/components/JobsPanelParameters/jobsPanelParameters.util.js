export const convertParamValue = (value, type) =>
  ['int', 'float', 'number'].includes(type) && Number.isFinite(Number(value))
    ? Number(value)
    : type === 'bool' && value.toLowerCase() === 'true'
    ? true
    : type === 'bool' && value.toLowerCase() === 'false'
    ? false
    : String(value)

export const editHyperParams = (
  hyperParams,
  selectedParameter,
  newName,
  convertedValue
) => {
  const value =
    typeof convertedValue === 'string'
      ? convertedValue.split(',')
      : [convertedValue]

  if (newName) {
    if (hyperParams[selectedParameter.name]) {
      return {
        ...hyperParams,
        [newName]: value
      }
    } else {
      delete hyperParams[selectedParameter.name]
      hyperParams[newName] = value

      return { ...hyperParams }
    }
  } else if (hyperParams[selectedParameter.name]) {
    hyperParams[selectedParameter.name] = value

    return { ...hyperParams }
  } else {
    return {
      ...hyperParams,
      [selectedParameter.name]: value
    }
  }
}

export const generateTableData = parameters => {
  const content = {
    predefined: [],
    custom: []
  }

  parameters.forEach(parameter => {
    if (parameter.isDefault && !content.predefined.includes(parameter)) {
      content.predefined.push(parameter)
    } else if (!parameter.isDefault && !content.custom.includes(parameter)) {
      content.custom.push(parameter)
    }
  })

  return content
}

export const selectOptions = {
  parameterType: [
    { label: 'Simple', id: 'Simple' },
    { label: 'Hyper', id: 'Hyper' }
  ],
  parametersValueType: [
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
  ],
  hyperStrategyType: [
    {
      label: 'List',
      id: 'list'
    },
    {
      label: 'Grid',
      id: 'grid'
    },
    {
      label: 'Random',
      id: 'random'
    }
  ],
  selectorCriteria: [
    {
      label: 'Max',
      id: 'max'
    },
    {
      label: 'Min',
      id: 'min'
    }
  ]
}

export const setHyperParams = (data, hyperparams, setNewJobHyperParameters) => {
  const value = convertParamValue(data.value, data.valueType)

  setNewJobHyperParameters({
    ...hyperparams,
    [data.name]: typeof value === 'string' ? value.split(',') : [value]
  })
}
