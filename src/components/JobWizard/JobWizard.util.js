import { chain, isEmpty, isNil, unionBy } from 'lodash'
import { JOB_DEFAULT_OUTPUT_PATH, PANEL_DEFAULT_ACCESS_KEY, TAG_LATEST } from '../../constants'
import {
  getDefaultCpuUnit,
  getDefaultMemoryUnit,
  getLimitsGpuType,
  getVolumeType
} from '../../utils/panelResources.util'
import { generateEnvVariable } from '../../utils/generateEnvironmentVariable'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { parseEnvVariables } from '../../utils/parseEnvironmentVariables'
import { parseKeyValues } from '../../utils'

export const generateJobWizardData = (
  frontendSpec,
  selectedFunctionData,
  defaultData,
  isEditMode
) => {
  const functions = selectedFunctionData.functions
  const functionInfo = getFunctionInfo(selectedFunctionData, defaultData)
  const defaultResources = frontendSpec?.default_function_pod_resources
  const functionParameters = getFunctionParameters(functions, functionInfo.method)
  const [functionPriorityClassName] = getFunctionPriorityClass(functions)
  const [limits] = getLimits(functions)
  const [requests] = getRequests(functions)
  const environmentVariables = getEnvironmentVariables(functions)
  const [preemptionMode] = getPreemptionMode(functions)
  const jobPriorityClassName =
    functionPriorityClassName || frontendSpec.default_function_priority_class_name
  const nodeSelector = getNodeSelectors(functions)
  const volumes = getVolumes(functions)
  const volumeMounts = getVolumeMounts(functions, volumes, isEditMode)
  const gpuType = getLimitsGpuType(limits)

  const currentLimits = {
    ...limits,
    cpu: limits?.cpu ?? defaultResources.limits?.cpu ?? '',
    cpuUnit: getDefaultCpuUnit(limits ?? {}, defaultResources?.requests.cpu),
    memory: limits?.memory ?? defaultResources.limits?.memory ?? '',
    memoryUnit: getDefaultMemoryUnit(limits ?? {}, defaultResources?.limits.memory),
    [gpuType]: limits?.[gpuType] ?? defaultResources?.limits.gpu ?? ''
  }
  const currentRequest = {
    cpu: requests?.cpu ?? defaultResources.requests?.cpu ?? '',
    cpuUnit: getDefaultCpuUnit(requests ?? {}, defaultResources?.requests.cpu),
    memory: requests?.memory ?? defaultResources.requests?.memory ?? '',
    memoryUnit: getDefaultMemoryUnit(requests ?? {}, defaultResources?.requests.memory)
  }

  const jobAdditionalData = {
    methodOptions: functionInfo.methodOptions,
    versionOptions: functionInfo.versionOptions
  }

  const jobFormData = {
    jobDetails: {
      name: functionInfo.name,
      version: functionInfo.version,
      method: functionInfo.method,
      methodDescription: functionInfo.methodDescription,
      labels: functionInfo.labels
    },
    dataInputs: {
      inputPath: undefined,
      outputPath: JOB_DEFAULT_OUTPUT_PATH
    },
    parameters: {},
    environmentVariables: parseEnvVariables(environmentVariables).map(env => ({
      data: generateEnvVariable(env)
    })),
    secretSources: [],
    access_key: PANEL_DEFAULT_ACCESS_KEY,
    nodeSelector,
    volumeMounts,
    volumes,
    currentLimits,
    currentRequest
  }

  if (frontendSpec.feature_flags.preemption_nodes === 'enabled') {
    jobFormData.preemptionMode =
      preemptionMode || frontendSpec.default_function_preemption_mode || 'prevent'
  }
  if (jobPriorityClassName) {
    jobFormData.jobPriorityClassName = jobPriorityClassName
  }

  if (!isEmpty(functionParameters)) {
    jobFormData.parameters.parametersTable = {
      predefined: getPredefinedParameters(functionParameters),
      custom: []
    }
    jobFormData.dataInputs.dataInputsTable = getDataInputs(functionParameters)
  }

  return [jobFormData, jobAdditionalData]
}

export const getFunctionInfo = (selectedFunctionData, defaultData) => {
  const functions = selectedFunctionData?.functions
  if (!isEmpty(functions)) {
    const versionOptions = getVersionOptions(functions)
    const methodOptions = getMethodOptions(functions)
    const { defaultMethod, defaultVersion } = getDefaultMethodAndVersion(versionOptions, functions)

    return {
      labels: parseKeyValues(functions[0].metadata.labels || []),
      name: selectedFunctionData.name,
      method: defaultMethod || (methodOptions[0]?.id ?? ''),
      methodDescription: methodOptions[0]?.subLabel ?? '',
      version: selectedFunctionData.tag || defaultVersion,
      methodOptions,
      versionOptions
    }
  } else if (defaultData) {
    // return {
    //   labels: parseKeyValues(defaultData.task.metadata.labels || []),
    //   name: defaultData.task.metadata.name,
    //   method: '',
    //   methodDescription: '',
    //   version: '',
    //   methodOptions: [],
    //   versionOptions: []
    // }
  }
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
        label: (func.metadata.tag === TAG_LATEST ? '$' : '') + (func.metadata.tag || '$latest'),
        id: func.metadata.tag || TAG_LATEST
      }
    }),
    'id'
  )

  return versionOptions.length ? versionOptions : [{ label: '$latest', id: 'latest' }]
}

export const getDefaultMethodAndVersion = (versionOptions, selectedFunctions) => {
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

export const getPreemptionMode = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => {
      return func.spec.preemption_mode ?? ''
    })
    .flatten()
    .unionBy('key')
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

export const getVolumes = selectedFunction => {
  return chain(selectedFunction)
    .orderBy('metadata.updated', 'desc')
    .map(func => func.spec.volumes ?? [])
    .flatten()
    .unionBy('name')
    .value()
}

export const getVolumeMounts = (selectedFunction, volumes, isEditMode) => {
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
        canBeModified: isEditMode
      }
    })
    .value()
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

export const getPredefinedParameters = functionParameters => {
  return functionParameters
    .filter(parameter => parameter.type !== 'DataItem')
    .map(parameter => ({
      data: {
        name: parameter.name ?? '',
        type: parameter.type ?? '',
        parameterType: 'Simple',
        value: parseParameterValue(parameter.default),
        isChecked: true,
      },
      doc: parameter.doc,
      isHidden: parameter.name === 'context',
      isDefault: true,
    }))
}

const parseParameterValue = parameterValue => {
  if (Array.isArray(parameterValue)) {
    return parameterValue.join(',')
  } else if (parameterValue !== '' && !isNil(parameterValue)) {
    return String(parameterValue)
  } else {
    return ''
  }
}

