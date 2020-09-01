import _, { isEmpty } from 'lodash'
import { panelActions } from './panelReducer'
import { parseDefaultContent } from '../../utils/parseDefaultContent'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

export const getDefaultData = functionParameters => {
  const parameters = functionParameters
    .filter(parameter => parameter.type !== 'DataItem')
    .map(parameter => ({
      doc: parameter.doc,
      isDefault: true,
      data: {
        name: parameter.name ?? '',
        valueType: parameter.type ?? '',
        parameterType: 'Simple',
        value: parameter.default ?? ''
      }
    }))

  const dataInputs = functionParameters
    .filter(dataInputs => dataInputs.type === 'DataItem')
    .map(input => ({
      doc: input.doc,
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

export const getMethodOptions = selectedFunctions => {
  return _.chain(selectedFunctions)
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

export const getVersionOptions = selectedFunctions => {
  const versionOptions = _.unionBy(
    selectedFunctions.map(func => {
      return {
        label:
          (func.metadata.tag === 'latest' ? '$' : '') +
          (func.metadata.tag || '$latest'),
        id: func.metadata.tag || 'latest'
      }
    }),
    'id'
  )

  return versionOptions.length
    ? versionOptions
    : [{ label: '$latest', id: 'latest' }]
}

export const getDefaultMethodAndVersion = (
  versionOptions,
  selectedFunctions
) => {
  const defaultMethod = selectedFunctions.find(
    item => item.metadata.tag === 'latest'
  )?.spec.default_handler

  const defaultVersion = !versionOptions.length
    ? versionOptions[0].id
    : versionOptions.find(version => version.id === 'latest').id

  return {
    defaultMethod,
    defaultVersion
  }
}

export const generateTableData = (
  method,
  selectedFunction,
  panelDispatch,
  setNewJob
) => {
  const functionParameters = getParameters(selectedFunction, method)

  if (!isEmpty(functionParameters)) {
    const { parameters, dataInputs } = getDefaultData(functionParameters)
    const volumeMounts = getVolumeMounts(selectedFunction)
    const volumes = getVolume(selectedFunction)

    panelDispatch({
      type: panelActions.SET_TABLE_DATA,
      payload: {
        dataInputs: dataInputs,
        parameters,
        volume_mounts: volumeMounts,
        volumes,
        environmentVariables: [],
        secretSources: []
      }
    })
    setNewJob({
      inputs: parseDefaultContent(dataInputs),
      parameters: parseDefaultContent(parameters),
      volume_mounts: volumeMounts.length
        ? volumeMounts.map(volumeMounts => volumeMounts.data)
        : [],
      volumes,
      environmentVariables: [],
      secret_sources: []
    })
  }
}

export const validateCronString = cronString => {
  let errorMessage = ''
  const cron = cronString.split(' ').map(dataItem => {
    if (
      dataItem.length > 2 ||
      dataItem.match(/(\*+\d)/) ||
      dataItem.match(/(\d\*+)/)
    ) {
      errorMessage = 'Please add spaces after values'
    }

    if (dataItem !== '' && dataItem <= 0) {
      errorMessage = 'Value must be greater than zero'
    }

    if (dataItem === '') dataItem = '*'

    if (!Number(dataItem) && dataItem !== '*')
      errorMessage = 'Value must be a number'

    return dataItem
  })

  if (cron.length > 5) {
    errorMessage = 'Unsupported value'
  }

  if (cron[0] > 59) {
    errorMessage = 'Unsupported value for minutes'
  } else if (cron[1] > 24) {
    errorMessage = 'Unsupported value for hours'
  } else if (cron[2] > 31) {
    errorMessage = 'Unsupported value for days of a month'
  } else if (cron[3] > 12) {
    errorMessage = 'Unsupported value for month'
  } else if (cron[4] > 7) {
    errorMessage = 'Unsupported value for week days'
  }

  return {
    cron,
    errorMessage
  }
}
export const generateRequestData = (
  jobsStore,
  cronString,
  panelState,
  project,
  labels,
  match,
  selectedFunction,
  isFunctionTemplate
) => {
  const func = isFunctionTemplate
    ? `hub://${selectedFunction.metadata.name.replace(/-/g, '_')}`
    : `${match.params.projectName}/${selectedFunction.metadata.name}@${selectedFunction.metadata.hash}`
  const resources = {
    limits: {},
    requests: {}
  }

  if (!isEveryObjectValueEmpty(panelState.limits)) {
    for (let key in panelState.limits) {
      if (panelState.limits[key].length > 0) {
        resources.limits[key] = panelState.limits[key]
      }
    }
  }

  if (!isEveryObjectValueEmpty(panelState.requests)) {
    for (let key in panelState.requests) {
      if (panelState.requests[key].length > 0) {
        resources.requests[key] = panelState.requests[key]
      }
    }
  }

  return {
    ...jobsStore.newJob,
    schedule: cronString,
    function: {
      ...jobsStore.newJob.function,
      spec: {
        ...jobsStore.newJob.function.spec,
        resources
      }
    },
    task: {
      ...jobsStore.newJob.task,
      metadata: {
        name: panelState.currentFunctionInfo.name,
        project,
        labels
      },
      spec: {
        ...jobsStore.newJob.task.spec,
        output_path: panelState.outputPath,
        input_path: panelState.inputPath,
        function: func,
        handler: panelState.currentFunctionInfo.method
      }
    }
  }
}
