import React, { useState } from 'react'

import JobsPanelDataInputsView from './JobsPanelDataInputsView'

const JobsPanelDataInputs = ({
  setNewJobInputs,
  inputs,
  match,
  volumes,
  setNewJobVolumes,
  setNewJobVolumeMounts,
  volumeMounts,
  setInputPath,
  setOutputPath
}) => {
  const [addNewInput, setAddNewInput] = useState(false)
  const [newInputName, setNewInputName] = useState('')
  const [newInputPath, setNewInputPath] = useState('')

  const [addNewVolume, setAddNewVolume] = useState(false)
  const [newVolumeName, setNewVolumeName] = useState('')
  const [newVolumeType, setNewVolumeType] = useState('')
  const [newVolumeTypeName, setNewVolumeTypeName] = useState('')
  const [newVolumePath, setNewVolumePath] = useState('')
  const [newAccessKey, setNewAccessKey] = useState('')
  const [newResourcePath, setNewResourcePath] = useState('')

  const handleAddNewItem = (input, volume) => {
    let newItem = {}

    if (input) {
      if (!newInputName || !newInputPath) {
        setNewInputName('')
        setNewInputPath('')
        return setAddNewInput(false)
      }

      newItem[newInputName] = newInputPath

      setAddNewInput(false)
      setNewJobInputs({ ...inputs, ...newItem })
      setNewInputName('')
      setNewInputPath('')
    } else if (volume) {
      if (!newVolumeType || !newVolumePath || !newVolumeName) {
        setNewVolumeName('')
        setNewVolumeType('')
        setNewVolumeTypeName('')
        setNewVolumePath('')
        setNewAccessKey('')
        setNewResourcePath('')
        return setAddNewVolume(false)
      }

      if (newVolumeType === 'V3IO') {
        newItem = {
          name: newVolumeName,
          flexVolume: {
            driver: 'v3io/fuse',
            options: {
              accessKey: newAccessKey,
              container: '',
              subPath: newResourcePath
            }
          }
        }
      } else if (newVolumeType === 'Config Map') {
        newItem = {
          name: newVolumeName,
          configMap: {
            name: newVolumeTypeName
          }
        }
      } else if (newVolumeType === 'Secret') {
        newItem = {
          name: newVolumeName,
          secret: {
            secretName: newVolumeTypeName
          }
        }
      } else {
        newItem = {
          name: newVolumeName,
          persistentVolumeClaim: {
            claimName: newVolumeTypeName
          }
        }
      }

      const newVolumeMounts = {
        name: newVolumeName,
        mountPath: newVolumePath
      }

      setNewJobVolumes([...volumes, newItem])
      setNewJobVolumeMounts([...volumeMounts, newVolumeMounts])
      setAddNewVolume(false)
      setNewVolumeName('')
      setNewVolumeType('')
      setNewVolumeTypeName('')
      setNewVolumePath('')
      setNewAccessKey('')
      setNewResourcePath('')
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
      volumeMounts={volumeMounts}
      newVolumeType={newVolumeType}
      match={match}
      setNewVolumeName={setNewVolumeName}
      setNewVolumeTypeName={setNewVolumeTypeName}
      setInputPath={setInputPath}
      setOutputPath={setOutputPath}
    />
  )
}

export default JobsPanelDataInputs
