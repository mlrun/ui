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
      name: newItemObj.name,
      [path]: newItemObj.path
    }
  }
  const generatedPanelData = isVolumes
    ? [...newJobData, generatedTableData.data]
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
  newName,
  panelDispatch,
  removeSelectedItem,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  const path = isInputs ? 'path' : 'mountPath'

  if (isInputs) {
    const currentDataObj = { ...currentPanelData }

    if (newName) {
      delete currentDataObj[selectedItem.name]

      currentDataObj[newName] = selectedItem.path
    } else {
      currentDataObj[selectedItem.name] = selectedItem.path
    }

    setCurrentPanelData({ ...currentDataObj })
  }

  const newDataArray = currentTableData.map(dataItem => {
    if (dataItem.data.name === selectedItem.name) {
      if (newName) {
        dataItem.data.name = newName
      }

      dataItem.data[path] = selectedItem[path]
    }

    return dataItem
  })

  if (!isInputs) {
    setCurrentPanelData(newDataArray.map(volume => volume.data))
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
    delete newInputs[selectedItem.data.name]

    setCurrentPanelData({ ...newInputs })
  } else {
    setCurrentPanelData(
      currentPanelData.filter(
        dataItem => dataItem.name !== selectedItem.data.name
      )
    )
  }

  panelDispatch({
    type: setPreviousPanelData,
    payload: previousPanelData.filter(dataItem => {
      const name = isVolumes ? dataItem.name : dataItem.data.name
      return name !== selectedItem.data.name
    })
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: currentTableData.filter(dataItem => {
      const name = isVolumes ? dataItem.name : dataItem.data.name
      return name !== selectedItem.data.name
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
