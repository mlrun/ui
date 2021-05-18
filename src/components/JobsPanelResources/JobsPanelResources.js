import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import JobsPanelResourcesView from './JobsPanelResourcesView'

import { panelActions } from '../JobsPanel/panelReducer'
import {
  generateCpuValue,
  generateMemoryValue
} from '../../utils/panelResources.util'
import { createNewVolume } from '../../utils/createNewVolume'

const JobsPanelResources = ({
  panelDispatch,
  panelState,
  setNewJobVolumeMounts,
  setNewJobVolumes,
  volumeMounts,
  volumes
}) => {
  const generateResourcesData = useCallback(
    () => ({
      limitsCpu: generateCpuValue(panelState.limits.cpu),
      requestsCpu: generateCpuValue(panelState.requests.cpu),
      requestsMemory: generateMemoryValue(panelState.requests.memory),
      limitsMemory: generateMemoryValue(panelState.limits.memory)
    }),
    [panelState.limits.cpu, panelState.limits.memory, panelState.requests]
  )

  const handleSelectMemoryUnit = value => {
    if (value !== 'Bytes') {
      const unit = value.match(/i/)
        ? value.slice(0, value.match(/i/).index + 1)
        : value.slice(0, 1)

      if (panelState.requests.memory.length > 0) {
        panelDispatch({
          type: panelActions.SET_REQUESTS_MEMORY,
          payload: Number.parseInt(panelState.requests.memory) + unit
        })
      }

      if (panelState.limits.memory.length > 0) {
        panelDispatch({
          type: panelActions.SET_LIMITS_MEMORY,
          payload: Number.parseInt(panelState.limits.memory) + unit
        })
      }
    } else {
      if (panelState.requests.memory.match(/[a-zA-Z]/)) {
        panelDispatch({
          type: panelActions.SET_REQUESTS_MEMORY,
          payload: Number.parseInt(panelState.requests.memory)
        })
      }

      if (panelState.limits.memory.match(/[a-zA-Z]/)) {
        panelDispatch({
          type: panelActions.SET_LIMITS_MEMORY,
          payload: Number.parseInt(panelState.limits.memory)
        })
      }
    }

    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: value
    })
  }

  const handleSelectСpuUnit = value => {
    if (value.match(/m/)) {
      if (panelState.requests.cpu > 0) {
        panelDispatch({
          type: panelActions.SET_REQUESTS_CPU,
          payload: panelState.requests.cpu + value.slice(0, 1)
        })
      }

      if (panelState.limits.cpu > 0) {
        panelDispatch({
          type: panelActions.SET_LIMITS_CPU,
          payload: panelState.limits.cpu + value.slice(0, 1)
        })
      }
    } else {
      if (panelState.requests.cpu.match(/m/)) {
        panelDispatch({
          type: panelActions.SET_REQUESTS_CPU,
          payload: Number.parseInt(panelState.requests.cpu)
        })
      }

      if (panelState.limits.cpu.match(/m/)) {
        panelDispatch({
          type: panelActions.SET_LIMITS_CPU,
          payload: Number.parseInt(panelState.limits.cpu)
        })
      }
    }

    panelDispatch({
      type: panelActions.SET_CPU_UNIT,
      payload: value
    })
  }

  const handleAddNewVolume = newVolume => {
    const newVolumeMount = {
      isDefault: false,
      data: {
        name: newVolume.name,
        mountPath: newVolume.path
      }
    }
    const generatedVolume = createNewVolume(newVolume)

    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS,
      payload: [
        ...panelState.previousPanelData.tableData.volume_mounts,
        newVolumeMount
      ]
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_VOLUME_MOUNTS,
      payload: [...panelState.tableData.volume_mounts, newVolumeMount]
    })
    setNewJobVolumeMounts([...volumeMounts, newVolumeMount.data])
    setNewJobVolumes([...volumes, generatedVolume])
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_VOLUMES,
      payload: [
        ...panelState.previousPanelData.tableData.volumes,
        generatedVolume
      ]
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_VOLUMES,
      payload: [...panelState.tableData.volumes, generatedVolume]
    })
  }

  const handleEditVolume = (volumes, volumeMounts) => {
    setNewJobVolumes([...volumes])
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_VOLUMES,
      payload: volumes
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_VOLUMES,
      payload: volumes
    })
    setNewJobVolumeMounts(volumeMounts.map(volume => volume.data))
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS,
      payload: volumeMounts
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_VOLUME_MOUNTS,
      payload: volumeMounts
    })
  }

  const handleDeleteVolume = (volumes, volumeMounts) => {
    setNewJobVolumes(volumes)
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_VOLUMES,
      payload: volumes
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_VOLUMES,
      payload: volumes
    })
    setNewJobVolumeMounts(volumeMounts.map(volumeMount => volumeMount.data))
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS,
      payload: volumeMounts
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_VOLUME_MOUNTS,
      payload: volumeMounts
    })
  }

  return (
    <JobsPanelResourcesView
      handleAddNewVolume={handleAddNewVolume}
      handleDeleteVolume={handleDeleteVolume}
      handleEditVolume={handleEditVolume}
      handleSelectСpuUnit={handleSelectСpuUnit}
      handleSelectMemoryUnit={handleSelectMemoryUnit}
      panelDispatch={panelDispatch}
      panelState={panelState}
      resourcesData={generateResourcesData()}
    />
  )
}

JobsPanelResources.propTypes = {
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setNewJobVolumeMounts: PropTypes.func.isRequired,
  setNewJobVolumes: PropTypes.func.isRequired,
  volumeMounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  volumes: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default JobsPanelResources
