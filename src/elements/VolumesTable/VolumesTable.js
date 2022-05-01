import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import VolumesTableView from './VolumesTableView'
import { CONFIG_MAP, PVC, SECRET, V3IO } from './volumesTable.util'

import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

export const VolumesTable = ({
  className,
  handleAddNewVolume,
  handleEdit,
  handleDelete,
  volumeMounts,
  volumes
}) => {
  const [newVolume, setNewVolume] = useState({
    name: '',
    type: V3IO,
    typeName: '',
    path: '',
    accessKey: '',
    subPath: ''
  })
  const [validation, setValidation] = useState({
    isNameValid: true,
    isTypeValid: true,
    isTypeNameValid: true,
    isPathValid: true,
    isAccessKeyValid: true
  })
  const [showAddNewVolumeRow, setShowAddNewVolumeRow] = useState(false)
  const [selectedVolume, setSelectedVolume] = useState(null)

  useEffect(() => {
    setValidation({
      isNameValid: true,
      isTypeValid: true,
      isTypeNameValid: true,
      isPathValid: true,
      isAccessKeyValid: true
    })
    setNewVolume(state => ({
      ...state,
      typeName: '',
      accessKey: '',
      subPath: ''
    }))
  }, [newVolume.type])

  const handleSetSelectedVolume = useCallback(
    selectedVolume => {
      const searchItem = volumes.find(
        volume => volume.name === selectedVolume.data.name
      )

      if (searchItem.configMap) {
        return setSelectedVolume({
          ...selectedVolume,
          type: {
            value: CONFIG_MAP,
            name: searchItem.configMap.name
          }
        })
      } else if (searchItem.persistentVolumeClaim) {
        return setSelectedVolume({
          ...selectedVolume,
          type: {
            value: PVC,
            name: searchItem.persistentVolumeClaim.claimName
          }
        })
      } else if (searchItem.secret) {
        return setSelectedVolume({
          ...selectedVolume,
          type: {
            value: SECRET,
            name: searchItem.secret.secretName
          }
        })
      } else {
        return setSelectedVolume({
          ...selectedVolume,
          type: {
            value: V3IO,
            name: searchItem.flexVolume.options.container,
            accessKey: searchItem.flexVolume.options.accessKey,
            subPath: searchItem.flexVolume.options.subPath
          }
        })
      }
    },
    [setSelectedVolume, volumes]
  )

  const deleteVolume = useCallback(
    selectedItem => {
      handleDelete(
        volumes.filter(volume => volume.name !== selectedItem.data.name),
        volumeMounts.filter(
          volume => volume.data.name !== selectedItem.data.name
        )
      )
    },
    [handleDelete, volumeMounts, volumes]
  )

  const generateActionsMenu = useCallback(
    rowItem => [
      {
        label: 'Edit',
        icon: <Edit />,
        onClick: volume => handleSetSelectedVolume(volume)
      },
      {
        label: 'Remove',
        icon: <Delete />,
        hidden: rowItem.isDefault && !rowItem.canBeModified,
        onClick: selectedItem => {
          deleteVolume(selectedItem)
        }
      }
    ],
    [deleteVolume, handleSetSelectedVolume]
  )

  const addVolume = () => {
    let volumeIsValid =
      newVolume.name.length > 0 &&
      validation.isNameValid &&
      newVolume.path.length > 0 &&
      validation.isPathValid &&
      newVolume.type.length > 0 &&
      validation.isTypeValid &&
      newVolume.typeName.length > 0 &&
      validation.isTypeNameValid

    if (newVolume.type === V3IO) {
      volumeIsValid =
        newVolume.name.length > 0 &&
        validation.isNameValid &&
        newVolume.path.length > 0 &&
        validation.isPathValid &&
        newVolume.type.length > 0 &&
        validation.isTypeValid &&
        newVolume.accessKey.length > 0 &&
        validation.isAccessKeyValid
    }

    if (volumeIsValid) {
      handleAddNewVolume(newVolume)
      resetVolumesData()
    } else {
      setValidation(state => ({
        isNameValid: newVolume.name.length > 0 && state.isNameValid,
        isTypeValid: newVolume.type.length > 0 && state.isTypeValid,
        isTypeNameValid:
          newVolume.type === V3IO
            ? true
            : newVolume.typeName.length > 0 && state.isTypeNameValid,
        isPathValid: newVolume.path.length > 0 && state.isPathValid,
        isAccessKeyValid:
          newVolume.type === V3IO
            ? newVolume.accessKey.length > 0 && state.isAccessKeyValid
            : true
      }))
    }
  }

  const resetVolumesData = () => {
    setNewVolume({
      name: '',
      type: V3IO,
      typeName: '',
      path: '',
      accessKey: '',
      subPath: ''
    })
    setShowAddNewVolumeRow(false)
    setValidation({
      isNameValid: true,
      isTypeValid: true,
      isTypeNameValid: true,
      isPathValid: true,
      isAccessKeyValid: true
    })
  }

  const editVolume = () => {
    const generatedVolumes = volumes.map(volume => {
      if (volume.name === selectedVolume.data.name) {
        volume.name = selectedVolume.newName || selectedVolume.data.name

        switch (selectedVolume.type.value) {
          case CONFIG_MAP:
            volume.configMap.name = selectedVolume.type.name
            break
          case PVC:
            volume.persistentVolumeClaim.claimName = selectedVolume.type.name
            break
          case SECRET:
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
    const generatedVolumeMounts = volumeMounts.map(volumeMount => {
      if (volumeMount.data.name === selectedVolume.data.name) {
        volumeMount.data.name =
          selectedVolume.newName || selectedVolume.data.name
        volumeMount.data.mountPath =
          selectedVolume.newPath || selectedVolume.data.mountPath
      }

      return volumeMount
    })

    handleEdit(generatedVolumes, generatedVolumeMounts)
    setSelectedVolume(null)
  }

  return (
    <VolumesTableView
      addVolume={addVolume}
      className={className}
      editVolume={editVolume}
      generateActionsMenu={generateActionsMenu}
      newVolume={newVolume}
      volumeMounts={volumeMounts}
      resetVolumesData={resetVolumesData}
      selectedVolume={selectedVolume}
      setNewVolume={setNewVolume}
      setSelectedVolume={setSelectedVolume}
      setShowAddNewVolumeRow={setShowAddNewVolumeRow}
      setValidation={setValidation}
      showAddNewVolumeRow={showAddNewVolumeRow}
      validation={validation}
    />
  )
}

VolumesTable.defaultProps = {
  className: ''
}

VolumesTable.propTypes = {
  className: PropTypes.string,
  handleAddNewVolume: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  volumeMounts: PropTypes.arrayOf(PropTypes.shape({})),
  volumes: PropTypes.arrayOf(PropTypes.shape({}))
}
