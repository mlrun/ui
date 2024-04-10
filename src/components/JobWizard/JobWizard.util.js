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
  merge,
  omit,
  set,
  some
} from 'lodash'
import {
  ADVANCED_STEP,
  CONFIG_MAP_VOLUME_TYPE,
  DATA_INPUTS_STEP,
  ENV_VARIABLE_TYPE_SECRET,
  ENV_VARIABLE_TYPE_VALUE,
  EXISTING_IMAGE_SOURCE,
  FUNCTION_DEFAULT_HANDLER,
  HYPERPARAMETER_STRATEGY_STEP,
  JOB_DEFAULT_OUTPUT_PATH,
  LIST_TUNING_STRATEGY,
  MAX_SELECTOR_CRITERIA,
  PANEL_DEFAULT_ACCESS_KEY,
  PARAMETERS_FROM_FILE_VALUE,
  PARAMETERS_FROM_UI_VALUE,
  PARAMETERS_STEP,
  PVC_VOLUME_TYPE,
  RANDOM_STRATEGY,
  RESOURCES_STEP,
  RUN_DETAILS_STEP,
  SECRET_VOLUME_TYPE,
  TAG_LATEST,
  TAG_NA,
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
  parametersValueTypeOptions,
  parameterTypeBool,
  parameterTypeFloat,
  parameterTypeInt,
  parameterTypeList,
  parameterTypeDict,
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
import { trimSplit } from '../../utils'

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
  currentProjectName,
  isEditMode,
  isTrain,
  prePopulatedData,
  selectedVersion
) => {
  const functionInfo = getFunctionInfo(selectedFunctionData, selectedVersion, isTrain)
  const defaultResources = frontendSpec?.default_function_pod_resources ?? {}
  const functionParameters = getFunctionParameters(functionInfo.function, functionInfo.handler)
  const functionPriorityClassName = getFunctionPriorityClass(functionInfo.function)
  const limits = getLimits(functionInfo.function)
  const requests = getRequests(functionInfo.function)
  const environmentVariables = getEnvironmentVariables(functionInfo.function)
  const preemptionMode = getFunctionPreemptionMode(functionInfo.function)
  const jobPriorityClassName =
    functionPriorityClassName || frontendSpec.default_function_priority_class_name || ''
  const nodeSelectorTable = getNodeSelectors(functionInfo.function)
  const volumesTable = getVolumes(functionInfo.function)
  const gpuType = getLimitsGpuType(limits)
  const scheduleData = defaultData?.schedule
    ? getDefaultSchedule(defaultData.schedule)
    : scheduleDataInitialState
  const jobAdditionalData = {
    handlerOptions: functionInfo.handlerOptions,
    versionOptions: functionInfo.versionOptions
  }
  const currentLimits = parseLimits(limits, defaultResources.limits, gpuType)
  const currentRequest = parseRequests(requests, defaultResources.requests)

  const jobFormData = {
    [RUN_DETAILS_STEP]: {
      runName: functionInfo.name,
      version: functionInfo.version,
      handler: functionInfo.handler,
      handlerData: functionInfo.handlerData,
      labels: [],
      image: parseImageData(functionInfo.function, frontendSpec, currentProjectName)
    },
    [PARAMETERS_STEP]: {
      parametersTable: {
        predefined: [],
        custom: []
      },
      parametersFrom: PARAMETERS_FROM_UI_VALUE
    },
    [HYPERPARAMETER_STRATEGY_STEP]: {
      strategy: LIST_TUNING_STRATEGY,
      criteria: MAX_SELECTOR_CRITERIA
    },
    [DATA_INPUTS_STEP]: {
      dataInputsTable: []
    },
    [RESOURCES_STEP]: {
      preemptionMode,
      currentLimits,
      currentRequest,
      nodeSelectorTable,
      volumesTable
    },
    [ADVANCED_STEP]: {
      inputPath: null,
      outputPath: frontendSpec.default_artifact_path || JOB_DEFAULT_OUTPUT_PATH,
      accessKey: true,
      accessKeyInput: '',
      environmentVariablesTable: parseEnvironmentVariables(environmentVariables)
      // secretSourcesTable - currently not shown
      // secretSourcesTable: []
    },
    function: null,
    scheduleData
  }

  jobFormData[RESOURCES_STEP].preemptionMode = getPreemptionMode(
    frontendSpec.feature_flags?.preemption_nodes,
    preemptionMode,
    frontendSpec.default_function_preemption_mode
  )

  if (jobPriorityClassName) {
    jobFormData[RESOURCES_STEP].jobPriorityClassName = jobPriorityClassName
  }

  if (!isEmpty(functionParameters) || !isEmpty(prePopulatedData?.trainDatasetUri)) {
    jobFormData[DATA_INPUTS_STEP].dataInputsTable = parseDataInputs(
      functionParameters,
      prePopulatedData?.trainDatasetUri
    )
  }

  if (!isEmpty(functionParameters)) {
    jobFormData[PARAMETERS_STEP].parametersTable = {
      predefined: parsePredefinedParameters(functionParameters),
      custom: []
    }
  }

  return [jobFormData, jobAdditionalData]
}

export const generateJobWizardDefaultData = (
  frontendSpec,
  selectedFunctionData,
  defaultData,
  currentProjectName,
  isEditMode
) => {
  if (isEmpty(defaultData)) return [{}, {}]
  const selectedFunction = selectedFunctionData?.functions[0] ?? {}

  const runInfo = getRunDefaultInfo(defaultData, selectedFunction)
  const functionParameters = getFunctionDefaultParameters(selectedFunction, runInfo.handler)
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
    handlerOptions: runInfo.handlerOptions,
    versionOptions: runInfo.versionOptions
  }
  const currentLimits = parseLimits(limits, defaultResources.limits, gpuType)
  const currentRequest = parseRequests(requests, defaultResources.requests)
  const scheduleData = defaultData?.schedule
    ? getDefaultSchedule(defaultData.schedule)
    : scheduleDataInitialState

  const jobFormData = {
    [RUN_DETAILS_STEP]: {
      runName: runInfo.name,
      version: runInfo.version,
      handler: runInfo.handler,
      handlerData: runInfo.handlerData,
      labels: runInfo.labels,
      image: parseImageData(selectedFunction, frontendSpec, currentProjectName)
    },
    [DATA_INPUTS_STEP]: {
      dataInputsTable: parseDefaultDataInputs(functionParameters, defaultData.task.spec.inputs)
    },
    [PARAMETERS_STEP]: {
      parametersFrom: isEmpty(defaultData.task.spec.hyper_param_options?.param_file)
        ? PARAMETERS_FROM_UI_VALUE
        : PARAMETERS_FROM_FILE_VALUE,
      parametersFromFileUrl: defaultData.task.spec.hyper_param_options?.param_file,
      parametersTable: {
        predefined: predefinedParameters,
        custom: customParameters
      }
    },
    [HYPERPARAMETER_STRATEGY_STEP]: {
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
    [RESOURCES_STEP]: {
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
    [ADVANCED_STEP]: {
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

  return [jobFormData, jobAdditionalData]
}

export const getHandlerData = (selectedFunction, handler) => {
  const handlerData = get(selectedFunction, ['spec', 'entry_points', handler], {})
  const outputs = (handlerData?.outputs ?? []).filter(output => output.type)

  return {
    doc: handlerData?.doc,
    has_kwargs: handlerData?.has_kwargs || false,
    outputs
  }
}

const getFunctionInfo = (selectedFunctionData, preSelectedVersion, isTrain) => {
  const functions = selectedFunctionData?.functions

  if (!isEmpty(functions)) {
    const allowedHandlers = isTrain ? ['train'] : []
    const versionOptions = getVersionOptions(functions)
    const selectedVersion = some(versionOptions, { id: preSelectedVersion })
      ? preSelectedVersion
      : getDefaultVersion(versionOptions)
    const handlerOptions = getHandlerOptions(functions, selectedVersion, allowedHandlers)
    const defaultHandler = getDefaultHandler(handlerOptions, functions, selectedVersion)
    const selectedFunction = getSelectedFunction(functions, selectedVersion)

    return {
      name: selectedFunctionData.name,
      handler: defaultHandler,
      version: selectedVersion,
      handlerData: getHandlerData(selectedFunction, defaultHandler),
      handlerOptions,
      versionOptions,
      function: selectedFunction || {}
    }
  }
}

const getRunDefaultInfo = (defaultData, selectedFunction) => {
  return {
    labels: parseChipsData(defaultData.task?.metadata?.labels),
    name: defaultData.task?.metadata?.name || '',
    handler: defaultData.task?.spec?.handler,
    handlerData: getHandlerData(selectedFunction, defaultData.task?.spec?.handler),
    handlerOptions: [],
    version: '',
    versionOptions: []
  }
}

const getHandlerOptions = (selectedFunctions, selectedVersion, allowedHandlers = []) => {
  const selectedFunction =
    selectedFunctions?.length === 1
      ? selectedFunctions[0]
      : selectedFunctions.find(func => func.metadata.tag === selectedVersion)

  return chain(selectedFunction)
    .get('spec.entry_points', {})
    .values()
    .flatten()
    .filter(
      entry_point => allowedHandlers.length === 0 || allowedHandlers.includes(entry_point.name)
    )
    .map(entry_point => ({
      label: entry_point.name,
      id: entry_point.name,
      subLabel: entry_point.doc
    }))
    .value()
}

const getVersionOptions = selectedFunctions => {
  const versionOptions = chain(selectedFunctions)
    .map(func => {
      if (!func.metadata.tag) return null

      return {
        label: func.metadata.tag || 'N/A',
        id: func.metadata.tag || TAG_NA
      }
    })
    .compact()
    .unionBy('id')
    .value()

  return versionOptions.length ? versionOptions : [{ label: 'N/A', id: TAG_NA }]
}

const getDefaultHandler = (handlerOptions, selectedFunctions, selectedVersion) => {
  let handler = ''
  const selectedFunction = selectedFunctions.find(item => item.metadata.tag === selectedVersion)

  if (handlerOptions.length) {
    handler = handlerOptions[0]?.id
  } else {
    handler = selectedFunction?.spec?.default_handler || FUNCTION_DEFAULT_HANDLER
  }

  return handler
}

const getDefaultVersion = versionOptions => {
  return versionOptions.find(version => version.id === TAG_LATEST)?.id || versionOptions[0].id || ''
}

const getSelectedFunction = (functions = [], selectedVersion) => {
  return functions.find(func => func.metadata.tag === selectedVersion) ?? functions[0]
}

export const getFunctionParameters = (selectedFunction, handler) => {
  return get(selectedFunction, ['spec', 'entry_points', handler, 'parameters'], [])
}

export const getFunctionDefaultParameters = (selectedFunction, handler) => {
  const functionParameters = get(selectedFunction, `spec.entry_points[${handler}].parameters`, [])

  return keyBy(functionParameters, 'name')
}

const getFunctionPriorityClass = selectedFunction => {
  return get(selectedFunction, 'spec.priority_class_name', '')
}

const getLimits = selectedFunction => {
  return get(selectedFunction, 'spec.resources.limits', {})
}

const getRequests = selectedFunction => {
  return get(selectedFunction, 'spec.resources.requests', {})
}

const getEnvironmentVariables = selectedFunction => {
  return get(selectedFunction, 'spec.env', [])
}

const getFunctionPreemptionMode = selectedFunction => {
  return get(selectedFunction, 'spec.preemption_mode', '')
}

const getNodeSelectors = selectedFunction => {
  return parseObjectToKeyValue(get(selectedFunction, 'spec.node_selector', {}))
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

const getVolumes = selectedFunction => {
  const volumes = get(selectedFunction, 'spec.volumes', [])
  const volumeMounts = get(selectedFunction, 'spec.volume_mounts', [])

  return parseVolumes(volumes, volumeMounts)
}

const parseImageData = (selectedFunction, frontendSpec, currentProjectName) => {
  const buildImageTemplate = frontendSpec?.function_deployment_target_image_template || ''
  let defaultBuildImage = buildImageTemplate

  if (selectedFunction.metadata?.name) {
    defaultBuildImage = buildImageTemplate
      .replace('{project}', selectedFunction.metadata.project || currentProjectName)
      .replace('{name}', selectedFunction.metadata.name)
      .replace('{tag}', selectedFunction.metadata.tag || TAG_LATEST)
  }

  return {
    // todo: Uncomment when BE implements "Building a new image"
    // imageSource: selectedFunction.spec?.image ? EXISTING_IMAGE_SOURCE : NEW_IMAGE_SOURCE,
    imageSource: EXISTING_IMAGE_SOURCE,
    imageName:
      selectedFunction.spec?.image ||
      frontendSpec?.default_function_image_by_kind?.[selectedFunction.kind] ||
      '',
    resultingImage: selectedFunction.spec?.build?.image || defaultBuildImage,
    baseImage:
      selectedFunction.spec?.build?.base_image ||
      frontendSpec?.default_function_image_by_kind?.[selectedFunction.kind] ||
      '',
    buildCommands: selectedFunction.spec?.build?.commands?.join?.('\n') || '',
    pythonRequirement:
      selectedFunction.spec?.build?.requirements?.join?.('\n') ||
      frontendSpec?.function_deployment_mlrun_requirement ||
      ''
  }
}

const parseVolumes = (volumes, volumeMounts, isEditMode) => {
  return volumeMounts.map(volumeMount => {
    const currentVolume = volumes.find(volume => volume.name === volumeMount?.name)
    const volumeType = getVolumeType(currentVolume)
    const volumeTypePath = volumeTypesMap[volumeType]
    const volumeTypeName = volumeTypeNamesMap[volumeType]
    const volumeData = {
      type: volumeType,
      name: volumeMount?.name,
      mountPath: volumeMount?.mountPath,
      ...currentVolume[volumeTypePath]?.options
    }

    if (volumeType === V3IO_VOLUME_TYPE) {
      volumeData.accessKey = currentVolume[volumeTypePath]?.secretRef?.name ?? ''
    } else {
      volumeData.typeName = currentVolume[volumeTypePath]?.[volumeTypeName]
    }

    return {
      data: {
        ...volumeData
      },
      typeAdditionalData: omit(currentVolume[volumeTypePath], ['options', 'name']),
      isDefault: true,
      canBeModified: isEditMode
    }
  })
}

export const getCategoryName = categoryId => {
  const categoriesNames = {
    dask: 'Dask',
    'data-analysis': 'Data Analysis',
    'data-preparation': 'Data Preparation',
    etl: 'ETL',
    'data-validation': 'Data Validation',
    dl: 'Deep Learning',
    'feature-store': 'Feature Store',
    'machine-learning': 'Machine Learning',
    'model-prep': 'Model Prep',
    'model-test': 'Model Test',
    'model-testing': 'Model Testing',
    'model-training': 'Model Training',
    monitoring: 'Monitoring',
    NLP: 'NLP',
    notifications: 'Alerts and Notifications',
    other: 'Other',
    utils: 'Utilities',
    'model-serving': 'Model Serving',
    simulators: 'Simulators',
    training: 'Model Training'
  }

  return categoriesNames[categoryId] ?? categoryId
}

const getDataInputData = (dataInputName, dataInputValue, dataInputIsChecked) => {
  const pathType = dataInputValue?.match(/^(.*?:\/\/+)/)?.[0] ?? ''
  const value = dataInputValue?.replace(pathType, '') ?? ''

  return {
    name: dataInputName,
    path: dataInputValue ?? '',
    fieldInfo: {
      pathType,
      value
    },
    isChecked: dataInputIsChecked
  }
}

const sortParameters = (parameter, nextParameter) => nextParameter.isRequired - parameter.isRequired

export const parseDataInputs = (functionParameters = [], trainDatasetUri) => {
  const parsedDataInputs = functionParameters
    .filter(dataInputs => dataInputs.type?.includes('DataItem'))
    .map(dataInput => {
      return {
        data: getDataInputData(dataInput.name, dataInput.default, !has(dataInput, 'default')),
        doc: dataInput.doc,
        isRequired: !has(dataInput, 'default'),
        isDefault: true,
        isPredefined: true
      }
    })
    .sort(sortParameters)
  const dataInputsDataset = parsedDataInputs.find(dataInput => dataInput.data?.name === 'dataset')

  if (dataInputsDataset && trainDatasetUri) {
    dataInputsDataset.data = getDataInputData(
      'dataset',
      trainDatasetUri,
      dataInputsDataset.data.isChecked
    )
  }

  return parsedDataInputs
}

export const parseDefaultDataInputs = (funcParams, runDataInputs = {}) => {
  const predefinedDataInputs = chain(funcParams)
    .filter(dataInput => dataInput.type?.includes('DataItem'))
    .map(dataInput => {
      const dataInputIsFromPreviousRun = has(runDataInputs, dataInput.name)
      const dataInputValue = dataInputIsFromPreviousRun
        ? runDataInputs[dataInput.name]
        : dataInput.default ?? ''

      return {
        data: getDataInputData(
          dataInput.name,
          dataInputValue,
          dataInputIsFromPreviousRun || !has(dataInput, 'default')
        ),
        doc: dataInput.doc ?? '',
        isRequired: !has(dataInput, 'default'),
        isDefault: true,
        isPredefined: true
      }
    })
    .sort(sortParameters)
    .value()

  const customDataInputsNames = difference(Object.keys(runDataInputs), Object.keys(funcParams))

  const customDataInputs = customDataInputsNames.map(dataInputName => {
    const dataInputValue = runDataInputs[dataInputName] ?? ''

    return {
      data: getDataInputData(dataInputName, dataInputValue, true),
      isRequired: false,
      isDefault: true,
      isPredefined: false
    }
  })

  return predefinedDataInputs.concat(customDataInputs)
}

export const parsePredefinedParameters = funcParams => {
  return funcParams
    .filter(parameter => !parameter.type?.includes('DataItem'))
    .map(parameter => {
      const parsedValue = parseParameterValue(parameter.default)
      const parameterIsRequired = !has(parameter, 'default')

      return {
        data: {
          name: parameter.name ?? '',
          type: parameter.type ?? '',
          value: parsedValue,
          isChecked: parameterIsRequired,
          isHyper: false
        },
        doc: parameter.doc,
        isHidden: parameter.name === 'context' && !parsedValue,
        isUnsupportedType: !parameterTypeValueMap[parameter.type],
        isRequired: parameterIsRequired,
        isDefault: true,
        isPredefined: true,
        parameterTypeOptions: getParameterTypeOptions(parameter.type)
      }
    })
    .sort(sortParameters)
}

export const parseDefaultParameters = (funcParams = {}, runParams = {}, runHyperParams = {}) => {
  let predefinedParameters = []
  let customParameters = []

  predefinedParameters = chain(funcParams)
    .filter(parameter => !parameter.type?.includes('DataItem'))
    .map(parameter => {
      const parsedValue = parseParameterValue(
        runParams[parameter.name] ?? runHyperParams[parameter.name] ?? parameter.default ?? ''
      )
      const predefinedParameterIsModified =
        parameter.name in runParams || parameter.name in runHyperParams
      const parametersIsRequired = !has(parameter, 'default')
      const parameterType = predefinedParameterIsModified
        ? parseParameterType(
            runParams[parameter.name] ?? runHyperParams[parameter.name],
            parameter.name in runHyperParams
          )
        : parameter.type ?? ''

      return {
        data: {
          name: parameter.name,
          type: parameterType,
          value: parsedValue,
          isChecked: (parsedValue && predefinedParameterIsModified) || parametersIsRequired,
          isHyper: parameter.name in runHyperParams
        },
        doc: parameter.doc ?? '',
        isHidden: parameter.name === 'context' && !parsedValue,
        isUnsupportedType: !parameterTypeValueMap[parameter.type],
        isRequired: parametersIsRequired,
        isDefault: true,
        isPredefined: true,
        parameterTypeOptions: getParameterTypeOptions(parameterType)
      }
    })
    .sort(sortParameters)
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
      isPredefined: false,
      parameterTypeOptions: parametersValueTypeOptions
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
    return parameterTypeDict
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
  } else if ([parameterTypeList, parameterTypeDict].includes(type)) {
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
    .forEach(parameter => {
      if (parameter.data.name === 'context' && !parameter.data.value) return false

      parameters[parameter.data.name] = convertParameterValue(
        parameter.data.value,
        parameter.data.type
      )
    })

  parametersTableData?.custom
    ?.filter(parameter => !parameter.data.isHyper && parameter.data.isChecked)
    .forEach(parameter => {
      parameters[parameter.data.name] = convertParameterValue(
        parameter.data.value,
        parameter.data.type
      )
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

  dataInputsTableData
    .filter(dataInput => dataInput.data.isChecked)
    .forEach(dataInput => {
      const dataInputValue = dataInput.data.fieldInfo.pathType + dataInput.data.fieldInfo.value

      if (dataInputValue.length > 0) {
        dataInputs[dataInput.data.name] = dataInputValue
      }
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
      const omitData = ['type', 'name', 'typeName', 'mountPath']

      if (volume.data?.accessKey === volume.typeAdditionalData?.secretRef?.name) {
        omitData.push('accessKey')
      }

      volumeData[volume.data.type] = {
        options: omit(volume.data, omitData)
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

const generateFunctionBuild = imageData => {
  if (imageData.imageSource === EXISTING_IMAGE_SOURCE) return {}

  return {
    image: imageData.resultingImage,
    base_image: imageData.baseImage,
    commands: trimSplit(imageData.buildCommands, '\n'),
    requirements: trimSplit(imageData.pythonRequirement, '\n')
  }
}

export const generateJobRequestData = (
  formData,
  selectedFunctionData,
  params,
  mode,
  isSchedule
) => {
  const selectedFunction = getSelectedFunction(
    selectedFunctionData?.functions,
    formData[RUN_DETAILS_STEP].version
  )
  const [volume_mounts, volumes] = generateVolumes(formData[RESOURCES_STEP].volumesTable)

  const postData = {
    task: {
      metadata: {
        project: params.projectName,
        name: formData[RUN_DETAILS_STEP].runName,
        labels: convertChipsData(formData[RUN_DETAILS_STEP].labels)
      },
      spec: {
        inputs: generateDataInputs(formData[DATA_INPUTS_STEP].dataInputsTable),
        parameters: generateParameters(formData[PARAMETERS_STEP].parametersTable),
        // secretSourcesTable - currently not shown
        // secret_sources: formData[ADVANCED_STEP].secretSourcesTable.map(secretSource => {
        //   return { kind: secretSource.data.key, source: secretSource.data.value }
        // }),
        handler: formData[RUN_DETAILS_STEP].handler ?? '',
        input_path: formData[ADVANCED_STEP].inputPath ?? '',
        output_path: formData[ADVANCED_STEP].outputPath,
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
          access_key: formData[ADVANCED_STEP].accessKey
            ? PANEL_DEFAULT_ACCESS_KEY
            : formData[ADVANCED_STEP].accessKeyInput
        }
      },
      spec: {
        image:
          formData[RUN_DETAILS_STEP].image?.imageSource === EXISTING_IMAGE_SOURCE
            ? formData[RUN_DETAILS_STEP].image.imageName
            : '',
        build: generateFunctionBuild(formData[RUN_DETAILS_STEP].image),
        env: generateEnvironmentVariables(formData[ADVANCED_STEP].environmentVariablesTable),
        node_selector: generateObjectFromKeyValue(formData[RESOURCES_STEP].nodeSelectorTable),
        preemption_mode: formData[RESOURCES_STEP].preemptionMode,
        priority_class_name: formData[RESOURCES_STEP].jobPriorityClassName,
        volume_mounts,
        volumes,
        resources: generateResources(formData[RESOURCES_STEP])
      }
    }
  }

  if (formData[RUN_DETAILS_STEP].hyperparameter) {
    postData.task.spec.hyper_param_options = {
      strategy: formData[HYPERPARAMETER_STRATEGY_STEP].strategy,
      stop_condition: formData[HYPERPARAMETER_STRATEGY_STEP].stopCondition ?? '',
      parallel_runs: formData[HYPERPARAMETER_STRATEGY_STEP].parallelRuns,
      dask_cluster_uri: formData[HYPERPARAMETER_STRATEGY_STEP].daskClusterUri ?? '',
      max_iterations:
        formData[HYPERPARAMETER_STRATEGY_STEP].strategy === RANDOM_STRATEGY
          ? formData[HYPERPARAMETER_STRATEGY_STEP].maxIterations
          : null,
      max_errors:
        formData[HYPERPARAMETER_STRATEGY_STEP].strategy === RANDOM_STRATEGY
          ? formData[HYPERPARAMETER_STRATEGY_STEP].maxErrors
          : null,
      teardown_dask: formData[HYPERPARAMETER_STRATEGY_STEP].teardownDask ?? false
    }

    if (formData[PARAMETERS_STEP].parametersFrom === PARAMETERS_FROM_FILE_VALUE) {
      postData.task.spec.hyper_param_options.param_file =
        formData[PARAMETERS_STEP].parametersFromFileUrl
    } else {
      postData.task.spec.hyperparams = generateHyperParameters(
        formData[PARAMETERS_STEP].parametersTable
      )
    }

    if (
      !isEmpty(formData[HYPERPARAMETER_STRATEGY_STEP]?.result) &&
      !isEmpty(formData[HYPERPARAMETER_STRATEGY_STEP]?.criteria)
    ) {
      postData.task.spec.hyper_param_options.selector = `${formData[HYPERPARAMETER_STRATEGY_STEP].criteria}.${formData[HYPERPARAMETER_STRATEGY_STEP].result}`
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
    ? 'You are not permitted to run a new job.'
    : error.response.status === CONFLICT_ERROR_STATUS_CODE
    ? 'This job is already scheduled'
    : getErrorDetail(error) || 'Unable to create a new job.'
}

export const getSaveJobErrorMsg = error => {
  return error.response.status === FORBIDDEN_ERROR_STATUS_CODE
    ? 'You are not permitted to run a new job.'
    : getErrorDetail(error) || 'Unable to save the job.'
}

export const getParameterTypeOptions = (parameterType = '') => {
  const match = parameterType.match(/Union\[(.*?)\]$/)

  if (match) {
    const uniqueUnionTypesList = [
      ...new Set(
        match[1].split(',').map(unionType => {
          const trimmedUnionType = unionType.trim().toLowerCase()

          return trimmedUnionType.startsWith('list') ? 'list' : trimmedUnionType
        })
      )
    ]

    const selectOptionsList = parametersValueTypeOptions.filter(option =>
      uniqueUnionTypesList.includes(option.id)
    )

    if (selectOptionsList.length === uniqueUnionTypesList.length) {
      return selectOptionsList
    }

    return parametersValueTypeOptions
  }

  return parametersValueTypeOptions
}
