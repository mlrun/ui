import { chain, isEmpty, unionBy } from 'lodash'
import { panelActions } from './panelReducer'
import { parseDefaultContent } from '../../utils/parseDefaultContent'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { getVolumeType } from '../../utils/panelResources.util'
import { PANEL_DEFAULT_ACCESS_KEY, PANEL_EDIT_MODE } from '../../constants'
import { generateEnvVariable } from '../../utils/generateEnvironmentVariable'
import { parseEnvVariables } from '../../utils/parseEnvironmentVariables'

export const REQUESTS = 'REQUESTS'
export const LIMITS = 'LIMITS'

export const getParameters = functionParameters => {
  return functionParameters
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
}

export const getDataInputs = functionParameters => {
  return functionParameters
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
}

export const getFunctionParameters = (selectedFunction, method) => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.entry_points
        ? func.spec.entry_points[method]?.parameters ?? []
        : []
    })
    .flatten()
    .unionBy('name')
    .value()
}

export const getLimits = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.resources?.limits ?? {}
    })
    .filter(limits => !isEveryObjectValueEmpty(limits))
    .flatten()
    .unionBy('name')
    .value()
}

export const getRequests = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.resources?.requests ?? {}
    })
    .filter(request => !isEveryObjectValueEmpty(request))
    .flatten()
    .unionBy('name')
    .value()
}

export const getEnvironmentVariables = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.env ?? []
    })
    .flatten()
    .unionBy('name')
    .value()
}

export const getNodeSelectors = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.node_selector ?? {}
    })
    .flatten()
    .unionBy('key')
    .map(selector => {
      return Object.entries(selector)
    })
    .flatten()
    .map(([key, value]) => {
      return {
        key,
        value
      }
    })
    .value()
}

export const getVolumeMounts = (selectedFunction, volumes, mode) => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => func.spec.volume_mounts ?? [])
    .flatten()
    .unionBy('name')
    .map(volume_mounts => {
      const currentVolume = volumes.find(
        volume => volume.name === volume_mounts?.name
      )

      return {
        data: {
          type: getVolumeType(currentVolume),
          name: volume_mounts?.name,
          mountPath: volume_mounts?.mountPath
        },
        isDefault: true,
        canBeModified: mode === PANEL_EDIT_MODE
      }
    })
    .value()
}

export const getVolumes = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => func.spec.volumes ?? [])
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
  stateRequests,
  mode
) => {
  const functionParameters = getFunctionParameters(selectedFunction, method)
  const [limits] = getLimits(selectedFunction)
  const [requests] = getRequests(selectedFunction)
  const environmentVariables = getEnvironmentVariables(selectedFunction)
  const node_selector = getNodeSelectors(selectedFunction)
  const volumes = getVolumes(selectedFunction)
  const volumeMounts = getVolumeMounts(selectedFunction, volumes, mode)
  let parameters = []
  let dataInputs = []

  if (limits?.memory?.match(/[a-zA-Z]/)) {
    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: `${limits.memory.replace(/\d+/g, '')}B`
    })
  } else if (requests?.memory?.match(/[a-zA-Z]/)) {
    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: `${requests.memory.replace(/\d+/g, '')}B`
    })
  } else if (limits?.memory?.length > 0 || requests?.memory?.length > 0) {
    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: 'Bytes'
    })
  }

  if (limits?.cpu?.match?.(/m/) || requests?.cpu?.match?.(/m/)) {
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
    parameters = getParameters(functionParameters)
    dataInputs = getDataInputs(functionParameters)
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

  panelDispatch({
    type: panelActions.SET_TABLE_DATA,
    payload: {
      dataInputs,
      parameters,
      volume_mounts: volumeMounts,
      volumes,
      environmentVariables: parseEnvVariables(environmentVariables).map(
        env => ({
          data: generateEnvVariable(env)
        })
      ),
      secretSources: [],
      node_selector
    }
  })
  panelDispatch({
    type: panelActions.SET_ACCESS_KEY,
    payload: PANEL_DEFAULT_ACCESS_KEY
  })
  setNewJob({
    access_key: PANEL_DEFAULT_ACCESS_KEY,
    inputs: parseDefaultDataInputsContent(dataInputs),
    parameters: parseDefaultContent(parameters),
    volume_mounts: (volumeMounts ?? []).map(volumeMounts => ({
      name: volumeMounts.data.name,
      mountPath: volumeMounts.data.mountPath
    })),
    volumes,
    environmentVariables,
    secret_sources: [],
    node_selector: parseDefaultNodeSelectorContent(node_selector)
  })
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
  setDefaultDataIsLoaded,
  mode
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
        isDefault: true,
        canBeModified: mode === PANEL_EDIT_MODE
      }
    }
  )

  if (limits?.memory?.match(/[a-zA-Z]/)) {
    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: `${limits.memory.replace(/\d+/g, '')}B`
    })
  } else if (requests?.memory?.match(/[a-zA-Z]/)) {
    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: `${requests.memory.replace(/\d+/g, '')}B`
    })
  } else if (limits?.memory?.length > 0 || requests?.memory?.length > 0) {
    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: 'Bytes'
    })
  }

  if (limits?.cpu?.match?.(/m/) || requests?.cpu?.match?.(/m/)) {
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
        parseEnvVariables(defaultData.function?.spec.env ?? []).map(env => ({
          data: generateEnvVariable(env)
        })) ?? [],
      secretSources: secrets,
      node_selector: Object.entries(
        defaultData.function?.spec.node_selector ?? {}
      ).map(([key, value]) => ({
        key,
        value
      }))
    }
  })
  panelDispatch({
    type: panelActions.SET_ACCESS_KEY,
    payload: defaultData.credentials?.access_key || PANEL_DEFAULT_ACCESS_KEY
  })
  setNewJob({
    access_key: defaultData.credentials?.access_key || PANEL_DEFAULT_ACCESS_KEY,
    inputs: defaultData.task.spec.inputs ?? {},
    parameters: defaultData.task.spec.parameters ?? {},
    volume_mounts: volumeMounts?.length
      ? volumeMounts.map(volumeMounts => ({
          name: volumeMounts.data.name,
          mountPath: volumeMounts.data.mountPath
        }))
      : [],
    volumes: defaultData.function?.spec.volumes ?? [],
    environmentVariables: defaultData.function?.spec.env ?? [],
    secret_sources: defaultData.task.spec.secret_sources ?? [],
    node_selector: defaultData.function?.spec.node_selector ?? {}
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
  defaultFunc,
  mode,
  defaultHandler
) => {
  const func = isFunctionTemplate
    ? `hub://${selectedFunction.metadata.name.replace(/-/g, '_')}`
    : defaultFunc ??
      `${match.params.projectName}/${selectedFunction.metadata.name}@${selectedFunction.metadata.hash}`
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

  const taskSpec = {
    ...jobsStore.newJob.task.spec,
    function: func,
    handler:
      mode === PANEL_EDIT_MODE
        ? defaultHandler
        : panelState.currentFunctionInfo.method,
    input_path: panelState.inputPath,
    output_path: panelState.outputPath
  }

  if (jobsStore.newJob.task.spec.selector.result.length > 0) {
    taskSpec.selector = `${jobsStore.newJob.task.spec.selector.criteria}.${jobsStore.newJob.task.spec.selector.result}`
  } else {
    delete taskSpec.selector
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
      spec: { ...taskSpec }
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

export const parseDefaultNodeSelectorContent = nodeSelector => {
  return nodeSelector.reduce((prev, curr) => {
    return {
      ...prev,
      [curr.key]: curr.value
    }
  }, {})
}

export const isNameNotUnique = (newName, content) => {
  return content.some(item => newName === item?.data.name && newName !== '')
}
