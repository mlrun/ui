import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

import JobsPanelDataInputsView from './JobsPanelDataInputsView'

import {
  initialState,
  inputsActions,
  jobsPanelDataInputsReducer
} from './jobsPanelDataInputsReducer'
import { panelActions } from '../JobsPanel/panelReducer'
import {
  createVolumeOfNewJob,
  handleAddItem,
  handleDelete,
  handleEdit
} from './jobsPanelDataInputs.util'

const JobsPanelDataInputs = ({
  inputs,
  match,
  panelDispatch,
  panelState,
  setNewJobInputs,
  setNewJobVolumeMounts,
  setNewJobVolumes,
  volumeMounts,
  volumes
}) => {
  const [inputsState, inputsDispatch] = useReducer(
    jobsPanelDataInputsReducer,
    initialState
  )

  const handleAddNewItem = (input, volume) => {
    if (input) {
      handleAddItem(
        panelState.tableData.dataInputs,
        inputsDispatch,
        false,
        inputsState.newInput,
        inputs,
        panelDispatch,
        panelState.previousPanelData.tableData.dataInputs,
        inputsActions.REMOVE_NEW_INPUT_DATA,
        inputsActions.SET_ADD_NEW_INPUT,
        panelActions.SET_TABLE_DATA_INPUTS,
        panelActions.SET_PREVIOUS_PANEL_DATA_INPUTS,
        setNewJobInputs
      )
    } else if (volume) {
      const newItemObj = {
        name: inputsState.newVolume.name,
        type: inputsState.newVolume.type,
        path: inputsState.newVolume.path
      }

      handleAddItem(
        panelState.tableData.volumeMounts,
        inputsDispatch,
        true,
        newItemObj,
        volumeMounts,
        panelDispatch,
        panelState.previousPanelData.tableData.volumeMounts,
        inputsActions.REMOVE_NEW_VOLUME_DATA,
        inputsActions.SET_ADD_NEW_VOLUME,
        panelActions.SET_TABLE_DATA_VOLUME_MOUNTS,
        panelActions.SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS,
        setNewJobVolumeMounts
      )

      const newItem = createVolumeOfNewJob(inputsState.newVolume)

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
  }

  const handleEditItems = isInput => {
    if (isInput) {
      handleEdit(
        inputs,
        panelState.tableData.dataInputs,
        inputsDispatch,
        true,
        inputsState.selectedDataInput.newDataInputName,
        panelDispatch,
        inputsActions.SET_SELECTED_INPUT,
        inputsState.selectedDataInput.data,
        setNewJobInputs,
        panelActions.SET_TABLE_DATA_INPUTS,
        panelActions.SET_PREVIOUS_PANEL_DATA_INPUTS
      )
    } else {
      handleEdit(
        volumeMounts,
        panelState.tableData.volumeMounts,
        inputsDispatch,
        false,
        false,
        panelDispatch,
        inputsActions.SET_SELECTED_VOLUME,
        inputsState.selectedVolume.data,
        setNewJobVolumeMounts,
        panelActions.SET_TABLE_DATA_VOLUME_MOUNTS,
        panelActions.SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS
      )
      handleEditVolume()
    }
  }

  const handleDeleteItems = (isInput, item) => {
    if (isInput) {
      handleDelete(
        inputs,
        panelState.tableData.dataInputs,
        true,
        false,
        panelDispatch,
        panelState.previousPanelData.tableData.dataInputs,
        item,
        setNewJobInputs,
        panelActions.SET_TABLE_DATA_INPUTS,
        panelActions.SET_PREVIOUS_PANEL_DATA_INPUTS
      )
    } else {
      handleDelete(
        volumes,
        panelState.tableData.volumes,
        false,
        true,
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
        false,
        false,
        panelDispatch,
        panelState.previousPanelData.tableData.volumeMounts,
        item,
        setNewJobVolumeMounts,
        panelActions.SET_TABLE_DATA_VOLUME_MOUNTS,
        panelActions.SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS
      )
    }
  }

  const handleEditVolume = () => {
    const currentVolumes = panelState.tableData.volumes.map(volume => {
      if (volume.name === inputsState.selectedVolume.data.name) {
        switch (inputsState.selectedVolume.type.value) {
          case 'Config Map':
            volume.configMap.name = inputsState.selectedVolume.type.name
            break
          case 'PVC':
            volume.persistentVolumeClaim.claimName =
              inputsState.selectedVolume.type.name
            break
          case 'Secret':
            volume.secret.secretName = inputsState.selectedVolume.type.name
            break
          default:
            volume.flexVolume.options = {
              container: inputsState.selectedVolume.type.name,
              accessKey: inputsState.selectedVolume.type.accessKey,
              subPath: inputsState.selectedVolume.type.subPath
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

  return (
    <JobsPanelDataInputsView
      handleAddNewItem={handleAddNewItem}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      inputsState={inputsState}
      inputsDispatch={inputsDispatch}
      match={match}
      panelDispatch={panelDispatch}
      panelState={panelState}
    />
  )
}

JobsPanelDataInputs.propTypes = {
  inputs: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setNewJobInputs: PropTypes.func.isRequired,
  setNewJobVolumeMounts: PropTypes.func.isRequired,
  setNewJobVolumes: PropTypes.func.isRequired,
  volumeMounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  volumes: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default JobsPanelDataInputs
