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
      name: {
        label: newItemObj.name
      },
      value: {
        label: newItemObj.value,
        isEdit: false
      }
    }

    setNewJobData({
      ...newJobData,
      [newItemObj.name]: newItemObj.value
    })
  } else {
    data = {
      kind: {
        label: newItemObj.kind
      },
      source: {
        label: newItemObj.source,
        isEdit: false
      }
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
  panelDispatch,
  removeSelectedItem,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  if (isEnv) {
    const currentDataObj = { ...currentPanelData }
    currentDataObj[selectedItem.name.label] = selectedItem.value.label

    setCurrentPanelData({ ...currentPanelData, ...currentDataObj })
  } else {
    const currentDataArray = currentPanelData.map(dataItem => {
      if (dataItem[selectedItem.kind.label]) {
        dataItem[selectedItem.kind.label] = selectedItem.source.label
      }

      return dataItem
    })

    setCurrentPanelData(currentDataArray)
  }

  const dataName = isEnv ? 'name' : 'kind'
  const dataValue = isEnv ? 'value' : 'source'

  const newDataArray = currentTableData.map(dataItem => {
    if (dataItem.data[dataName].label === selectedItem[dataName].label) {
      dataItem.data[dataValue].label = selectedItem[dataValue].label
      dataItem.data[dataValue].isEdit = false
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
  if (isEnv) {
    const newData = { ...currentPanelData }
    delete newData[selectedItem.data.name.label]

    setCurrentPanelData({ ...newData })
  } else {
    setCurrentPanelData(
      currentPanelData.filter(
        dataItem => !dataItem[selectedItem.data.kind.label]
      )
    )
  }

  const dataName = isEnv ? 'name' : 'kind'

  panelDispatch({
    type: setPreviousPanelData,
    payload: previousPanelData.filter(
      dataItem =>
        dataItem.data[dataName].label !== selectedItem.data[dataName].label
    )
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: currentTableData.filter(
      dataItem =>
        dataItem.data[dataName].label !== selectedItem.data[dataName].label
    )
  })
}

export const selectOptions = {
  secretKind: [
    { label: 'File', id: 'file' },
    { label: 'Env', id: 'env' }
  ]
}
