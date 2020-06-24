import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

export const handleAddItem = (
  currentTableData,
  inputsDispatch,
  isVolumes,
  newItemObj,
  newJobData,
  panelDispatch,
  previousData,
  removeNewItemObj,
  setAddNewItem,
  setCurrentTableData,
  setPreviousData,
  setNewJobData
) => {
  if (isEveryObjectValueEmpty(newItemObj)) {
    inputsDispatch({
      type: removeNewItemObj
    })

    return inputsDispatch({
      type: setAddNewItem,
      payload: false
    })
  }

  const path = isVolumes ? 'mountPath' : 'path'
  const generatedTableData = {
    isDefault: false,
    data: {
      name: {
        label: newItemObj.name
      },
      [path]: {
        label: newItemObj.path,
        isEdit: false
      }
    }
  }
  const generatedPanelData = isVolumes
    ? [
        ...newJobData,
        {
          name: generatedTableData.data.name.label,
          mountPath: generatedTableData.data.mountPath.label
        }
      ]
    : {
        ...newJobData,
        [newItemObj.name]: newItemObj.path
      }

  panelDispatch({
    type: setPreviousData,
    payload: [...previousData, generatedTableData]
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: [...currentTableData, generatedTableData]
  })
  inputsDispatch({
    type: setAddNewItem,
    payload: false
  })
  inputsDispatch({
    type: removeNewItemObj
  })
  setNewJobData(generatedPanelData)
}

export const handleEdit = (
  currentPanelData,
  currentTableData,
  inputsDispatch,
  isInputs,
  panelDispatch,
  removeSelectedItem,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  const path = isInputs ? 'path' : 'mountPath'

  const newDataArray = currentTableData.map(dataItem => {
    if (dataItem.data.name.label === selectedItem.name.label) {
      dataItem.data[path].label = selectedItem[path].label
      if (dataItem.data[path].isEdit) {
        dataItem.data[path].isEdit = false
      }
    }

    return dataItem
  })

  if (isInputs) {
    const currentDataObj = { ...currentPanelData }
    currentDataObj[selectedItem.name.label] = selectedItem.path.label

    setCurrentPanelData({ ...currentPanelData, ...currentDataObj })
  } else {
    setCurrentPanelData(
      newDataArray.map(volume => ({
        name: volume.data.name.label,
        mountPath: volume.data.mountPath.label
      }))
    )
  }

  panelDispatch({
    type: setPreviousPanelData,
    payload: newDataArray
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: newDataArray
  })
  inputsDispatch({
    type: removeSelectedItem,
    payload: {}
  })
}

export const handleDelete = (
  currentPanelData,
  currentTableData,
  isInputs,
  isVolumes,
  panelDispatch,
  previousPanelData,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  if (isInputs) {
    const newInputs = { ...currentPanelData }
    delete newInputs[selectedItem.data.name.label]

    setCurrentPanelData({ ...newInputs })
  } else {
    setCurrentPanelData(
      currentPanelData.filter(
        dataItem => dataItem.name.label !== selectedItem.data.name.label
      )
    )
  }

  panelDispatch({
    type: setPreviousPanelData,
    payload: previousPanelData.filter(dataItem => {
      const name = isVolumes ? dataItem.name.label : dataItem.data.name.label
      return name !== selectedItem.data.name.label
    })
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: currentTableData.filter(dataItem => {
      const name = isVolumes ? dataItem.name.label : dataItem.data.name.label
      return name !== selectedItem.data.name.label
    })
  })
}

export const selectOptions = {
  volumeType: [
    { label: 'V3IO', id: 'V3IO' },
    { label: 'Config Map', id: 'Config Map' },
    { label: 'Secret', id: 'Secret' },
    { label: 'PVC', id: 'PVC' }
  ]
}

export const createVolumeOfNewJob = newVolume => {
  switch (newVolume.type) {
    case 'V3IO':
      return {
        name: newVolume.name,
        flexVolume: {
          driver: 'v3io/fuse',
          options: {
            accessKey: newVolume.accessKey,
            container: newVolume.typeName,
            subPath: newVolume.resourcesPath
          }
        }
      }
    case 'Config Map':
      return {
        name: newVolume.name,
        configMap: {
          name: newVolume.typeName
        }
      }
    case 'Secret':
      return {
        name: newVolume.name,
        secret: {
          secretName: newVolume.typeName
        }
      }
    default:
      return {
        name: newVolume.name,
        persistentVolumeClaim: {
          claimName: newVolume.typeName
        }
      }
  }
}
