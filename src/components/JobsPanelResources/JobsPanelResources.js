import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import JobsPanelResourcesView from './JobsPanelResourcesView'

import { panelActions } from '../JobsPanel/panelReducer'
import {
  generateCpuValue,
  generateMemoryValue
} from '../../utils/panelResources.util'
import { createNewVolume } from '../../utils/createNewVolume'
import jobsActions from '../../actions/jobs'
import { setRangeInputValidation } from './jobsPanelResources.util'

const JobsPanelResources = ({
  jobsStore,
  panelDispatch,
  panelState,
  setNewJobNodeSelector,
  setNewJobVolumeMounts,
  setNewJobVolumes,
  setValidation,
  validation
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

  const handleSelectCpuUnit = value => {
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
        type: newVolume.type,
        name: newVolume.name,
        mountPath: newVolume.path
      },
      canBeModified: true
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
    setNewJobVolumeMounts([
      ...jobsStore.newJob.function.spec.volume_mounts,
      {
        name: newVolumeMount.data.name,
        mountPath: newVolumeMount.data.mountPath
      }
    ])
    setNewJobVolumes([
      ...jobsStore.newJob.function.spec.volumes,
      generatedVolume
    ])
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
    setNewJobVolumeMounts(
      volumeMounts.map(volume => ({
        name: volume.data.name,
        mountPath: volume.data.mountPath
      }))
    )
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
    setNewJobVolumeMounts(
      volumeMounts.map(volumeMount => ({
        name: volumeMount.data.name,
        mountPath: volumeMount.data.mountPath
      }))
    )
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS,
      payload: volumeMounts
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_VOLUME_MOUNTS,
      payload: volumeMounts
    })
  }

  const handleAddNewNodeSelector = newNodeSelector => {
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_NODE_SELECTOR,
      payload: [
        ...panelState.previousPanelData.tableData.node_selector,
        newNodeSelector
      ]
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_NODE_SELECTOR,
      payload: [...panelState.tableData.node_selector, newNodeSelector]
    })
    setNewJobNodeSelector({
      ...jobsStore.newJob.function.spec.node_selector,
      [newNodeSelector.key]: newNodeSelector.value
    })
  }

  const handleEditNodeSelector = nodeSelector => {
    const newNodeSelector = { ...jobsStore.newJob.function.spec.node_selector }
    const newTableData = [...panelState.tableData.node_selector].map(
      dataItem => {
        if (dataItem.key === nodeSelector.key) {
          dataItem.key = nodeSelector.newKey || nodeSelector.key
          dataItem.value = nodeSelector.value
        }

        return dataItem
      }
    )

    if (nodeSelector.newKey) {
      delete newNodeSelector[nodeSelector.key]
    }

    newNodeSelector[nodeSelector.newKey || nodeSelector.key] =
      nodeSelector.value

    setNewJobNodeSelector(newNodeSelector)
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_NODE_SELECTOR,
      payload: newTableData
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_NODE_SELECTOR,
      payload: newTableData
    })
  }

  const handleDeleteNodeSelector = (index, nodeSelector) => {
    const newNodeSelector = { ...jobsStore.newJob.function.spec.node_selector }

    delete newNodeSelector[nodeSelector.key]
    setNewJobNodeSelector(newNodeSelector)
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_NODE_SELECTOR,
      payload: [
        ...panelState.previousPanelData.tableData.node_selector.filter(
          item => item.key !== nodeSelector.key
        )
      ]
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_NODE_SELECTOR,
      payload: [
        ...panelState.tableData.node_selector.filter(
          item => item.key !== nodeSelector.key
        )
      ]
    })
  }

  const setCpuValue = (value, data, type, validationField) => {
    panelDispatch({
      type: panelActions[`SET_${type}_CPU`],
      payload: `${value}${panelState.cpuUnit === 'millicpu' ? 'm' : ''}`
    })
    setRangeInputValidation(
      data,
      setValidation,
      value,
      type,
      validationField,
      'Cpu'
    )
  }

  const setMemoryValue = (value, data, type, validationField) => {
    panelDispatch({
      type: panelActions[`SET_${type}_MEMORY`],
      payload: `${value}${
        panelState.memoryUnit.length === 0 || panelState.memoryUnit === 'Bytes'
          ? ''
          : panelState.memoryUnit.match(/i/)
          ? panelState.memoryUnit.slice(0, 2)
          : panelState.memoryUnit.slice(0, 1)
      }`
    })
    setRangeInputValidation(
      data,
      setValidation,
      value,
      type,
      validationField,
      'Memory'
    )
  }

  const setGpuValue = value => {
    let isValid = true

    if (value && Number(value) <= 0) {
      isValid = false
    }

    panelDispatch({
      type: panelActions.SET_LIMITS_NVIDIA_GPU,
      payload: `${value}`
    })
    setValidation(prevState => ({ ...prevState, isGpuLimitValid: isValid }))
  }

  return (
    <JobsPanelResourcesView
      handleAddNewVolume={handleAddNewVolume}
      handleAddNewNodeSelector={handleAddNewNodeSelector}
      handleDeleteNodeSelector={handleDeleteNodeSelector}
      handleDeleteVolume={handleDeleteVolume}
      handleEditNodeSelector={handleEditNodeSelector}
      handleEditVolume={handleEditVolume}
      handleSelectCpuUnit={handleSelectCpuUnit}
      handleSelectMemoryUnit={handleSelectMemoryUnit}
      panelState={panelState}
      resourcesData={generateResourcesData()}
      setCpuValue={setCpuValue}
      setGpuValue={setGpuValue}
      setMemoryValue={setMemoryValue}
      validation={validation}
    />
  )
}

JobsPanelResources.propTypes = {
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => jobsStore, { ...jobsActions })(
  JobsPanelResources
)
