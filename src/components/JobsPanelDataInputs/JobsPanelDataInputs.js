import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelDataInputsView from './JobsPanelDataInputsView'

import createVolumeOfNewJob from '../../utils/createVolumeOfNewJob'

const JobsPanelDataInputs = ({
  edit,
  inputs,
  match,
  setInputPath,
  setNewJobInputs,
  setNewJobVolumes,
  setNewJobVolumeMounts,
  setOutputPath,
  volumes,
  volumeMounts
}) => {
  const [addNewInput, setAddNewInput] = useState(false)
  const [newInput, setNewInput] = useState({
    name: '',
    path: ''
  })

  const [addNewVolume, setAddNewVolume] = useState(false)
  const [newVolume, setNewVolume] = useState({
    name: '',
    type: '',
    typeName: '',
    path: '',
    accessKey: '',
    resourcesPath: ''
  })
  const [selectedDataInput, setSelectedDataInput] = useState({})
  const [selectedVolume, setSelectedVolume] = useState({})

  const handleAddNewItem = (input, volume) => {
    if (input) {
      handleAddNewDataInput()
    } else if (volume) {
      handleAddNewVolume()
    }
  }

  const handleEditItems = isInput => {
    if (isInput) {
      handleEditDataInput()
    } else {
      handleEditVolume()
    }

    setSelectedDataInput({})
  }

  const handleAddNewDataInput = () => {
    let newItem = {}
    const emptyInput = Object.values(newInput).filter(item => item.length === 0)

    if (emptyInput.length > 0) {
      setNewInput({
        name: '',
        path: ''
      })

      return setAddNewInput(false)
    }

    newItem[newInput.name] = newInput.path

    setAddNewInput(false)
    setNewJobInputs({ ...inputs, ...newItem })
    setNewInput({
      name: '',
      path: ''
    })
  }

  const handleEditDataInput = () => {
    const currentInputs = { ...inputs }

    currentInputs[selectedDataInput.name] = selectedDataInput.path

    setNewJobInputs({ ...inputs, ...currentInputs })
  }

  const handleAddNewVolume = () => {
    if (!newVolume.name || !newVolume.type || !newVolume.path) {
      setNewVolume({
        name: '',
        type: '',
        typeName: '',
        path: '',
        accessKey: '',
        resourcesPath: ''
      })

      return setAddNewVolume(false)
    }

    const newItem = createVolumeOfNewJob(newVolume)

    const newVolumeMounts = {
      name: newVolume.name,
      mountPath: newVolume.path
    }

    setNewJobVolumes([...volumes, newItem])
    setNewJobVolumeMounts([...volumeMounts, newVolumeMounts])
    setAddNewVolume(false)
    setNewVolume({
      name: '',
      type: '',
      typeName: '',
      path: '',
      accessKey: '',
      resourcesPath: ''
    })
  }

  const handleEditVolume = () => {
    const currentVolumeMounts = volumeMounts.map(volume => {
      if (volume.name === selectedVolume.name) {
        volume.mountPath = selectedVolume.mountPath
      }

      return volume
    })

    const currentVolumes = volumes.map(volume => {
      if (volume.name === selectedVolume.name) {
        switch (selectedVolume.type.value) {
          case 'Config Map':
            volume.configMap.name = selectedVolume.type.name
            break
          case 'PVC':
            volume.persistentVolumeClaim.claimName = selectedVolume.type.name
            break
          case 'Secret':
            volume.secret.secretName = selectedVolume.type.name
            break
          default:
            volume.flexVolume.options = {
              container: selectedVolume.type.name,
              accessKey: selectedVolume.type.accessKey,
              subPath: selectedVolume.type.subPath
            }
        }
      }

      return volume
    })

    setNewJobVolumeMounts([...currentVolumeMounts])
    setNewJobVolumes([...currentVolumes])
  }

  return (
    <JobsPanelDataInputsView
      addNewInput={addNewInput}
      addNewVolume={addNewVolume}
      edit={edit}
      handleAddNewItem={handleAddNewItem}
      handleEditItems={handleEditItems}
      inputs={inputs}
      match={match}
      newInput={newInput}
      newVolume={newVolume}
      selectedVolume={selectedVolume}
      selectedDataInput={selectedDataInput}
      setAddNewInput={setAddNewInput}
      setAddNewVolume={setAddNewVolume}
      setInputPath={setInputPath}
      setNewInput={setNewInput}
      setOutputPath={setOutputPath}
      setNewVolume={setNewVolume}
      setSelectedDataInput={setSelectedDataInput}
      setSelectedVolume={setSelectedVolume}
      volumes={volumes}
      volumeMounts={volumeMounts}
    />
  )
}

JobsPanelDataInputs.propTypes = {
  edit: PropTypes.bool.isRequired,
  inputs: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  setInputPath: PropTypes.func.isRequired,
  setNewJobInputs: PropTypes.func.isRequired,
  setNewJobVolumes: PropTypes.func.isRequired,
  setNewJobVolumeMounts: PropTypes.func.isRequired,
  setOutputPath: PropTypes.func.isRequired,
  volumes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  volumeMounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default JobsPanelDataInputs
