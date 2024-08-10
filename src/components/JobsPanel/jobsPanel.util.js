/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { chain, isEmpty, unionBy, isEqual, cloneDeep } from 'lodash'
import { panelActions } from './panelReducer'
import { parseDefaultContent } from '../../utils/parseDefaultContent'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import {
  getDefaultCpuUnit,
  getDefaultMemoryUnit,
  getLimitsGpuType,
  getVolumeType
} from '../../utils/panelResources.util'
import {
  JOB_DEFAULT_OUTPUT_PATH,
  PANEL_DEFAULT_ACCESS_KEY,
  PANEL_EDIT_MODE,
  TAG_LATEST
} from '../../constants'
import { parameterTypeFloat, parameterTypeList } from '../../elements/FormParametersTable/formParametersTable.util'
import { generateEnvVariable } from '../../utils/generateEnvironmentVariable'
import { parseEnvVariables } from '../../utils/parseEnvironmentVariables'
import { getPreemptionMode } from '../../utils/getPreemptionMode'

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
      return func.spec.entry_points ? func.spec.entry_points[method]?.parameters ?? [] : []
    })
    .flatten()
    .unionBy('name')
    .value()
}

export const getFunctionPriorityClass = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.priority_class_name
    })
    .flatten()
    .unionBy('name')
    .value()
}

export const getLimits = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.resources?.limits ? func.spec.resources?.limits : {}
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
      return func.spec.resources?.requests ? func.spec.resources.requests : {}
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

export const getFunctionPreemptionMode = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.preemption_mode ?? ''
    })
    .flatten()
    .unionBy('key')
    .value()
}

export const getVolumeMounts = (selectedFunction, volumes, mode) => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => func.spec.volume_mounts ?? [])
    .flatten()
    .unionBy('name')
    .map(volume_mounts => {
      const currentVolume = volumes.find(volume => volume.name === volume_mounts?.name)

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
        label: func.metadata.tag || TAG_LATEST,
        id: func.metadata.tag || TAG_LATEST
      }
    }),
    'id'
  )

  return versionOptions.length ? versionOptions : [{ label: 'latest', id: TAG_LATEST }]
}

export const getDefaultMethodAndVersion = (versionOptions, selectedFunctions) => {
  const defaultMethod = selectedFunctions.find(item => item.metadata.tag === TAG_LATEST)?.spec
    .default_handler

  const defaultVersion =
    versionOptions.length === 1
      ? versionOptions[0].id
      : versionOptions.find(version => version.id === TAG_LATEST).id

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
  mode,
  frontendSpec
) => {
  const defaultResources = frontendSpec?.default_function_pod_resources ?? {}
  const functionParameters = getFunctionParameters(selectedFunction, method)
  const [functionPriorityClassName] = getFunctionPriorityClass(selectedFunction)
  const [limits] = getLimits(selectedFunction)
  const [requests] = getRequests(selectedFunction)
  const environmentVariables = getEnvironmentVariables(selectedFunction)
  const [preemptionMode] = getFunctionPreemptionMode(selectedFunction)
  const jobPriorityClassName =
    functionPriorityClassName || frontendSpec.default_function_priority_class_name || ''
  const node_selector = getNodeSelectors(selectedFunction)
  const volumes = getVolumes(selectedFunction)
  const volumeMounts = getVolumeMounts(selectedFunction, volumes, mode)
  const gpuType = getLimitsGpuType(limits)
  let parameters = []
  let dataInputs = []
  const currentLimits = {
    ...stateLimits,
    ...limits,
    cpu: limits?.cpu ?? defaultResources.limits?.cpu ?? '',
    cpuUnit: getDefaultCpuUnit(limits ?? {}, defaultResources?.limits.cpu),
    memory: limits?.memory ?? defaultResources.limits?.memory ?? '',
    memoryUnit: getDefaultMemoryUnit(limits ?? {}, defaultResources?.limits.memory),
    [gpuType]: limits?.[gpuType] ?? defaultResources?.limits.gpu ?? ''
  }
  const currentRequest = {
    ...stateRequests,
    cpu: requests?.cpu ?? defaultResources.requests?.cpu ?? '',
    cpuUnit: getDefaultCpuUnit(requests ?? {}, defaultResources?.requests.cpu),
    memory: requests?.memory ?? defaultResources.requests?.memory ?? '',
    memoryUnit: getDefaultMemoryUnit(requests ?? {}, defaultResources?.requests.memory)
  }

  panelDispatch({
    type: panelActions.SET_PREEMPTION_MODE,
    payload: getPreemptionMode(
      frontendSpec.feature_flags?.preemption_nodes,
      preemptionMode,
      frontendSpec.default_function_preemption_mode
    )
  })

  if (jobPriorityClassName) {
    panelDispatch({
      type: panelActions.SET_PRIORITY_CLASS_NAME,
      payload: jobPriorityClassName
    })
  }

  if (!isEmpty(functionParameters)) {
    parameters = getParameters(functionParameters)
    dataInputs = getDataInputs(functionParameters)
  }

  if (!isEqual(stateLimits, currentLimits)) {
    panelDispatch({
      type: panelActions.SET_LIMITS,
      payload: currentLimits
    })
  }

  if (!isEqual(stateRequests, currentRequest)) {
    panelDispatch({
      type: panelActions.SET_REQUESTS,
      payload: currentRequest
    })
  }

  panelDispatch({
    type: panelActions.SET_TABLE_DATA,
    payload: {
      dataInputs,
      parameters,
      volume_mounts: volumeMounts,
      volumes,
      environmentVariables: parseEnvVariables(environmentVariables).map(env => ({
        data: generateEnvVariable(env)
      })),
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
      mountPath: volumeMounts.data.mountPath,
      subPath: volumeMounts.data.subPath
    })),
    volumes,
    environmentVariables,
    secret_sources: [],
    node_selector: parseDefaultNodeSelectorContent(node_selector),
    preemption_mode: preemptionMode ?? '',
    priority_class_name: jobPriorityClassName ?? ''
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
  boolean: 'bool'
}

const getParameterType = parameter => {
  return typeof parameter === 'string' && parameter.match(',')
    ? parameterTypeList
    : typeof parameter === 'number' && parameter % 1 !== 0
    ? parameterTypeFloat
    : parameterTypes[typeof parameter] ?? ''
}

export const generateTableDataFromDefaultData = (
  defaultData,
  panelDispatch,
  panelLimits,
  panelRequests,
  setNewJob,
  setDefaultDataIsLoaded,
  mode,
  defaultResources
) => {
  const parameters = generateDefaultParameters(
    Object.entries(defaultData.task.spec.parameters ?? {})
  )
  const dataInputs = generateDefaultDataInputs(Object.entries(defaultData.task.spec.inputs ?? {}))
  const funcSpec = defaultData.function?.spec
  const limits = funcSpec?.resources?.limits ?? {}
  const requests = funcSpec?.resources?.requests ?? {}
  const secrets = (defaultData.task.spec.secret_sources ?? []).map(secret => ({
    data: secret
  }))
  const volumeMounts = defaultData.function?.spec?.volume_mounts.map(volume_mounts => {
    return {
      data: {
        name: volume_mounts?.name,
        mountPath: volume_mounts?.mountPath,
        subPath: volume_mounts?.subPath
      },
      isDefault: true,
      canBeModified: mode === PANEL_EDIT_MODE
    }
  })

  panelDispatch({
    type: panelActions.SET_TABLE_DATA,
    payload: {
      dataInputs,
      parameters,
      volume_mounts: volumeMounts ?? [],
      volumes: defaultData.function?.spec?.volumes ?? [],
      environmentVariables:
        parseEnvVariables(defaultData.function?.spec?.env ?? []).map(env => ({
          data: generateEnvVariable(env)
        })) ?? [],
      secretSources: secrets,
      node_selector: Object.entries(defaultData.function?.spec?.node_selector ?? {}).map(
        ([key, value]) => ({
          key,
          value
        })
      )
    }
  })
  panelDispatch({
    type: panelActions.SET_ACCESS_KEY,
    payload: defaultData.function?.metadata?.credentials?.access_key || PANEL_DEFAULT_ACCESS_KEY
  })
  panelDispatch({
    type: panelActions.SET_OUTPUT_PATH,
    payload: defaultData.task.spec.output_path ?? JOB_DEFAULT_OUTPUT_PATH
  })
  panelDispatch({
    type: panelActions.SET_PREEMPTION_MODE,
    payload: defaultData.function?.spec?.preemption_mode || ''
  })
  setNewJob({
    access_key: defaultData.function?.metadata?.credentials?.access_key || PANEL_DEFAULT_ACCESS_KEY,
    inputs: defaultData.task.spec.inputs ?? {},
    parameters: defaultData.task.spec.parameters ?? {},
    volume_mounts: volumeMounts?.length
      ? volumeMounts.map(volumeMounts => ({
          name: volumeMounts.data.name,
          mountPath: volumeMounts.data.mountPath,
          subPath: volumeMounts.data.subPath
        }))
      : [],
    volumes: defaultData.function?.spec?.volumes ?? [],
    environmentVariables: defaultData.function?.spec?.env ?? [],
    secret_sources: defaultData.task.spec.secret_sources ?? [],
    node_selector: defaultData.function?.spec?.node_selector ?? {},
    preemption_mode: defaultData.function?.spec?.preemption_mode ?? '',
    priority_class_name: defaultData.function?.spec?.priority_class_name ?? ''
  })

  panelDispatch({
    type: panelActions.SET_LIMITS,
    payload: {
      ...panelLimits,
      ...limits,
      cpu: limits?.cpu ?? defaultResources.limits?.cpu ?? '',
      cpuUnit: getDefaultCpuUnit(limits ?? {}, defaultResources?.requests.cpu),
      memory: limits?.memory ?? defaultResources.limits?.memory ?? '',
      memoryUnit: getDefaultMemoryUnit(limits ?? {}, defaultResources?.limits.memory)
    }
  })

  panelDispatch({
    type: panelActions.SET_REQUESTS,
    payload: {
      ...panelRequests,
      cpu: requests?.cpu ?? defaultResources.requests?.cpu ?? '',
      cpuUnit: getDefaultCpuUnit(requests ?? {}, defaultResources?.requests.cpu),
      memory: requests?.memory ?? defaultResources.requests?.memory ?? '',
      memoryUnit: getDefaultMemoryUnit(requests ?? {}, defaultResources?.requests.memory)
    }
  })

  if (defaultData.function?.spec?.priority_class_name) {
    panelDispatch({
      type: panelActions.SET_PRIORITY_CLASS_NAME,
      payload: defaultData.function.spec?.priority_class_name
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
  params,
  selectedFunction,
  isFunctionTemplate,
  defaultFunc,
  mode,
  defaultHandler
) => {
  let func = ''
  const resources = {
    limits: {},
    requests: {}
  }

  if (isFunctionTemplate && selectedFunction) {
    func = `hub://${selectedFunction.metadata.name.replace(/-/g, '_')}`
  } else if (defaultFunc) {
    func = defaultFunc
  } else if (selectedFunction) {
    func = `${selectedFunction.metadata.project}/${selectedFunction.metadata.name}@${selectedFunction.metadata.hash}`
  }

  if (!isEveryObjectValueEmpty(panelState.limits)) {
    for (let key in panelState.limits) {
      if (panelState.limits[key]?.length > 0 && !['cpuUnit', 'memoryUnit'].includes(key)) {
        resources.limits[key] = panelState.limits[key]
      }
    }
  }

  if (!isEveryObjectValueEmpty(panelState.requests)) {
    for (let key in panelState.requests) {
      if (panelState.requests[key]?.length > 0 && !['cpuUnit', 'memoryUnit'].includes(key)) {
        resources.requests[key] = panelState.requests[key]
      }
    }
  }

  const taskSpec = {
    ...cloneDeep(jobsStore.newJob.task.spec),
    function: func,
    handler: mode === PANEL_EDIT_MODE ? defaultHandler : panelState.currentFunctionInfo.method,
    input_path: panelState.inputPath,
    output_path: panelState.outputPath
  }

  if (jobsStore.newJob.task.spec.hyper_param_options.selector.result.length > 0) {
    taskSpec.hyper_param_options.selector = `${jobsStore.newJob.task.spec.hyper_param_options.selector.criteria}.${jobsStore.newJob.task.spec.hyper_param_options.selector.result}`
  } else {
    delete taskSpec.hyper_param_options.selector
  }

  return {
    ...jobsStore.newJob,
    schedule: cronString,
    function: {
      ...jobsStore.newJob.function,
      spec: {
        ...jobsStore.newJob.function.spec,
        env: fillEmptyEnvVarValue(jobsStore.newJob.function.spec.env),
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

const fillEmptyEnvVarValue = environmentVariables => {
  return environmentVariables.map(envVar => {
    if (!envVar.value && !envVar.valueFrom) {
      envVar.value = ''
    }

    return envVar
  })
}
