import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

export const handleAddItem = (
  currentTableData,
  advancedDispatch,
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
    advancedDispatch({
      type: removeNewItemObj
    })

    return advancedDispatch({
      type: setAddNewItem,
      payload: false
    })
  }

  const generatedTableData = {
    isValueEmpty: true,
    isDefault: false,
    data: {
      name: newItemObj.name,
      value: newItemObj.value
    }
  }

  panelDispatch({
    type: setPreviousData,
    payload: [...previousData, generatedTableData]
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: [...currentTableData, generatedTableData]
  })
  advancedDispatch({
    type: setAddNewItem,
    payload: false
  })
  advancedDispatch({
    type: removeNewItemObj
  })
  setNewJobData({
    ...newJobData,
    [newItemObj.name]: newItemObj.value
  })
}

export const handleEdit = (
  currentPanelData,
  currentTableData,
  advancedDispatch,
  isEnv,
  panelDispatch,
  removeSelectedItem,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  if (isEnv) {
    const currentDataObj = { ...currentPanelData }
    currentDataObj[selectedItem.name] = selectedItem.value

    setCurrentPanelData({ ...currentPanelData, ...currentDataObj })
  }

  const newDataArray = currentTableData.map(dataItem => {
    if (dataItem.data.name === selectedItem.name) {
      dataItem.data.value = selectedItem.value
    }

    return dataItem
  })

  panelDispatch({
    type: setPreviousPanelData,
    payload: newDataArray
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: newDataArray
  })
  advancedDispatch({
    type: removeSelectedItem,
    payload: {}
  })
}

export const handleDelete = (
  currentPanelData,
  currentTableData,
  panelDispatch,
  previousPanelData,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  const newData = { ...currentPanelData }
  delete newData[selectedItem.data.name]

  setCurrentPanelData({ ...newData })

  panelDispatch({
    type: setPreviousPanelData,
    payload: previousPanelData.filter(
      dataItem => dataItem.data.name !== selectedItem.data.name
    )
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: currentTableData.filter(
      dataItem => dataItem.data.name !== selectedItem.data.name
    )
  })
}
