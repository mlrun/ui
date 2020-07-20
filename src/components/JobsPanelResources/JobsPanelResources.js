import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

import JobsPanelResourcesView from './JobsPanelResourcesView'

import { panelActions } from '../JobsPanel/panelReducer'
import {
  createVolumeOfNewJob,
  handleAddItem,
  handleEdit,
  handleDelete
} from './jobsPanelResources.util'
import {
  jobsPanelResourcesReducer,
  initialState,
  resourcesActions
} from './jobsPanelResourcesReducer'
import { inputsActions } from '../JobsPanelDataInputs/jobsPanelDataInputsReducer'

const JobsPanelResources = ({
  match,
  panelDispatch,
  panelState,
  setNewJobVolumeMounts,
  setNewJobVolumes,
  volumeMounts,
  volumes
}) => {
  const [resourcesState, resourcesDispatch] = useReducer(
    jobsPanelResourcesReducer,
    initialState
  )

  const requestsCpu = panelState.requests.cpu.match(/m/)
    ? panelState.requests.cpu.slice(0, panelState.requests.cpu.length - 1)
    : panelState.requests.cpu

  const requestsMemory = panelState.requests.memory.match(/[a-zA-Z]/)
    ? panelState.requests.memory.slice(
        0,
        panelState.requests.memory.match(/[a-zA-Z]/).index
      )
    : panelState.requests.memory

  const handleSelectMemoryUnit = value => {
    if (panelState.requests.memory.length > 0 && value !== 'Bytes') {
      const unit = value.match(/i/)
        ? value.slice(0, value.match(/i/).index + 1)
        : value.slice(0, 1)

      panelDispatch({
        type: panelActions.SET_REQUESTS_MEMORY,
        payload: panelState.requests.memory + unit
      })
    }

    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: value
    })
  }

  const handleAddNewItem = () => {
    const newItemObj = {
      name: resourcesState.newVolume.name,
      type: resourcesState.newVolume.type,
      path: resourcesState.newVolume.path
    }

    handleAddItem(
      panelState.tableData.volumeMounts,
      resourcesDispatch,
      newItemObj,
      volumeMounts,
      panelDispatch,
      panelState.previousPanelData.tableData.volumeMounts,
      resourcesActions.REMOVE_NEW_VOLUME_DATA,
      resourcesActions.SET_ADD_NEW_VOLUME,
      panelActions.SET_TABLE_DATA_VOLUME_MOUNTS,
      panelActions.SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS,
      setNewJobVolumeMounts
    )

    const newItem = createVolumeOfNewJob(resourcesState.newVolume)

    setNewJobVolumes([...volumes, newItem])
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_VOLUMES,
      payload: [...panelState.previousPanelData.tableData.volumes, newItem]
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_VOLUMES,
      payload: [...panelState.tableData.volumes, newItem]
    })
  }

  const handleEditVolume = () => {
    const currentVolumes = panelState.tableData.volumes.map(volume => {
      if (volume.name === resourcesState.selectedVolume.data.name) {
        volume.name =
          resourcesState.selectedVolume.newName ||
          resourcesState.selectedVolume.data.name

        switch (resourcesState.selectedVolume.type.value) {
          case 'Config Map':
            volume.configMap.name = resourcesState.selectedVolume.type.name
            break
          case 'PVC':
            volume.persistentVolumeClaim.claimName =
              resourcesState.selectedVolume.type.name
            break
          case 'Secret':
            volume.secret.secretName = resourcesState.selectedVolume.type.name
            break
          default:
            volume.flexVolume.options = {
              container: resourcesState.selectedVolume.type.name,
              accessKey: resourcesState.selectedVolume.type.accessKey,
              subPath: resourcesState.selectedVolume.type.subPath
            }
        }
      }

      return volume
    })

    setNewJobVolumes([...currentVolumes])
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_VOLUMES,
      payload: currentVolumes
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_VOLUMES,
      payload: currentVolumes
    })
  }

  const handleEditItems = () => {
    handleEditVolume()
    handleEdit(
      volumeMounts,
      panelState.tableData.volumeMounts,
      resourcesDispatch,
      resourcesState.selectedVolume.newName,
      panelDispatch,
      inputsActions.SET_SELECTED_VOLUME,
      resourcesState.selectedVolume.data,
      setNewJobVolumeMounts,
      panelActions.SET_TABLE_DATA_VOLUME_MOUNTS,
      panelActions.SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS
    )
  }

  const handleDeleteItems = item => {
    handleDelete(
      volumes,
      panelState.tableData.volumes,
      panelDispatch,
      panelState.previousPanelData.tableData.volumes,
      item,
      setNewJobVolumes,
      panelActions.SET_TABLE_DATA_VOLUMES,
      panelActions.SET_PREVIOUS_PANEL_DATA_VOLUMES
    )
    handleDelete(
      volumeMounts,
      panelState.tableData.volumeMounts,
      panelDispatch,
      panelState.previousPanelData.tableData.volumeMounts,
      item,
      setNewJobVolumeMounts,
      panelActions.SET_TABLE_DATA_VOLUME_MOUNTS,
      panelActions.SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS
    )
  }

  const handleSelectСpuUnit = value => {
    if (panelState.requests.cpu > 0 && value.match(/m/)) {
      panelDispatch({
        type: panelActions.SET_REQUESTS_CPU,
        payload: panelState.requests.cpu + value.slice(0, 1)
      })
    }

    panelDispatch({
      type: panelActions.SET_CPU_UNIT,
      payload: value
    })
  }

  return (
    <JobsPanelResourcesView
      handleAddNewItem={handleAddNewItem}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      handleSelectMemoryUnit={handleSelectMemoryUnit}
      handleSelectСpuUnit={handleSelectСpuUnit}
      match={match}
      panelDispatch={panelDispatch}
      panelState={panelState}
      requestsCpu={requestsCpu}
      requestsMemory={requestsMemory}
      resourcesState={resourcesState}
      resourcesDispatch={resourcesDispatch}
    />
  )
}

JobsPanelResources.propTypes = {
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setNewJobVolumeMounts: PropTypes.func.isRequired,
  setNewJobVolumes: PropTypes.func.isRequired,
  volumeMounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  volumes: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default JobsPanelResources
