import React, { useState } from 'react'
import { connect } from 'react-redux'

import FunctionsPanelResourcesView from './FunctionsPanelResourcesView'

import { createNewVolume } from '../../utils/createNewVolume'
import functionsActions from '../../actions/functions'

const FunctionsPanelResources = ({
  functionsStore,
  setNewFunctionVolumeMounts,
  setNewFunctionVolumes,
  setNewFunctionResources
}) => {
  const [data, setData] = useState({
    volumeMounts: functionsStore.newFunction.spec.volume_mounts,
    volumes: functionsStore.newFunction.spec.volumes,
    memoryUnit: '',
    cpuUnit: '',
    limits: {
      cpu: '',
      memory: '',
      'nvidia.com/gpu': ''
    },
    requests: {
      cpu: '',
      memory: ''
    }
  })

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
        requests: {
          ...functionsStore.newFunction.spec.resources.requests,
          memory:
            data.requests.memory.length > 0
              ? `${Number.parseInt(data.requests.memory)}${
                  value !== 'Bytes' ? unit : ''
                }`
              : data.requests.memory
        },
        limits: {
          ...functionsStore.newFunction.spec.resources.limits,
          memory:
            data.limits.memory.length > 0
              ? `${Number.parseInt(data.limits.memory)}${
                  value !== 'Bytes' ? unit : ''
                }`
              : data.limits.memory
        }
      })
    }
  }

  const setMemoryValue = (value, type) => {
    const memory = `${value}${
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
  }

  const handleSelectСpuUnit = value => {
    setData(state => ({
      ...state,
      cpuUnit: value,
      requests: {
        ...state.requests,
        cpu: value.match(/m/)
          ? state.requests.cpu + value.slice(0, 1)
          : state.requests.cpu.match(/m/)
          ? String(Number.parseInt(state.requests.cpu))
          : state.requests.cpu
      },
      limits: {
        ...state.limits,
        cpu: value.match(/m/)
          ? state.limits.cpu + value.slice(0, 1)
          : state.limits.cpu.match(/m/)
          ? String(Number.parseInt(state.limits.cpu))
          : state.limits.cpu
      }
    }))

    if (data.requests.cpu.length > 0 || data.limits.cpu.length > 0) {
      setNewFunctionResources({
        requests: {
          ...functionsStore.newFunction.spec.resources.requests,
          cpu: value.match(/m/)
            ? data.requests.cpu + value.slice(0, 1)
            : data.requests.cpu.match(/m/)
            ? String(Number.parseInt(data.requests.cpu))
            : data.requests.cpu
        },
        limits: {
          ...functionsStore.newFunction.spec.resources.limits,
          cpu: value.match(/m/)
            ? data.limits.cpu + value.slice(0, 1)
            : data.limits.cpu.match(/m/)
            ? String(Number.parseInt(data.limits.cpu))
            : data.limits.cpu
        }
      })
    }
  }

  const setCpuValue = (value, type) => {
    setData(state => ({
      ...state,
      [type]: {
        ...state[type],
        cpu: `${value}${state.cpuUnit === 'millicpu' ? 'm' : ''}`
      }
    }))
  }

  const handleAddNewVolume = newVolume => {
    const generatedVolume = createNewVolume(newVolume)
    const generatedVolumeMount = {
      isDefault: false,
      data: {
        name: newVolume.name,
        mountPath: newVolume.path
      }
    }

    setData(state => ({
      ...state,
      volumeMounts: [...state.volumeMounts, generatedVolumeMount],
      volumes: [...state.volumes, generatedVolume]
    }))
    setNewFunctionVolumeMounts([
      ...functionsStore.newFunction.spec.volume_mounts,
      generatedVolumeMount.data
    ])
    setNewFunctionVolumes([
      ...functionsStore.newFunction.spec.volumes,
      generatedVolume
    ])
  }

  const handleEditVolume = (volumes, volumeMounts) => {
    setNewFunctionVolumes([...volumes])
    setNewFunctionVolumeMounts(volumeMounts.map(volume => volume.data))
  }

  const handleDeleteVolume = (volumes, volumeMounts) => {
    setData(state => ({
      ...state,
      volumeMounts,
      volumes
    }))
    setNewFunctionVolumeMounts(volumeMounts.map(volume => volume.data))
    setNewFunctionVolumes(volumes)
  }

  const setGpuValue = value => {
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
  }

  return (
    <FunctionsPanelResourcesView
      data={data}
      handleAddNewVolume={handleAddNewVolume}
      handleDeleteVolume={handleDeleteVolume}
      handleEditVolume={handleEditVolume}
      handleSelectMemoryUnit={handleSelectMemoryUnit}
      setData={setData}
      setMemoryValue={setMemoryValue}
      handleSelectСpuUnit={handleSelectСpuUnit}
      setCpuValue={setCpuValue}
      setGpuValue={setGpuValue}
    />
  )
}

FunctionsPanelResources.propTypes = {}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelResources)
