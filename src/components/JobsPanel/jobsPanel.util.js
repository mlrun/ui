import { chain, isEmpty, unionBy } from 'lodash'
import { panelActions } from './panelReducer'
import { parseDefaultContent } from '../../utils/parseDefaultContent'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

export const getDefaultData = functionParameters => {
  const parameters = functionParameters
    .filter(parameter => parameter.type !== 'DataItem')
    .map(parameter => ({
      doc: parameter.doc,
      isChecked: true,
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
    .map(input => {
      const inputPath = {
        pathType: input.path?.replace(/:\/\/.*$/g, '://') ?? ''
      }

      inputPath.value = input.path?.replace(/.*:\/\//g, '') ?? ''

      return {
        doc: input.doc,
        isDefault: true,
        data: {
          name: input.name,
          path: {
            ...inputPath
          }
        }
      }
    })

  return { parameters, dataInputs }
}

export const getParameters = (selectedFunction, method) => {
  return chain(selectedFunction)
    .map(func => {
      return func.spec.entry_points
        ? func.spec.entry_points[method]?.parameters ?? []
        : []
    })
    .flatten()
    .unionBy('name')
    .value()
}
export const getResources = selectedFunction => {
  return chain(selectedFunction)
    .map(func => {
      return func.spec.resources ?? {}
    })
    .flatten()
    .unionBy('name')
    .value()
}

export const getEnvironmentVariables = selectedFunction => {
  return chain(selectedFunction)
    .map(func => {
      return func.spec.env ?? {}
    })
    .flatten()
    .unionBy('name')
    .value()
}

export const getVolumeMounts = selectedFunction => {
  if (!selectedFunction.some(func => func.spec.volume_mounts)) {
    return []
  }

  return chain(selectedFunction)
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

  return chain(selectedFunction)
    .map(func => func.spec.volumes)
    .flatten()
    .unionBy('name')
    .value()
}

export const getMethodOptions = selectedFunctions => {
  return chain(selectedFunctions)
    .map(func => Object.values(func.spec?.entry_points ?? {}))
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
  const versionOptions = unionBy(
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

  const defaultVersion =
    versionOptions.length === 1
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
  setNewJob,
  stateLimits,
  stateRequests
) => {
  const functionParameters = getParameters(selectedFunction, method)
  const [{ limits, requests }] = getResources(selectedFunction)
  const environmentVariables = getEnvironmentVariables(selectedFunction)

  if (
    limits?.memory?.match(/[a-zA-Z]/) ||
    requests?.memory?.match(/[a-zA-Z]/)
  ) {
    const limitsMemoryUnit = limits.memory.replace(/\d+/g, '') + 'B'
    const requestsMemoryUnit = requests.memory.replace(/\d+/g, '') + 'B'

    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: limitsMemoryUnit || requestsMemoryUnit
    })
  } else if (limits?.memory?.length > 0 || requests?.memory?.length > 0) {
    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: 'Bytes'
    })
  }

  if (limits?.cpu?.match(/m/) || requests?.cpu?.match(/m/)) {
    panelDispatch({
      type: panelActions.SET_CPU_UNIT,
      payload: 'millicpu'
    })
  } else if (limits?.cpu?.length > 0 || requests?.cpu?.length > 0) {
    panelDispatch({
      type: panelActions.SET_CPU_UNIT,
      payload: 'cpu'
    })
  }

  if (!isEmpty(functionParameters)) {
    const { parameters, dataInputs } = getDefaultData(functionParameters)
    const volumeMounts = getVolumeMounts(selectedFunction)
    const volumes = getVolume(selectedFunction)

    panelDispatch({
      type: panelActions.SET_TABLE_DATA,
      payload: {
        dataInputs,
        parameters,
        volume_mounts: volumeMounts,
        volumes,
        environmentVariables: environmentVariables.map(env => ({
          data: {
            name: env.name,
            value: env.value ?? ''
          }
        })),
        secretSources: []
      }
    })
    setNewJob({
      inputs: parseDefaultDataInputsContent(dataInputs),
      parameters: parseDefaultContent(parameters),
      volume_mounts: volumeMounts.length
        ? volumeMounts.map(volumeMounts => volumeMounts.data)
        : [],
      volumes,
      environmentVariables,
      secret_sources: []
    })
  }

  if (limits && !isEveryObjectValueEmpty(limits)) {
    panelDispatch({
      type: panelActions.SET_LIMITS,
      payload: {
        ...stateLimits,
        ...limits
      }
    })
  }

  if (requests && !isEveryObjectValueEmpty(requests)) {
    panelDispatch({
      type: panelActions.SET_REQUESTS,
      payload: { ...stateRequests, ...requests }
    })
  }
}

const generateDefaultParameters = parameters => {
  return parameters.map(([key, value]) => ({
    isChecked: true,
    isDefault: true,
    data: {
      name: key ?? '',
      valueType: getParameterType(value),
      parameterType: 'Simple',
      value: value
    }
  }))
}

const generateDefaultDataInputs = dataInputs => {
  return dataInputs.map(([key, value]) => {
    const inputPath = {
      pathType: value?.replace(/:\/\/.*$/g, '://') ?? ''
    }

    inputPath.value = value?.replace(/.*:\/\//g, '') ?? ''

    return {
      isDefault: true,
      data: {
        name: key,
        path: {
          ...inputPath
        }
      }
    }
  })
}

const parameterTypes = {
  string: 'str',
  number: 'int',
  bool: 'bool'
}

const getParameterType = parameter => {
  return typeof parameter === 'string' && parameter.match(',')
    ? 'list'
    : typeof parameter === 'number' && parameter % 1 !== 0
    ? 'float'
    : parameterTypes[typeof parameter] ?? ''
}

export const generateTableDataFromDefaultData = (
  defaultData,
  panelDispatch,
  panelLimits,
  panelRequests,
  setNewJob,
  setDefaultDataIsLoaded
) => {
  const parameters = generateDefaultParameters(
    Object.entries(defaultData.task.spec.parameters ?? {})
  )
  const dataInputs = generateDefaultDataInputs(
    Object.entries(defaultData.task.spec.inputs ?? {})
  )
  const { limits, requests } = defaultData.function?.spec.resources ?? {
    limits: {},
    requests: {}
  }
  const secrets = (defaultData.task.spec.secret_sources ?? []).map(secret => ({
    data: secret
  }))
  const volumeMounts = defaultData.function?.spec.volume_mounts.map(
    volume_mounts => {
      return {
        data: {
          name: volume_mounts?.name,
          mountPath: volume_mounts?.mountPath
        },
        isDefault: true
      }
    }
  )

  if (
    limits?.memory?.match(/[a-zA-Z]/) ||
    requests?.memory?.match(/[a-zA-Z]/)
  ) {
    const limitsMemoryUnit = limits.memory.replace(/\d+/g, '') + 'B'
    const requestsMemoryUnit = requests.memory.replace(/\d+/g, '') + 'B'

    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: limitsMemoryUnit || requestsMemoryUnit
    })
  } else if (limits?.memory?.length > 0 || requests?.memory?.length > 0) {
    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: 'Bytes'
    })
  }

  if (limits?.cpu?.match(/m/) || requests?.cpu?.match(/m/)) {
    panelDispatch({
      type: panelActions.SET_CPU_UNIT,
      payload: 'millicpu'
    })
  } else if (limits?.cpu?.length > 0 || requests?.cpu?.length > 0) {
    panelDispatch({
      type: panelActions.SET_CPU_UNIT,
      payload: 'cpu'
    })
  }

  panelDispatch({
    type: panelActions.SET_TABLE_DATA,
    payload: {
      dataInputs,
      parameters,
      volume_mounts: volumeMounts ?? [],
      volumes: defaultData.function?.spec.volumes ?? [],
      environmentVariables:
        defaultData.function?.spec.env.map(env => ({
          data: {
            name: env.name,
            value: env.value ?? ''
          }
        })) ?? [],
      secretSources: secrets
    }
  })
  setNewJob({
    inputs: parseDefaultDataInputsContent(dataInputs),
    parameters: parseDefaultContent(parameters),
    volume_mounts: volumeMounts?.length
      ? volumeMounts.map(volumeMounts => volumeMounts.data)
      : [],
    volumes: defaultData.function?.spec.volumes ?? [],
    environmentVariables: defaultData.function?.spec.env ?? [],
    secret_sources: defaultData.task.spec.secret_sources ?? []
  })

  if (limits) {
    panelDispatch({
      type: panelActions.SET_LIMITS,
      payload: {
        ...panelLimits,
        ...limits
      }
    })
  }

  if (requests) {
    panelDispatch({
      type: panelActions.SET_REQUESTS,
      payload: {
        ...panelRequests,
        ...requests
      }
    })
  }

  setDefaultDataIsLoaded(true)
}

export const generateRequestData = (
  jobsStore,
  cronString,
  panelState,
  project,
  labels,
  match,
  selectedFunction,
  isFunctionTemplate,
  defaultFunc
) => {
  const func = defaultFunc
    ? defaultFunc
    : isFunctionTemplate
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

  const spec = {
    ...jobsStore.newJob.task.spec,
    function: func,
    handler: panelState.currentFunctionInfo.method,
    input_path: panelState.inputPath,
    output_path: panelState.outputPath
  }

  if (jobsStore.newJob.task.spec.selector.result.length > 0) {
    spec.selector = `${jobsStore.newJob.task.spec.selector.criteria}.${jobsStore.newJob.task.spec.selector.result}`
  } else {
    delete spec.selector
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
      spec
    }
  }
}

export const parseDefaultDataInputsContent = inputs => {
  return inputs.reduce((prev, curr) => {
    return {
      ...prev,
      [curr.data.name]: `${curr.data.path.pathType}${curr.data.path.value}`
    }
  }, {})
}

export const isNameNotUnique = (newName, content) => {
  return content.some(item => newName === item?.data.name && newName !== '')
}
