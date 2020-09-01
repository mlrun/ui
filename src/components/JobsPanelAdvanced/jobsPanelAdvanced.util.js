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
  } else {
    data = {
      kind: newItemObj.kind,
      source: newItemObj.source
    }
  }

  const generatedTableData = {
    isDefault: false,
    data
  }

  setNewJobData([...newJobData, { ...data }])
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
  const dataName = isEnv ? 'name' : 'kind'
  const dataValue = isEnv ? 'value' : 'source'
  const newData = currentPanelData.map(dataItem => {
    if (dataItem[dataName] === selectedItem[dataName]) {
      dataItem[dataName] = newName || selectedItem[dataName]
      dataItem[dataValue] = selectedItem[dataValue]
    }

    return dataItem
  })
  const newTableData = currentTableData.map(dataItem => {
    if (dataItem.data[dataName] === selectedItem[dataName]) {
      dataItem.data[dataName] = newName || selectedItem[dataName]
      dataItem.data[dataValue] = selectedItem[dataValue]
    }

    return dataItem
  })

  setCurrentPanelData(newData)
  panelDispatch({
    type: setPreviousPanelData,
    payload: newTableData
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: newTableData
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

  setCurrentPanelData(
    currentPanelData.filter(
      dataItem => dataItem[dataName] !== selectedItem.data[dataName]
    )
  )
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
