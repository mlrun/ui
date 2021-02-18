export const convertParamValue = (value, type) =>
  ['int', 'float', 'number'].includes(type) && Number.isFinite(Number(value))
    ? Number(value)
    : type === 'bool' && value.toLowerCase() === 'true'
    ? true
    : type === 'bool' && value.toLowerCase() === 'false'
    ? false
    : String(value)

export const editHyperParams = (hyperParams, selectedParameter, newName) => {
  if (newName) {
    if (hyperParams[selectedParameter.name]) {
      return {
        ...hyperParams,
        [newName]: selectedParameter.value.split(',')
      }
    } else {
      delete hyperParams[selectedParameter.name]
      hyperParams[newName] = selectedParameter.value.split(',')

      return { ...hyperParams }
    }
  } else if (hyperParams[selectedParameter.name]) {
    hyperParams[selectedParameter.name] = selectedParameter.value.split(',')

    return { ...hyperParams }
  } else {
    return {
      ...hyperParams,
      [selectedParameter.name]: selectedParameter.value.split(',')
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
  ]
}
