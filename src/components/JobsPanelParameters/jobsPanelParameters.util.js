export const editHyperParams = (hyperParams, selectedParameter) => {
  if (hyperParams[selectedParameter.name.label]) {
    hyperParams[
      selectedParameter.name.label
    ] = selectedParameter.value.label.split(',')

    return { ...hyperParams }
  } else {
    return {
      ...hyperParams,
      [selectedParameter.name.label]: selectedParameter.value.label.split(',')
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
  ]
}
