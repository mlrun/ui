import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelDataInputsView from './JobsPanelDataInputsView'

import createVolumeOfNewJob from '../../utils/createVolumeOfNewJob'

const JobsPanelDataInputs = ({
  functionDefaultValues,
  inputs,
  match,
  setInputPath,
  setNewJobInputs,
  setNewJobVolumeMounts,
  setNewJobVolumes,
  setOutputPath,
  volumeMounts,
  volumes
}) => {
  const [addNewInput, setAddNewInput] = useState(false)
  const [newInput, setNewInput] = useState({
    name: '',
    path: ''
  })
  const [defaultDataInputs, setDefaultDataInputs] = useState(
    functionDefaultValues.dataInputs
  )

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

  const selectOptions = {
    volumeType: [
      { label: 'V3IO', id: 'V3IO' },
      { label: 'Config Map', id: 'Config Map' },
      { label: 'Secret', id: 'Secret' },
      { label: 'PVC', id: 'PVC' }
    ]
  }

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

  const handleDeleteItems = (isInput, item) => {
    if (isInput) {
      handleDeleteDataInput(item)
    } else {
      handleDeleteVolume(item)
    }
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

    setDefaultDataInputs(prev =>
      prev.concat({
        data: { name: newInput.name, path: newInput.path },
        isValueEmpty: true,
        isDefault: false
      })
    )

    setAddNewInput(false)
    setNewJobInputs({ ...inputs, ...newItem })
    setNewInput({
      name: '',
      path: ''
    })
  }

  const handleEditDataInput = () => {
    const currentInputs = { ...inputs }
    currentInputs[selectedDataInput.data.name] = selectedDataInput.data.path

    const currentDataInput = [...defaultDataInputs]
    const currentDataInputIndex = defaultDataInputs.findIndex(
      item => item.data.name === selectedDataInput.data.name
    )

    currentDataInput[currentDataInputIndex] = selectedDataInput

    setDefaultDataInputs(currentDataInput)
    setSelectedDataInput(selectedDataInput)
    setNewJobInputs({ ...inputs, ...currentInputs })
  }

  const handleAddNewVolume = () => {
    if (!newVolume.name || !newVolume.type || !newVolume.path) {
      setEmptyVolume()

      return setAddNewVolume(false)
    }

    const newItem = createVolumeOfNewJob(newVolume)

    const newVolumeMounts = {
      data: { name: newVolume.name, mountPath: newVolume.path },
      isValueEmpty: true,
      isDefault: false
    }

    setNewJobVolumes([...volumes, newItem])
    setNewJobVolumeMounts([...volumeMounts, newVolumeMounts])
    setAddNewVolume(false)
    setEmptyVolume()
  }

  const setEmptyVolume = () => {
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
      if (volume.data.name === selectedVolume.data.name) {
        volume.data.mountPath = selectedVolume.data.mountPath
      }

      return volume
    })

    const currentVolumes = volumes.map(volume => {
      if (volume.name === selectedVolume.data.name) {
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

  const handleDeleteDataInput = item => {
    const newInputs = { ...inputs }

    delete newInputs[item.name]

    setDefaultDataInputs(prev => {
      return prev.filter(dataInput => dataInput.data.name !== item.data.name)
    })

    setNewJobInputs({ ...newInputs })
  }

  const handleDeleteVolume = item => {
    setNewJobVolumes(volumes.filter(volume => volume.name !== item.name))
    setNewJobVolumeMounts(
      volumeMounts.filter(volume => volume.name !== item.name)
    )
  }

  return (
    <JobsPanelDataInputsView
      addNewInput={addNewInput}
      addNewVolume={addNewVolume}
      handleAddNewItem={handleAddNewItem}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      inputs={defaultDataInputs}
      match={match}
      newInput={newInput}
      newVolume={newVolume}
      selectOptions={selectOptions}
      selectedDataInput={selectedDataInput}
      selectedVolume={selectedVolume}
      setAddNewInput={setAddNewInput}
      setAddNewVolume={setAddNewVolume}
      setInputPath={setInputPath}
      setNewInput={setNewInput}
      setNewVolume={setNewVolume}
      setOutputPath={setOutputPath}
      setSelectedDataInput={setSelectedDataInput}
      setSelectedVolume={setSelectedVolume}
      volumeMounts={volumeMounts}
      volumes={volumes}
    />
  )
}

JobsPanelDataInputs.propTypes = {
  functionDefaultValues: PropTypes.shape({}).isRequired,
  inputs: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  setInputPath: PropTypes.func.isRequired,
  setNewJobInputs: PropTypes.func.isRequired,
  setNewJobVolumeMounts: PropTypes.func.isRequired,
  setNewJobVolumes: PropTypes.func.isRequired,
  setOutputPath: PropTypes.func.isRequired,
  volumeMounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  volumes: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default JobsPanelDataInputs
