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
  setNewJobData,
  setValidation,
  validation
) => {
  let data = {}
  const isValid = isEnv
    ? newItemObj.name.length > 0 &&
      validation.envVariablesName &&
      newItemObj.value.length > 0 &&
      validation.envVariablesValue
    : newItemObj.source.length > 0 && validation.secretsSourceValue

  if (isValid) {
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

  if (isEnv) {
    setValidation(state => ({
      ...state,
      envVariablesName:
        newItemObj.name.length > 0 && validation.envVariablesName,
      envVariablesValue:
        newItemObj.value.length > 0 && validation.envVariablesValue
    }))
  } else {
    setValidation(state => ({
      ...state,
      secretsSourceValue:
        newItemObj.source.length > 0 && validation.secretsSourceValue
    }))
  }
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
  setPreviousPanelData,
  index
) => {
  const dataName = isEnv ? 'name' : 'kind'
  const dataValue = isEnv ? 'value' : 'source'
  const newData = [...currentPanelData]
  newData[index] = {
    [dataName]: newName || selectedItem[dataName],
    [dataValue]: selectedItem[dataValue]
  }
  const newTableData = [...currentTableData]
  newTableData[index].data = {
    [dataName]: newName || selectedItem[dataName],
    [dataValue]: selectedItem[dataValue]
  }

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
  index,
  panelDispatch,
  previousPanelData,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  setCurrentPanelData(
    currentPanelData.filter((dataItem, dataIndex) => dataIndex !== index)
  )
  panelDispatch({
    type: setPreviousPanelData,
    payload: previousPanelData.filter(
      (dataItem, dataIndex) => dataIndex !== index
    )
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: currentTableData.filter(
      (dataItem, dataIndex) => dataIndex !== index
    )
  })
}

export const handleReset = (
  advancedDispatch,
  removeNewItemObj,
  setAddNewItem,
  setValidation
) => {
  advancedDispatch({
    type: setAddNewItem,
    payload: false
  })
  advancedDispatch({
    type: removeNewItemObj
  })
  setValidation({
    secretsSourceValue: true,
    envVariablesName: true,
    envVariablesValue: true
  })
}

export const selectOptions = {
  secretKind: [
    { label: 'File', id: 'file' },
    { label: 'Env', id: 'env' }
  ]
}
