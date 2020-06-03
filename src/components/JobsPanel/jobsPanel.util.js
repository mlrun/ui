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

export const getParameters = (selectedFunction, method) => {
  return _.chain(selectedFunction)
    .map(func => {
      return func.spec.entry_points
        ? func.spec.entry_points[method]?.parameters ?? []
        : []
    })
    .flatten()
    .unionBy('name')
    .value()
}

export const getVolumeMounts = selectedFunction => {
  if (!selectedFunction.some(func => func.spec.volume_mounts)) {
    return []
  }

  return _.chain(selectedFunction)
    .map(func => func.spec.volume_mounts)
    .flatten()
    .unionBy('name')
    .map(volume_mounts => {
      return {
        data: {
          name: volume_mounts?.name,
          mountPath: volume_mounts?.mountPath
        },
        isValueEmpty: !volume_mounts?.mountPath,
        isDefault: true
      }
    })
    .value()
}

export const getVolume = selectedFunction => {
  if (!selectedFunction.some(func => func.spec.volumes)) {
    return []
  }

  return _.chain(selectedFunction)
    .map(func => func.spec.volumes)
    .flatten()
    .unionBy('name')
    .value()
}

export const getMethodOptions = selectedFunction => {
  return _.chain(selectedFunction)
    .map(func =>
      func.spec.entry_points ? Object.values(func.spec.entry_points) : []
    )
    .flatten()
    .map(entry_point => ({
      label: entry_point.name,
      id: entry_point.name,
      subLabel: entry_point.doc
    }))
    .uniqBy('label')
    .value()
}

export const getVersionOptions = selectedFunction => {
  return _.unionBy(
    selectedFunction.map(func => {
      return {
        label:
          (func.metadata.tag === 'latest' ? '$' : '') +
          (func.metadata.tag || '$latest'),
        id: func.metadata.tag || 'latest'
      }
    }),
    'id'
  )
}

export const getDefaultMethodAndVersion = (
  versionOptions,
  selectedFunction
) => {
  versionOptions = versionOptions.length
    ? [{ label: '$latest', id: 'latest' }]
    : versionOptions

  const defaultMethod = selectedFunction.find(
    item => item.metadata.tag === 'latest'
  )?.spec.default_handler

  const defaultVersion = versionOptions.length
    ? versionOptions[0].id
    : versionOptions.find(version => version.id === 'latest')

  return {
    defaultMethod,
    defaultVersion
  }
}
