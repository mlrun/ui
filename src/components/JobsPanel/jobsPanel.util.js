import _ from 'lodash'

export const getDefaultData = functionParameters => {
  const parameters = functionParameters
    .filter(parameter => parameter.type !== 'DataItem')
    .map(parameter => ({
      doc: parameter.doc,
      isValueEmpty: !parameter.default,
      isDefault: true,
      data: {
        name: parameter.name ?? '',
        type: parameter.type ?? '',
        value: parameter.default ?? '',
        simple: ''
      }
    }))

  const dataInputs = functionParameters
    .filter(dataInputs => dataInputs.type === 'DataItem')
    .map(input => ({
      doc: input.doc,
      isValueEmpty: !input.path,
      isDefault: true,
      data: {
        name: input.name,
        path: input.path ?? ''
      }
    }))

  return { parameters, dataInputs }
}

export const getParameters = selectedFunction =>
  _.chain(selectedFunction)
    .map(func =>
      func.spec.entry_points ? Object.values(func.spec.entry_points) : []
    )
    .flatten()
    .map(entry_points => entry_points.parameters)
    .flatten()
    .uniqBy('name')
    .value()
