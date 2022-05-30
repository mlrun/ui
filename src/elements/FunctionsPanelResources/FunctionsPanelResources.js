import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FunctionsPanelResourcesView from './FunctionsPanelResourcesView'

import { createNewVolume } from '../../utils/createNewVolume'
import functionsActions from '../../actions/functions'
import {
  getDefaultVolumeMounts,
  VOLUME_MOUNT_AUTO_TYPE,
  VOLUME_MOUNT_NONE_TYPE
} from './functionsPanelResources.util'
import {
  generateFullCpuValue,
  generateFullMemoryValue,
  getDefaultCpuUnit,
  getDefaultMemoryUnit,
  getLimitsGpuType,
  getSelectedCpuOption,
  setCpuValidation,
  setMemoryDropdownValidation,
  setMemoryInputValidation
} from '../../utils/panelResources.util'
import { generateFunctionPriorityLabel } from '../../utils/generateFunctionPriorityLabel'
import { FUNCTION_PANEL_MODE } from '../../types'
import { PANEL_CREATE_MODE } from '../../constants'

const FunctionsPanelResources = ({
  defaultData,
  frontendSpec,
  functionsStore,
  mode,
  setNewFunctionDisableAutoMount,
  setNewFunctionPreemtionMode,
  setNewFunctionPriorityClassName,
  setNewFunctionVolumeMounts,
  setNewFunctionVolumes,
  setNewFunctionResources,
  setValidation,
  validation
}) => {
  const gpuType = useMemo(
    () => getLimitsGpuType(defaultData.resources?.limits),
    [defaultData.resources?.limits]
  )

  const [podsPriorityClassName, setPodsPriorityClassName] = useState(
    defaultData.priority_class_name ||
      functionsStore.newFunction.spec.priority_class_name ||
      frontendSpec.default_function_priority_class_name
  )
  const defaultPodsResources = useMemo(() => {
    return frontendSpec?.default_function_pod_resources
  }, [frontendSpec.default_function_pod_resources])

  const [data, setData] = useState({
    volumeMounts: getDefaultVolumeMounts(
      defaultData.volume_mounts ?? [],
      defaultData.volumes ?? [],
      mode
    ),
    volumeMount: VOLUME_MOUNT_AUTO_TYPE,
    volumes: defaultData.volumes ?? [],
    limits: {
      cpu: defaultData.resources?.limits?.cpu ?? defaultPodsResources?.limits.cpu ?? '',
      cpuUnit: getDefaultCpuUnit(
        defaultData.resources?.limits ?? {},
        defaultPodsResources?.limits.cpu
      ),
      memory: defaultData.resources?.limits?.memory ?? defaultPodsResources?.limits.memory ?? '',
      [gpuType]: defaultData.resources?.limits?.[gpuType] ?? defaultPodsResources?.limits.gpu ?? '',
      memoryUnit: getDefaultMemoryUnit(
        defaultData.resources?.limits ?? {},
        defaultPodsResources?.limits.memory
      )
    },
    preemptionMode:
      frontendSpec.feature_flags.preemption_nodes === 'enabled'
        ? defaultData.preemption_mode || frontendSpec.default_function_preemption_mode || 'prevent'
        : '',
    requests: {
      cpu: defaultData.resources?.requests?.cpu ?? defaultPodsResources?.requests.cpu ?? '',
      cpuUnit: getDefaultCpuUnit(
        defaultData.resources?.requests ?? {},
        defaultPodsResources?.requests.cpu
      ),
      memory:
        defaultData.resources?.requests?.memory ?? defaultPodsResources?.requests.memory ?? '',
      memoryUnit: getDefaultMemoryUnit(
        defaultData.resources?.requests ?? {},
        defaultPodsResources?.requests.memory
      )
    }
  })

  const validFunctionPriorityClassNames = useMemo(() => {
    return (frontendSpec.valid_function_priority_class_names ?? []).map(className => ({
      id: className,
      label: generateFunctionPriorityLabel(className)
    }))
  }, [frontendSpec.valid_function_priority_class_names])

  useEffect(() => {
    if (mode === PANEL_CREATE_MODE) {
      setNewFunctionPreemtionMode(data.preemptionMode)
      setNewFunctionPriorityClassName(frontendSpec.default_function_priority_class_name ?? '')

      setNewFunctionDisableAutoMount(false)
    }
  }, [
    data.preemptionMode,
    frontendSpec.default_function_priority_class_name,
    mode,
    setNewFunctionDisableAutoMount,
    setNewFunctionPreemtionMode,
    setNewFunctionPriorityClassName
  ])

  useEffect(() => {
    setNewFunctionResources({
      limits: {
        cpu: defaultData.resources?.limits?.cpu ?? defaultPodsResources?.limits.cpu ?? '',
        memory: defaultData.resources?.limits?.memory ?? defaultPodsResources?.limits.memory ?? ''
      },
      requests: {
        cpu: defaultData.resources?.requests?.cpu ?? defaultPodsResources?.requests.cpu ?? '',
        memory:
          defaultData.resources?.requests?.memory ?? defaultPodsResources?.requests.memory ?? ''
      }
    })
  }, [
    defaultData.resources,
    defaultPodsResources.limits.cpu,
    defaultPodsResources.limits.memory,
    defaultPodsResources.requests.cpu,
    defaultPodsResources.requests.memory,
    setNewFunctionResources
  ])

  const handleAddNewVolume = newVolume => {
    const generatedVolume = createNewVolume(newVolume)
    const generatedVolumeMount = {
      isDefault: false,
      data: {
        type: newVolume.type,
        name: newVolume.name,
        mountPath: newVolume.path
      },
      canBeModified: true
    }

    setData(state => ({
      ...state,
      volumeMounts: [...state.volumeMounts, generatedVolumeMount],
      volumes: [...state.volumes, generatedVolume]
    }))
    setNewFunctionVolumeMounts([
      ...functionsStore.newFunction.spec.volume_mounts,
      {
        name: generatedVolumeMount.data.name,
        mountPath: generatedVolumeMount.data.mountPath
      }
    ])
    setNewFunctionVolumes([...functionsStore.newFunction.spec.volumes, generatedVolume])
  }

  const handleEditVolume = (volumes, volumeMounts) => {
    setNewFunctionVolumes([...volumes])
    setNewFunctionVolumeMounts(
      volumeMounts.map(volume => ({
        name: volume.data.name,
        mountPath: volume.data.mountPath
      }))
    )
  }

  const handleDeleteVolume = (volumes, volumeMounts) => {
    setData(state => ({
      ...state,
      volumeMounts,
      volumes
    }))
    setNewFunctionVolumeMounts(
      volumeMounts.map(volume => ({
        name: volume.data.name,
        mountPath: volume.data.mountPath
      }))
    )
    setNewFunctionVolumes(volumes)
  }

  const handleSelectPreemptionMode = value => {
    setData(state => ({
      ...state,
      preemptionMode: value
    }))
    setNewFunctionPreemtionMode(value)
  }

  const handleSelectVolumeMount = value => {
    switch (value) {
      case VOLUME_MOUNT_AUTO_TYPE:
        setData(state => ({
          ...state,
          volumes: [],
          volumeMounts: [],
          volumeMount: value
        }))
        setNewFunctionVolumes([])
        setNewFunctionVolumeMounts([])
        setNewFunctionDisableAutoMount(false)
        break
      case VOLUME_MOUNT_NONE_TYPE:
        setData(state => ({
          ...state,
          volumes: [],
          volumeMounts: [],
          volumeMount: value
        }))
        setNewFunctionVolumes([])
        setNewFunctionVolumeMounts([])
        setNewFunctionDisableAutoMount(true)
        break
      default:
        setData(state => ({
          ...state,
          volumeMount: value
        }))
        setNewFunctionDisableAutoMount(true)
    }
  }

  const selectPodsPriorityClassName = value => {
    setNewFunctionPriorityClassName(value)
    setPodsPriorityClassName(value)
  }

  const handleSelectMemoryUnit = (value, type) => {
    const unit = value.match(/i/) ? value.slice(0, value.match(/i/).index + 1) : value.slice(0, 1)

    setData(state => ({
      ...state,
      [type]: {
        ...state[type],
        memory:
          state[type].memory.length > 0
            ? `${Number.parseInt(state[type].memory)}${value !== 'Bytes' ? unit : ''}`
            : state[type].memory,
        memoryUnit: value
      }
    }))

    if (data[type].memory.length > 0) {
      setNewFunctionResources({
        [type]:
          data[type].memory.length > 0
            ? {
                ...functionsStore.newFunction.spec.resources[type],
                memory: `${Number.parseInt(data[type].memory)}${value !== 'Bytes' ? unit : ''}`
              }
            : functionsStore.newFunction.spec.resources[type]
      })
    }

    setMemoryDropdownValidation(data, setValidation, type, value)
  }

  const setMemoryValue = (value, type, validationField) => {
    const convertedMemoryValue = value.toString()
    const memory = generateFullMemoryValue(convertedMemoryValue, type, data)

    setData(state => ({
      ...state,
      [type]: {
        ...state[type],
        memory
      }
    }))
    setNewFunctionResources({
      ...functionsStore.newFunction.spec.resources,
      [type]: {
        ...functionsStore.newFunction.spec.resources[type],
        memory
      }
    })
    setMemoryInputValidation(data, setValidation, type, validationField, convertedMemoryValue)
  }

  const handleSelectCpuUnit = (value, type) => {
    const selectedOption = getSelectedCpuOption(value)

    setData(state => ({
      ...state,
      [type]:
        state[type].cpu.length > 0
          ? {
              ...state[type],
              cpu: selectedOption.onChange(state[type].cpu),
              cpuUnit: value
            }
          : {
              ...state[type],
              cpuUnit: value
            }
    }))

    if (data[type].cpu.length > 0) {
      setNewFunctionResources({
        [type]:
          data[type].cpu.length > 0
            ? {
                ...functionsStore.newFunction.spec.resources[type],
                cpu: selectedOption.onChange(data[type].cpu)
              }
            : functionsStore.newFunction.spec.resources[type]
      })
    }
  }

  const setCpuValue = (value, type, validationField) => {
    const convertedValue = value.toString()

    setData(state => ({
      ...state,
      [type]: {
        ...state[type],
        cpu: generateFullCpuValue(convertedValue, type, state)
      }
    }))
    setNewFunctionResources({
      ...functionsStore.newFunction.spec.resources,
      [type]: {
        ...functionsStore.newFunction.spec.resources[type],
        cpu: generateFullCpuValue(convertedValue, type, data)
      }
    })

    setCpuValidation(data, setValidation, type, validationField, convertedValue)
  }

  const setGpuValue = value => {
    let isValid = true

    if (value && Number(value) <= 0) {
      isValid = false
    }

    setData(state => ({
      ...state,
      limits: {
        ...state.limits,
        [gpuType]: String(value)
      }
    }))
    setNewFunctionResources({
      ...functionsStore.newFunction.spec.resources,
      limits: {
        ...functionsStore.newFunction.spec.resources.limits,
        [gpuType]: String(value)
      }
    })
    setValidation(prevState => ({ ...prevState, isGpuLimitValid: isValid }))
  }

  return (
    <FunctionsPanelResourcesView
      data={data}
      gpuType={gpuType}
      handleAddNewVolume={handleAddNewVolume}
      handleDeleteVolume={handleDeleteVolume}
      handleEditVolume={handleEditVolume}
      handleSelectCpuUnit={handleSelectCpuUnit}
      handleSelectMemoryUnit={handleSelectMemoryUnit}
      handleSelectPreemptionMode={handleSelectPreemptionMode}
      handleSelectVolumeMount={handleSelectVolumeMount}
      mode={mode}
      podsPriorityClassName={podsPriorityClassName}
      selectPodsPriorityClassName={selectPodsPriorityClassName}
      setCpuValue={setCpuValue}
      setData={setData}
      setGpuValue={setGpuValue}
      setMemoryValue={setMemoryValue}
      setNewFunctionResources={setNewFunctionResources}
      setValidation={setValidation}
      validFunctionPriorityClassNames={validFunctionPriorityClassNames}
      validation={validation}
    />
  )
}

FunctionsPanelResources.defaultProp = {
  defaultData: {}
}

FunctionsPanelResources.propTypes = {
  defaultData: PropTypes.shape({}),
  mode: FUNCTION_PANEL_MODE.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({})
}

export default connect(
  ({ functionsStore, appStore }) => ({
    functionsStore,
    frontendSpec: appStore.frontendSpec
  }),
  {
    ...functionsActions
  }
)(FunctionsPanelResources)
