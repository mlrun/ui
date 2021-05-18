import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import VolumesTableView from './VolumesTableView'

import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

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
    type: '',
    typeName: '',
    path: '',
    accessKey: '',
    subPath: ''
  })
  const [showAddNewVolumeRow, setShowAddNewVolumeRow] = useState(false)
  const [selectedVolume, setSelectedVolume] = useState(null)

  const handleSetSelectedVolume = useCallback(
    selectedVolume => {
      const searchItem = volumes.find(
        volume => volume.name === selectedVolume.data.name
      )

      if (searchItem.configMap) {
        return setSelectedVolume({
          ...selectedVolume,
          type: {
            value: 'Config Map',
            name: searchItem.configMap.name
          }
        })
      } else if (searchItem.persistentVolumeClaim) {
        return setSelectedVolume({
          ...selectedVolume,
          type: {
            value: 'PVC',
            name: searchItem.persistentVolumeClaim.claimName
          }
        })
      } else if (searchItem.secret) {
        return setSelectedVolume({
          ...selectedVolume,
          type: {
            value: 'Secret',
            name: searchItem.secret.secretName
          }
        })
      } else {
        return setSelectedVolume({
          ...selectedVolume,
          type: {
            value: 'V3IO',
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
        onClick: param => handleSetSelectedVolume(param)
      },
      {
        label: 'Remove',
        icon: <Delete />,
        hidden: rowItem.isDefault,
        onClick: selectedItem => {
          deleteVolume(selectedItem)
        }
      }
    ],
    [deleteVolume, handleSetSelectedVolume]
  )

  const addVolume = () => {
    if (
      newVolume.name.length > 0 &&
      newVolume.path.length > 0 &&
      newVolume.type.length > 0
    ) {
      handleAddNewVolume(newVolume)
    }

    setNewVolume({
      name: '',
      type: '',
      typeName: '',
      path: '',
      accessKey: '',
      subPath: ''
    })
    setShowAddNewVolumeRow(false)
  }

  const editVolume = () => {
    const generatedVolumes = volumes.map(volume => {
      if (volume.name === selectedVolume.data.name) {
        volume.name = selectedVolume.newName || selectedVolume.data.name

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
    const generatedVolumeMounts = volumeMounts.map(volumeMount => {
      if (volumeMount.data.name === selectedVolume.data.name) {
        volumeMount.data.name =
          selectedVolume.newName || selectedVolume.data.name
        volumeMount.data.mountPath = selectedVolume.data.mountPath
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
      selectedVolume={selectedVolume}
      setNewVolume={setNewVolume}
      setSelectedVolume={setSelectedVolume}
      setShowAddNewVolumeRow={setShowAddNewVolumeRow}
      showAddNewVolumeRow={showAddNewVolumeRow}
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
