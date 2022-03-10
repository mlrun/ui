import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { VolumesTable } from '../../../elements/VolumesTable/VolumesTable'

import { createNewVolume } from '../../../utils/createNewVolume'
import { panelActions } from '../../JobsPanel/panelReducer'
import jobsActions from '../../../actions/jobs'

const JobsPanelVolumes = ({
  jobsStore,
  panelDispatch,
  panelState,
  setNewJobVolumeMounts,
  setNewJobVolumes
}) => {
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

  return (
    <VolumesTable
      handleAddNewVolume={handleAddNewVolume}
      handleDelete={handleDeleteVolume}
      handleEdit={handleEditVolume}
      className={'data-inputs volumes'}
      volumeMounts={panelState.tableData.volume_mounts}
      volumes={panelState.tableData.volumes}
    />
  )
}

JobsPanelVolumes.propTypes = {
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => jobsStore, {
  setNewJobVolumeMounts: jobsActions.setNewJobVolumeMounts,
  setNewJobVolumes: jobsActions.setNewJobVolumes
})(JobsPanelVolumes)
