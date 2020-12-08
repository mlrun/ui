export const editHyperParams = (hyperParams, selectedParameter, newName) => {
  if (newName) {
    if (hyperParams[selectedParameter.name]) {
      return {
        ...hyperParams,
        [newName]: `${selectedParameter.value}`.split(',')
      }
    } else {
      delete hyperParams[selectedParameter.name]

      hyperParams[newName] = `${selectedParameter.value}`.split(',')

      return { ...hyperParams }
    }
  } else if (hyperParams[selectedParameter.name]) {
    hyperParams[selectedParameter.name] = `${selectedParameter.value}`.split(
      ','
    )

    return { ...hyperParams }
  } else {
    return {
      ...hyperParams,
      [selectedParameter.name]: `${selectedParameter.value}`.split(',')
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
      label: 'string',
      id: 'string'
    },
    {
      label: 'number',
      id: 'number'
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
