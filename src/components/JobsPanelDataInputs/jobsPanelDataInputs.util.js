import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

export const handleAddItem = (
  currentTableData,
  inputsDispatch,
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

  panelDispatch({
    type: setPreviousData,
    payload: [
      ...previousData,
      {
        isDefault: false,
        data: {
          name: newItemObj.name,
          path: newItemObj.path
        }
      }
    ]
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: [
      ...currentTableData,
      {
        isDefault: false,
        data: {
          name: newItemObj.name,
          path: newItemObj.path
        }
      }
    ]
  })
  inputsDispatch({
    type: setAddNewItem,
    payload: false
  })
  inputsDispatch({
    type: removeNewItemObj
  })
  setNewJobData({
    ...newJobData,
    [newItemObj.name]: newItemObj.path
  })
}

export const handleEdit = (
  currentPanelData,
  currentTableData,
  inputsDispatch,
  newName,
  panelDispatch,
  removeSelectedItem,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  const currentDataObj = { ...currentPanelData }

  if (newName) {
    delete currentDataObj[selectedItem.name]

    currentDataObj[newName] = selectedItem.path
  } else {
    currentDataObj[selectedItem.name] = selectedItem.path
  }

  setCurrentPanelData({ ...currentDataObj })

  const newDataArray = currentTableData.map(dataItem => {
    if (dataItem.data.name === selectedItem.name) {
      dataItem.data.name = newName || selectedItem.name
      dataItem.data.path = selectedItem.path
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
  inputsDispatch({
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
  const newInputs = { ...currentPanelData }
  delete newInputs[selectedItem.data.name]

  setCurrentPanelData({ ...newInputs })

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
