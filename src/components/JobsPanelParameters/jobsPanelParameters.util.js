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
      [selectedParameter.name]: `${selectedParameter.value}`.split(',')
    }
  }
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
