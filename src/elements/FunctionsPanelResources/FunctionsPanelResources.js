import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FunctionsPanelResourcesView from './FunctionsPanelResourcesView'

import { createNewVolume } from '../../utils/createNewVolume'
import functionsActions from '../../actions/functions'
import {
  getDefaultCpuUnit,
  getDefaultMemoryUnit,
  getDefaultVolumeMounts,
  setRangeInputValidation,
  VOLUME_MOUNT_AUTO_TYPE,
  VOLUME_MOUNT_NONE_TYPE
} from './functionsPanelResources.util'
import { FUNCTION_PANEL_MODE } from '../../types'
import { PANEL_CREATE_MODE } from '../../constants'

const FunctionsPanelResources = ({
  defaultData,
  functionsStore,
  mode,
  setNewFunctionDisableAutoMount,
  setNewFunctionVolumeMounts,
  setNewFunctionVolumes,
  setNewFunctionResources,
  setValidation,
  validation
}) => {
  const [data, setData] = useState({
    volumeMounts: getDefaultVolumeMounts(
      defaultData.volume_mounts ?? [],
      defaultData.volumes ?? [],
      mode
    ),
    volumeMount: VOLUME_MOUNT_AUTO_TYPE,
    volumes: defaultData.volumes ?? [],
    memoryUnit:
      getDefaultMemoryUnit(
        defaultData.resources?.limits ?? {},
        defaultData.resources?.requests ?? {}
      ) ?? 'MiB',
    cpuUnit:
      getDefaultCpuUnit(
        defaultData.resources?.limits ?? {},
        defaultData.resources?.requests ?? {}
      ) ?? 'cpu',
    limits: {
      cpu: defaultData.resources?.limits?.cpu ?? '',
      memory: defaultData.resources?.limits?.memory ?? '',
      'nvidia.com/gpu': defaultData.resources?.limits?.['nvidia.com/gpu'] ?? ''
    },
    requests: {
      cpu: defaultData.resources?.requests?.cpu ?? '',
      memory: defaultData.resources?.requests?.memory ?? ''
    }
  })

  useEffect(() => {
    if (mode === PANEL_CREATE_MODE) {
      setNewFunctionDisableAutoMount(false)
    }
  }, [mode, setNewFunctionDisableAutoMount])

  const handleSelectMemoryUnit = value => {
    const unit = value.match(/i/)
      ? value.slice(0, value.match(/i/).index + 1)
      : value.slice(0, 1)

    setData(state => ({
      ...state,
      memoryUnit: value,
      requests: {
        ...state.requests,
        memory:
          state.requests.memory.length > 0
            ? `${Number.parseInt(state.requests.memory)}${
                value !== 'Bytes' ? unit : ''
              }`
            : state.requests.memory
      },
      limits: {
        ...state.limits,
        memory:
          data.limits.memory.length > 0
            ? `${Number.parseInt(state.limits.memory)}${
                value !== 'Bytes' ? unit : ''
              }`
            : state.limits.memory
      }
    }))

    if (data.requests.memory.length > 0 || data.limits.memory.length > 0) {
      setNewFunctionResources({
        requests:
          data.requests.memory.length > 0
            ? {
                ...functionsStore.newFunction.spec.resources.requests,
                memory: `${Number.parseInt(data.requests.memory)}${
                  value !== 'Bytes' ? unit : ''
                }`
              }
            : functionsStore.newFunction.spec.resources.requests,
        limits:
          data.limits.memory.length > 0
            ? {
                ...functionsStore.newFunction.spec.resources.limits,
                memory: `${Number.parseInt(data.limits.memory)}${
                  value !== 'Bytes' ? unit : ''
                }`
              }
            : functionsStore.newFunction.spec.resources.limits
      })
    }
  }

  const setMemoryValue = (value, type, validationField) => {
    const memory =
      value.length === 0
        ? ''
        : `${value}${
            data.memoryUnit.length === 0 || data.memoryUnit === 'Bytes'
              ? ''
              : data.memoryUnit.match(/i/)
              ? data.memoryUnit.slice(0, 2)
              : data.memoryUnit.slice(0, 1)
          }`
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
    setRangeInputValidation(
      data,
      setValidation,
      value,
      type,
      validationField,
      'memory'
    )
  }

  const handleSelectCpuUnit = value => {
    setData(state => ({
      ...state,
      cpuUnit: value,
      requests:
        state.requests.cpu.length > 0
          ? {
              ...state.requests,
              cpu: value.match(/m/)
                ? state.requests.cpu + value.slice(0, 1)
                : state.requests.cpu.match(/m/)
                ? String(Number.parseInt(state.requests.cpu))
                : state.requests.cpu
            }
          : state.requests,
      limits:
        state.limits.cpu.length > 0
          ? {
              ...state.limits,
              cpu: value.match(/m/)
                ? state.limits.cpu + value.slice(0, 1)
                : state.limits.cpu.match(/m/)
                ? String(Number.parseInt(state.limits.cpu))
                : state.limits.cpu
            }
          : state.limits
    }))

    if (data.requests.cpu.length > 0 || data.limits.cpu.length > 0) {
      setNewFunctionResources({
        requests:
          data.requests.cpu.length > 0
            ? {
                ...functionsStore.newFunction.spec.resources.requests,
                cpu: value.match(/m/)
                  ? data.requests.cpu + value.slice(0, 1)
                  : data.requests.cpu.match(/m/)
                  ? String(Number.parseInt(data.requests.cpu))
                  : data.requests.cpu
              }
            : functionsStore.newFunction.spec.resources.requests,
        limits:
          data.limits.cpu.length > 0
            ? {
                ...functionsStore.newFunction.spec.resources.limits,
                cpu: value.match(/m/)
                  ? data.limits.cpu + value.slice(0, 1)
                  : data.limits.cpu.match(/m/)
                  ? String(Number.parseInt(data.limits.cpu))
                  : data.limits.cpu
              }
            : functionsStore.newFunction.spec.resources.limits
      })
    }
  }

  const setCpuValue = (value, type, validationField) => {
    setData(state => ({
      ...state,
      [type]: {
        ...state[type],
        cpu: `${value}${state.cpuUnit === 'millicpu' ? 'm' : ''}`
      }
    }))
    setNewFunctionResources({
      ...functionsStore.newFunction.spec.resources,
      [type]: {
        ...functionsStore.newFunction.spec.resources[type],
        cpu: `${value}${data.cpuUnit === 'millicpu' ? 'm' : ''}`
      }
    })
    setRangeInputValidation(
      data,
      setValidation,
      value,
      type,
      validationField,
      'cpu'
    )
  }

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
    setNewFunctionVolumes([
      ...functionsStore.newFunction.spec.volumes,
      generatedVolume
    ])
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

  const setGpuValue = value => {
    let isValid = true

    if (value && Number(value) <= 0) {
      isValid = false
    }

    setData(state => ({
      ...state,
      limits: {
        ...state.limits,
        'nvidia.com/gpu': String(value)
      }
    }))
    setNewFunctionResources({
      ...functionsStore.newFunction.spec.resources,
      limits: {
        ...functionsStore.newFunction.spec.resources.limits,
        'nvidia.com/gpu': String(value)
      }
    })
    setValidation(prevState => ({ ...prevState, isGpuLimitValid: isValid }))
  }

  return (
    <FunctionsPanelResourcesView
      data={data}
      handleAddNewVolume={handleAddNewVolume}
      handleDeleteVolume={handleDeleteVolume}
      handleEditVolume={handleEditVolume}
      handleSelectCpuUnit={handleSelectCpuUnit}
      handleSelectMemoryUnit={handleSelectMemoryUnit}
      handleSelectVolumeMount={handleSelectVolumeMount}
      mode={mode}
      setData={setData}
      setMemoryValue={setMemoryValue}
      setCpuValue={setCpuValue}
      setGpuValue={setGpuValue}
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

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelResources)
