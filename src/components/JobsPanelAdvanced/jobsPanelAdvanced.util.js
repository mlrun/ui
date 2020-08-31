import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

export const handleAddItem = (
  advancedDispatch,
  currentTableData,
  isEnv,
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
  let data = {}

  if (isEveryObjectValueEmpty(newItemObj)) {
    advancedDispatch({
      type: removeNewItemObj
    })

    return advancedDispatch({
      type: setAddNewItem,
      payload: false
    })
  }

  if (isEnv) {
    data = {
      name: newItemObj.name,
      value: newItemObj.value
    }

    setNewJobData([...newJobData, { ...data }])
  } else {
    data = {
      kind: newItemObj.kind,
      source: newItemObj.source
    }

    setNewJobData([...newJobData, { [newItemObj.kind]: newItemObj.source }])
  }

  const generatedTableData = {
    isDefault: false,
    data
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
}

export const handleEdit = (
  currentPanelData,
  currentTableData,
  advancedDispatch,
  isEnv,
  newName,
  panelDispatch,
  removeSelectedItem,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  if (isEnv) {
    const newData = currentPanelData.map(dataItem => {
      if (dataItem.name === selectedItem.name) {
        if (newName) {
          dataItem.name = newName
        } else {
          dataItem.value = selectedItem.value
        }
      }

      return dataItem
    })

    setCurrentPanelData(newData)
  } else {
    const currentDataArray = currentPanelData.map(dataItem => {
      if (dataItem[selectedItem.kind]) {
        if (newName) {
          delete dataItem[selectedItem.kind]

          dataItem[newName] = selectedItem.source
        } else {
          dataItem[selectedItem.kind] = selectedItem.source
        }
      }

      return dataItem
    })

    setCurrentPanelData(currentDataArray)
  }

  const dataName = isEnv ? 'name' : 'kind'
  const dataValue = isEnv ? 'value' : 'source'

  const newDataArray = currentTableData.map(dataItem => {
    if (dataItem.data[dataName] === selectedItem[dataName]) {
      dataItem.data[dataName] = newName || selectedItem[dataName]
      dataItem.data[dataValue] = selectedItem[dataValue]
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
  isEnv,
  panelDispatch,
  previousPanelData,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  const dataName = isEnv ? 'name' : 'kind'

  if (isEnv) {
    setCurrentPanelData(
      currentPanelData.filter(
        dataItem => dataItem.name !== selectedItem.data.name
      )
    )
  } else {
    setCurrentPanelData(
      currentPanelData.filter(dataItem => !dataItem[selectedItem.data.kind])
    )
  }

  panelDispatch({
    type: setPreviousPanelData,
    payload: previousPanelData.filter(
      dataItem => dataItem.data[dataName] !== selectedItem.data[dataName]
    )
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: currentTableData.filter(
      dataItem => dataItem.data[dataName] !== selectedItem.data[dataName]
    )
  })
}

export const selectOptions = {
  secretKind: [
    { label: 'File', id: 'file' },
    { label: 'Env', id: 'env' }
  ]
}
