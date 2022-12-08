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
import { chain, isEmpty, isNil, omit, unionBy, isFinite, isObject, merge, map, has } from 'lodash'
import {
  CONFIG_MAP_VOLUME_TYPE,
  ENV_VARIABLE_TYPE_SECRET,
  ENV_VARIABLE_TYPE_VALUE,
  JOB_DEFAULT_OUTPUT_PATH,
  LIST_TUNING_STRATEGY,
  MAX_SELECTOR_CRITERIA,
  PANEL_DEFAULT_ACCESS_KEY,
  PARAMETER_TYPE_HYPER,
  PARAMETER_TYPE_SIMPLE,
  PVC_VOLUME_TYPE,
  SECRET_VOLUME_TYPE,
  TAG_LATEST,
  V3IO_VOLUME_TYPE
} from '../../constants'
import {
  getCpuData,
  getMemoryData,
  getLimitsGpuType,
  generateCpuWithUnit,
  generateMemoryWithUnit
} from '../../elements/FormResourcesUnits/formResourcesUnits.util'
import {
  parameterTypeBool,
  parameterTypeFloat,
  parameterTypeInt,
  parameterTypeList,
  parameterTypeMap,
  parameterTypeStr
} from '../../elements/FormParametersTable/formParametersTable.util'
import { CONFLICT_ERROR_STATUS_CODE, FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { generateObjectFromKeyValue, parseObjectToKeyValue } from 'igz-controls/utils/form.util'
import { getDefaultSchedule, scheduleDataInitialState } from '../SheduleWizard/scheduleWizard.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { convertChipsData, parseChipsData } from '../../utils/convertChipsData'

const volumeTypesMap = {
  [CONFIG_MAP_VOLUME_TYPE]: 'configMap',
  [PVC_VOLUME_TYPE]: 'persistentVolumeClaim',
  [SECRET_VOLUME_TYPE]: 'secret',
  [V3IO_VOLUME_TYPE]: 'flexVolume'
}

export const generateJobWizardData = (
  frontendSpec,
  selectedFunctionData,
  defaultData,
  isEditMode,
  isStagingMode
) => {
  const functions = selectedFunctionData.functions
  const functionInfo = getFunctionInfo(selectedFunctionData)
  const defaultResources = frontendSpec?.default_function_pod_resources ?? {}
  const functionParameters = getFunctionParameters(functions, functionInfo.method)
  const [functionPriorityClassName] = getFunctionPriorityClass(functions)
  const [limits] = getLimits(functions)
  const [requests] = getRequests(functions)
  const environmentVariables = getEnvironmentVariables(functions)
  const [preemptionMode] = getPreemptionMode(functions)
  const jobPriorityClassName =
    functionPriorityClassName || frontendSpec.default_function_priority_class_name
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
    jobDetails: {
      name: functionInfo.name,
      version: functionInfo.version,
      method: functionInfo.method,
      methodDescription: functionInfo.methodDescription,
      labels: functionInfo.labels
    },
    parameters: {
      hyperParameters: {
        tuningStrategy: LIST_TUNING_STRATEGY,
        criteria: MAX_SELECTOR_CRITERIA
      },
      parametersTable: {}
    },
    dataInputs: {
      dataInputsTable: [],
      inputPath: null,
      outputPath: JOB_DEFAULT_OUTPUT_PATH
    },
    resources: {
      preemptionMode,
      currentLimits,
      currentRequest,
      nodeSelectorTable,
      volumesTable
    },
    advanced: {
      accessKey: true,
      accessKeyInput: '',
      environmentVariablesTable: parseEnvironmentVariables(environmentVariables, isStagingMode),
      secretSourcesTable: []
    },
    function: null,
    scheduleData
  }

  if (frontendSpec.feature_flags.preemption_nodes === 'enabled') {
    jobFormData.resources.preemptionMode =
      preemptionMode || frontendSpec.default_function_preemption_mode || 'prevent'
  }

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
  defaultData,
  isEditMode,
  isStagingMode
) => {
  if (isEmpty(defaultData)) return [{}, {}]

  const functionInfo = getFunctionDefaultInfo(defaultData)
  const defaultResources = frontendSpec?.default_function_pod_resources ?? {}
  const [hyperParamCriteria = MAX_SELECTOR_CRITERIA, hyperParamResult = ''] = (
    defaultData.task.spec.selector ?? ''
  ).split('.')
  const limits = defaultData.function.spec?.resources?.limits
  const requests = defaultData.function.spec?.resources?.requests
  const gpuType = getLimitsGpuType(limits)
  const jobAdditionalData = {
    methodOptions: functionInfo.methodOptions,
    versionOptions: functionInfo.versionOptions
  }
  const currentLimits = parseLimits(limits, defaultResources.limits, gpuType)
  const currentRequest = parseRequests(requests, defaultResources.requests)
  const scheduleData = defaultData?.schedule
    ? getDefaultSchedule(defaultData.schedule)
    : scheduleDataInitialState

  const jobFormData = {
    jobDetails: {
      name: functionInfo.name,
      version: functionInfo.version,
      method: functionInfo.method,
      methodDescription: functionInfo.methodDescription,
      labels: functionInfo.labels
    },
    dataInputs: {
      inputPath: defaultData.task.spec.input_path,
      outputPath: defaultData.task.spec.output_path,
      dataInputsTable: []
    },
    parameters: {
      hyperParameters: {
        paramFile: defaultData.task.spec.param_file,
        tuningStrategy: defaultData.task.spec.tuning_strategy ?? LIST_TUNING_STRATEGY,
        criteria: hyperParamCriteria,
        result: hyperParamResult
      },
      parametersTable: {}
    },
    resources: {
      preemptionMode: defaultData.function?.spec?.preemption_mode,
      jobPriorityClassName: defaultData.function?.spec?.priority_class_name,
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
      accessKey:
        defaultData.function?.metadata?.credentials?.access_key === PANEL_DEFAULT_ACCESS_KEY,
      accessKeyInput:
        defaultData.function?.metadata?.credentials?.access_key === PANEL_DEFAULT_ACCESS_KEY
          ? ''
          : defaultData.function?.metadata?.credentials?.access_key,
      environmentVariablesTable: parseEnvironmentVariables(
        defaultData.function?.spec?.env ?? [],
        isStagingMode
      ),
      secretSourcesTable: parseSecretSources(defaultData.task.spec.secret_sources)
    },
    scheduleData,
    function: defaultData.task.spec.function
  }

  if (!isEmpty(defaultData.task.spec.parameters)) {
    jobFormData.parameters.parametersTable = {
      predefined: parsePredefinedDefaultParameters(
        !isEmpty(defaultData.task.spec.parameters) ? defaultData.task.spec.parameters : {}
      ),
      custom: []
    }
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
    const { defaultMethod, defaultVersion } = getDefaultMethodAndVersion(versionOptions, functions)

    return {
      labels: parseChipsData(functions[0].metadata.labels),
      name: selectedFunctionData.name,
      method: defaultMethod || (methodOptions[0]?.id ?? ''),
      methodDescription: methodOptions[0]?.subLabel ?? '',
      version: selectedFunctionData.tag || defaultVersion,
      methodOptions,
      versionOptions
    }
  }
}

const getFunctionDefaultInfo = defaultData => {
  return {
    labels: parseChipsData(defaultData.task?.metadata?.labels),
    name: defaultData.task?.metadata?.name || '',
    method: defaultData.task?.spec?.handler,
    methodDescription: '',
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

const getDefaultMethodAndVersion = (versionOptions, selectedFunctions) => {
  const defaultMethod = selectedFunctions.find(item => item.metadata.tag === 'latest')?.spec
    .default_handler

  const defaultVersion =
    versionOptions.length === 1
      ? versionOptions[0].id
      : versionOptions.find(version => version.id === 'latest').id

  return {
    defaultMethod,
    defaultVersion
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

const getPreemptionMode = selectedFunction => {
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

    return {
      data: {
        type: volumeType,
        name: volumeMount?.name,
        mountPath: volumeMount?.mountPath,
        typeName: currentVolume[volumeTypePath]?.name,
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
    NLP: 'NLP',
    ml: 'Machine Learning',
    serving: 'Model Serving',
    training: 'Model Training',
    analysis: 'Data Analysis',
    simulators: 'Simulators',
    notifications: 'Alerts and Notifications',
    dl: 'Deep Learning'
  }

  return categoriesNames[categoryId] ?? categoryId
}

export const parseDataInputs = functionParameters => {
  return functionParameters
    .filter(dataInputs => dataInputs.type === 'DataItem')
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

export const parsePredefinedParameters = functionParameters => {
  return functionParameters
    .filter(parameter => parameter.type !== 'DataItem')
    .map(parameter => ({
      data: {
        name: parameter.name ?? '',
        type: parameter.type ?? parseParameterType(parameter.default),
        parameterType: PARAMETER_TYPE_SIMPLE,
        value: parseParameterValue(parameter.default),
        isChecked: true
      },
      doc: parameter.doc,
      isHidden: parameter.name === 'context',
      isDefault: true
    }))
}

export const parsePredefinedDefaultParameters = functionParameters => {
  return map(functionParameters, (value, key) => ({
    data: {
      name: key ?? '',
      type: parseParameterType(value),
      parameterType: PARAMETER_TYPE_SIMPLE,
      value: parseParameterValue(value),
      isChecked: true
    },
    isHidden: key === 'context',
    isDefault: true
  }))
}

const parseParameterType = parameterValue => {
  if (Array.isArray(parameterValue)) {
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

const parseEnvironmentVariables = (envVariables, isStagingMode) => {
  return envVariables.map(envVariable => {
    let env = {
      key: envVariable.name
    }

    if (envVariable?.valueFrom?.secretKeyRef) {
      const secretName = envVariable.valueFrom.secretKeyRef.name ?? ''
      const secretKey = envVariable.valueFrom.secretKeyRef.key ?? ''

      env.type = ENV_VARIABLE_TYPE_SECRET

      if (isStagingMode) {
        env.secretName = secretName
        env.secretKey = secretKey
      } else {
        env.value = secretName && secretKey ? `${secretName}:${secretKey}` : secretName
      }
    } else {
      env.type = ENV_VARIABLE_TYPE_VALUE
      env.value = envVariable.value
    }

    return { data: env }
  })
}

const parseSecretSources = secretSources => {
  return secretSources.map(secretSource => {
    return {
      data: {
        key: secretSource.kind,
        value: secretSource.source
      }
    }
  })
}

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
  if (typeof parameterValue === 'string') {
    parameterValue = parameterValue.split(',')
  } else if (!isObject(parameterValue)) {
    parameterValue = [parameterValue]
  }

  return parameterValue
}

const generateParameters = parametersTableData => {
  const parameters = {}

  parametersTableData?.predefined
    ?.filter(parameter => parameter.data.parameterType !== PARAMETER_TYPE_HYPER)
    .forEach(value => {
      parameters[value.data.name] = convertParameterValue(value.data.value, value.data.type)
    })

  parametersTableData?.custom
    ?.filter(parameter => parameter.data.parameterType !== PARAMETER_TYPE_HYPER)
    .forEach(value => {
      parameters[value.data.name] = convertParameterValue(value.data.value, value.data.type)
    })

  return parameters
}

const generateHyperParameters = parametersTableData => {
  const hyperparams = {}

  parametersTableData?.predefined
    ?.filter(parameter => parameter.data.parameterType === PARAMETER_TYPE_HYPER)
    .forEach(parameter => {
      hyperparams[parameter.data.name] = convertHyperParameterValue(
        convertParameterValue(parameter.data.value, parameter.data.type)
      )
    })

  parametersTableData?.custom
    ?.filter(parameter => parameter.data.parameterType === PARAMETER_TYPE_HYPER)
    .forEach(parameter => {
      hyperparams[parameter.data.name] = convertHyperParameterValue(
        convertParameterValue(parameter.data.value, parameter.data.type)
      )
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

const generateEnvironmentVariables = envVarData => {
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
      generatedEnvVar.value = envVar.data.value
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
        name: volume.data.typeName
      }
    } else {
      volumeData[volume.data.type] = {
        options: omit(volume.data, ['type', 'name', 'typeName', 'mountPath'])
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
      'nvidia.com/gpu': String(resources.currentLimits['nvidia.com/gpu'])
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
    func => func.metadata.tag === formData.jobDetails.version
  )
  selectedFunction ??= selectedFunctionData?.functions?.[0]
  const [volume_mounts, volumes] = generateVolumes(formData.resources.volumesTable)

  const postData = {
    task: {
      metadata: {
        project: formData.functionSelection?.projectName ?? params.projectName,
        name: formData.jobDetails.name,
        labels: convertChipsData(formData.jobDetails.labels)
      },
      spec: {
        inputs: generateDataInputs(formData.dataInputs.dataInputsTable),
        parameters: generateParameters(formData.parameters.parametersTable),
        hyperparams: generateHyperParameters(formData.parameters.parametersTable),
        secret_sources: formData.advanced.secretSourcesTable.map(secretSource => {
          return { kind: secretSource.data.key, source: secretSource.data.value }
        }),
        param_file: formData.parameters.hyperParameters?.paramFile ?? '',
        tuning_strategy: formData.parameters.hyperParameters?.tuningStrategy,
        handler: formData.jobDetails.method ?? '',
        input_path: formData.dataInputs.inputPath ?? '',
        output_path: formData.dataInputs.outputPath,
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

  if (
    !isEmpty(formData.parameters.hyperParameters?.result) &&
    !isEmpty(formData.parameters.hyperParameters?.criteria)
  ) {
    postData.task.spec.selector = `${formData.parameters.hyperParameters.criteria}.${formData.parameters.hyperParameters.result}`
  }

  if (isSchedule) {
    postData.schedule = formData.scheduleData.cron
  }

  return postData
}

export const getNewJobErrorMsg = error => {
  return error.response.status === FORBIDDEN_ERROR_STATUS_CODE
    ? 'You are not permitted to run new job.'
    : error.response.status === CONFLICT_ERROR_STATUS_CODE
    ? 'This job is already scheduled'
    : 'Unable to create new job.'
}

export const getSaveJobErrorMsg = error => {
  return error.response.status === FORBIDDEN_ERROR_STATUS_CODE
    ? 'You are not permitted to run new job.'
    : error.message
}
