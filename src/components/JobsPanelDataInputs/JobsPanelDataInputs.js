import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelDataInputsView from './JobsPanelDataInputsView'

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

  const handleAddNewItem = (input, volume) => {
    let newItem = {}
    let emptyInput = null
    if (input) {
      emptyInput = Object.values(newInput).filter(item => item.length === 0)

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
    } else if (volume) {
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

      if (newVolume.type === 'V3IO') {
        newItem = {
          name: newVolume.name,
          flexVolume: {
            driver: 'v3io/fuse',
            options: {
              accessKey: newVolume.accessKey,
              container: '',
              subPath: newVolume.resourcesPath
            }
          }
        }
      } else if (newVolume.type === 'Config Map') {
        newItem = {
          name: newVolume.name,
          configMap: {
            name: newVolume.typeName
          }
        }
      } else if (newVolume.type === 'Secret') {
        newItem = {
          name: newVolume.name,
          secret: {
            secretName: newVolume.typeName
          }
        }
      } else {
        newItem = {
          name: newVolume.name,
          persistentVolumeClaim: {
            claimName: newVolume.typeName
          }
        }
      }

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
  }

  return (
    <JobsPanelDataInputsView
      addNewInput={addNewInput}
      addNewVolume={addNewVolume}
      edit={edit}
      handleAddNewItem={handleAddNewItem}
      inputs={inputs}
      match={match}
      newInput={newInput}
      newVolume={newVolume}
      setAddNewInput={setAddNewInput}
      setAddNewVolume={setAddNewVolume}
      setInputPath={setInputPath}
      setNewInput={setNewInput}
      setOutputPath={setOutputPath}
      setNewVolume={setNewVolume}
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
