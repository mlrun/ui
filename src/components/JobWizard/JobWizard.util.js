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
import {
  chain,
  difference,
  get,
  has,
  isEmpty,
  isFinite,
  isNil,
  keyBy,
  map,
  merge,
  omit,
  set,
  unionBy
} from 'lodash'
import {
  CONFIG_MAP_VOLUME_TYPE,
  ENV_VARIABLE_TYPE_SECRET,
  ENV_VARIABLE_TYPE_VALUE,
  JOB_DEFAULT_OUTPUT_PATH,
  LIST_TUNING_STRATEGY,
  MAX_SELECTOR_CRITERIA,
  PANEL_DEFAULT_ACCESS_KEY,
  PARAMETERS_FROM_FILE_VALUE,
  PARAMETERS_FROM_UI_VALUE,
  PVC_VOLUME_TYPE,
  RANDOM_STRATEGY,
  SECRET_VOLUME_TYPE,
  TAG_LATEST,
  V3IO_VOLUME_TYPE
} from '../../constants'
import {
  generateCpuWithUnit,
  generateMemoryWithUnit,
  getCpuData,
  getLimitsGpuType,
  getMemoryData
} from '../../elements/FormResourcesUnits/formResourcesUnits.util'
import {
  parameterTypeBool,
  parameterTypeFloat,
  parameterTypeInt,
  parameterTypeList,
  parameterTypeMap,
  parameterTypeStr,
  parameterTypeValueMap
} from '../../elements/FormParametersTable/formParametersTable.util'
import {
  CONFLICT_ERROR_STATUS_CODE,
  FORBIDDEN_ERROR_STATUS_CODE,
  NOTFOUND_ERROR_STATUS_CODE
} from 'igz-controls/constants'
import { convertChipsData, parseChipsData } from '../../utils/convertChipsData'
import { generateObjectFromKeyValue, parseObjectToKeyValue } from 'igz-controls/utils/form.util'
import { getDefaultSchedule, scheduleDataInitialState } from '../SheduleWizard/scheduleWizard.util'
import { getErrorDetail } from 'igz-controls/utils/common.util'
import { getPreemptionMode } from '../../utils/getPreemptionMode'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

const volumeTypesMap = {
  [CONFIG_MAP_VOLUME_TYPE]: 'configMap',
  [PVC_VOLUME_TYPE]: 'persistentVolumeClaim',
  [SECRET_VOLUME_TYPE]: 'secret',
  [V3IO_VOLUME_TYPE]: 'flexVolume'
}

const volumeTypeNamesMap = {
  [CONFIG_MAP_VOLUME_TYPE]: 'name',
  [PVC_VOLUME_TYPE]: 'claimName',
  [SECRET_VOLUME_TYPE]: 'secretName'
}

export const generateJobWizardData = (
  frontendSpec,
  selectedFunctionData,
  defaultData,
  isEditMode
) => {
  const functions = selectedFunctionData.functions
  const functionInfo = getFunctionInfo(selectedFunctionData)
  const defaultResources = frontendSpec?.default_function_pod_resources ?? {}
  const functionParameters = getFunctionParameters(functions, functionInfo.method)
  const [functionPriorityClassName] = getFunctionPriorityClass(functions)
  const [limits] = getLimits(functions)
  const [requests] = getRequests(functions)
  const environmentVariables = getEnvironmentVariables(functions)
  const [preemptionMode] = getFunctionPreemptionMode(functions)
  const jobPriorityClassName =
    functionPriorityClassName || frontendSpec.default_function_priority_class_name || ''
  const nodeSelectorTable = getNodeSelectors(functions)
  const volumesTable = getVolumesData(functions)
  const gpuType = getLimitsGpuType(limits)
  const scheduleData = defaultData?.schedule
    ? getDefaultSchedule(defaultData.schedule)
    : scheduleDataInitialState
  const jobAdditionalData = {
    methodOptions: functionInfo.methodOptions,
    versionOptions: functionInfo.versionOptions
  }
  const currentLimits = parseLimits(limits, defaultResources.limits, gpuType)
  const currentRequest = parseRequests(requests, defaultResources.requests)

  const jobFormData = {
    runDetails: {
      name: functionInfo.name,
      version: functionInfo.version,
      method: functionInfo.method,
      labels: functionInfo.labels
    },
    parameters: {
      parametersTable: {},
      parametersFrom: PARAMETERS_FROM_UI_VALUE
    },
    hyperparameterStrategy: {
      strategy: LIST_TUNING_STRATEGY,
      criteria: MAX_SELECTOR_CRITERIA
    },
    dataInputs: {
      dataInputsTable: []
    },
    resources: {
      preemptionMode,
      currentLimits,
      currentRequest,
      nodeSelectorTable,
      volumesTable
    },
    advanced: {
      inputPath: null,
      outputPath: JOB_DEFAULT_OUTPUT_PATH,
      accessKey: true,
      accessKeyInput: '',
      environmentVariablesTable: parseEnvironmentVariables(environmentVariables)
      // secretSourcesTable - currently not shown
      // secretSourcesTable: []
    },
    function: null,
    scheduleData
  }

  jobFormData.resources.preemptionMode = getPreemptionMode(
    frontendSpec.feature_flags?.preemption_nodes,
    preemptionMode,
    frontendSpec.default_function_preemption_mode
  )

  if (jobPriorityClassName) {
    jobFormData.resources.jobPriorityClassName = jobPriorityClassName
  }

  if (!isEmpty(functionParameters)) {
    jobFormData.parameters.parametersTable = {
      predefined: parsePredefinedParameters(functionParameters),
      custom: []
    }
    jobFormData.dataInputs.dataInputsTable = parseDataInputs(functionParameters)
  }

  return [jobFormData, jobAdditionalData]
}

export const generateJobWizardDefaultData = (
  frontendSpec,
  selectedFunctionData,
  defaultData,
  isEditMode
) => {
  if (isEmpty(defaultData)) return [{}, {}]

  const runInfo = getRunDefaultInfo(defaultData)
  const functionParameters = getFunctionDefaultParameters(selectedFunctionData, runInfo.method)
  const [predefinedParameters, customParameters] = parseDefaultParameters(
    functionParameters,
    defaultData.task.spec.parameters,
    defaultData.task.spec.hyperparams
  )
  const defaultResources = frontendSpec?.default_function_pod_resources ?? {}
  const [hyperParamCriteria = MAX_SELECTOR_CRITERIA, hyperParamResult = ''] = (
    defaultData.task.spec.hyper_param_options?.selector ?? ''
  ).split('.')
  const limits = defaultData.function.spec?.resources?.limits
  const requests = defaultData.function.spec?.resources?.requests
  const gpuType = getLimitsGpuType(limits)
  const jobAdditionalData = {
    methodOptions: runInfo.methodOptions,
    versionOptions: runInfo.versionOptions
  }
  const currentLimits = parseLimits(limits, defaultResources.limits, gpuType)
  const currentRequest = parseRequests(requests, defaultResources.requests)
  const scheduleData = defaultData?.schedule
    ? getDefaultSchedule(defaultData.schedule)
    : scheduleDataInitialState

  const jobFormData = {
    runDetails: {
      name: runInfo.name,
      version: runInfo.version,
      method: runInfo.method,
      labels: runInfo.labels
    },
    dataInputs: {
      dataInputsTable: []
    },
    parameters: {
      parametersFrom: isEmpty(defaultData.task.spec.hyper_param_options?.param_file)
        ? PARAMETERS_FROM_UI_VALUE
        : PARAMETERS_FROM_FILE_VALUE,
      parametersFromFileUrl: defaultData.task.spec.hyper_param_options?.param_file,
      parametersTable: {
        predefined: predefinedParameters,
        custom: customParameters
      }
    },
    hyperparameterStrategy: {
      strategy: defaultData.task.spec.hyper_param_options?.strategy ?? LIST_TUNING_STRATEGY,
      criteria: hyperParamCriteria || MAX_SELECTOR_CRITERIA,
      result: hyperParamResult,
      maxErrors: defaultData.task.spec.hyper_param_options?.max_errors,
      maxIterations: defaultData.task.spec.hyper_param_options?.max_iterations,
      stopCondition: defaultData.task.spec.hyper_param_options?.stop_condition,
      parallelRuns: defaultData.task.spec.hyper_param_options?.parallel_runs,
      daskClusterUri: defaultData.task.spec.hyper_param_options?.dask_cluster_uri,
      teardownDask: defaultData.task.spec.hyper_param_options?.teardown_dask
    },
    resources: {
      preemptionMode: defaultData.function?.spec?.preemption_mode || '',
      jobPriorityClassName: defaultData.function?.spec?.priority_class_name || '',
      currentLimits,
      currentRequest,
      nodeSelectorTable: parseObjectToKeyValue(defaultData.function?.spec?.node_selector ?? []),
      volumesTable: parseVolumes(
        defaultData.function?.spec?.volumes ?? [],
        defaultData.function?.spec?.volume_mounts ?? [],
        isEditMode
      )
    },
    advanced: {
      inputPath: defaultData.task.spec.input_path,
      outputPath: defaultData.task.spec.output_path,
      accessKey:
        defaultData.function?.metadata?.credentials?.access_key === PANEL_DEFAULT_ACCESS_KEY,
      accessKeyInput:
        defaultData.function?.metadata?.credentials?.access_key === PANEL_DEFAULT_ACCESS_KEY
          ? ''
          : defaultData.function?.metadata?.credentials?.access_key,
      environmentVariablesTable: parseEnvironmentVariables(defaultData.function?.spec?.env ?? [])
      // secretSourcesTable - currently not shown
      // secretSourcesTable: parseSecretSources(defaultData.task.spec.secret_sources)
    },
    scheduleData,
    function: defaultData.task.spec.function
  }

  if (!isEmpty(defaultData.task.spec.inputs)) {
    jobFormData.dataInputs.dataInputsTable = parseDefaultDataInputs(defaultData.task.spec.inputs)
  }

  return [jobFormData, jobAdditionalData]
}

const getFunctionInfo = selectedFunctionData => {
  const functions = selectedFunctionData?.functions

  if (!isEmpty(functions)) {
    const versionOptions = getVersionOptions(functions)
    const methodOptions = getMethodOptions(functions)
    const { defaultVersion, defaultMethod } = getDefaultMethodAndVersion(
      versionOptions,
      methodOptions,
      functions
    )
    const currentFunctionVersion = selectedFunctionData.tag || defaultVersion
    const currentFunction =
      functions.find(func => func.metadata.tag === currentFunctionVersion) ?? functions[0]

    return {
      labels: parseChipsData(currentFunction?.metadata.labels),
      name: selectedFunctionData.name,
      method: defaultMethod,
      version: currentFunctionVersion,
      methodOptions,
      versionOptions
    }
  }
}

const getRunDefaultInfo = defaultData => {
  return {
    labels: parseChipsData(defaultData.task?.metadata?.labels),
    name: defaultData.task?.metadata?.name || '',
    method: defaultData.task?.spec?.handler,
    version: '',
    methodOptions: [],
    versionOptions: []
  }
}

const getMethodOptions = selectedFunctions => {
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

const getVersionOptions = selectedFunctions => {
  const versionOptions = unionBy(
    selectedFunctions.map(func => {
      return {
        label: (func.metadata.tag === TAG_LATEST ? '$' : '') + (func.metadata.tag || '$latest'),
        id: func.metadata.tag || TAG_LATEST
      }
    }),
    'id'
  )

  return versionOptions.length ? versionOptions : [{ label: '$latest', id: 'latest' }]
}

const getDefaultMethod = (methodOptions, selectedFunctions) => {
  let method = ''

  const latestFunction = selectedFunctions.find(item => item.metadata.tag === 'latest')

  if (methodOptions.length) {
    method = methodOptions[0]?.id
  } else if (latestFunction) {
    method = latestFunction.spec.default_handler || 'handler'
  } else {
    method = selectedFunctions[0]?.spec.default_handler || 'handler'
  }

  return method
}

const getDefaultMethodAndVersion = (versionOptions, methodOptions, selectedFunctions) => {
  const defaultVersion =
    versionOptions.find(version => version.id === 'latest')?.id || versionOptions[0].id || ''

  const defaultMethod = getDefaultMethod(methodOptions, selectedFunctions)

  return {
    defaultVersion,
    defaultMethod
  }
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

export const getFunctionDefaultParameters = (selectedFunction, method) => {
  const functionParameters = get(selectedFunction, `spec.entry_points[${method}].parameters`, [])

  return keyBy(functionParameters, 'name')
}

const getFunctionPriorityClass = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.priority_class_name
    })
    .flatten()
    .unionBy('name')
    .value()
}

const getLimits = selectedFunction => {
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

const getRequests = selectedFunction => {
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

const getEnvironmentVariables = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.env ?? []
    })
    .flatten()
    .unionBy('name')
    .value()
}

const getFunctionPreemptionMode = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.preemption_mode ?? ''
    })
    .flatten()
    .unionBy('key')
    .value()
}

const getNodeSelectors = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.node_selector ?? {}
    })
    .map(parseObjectToKeyValue)
    .flatten()
    .unionBy('data.key')
    .value()
}

const getVolumeType = volume => {
  if (volume.configMap) {
    return CONFIG_MAP_VOLUME_TYPE
  } else if (volume.persistentVolumeClaim) {
    return PVC_VOLUME_TYPE
  } else if (volume.secret) {
    return SECRET_VOLUME_TYPE
  } else if (volume.flexVolume) {
    return V3IO_VOLUME_TYPE
  }
}

const getVolumesData = selectedFunction => {
  const volumes = chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => func.spec.volumes ?? [])
    .flatten()
    .unionBy('name')
    .value()

  const volumeMounts = chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => func.spec.volume_mounts ?? [])
    .flatten()
    .unionBy('name')
    .value()

  return parseVolumes(volumes, volumeMounts)
}

const parseVolumes = (volumes, volumeMounts, isEditMode) => {
  return volumeMounts.map(volumeMount => {
    const currentVolume = volumes.find(volume => volume.name === volumeMount?.name)
    const volumeType = getVolumeType(currentVolume)
    const volumeTypePath = volumeTypesMap[volumeType]
    const volumeTypeName = volumeTypeNamesMap[volumeType]

    return {
      data: {
        type: volumeType,
        name: volumeMount?.name,
        mountPath: volumeMount?.mountPath,
        typeName: currentVolume[volumeTypePath]?.[volumeTypeName],
        ...currentVolume[volumeTypePath]?.options
      },
      typeAdditionalData: omit(currentVolume[volumeTypePath], ['options', 'name']),
      isDefault: true,
      canBeModified: isEditMode
    }
  })
}

export const getCategoryName = categoryId => {
  const categoriesNames = {
    'data-prep': 'Data Preparation',
    'data-source': 'ETL',
    'model-prep': 'Model Prep',
    'model-test': 'Model Test',
    'model-testing': 'Model Testing',
    NLP: 'NLP',
    analysis: 'Data Analysis',
    dask: 'Dask',
    dl: 'Deep Learning',
    ml: 'Machine Learning',
    notifications: 'Alerts and Notifications',
    other: 'Other',
    serving: 'Model Serving',
    simulators: 'Simulators',
    training: 'Model Training'
  }

  return categoriesNames[categoryId] ?? categoryId
}

export const parseDataInputs = functionParameters => {
  return functionParameters
    .filter(dataInputs => dataInputs.type?.includes('DataItem'))
    .map(input => {
      return {
        doc: input.doc,
        isDefault: true,
        data: {
          name: input.name,
          path: input.path ?? '',
          fieldInfo: {
            pathType: input.path?.replace(/:\/\/.*$/g, '://') ?? '',
            value: input.path?.replace(/.*:\/\//g, '') ?? ''
          }
        }
      }
    })
}

export const parseDefaultDataInputs = dataInputs => {
  return map(dataInputs, (value, key) => {
    return {
      isDefault: true,
      data: {
        name: key,
        path: value ?? '',
        fieldInfo: {
          pathType: value?.replace(/:\/\/.*$/g, '://') ?? '',
          value: value?.replace(/.*:\/\//g, '') ?? ''
        }
      }
    }
  })
}

export const parsePredefinedParameters = funcParams => {
  return funcParams
    .filter(parameter => !parameter.type?.includes('DataItem'))
    .map(parameter => {
      return {
        data: {
          name: parameter.name ?? '',
          type: parameter.type ?? '',
          value: parseParameterValue(parameter.default),
          isChecked: true,
          isHyper: false
        },
        doc: parameter.doc,
        isHidden: parameter.name === 'context',
        isUnsupportedType: !parameterTypeValueMap[parameter.type],
        isDefault: true,
        isPredefined: true
      }
    })
}

export const parseDefaultParameters = (funcParams = {}, runParams = {}, runHyperParams = {}) => {
  let predefinedParameters = []
  let customParameters = []

  predefinedParameters = chain(funcParams)
    .filter(parameter => !parameter.type?.includes('DataItem'))
    .map(parameter => {
      return {
        data: {
          name: parameter.name,
          type: parameter.type ?? '',
          value: parseParameterValue(
            runParams[parameter.name] ?? runHyperParams[parameter.name] ?? parameter.default ?? ''
          ),
          isChecked: parameter.name in runParams || parameter.name in runHyperParams,
          isHyper: parameter.name in runHyperParams
        },
        doc: parameter.doc ?? '',
        isHidden: parameter.name === 'context',
        isUnsupportedType: !parameterTypeValueMap[parameter.type],
        isDefault: true,
        isPredefined: true
      }
    })
    .value()

  const customParametersNames = difference(
    Object.keys(runParams).concat(Object.keys(runHyperParams)),
    Object.keys(funcParams)
  )

  customParameters = customParametersNames.map(paramName => {
    return {
      data: {
        name: paramName,
        type: parseParameterType(
          runParams[paramName] ?? runHyperParams[paramName],
          paramName in runHyperParams
        ),
        value: parseParameterValue(runParams[paramName] ?? runHyperParams[paramName]),
        isChecked: true,
        isHyper: paramName in runHyperParams
      },
      isHidden: false,
      isDefault: true,
      isPredefined: false
    }
  })

  return [predefinedParameters, customParameters]
}

export const parseParameterType = (parameterValue, isHyper) => {
  if (isHyper) {
    const hyperParameterTypes = parameterValue.map(parameterHyperValue => {
      return parseParameterType(parameterHyperValue)
    })

    return hyperParameterTypes.every(
      hyperParameterType => hyperParameterType === hyperParameterTypes[0]
    )
      ? hyperParameterTypes[0]
      : ''
  } else if (Array.isArray(parameterValue)) {
    return parameterTypeList
  } else if (
    typeof parameterValue === 'object' &&
    !Array.isArray(parameterValue) &&
    parameterValue !== null
  ) {
    return parameterTypeMap
  } else if (isFinite(parameterValue)) {
    return String(parameterValue).includes('.') ? parameterTypeFloat : parameterTypeInt
  } else if (typeof parameterValue === 'boolean') {
    return parameterTypeBool
  } else {
    return parameterTypeStr
  }
}

const parseParameterValue = parameterValue => {
  if (
    Array.isArray(parameterValue) ||
    (typeof parameterValue === 'object' && parameterValue !== null)
  ) {
    try {
      return JSON.stringify(parameterValue)
    } catch {
      return String(parameterValue)
    }
  } else if (parameterValue !== '' && !isNil(parameterValue)) {
    return String(parameterValue)
  } else {
    return ''
  }
}

const parseLimits = (limits = {}, defaultLimits = {}, gpuType) => {
  const [cpu, cpuUnitId] = getCpuData(limits.cpu ?? defaultLimits.cpu)
  const [memory, memoryUnitId] = getMemoryData(limits.memory ?? defaultLimits.memory)

  return {
    ...limits,
    cpu,
    cpuUnitId,
    memory,
    memoryUnitId,
    [gpuType]: limits[gpuType] ?? defaultLimits.gpu ?? ''
  }
}

const parseRequests = (requests = {}, defaultRequests = {}) => {
  const [cpu, cpuUnitId] = getCpuData(requests.cpu ?? defaultRequests.cpu)
  const [memory, memoryUnitId] = getMemoryData(requests.memory ?? defaultRequests.memory)

  return {
    cpu,
    cpuUnitId,
    memory,
    memoryUnitId
  }
}

const parseEnvironmentVariables = envVariables => {
  return envVariables
    .filter(envVariable => {
      if (envVariable?.valueFrom?.secretKeyRef) {
        return (
          envVariable.name &&
          envVariable.valueFrom.secretKeyRef.name &&
          envVariable.valueFrom.secretKeyRef.key
        )
      } else {
        return envVariable.name && envVariable.value
      }
    })
    .map(envVariable => {
      let env = {
        key: envVariable.name
      }

      if (envVariable?.valueFrom?.secretKeyRef) {
        const secretName = envVariable.valueFrom.secretKeyRef.name
        const secretKey = envVariable.valueFrom.secretKeyRef.key ?? ''

        env.secretName = secretName
        env.secretKey = secretKey
        env.type = ENV_VARIABLE_TYPE_SECRET
      } else {
        env.type = ENV_VARIABLE_TYPE_VALUE
        env.value = envVariable.value
      }

      return { data: env }
    })
}

// secretSourcesTable - currently not shown
// const parseSecretSources = secretSources => {
//   return secretSources.map(secretSource => {
//     return {
//       data: {
//         key: secretSource.kind,
//         value: secretSource.source
//       }
//     }
//   })
// }

const convertParameterValue = (value, type) => {
  if ([parameterTypeInt, parameterTypeFloat].includes(type) && Number.isFinite(Number(value))) {
    return Number(value)
  } else if (type === parameterTypeBool && ['true', 'false'].includes(value.toLowerCase())) {
    return value.toLowerCase() === 'true'
  } else if ([parameterTypeList, parameterTypeMap].includes(type)) {
    try {
      return JSON.parse(value)
    } catch {
      return String(value)
    }
  } else {
    return String(value)
  }
}

const convertHyperParameterValue = parameterValue => {
  try {
    return JSON.parse(parameterValue)
  } catch {
    return []
  }
}

const generateParameters = parametersTableData => {
  const parameters = {}

  parametersTableData?.predefined
    ?.filter(parameter => !parameter.data.isHyper && parameter.data.isChecked)
    .forEach(value => {
      parameters[value.data.name] = convertParameterValue(value.data.value, value.data.type)
    })

  parametersTableData?.custom
    ?.filter(parameter => !parameter.data.isHyper && parameter.data.isChecked)
    .forEach(value => {
      parameters[value.data.name] = convertParameterValue(value.data.value, value.data.type)
    })

  return parameters
}

const generateHyperParameters = parametersTableData => {
  const hyperparams = {}

  parametersTableData?.predefined
    ?.filter(parameter => parameter.data.isHyper && parameter.data.isChecked)
    .forEach(parameter => {
      hyperparams[parameter.data.name] = convertHyperParameterValue(parameter.data.value)
    })

  parametersTableData?.custom
    ?.filter(parameter => parameter.data.isHyper && parameter.data.isChecked)
    .forEach(parameter => {
      hyperparams[parameter.data.name] = convertHyperParameterValue(parameter.data.value)
    })

  return hyperparams
}

const generateDataInputs = dataInputsTableData => {
  const dataInputs = {}

  dataInputsTableData.forEach(dataInput => {
    dataInputs[dataInput.data.name] =
      dataInput.data.fieldInfo.pathType + dataInput.data.fieldInfo.value
  })

  return dataInputs
}

const generateEnvironmentVariables = (envVarData = []) => {
  return envVarData.map(envVar => {
    const generatedEnvVar = {
      name: envVar.data.key
    }

    if (envVar.data.type === ENV_VARIABLE_TYPE_SECRET) {
      generatedEnvVar.valueFrom = {
        secretKeyRef: {
          key: envVar.data.secretKey ?? '',
          name: envVar.data.secretName
        }
      }
    } else {
      generatedEnvVar.value = envVar.data.value ?? ''
    }

    return generatedEnvVar
  })
}

const generateVolumes = volumesTable => {
  const volume_mounts = volumesTable.map(volume => {
    return {
      name: volume.data.name,
      mountPath: volume.data.mountPath
    }
  })
  const volumes = volumesTable.map(volume => {
    const volumeData = {
      name: volume.data.name
    }

    if (volume.data.typeName) {
      volumeData[volume.data.type] = {
        [volumeTypeNamesMap[volume.data.type]]: volume.data.typeName
      }
    } else {
      volumeData[volume.data.type] = {
        options: omit(volume.data, ['type', 'name', 'typeName', 'mountPath'])
      }

      if (volume.data.type === V3IO_VOLUME_TYPE && !volume.typeAdditionalData?.driver) {
        set(volume, ['typeAdditionalData', 'driver'], 'v3io/fuse')
      }
    }

    merge(volumeData[volume.data.type], volume.typeAdditionalData)

    return volumeData
  })

  return [volume_mounts, volumes]
}

const generateResources = resources => {
  return {
    limits: {
      cpu: generateCpuWithUnit(resources.currentLimits.cpu, resources.currentLimits.cpuUnitId),
      memory: generateMemoryWithUnit(
        resources.currentLimits.memory,
        resources.currentLimits.memoryUnitId
      ),
      'nvidia.com/gpu': String(resources.currentLimits['nvidia.com/gpu'] ?? '')
    },
    requests: {
      cpu: generateCpuWithUnit(resources.currentRequest.cpu, resources.currentRequest.cpuUnitId),
      memory: generateMemoryWithUnit(
        resources.currentRequest.memory,
        resources.currentRequest.memoryUnitId
      )
    }
  }
}

export const generateJobRequestData = (
  formData,
  selectedFunctionData,
  params,
  mode,
  isSchedule
) => {
  let selectedFunction = selectedFunctionData?.functions?.find(
    func => func.metadata.tag === formData.runDetails.version
  )
  selectedFunction ??= selectedFunctionData?.functions?.[0]
  const [volume_mounts, volumes] = generateVolumes(formData.resources.volumesTable)

  const postData = {
    task: {
      metadata: {
        project: params.projectName,
        name: formData.runDetails.name,
        labels: convertChipsData(formData.runDetails.labels)
      },
      spec: {
        inputs: generateDataInputs(formData.dataInputs.dataInputsTable),
        parameters: generateParameters(formData.parameters.parametersTable),
        // secretSourcesTable - currently not shown
        // secret_sources: formData.advanced.secretSourcesTable.map(secretSource => {
        //   return { kind: secretSource.data.key, source: secretSource.data.value }
        // }),
        handler: formData.runDetails.method ?? '',
        input_path: formData.advanced.inputPath ?? '',
        output_path: formData.advanced.outputPath,
        function:
          selectedFunction && !has(selectedFunction, 'status')
            ? `hub://${selectedFunction.metadata.name.replace(/-/g, '_')}`
            : formData.function ??
              (selectedFunction
                ? `${selectedFunction.metadata.project}/${selectedFunction.metadata.name}@${selectedFunction.metadata.hash}`
                : '')
      }
    },
    function: {
      metadata: {
        credentials: {
          access_key: formData.advanced.accessKey
            ? PANEL_DEFAULT_ACCESS_KEY
            : formData.advanced.accessKeyInput
        }
      },
      spec: {
        env: generateEnvironmentVariables(formData.advanced.environmentVariablesTable),
        node_selector: generateObjectFromKeyValue(formData.resources.nodeSelectorTable),
        preemption_mode: formData.resources.preemptionMode,
        priority_class_name: formData.resources.jobPriorityClassName,
        volume_mounts,
        volumes,
        resources: generateResources(formData.resources)
      }
    }
  }

  if (formData.runDetails.hyperparameter) {
    postData.task.spec.hyper_param_options = {
      strategy: formData.hyperparameterStrategy.strategy,
      stop_condition: formData.hyperparameterStrategy.stopCondition ?? '',
      parallel_runs: formData.hyperparameterStrategy.parallelRuns,
      dask_cluster_uri: formData.hyperparameterStrategy.daskClusterUri ?? '',
      max_iterations:
        formData.hyperparameterStrategy.strategy === RANDOM_STRATEGY
          ? formData.hyperparameterStrategy.maxIterations
          : null,
      max_errors:
        formData.hyperparameterStrategy.strategy === RANDOM_STRATEGY
          ? formData.hyperparameterStrategy.maxErrors
          : null,
      teardown_dask: formData.hyperparameterStrategy.teardownDask ?? false
    }

    if (formData.parameters.parametersFrom === PARAMETERS_FROM_FILE_VALUE) {
      postData.task.spec.hyper_param_options.param_file = formData.parameters.parametersFromFileUrl
    } else {
      postData.task.spec.hyperparams = generateHyperParameters(formData.parameters.parametersTable)
    }

    if (
      !isEmpty(formData.hyperparameterStrategy?.result) &&
      !isEmpty(formData.hyperparameterStrategy?.criteria)
    ) {
      postData.task.spec.hyper_param_options.selector = `${formData.hyperparameterStrategy.criteria}.${formData.hyperparameterStrategy.result}`
    }
  }

  if (isSchedule) {
    postData.schedule = formData.scheduleData.cron
  }

  return postData
}

export const getNewJobErrorMsg = error => {
  return error.response.status === NOTFOUND_ERROR_STATUS_CODE
    ? 'To run a job, the selected function needs to be built. Make sure to build the function before running the job.'
    : error.response.status === FORBIDDEN_ERROR_STATUS_CODE
    ? 'You are not permitted to run new job.'
    : error.response.status === CONFLICT_ERROR_STATUS_CODE
    ? 'This job is already scheduled'
    : getErrorDetail(error) || 'Unable to create a new job.'
}

export const getSaveJobErrorMsg = error => {
  return error.response.status === FORBIDDEN_ERROR_STATUS_CODE
    ? 'You are not permitted to run new job.'
    : getErrorDetail(error) || 'Unable to save the job.'
}
