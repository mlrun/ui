import React, { useState } from 'react'

import JobsPanelDataInputsView from './JobsPanelDataInputsView'

const JobsPanelDataInputs = () => {
  const [inputs, setInputs] = useState({})
  const [volumes, setVolumes] = useState({})

  const [addNewInput, setAddNewInput] = useState(false)
  const [newInputName, setNewInputName] = useState('')
  const [newInputPath, setNewInputPath] = useState('')

  const [addNewVolume, setAddNewVolume] = useState(false)
  const [newVolumeType, setNewVolumeType] = useState('')
  const [newVolumePath, setNewVolumePath] = useState('')
  const [newAccessKey, setNewAccessKey] = useState('')
  const [newResourcePath, setNewResourcePath] = useState('')

  console.log(newAccessKey, newResourcePath)

  const handleAddNewItem = (input, volume) => {
    const newItem = {}

    if (input) {
      if (!newInputName || !newInputPath) {
        return setAddNewInput(false)
      }

      newItem[newInputName] = newInputPath

      setInputs({ ...inputs, ...newItem })
      setAddNewInput(false)
    } else if (volume) {
      if (!newVolumeType || !newVolumePath) {
        return setAddNewVolume(false)
      }

      newItem[newVolumeType] = newVolumePath

      setVolumes({ ...volumes, ...newItem })
      setAddNewVolume(false)
    }
  }

  return (
    <JobsPanelDataInputsView
      addNewInput={addNewInput}
      addNewVolume={addNewVolume}
      handleAddNewItem={handleAddNewItem}
      inputs={inputs}
      setAddNewInput={setAddNewInput}
      setAddNewVolume={setAddNewVolume}
      setNewAccessKey={setNewAccessKey}
      setNewInputName={setNewInputName}
      setNewInputPath={setNewInputPath}
      setNewResourcePath={setNewResourcePath}
      setNewVolumePath={setNewVolumePath}
      setNewVolumeType={setNewVolumeType}
      volumes={volumes}
    />
  )
}

export default JobsPanelDataInputs
