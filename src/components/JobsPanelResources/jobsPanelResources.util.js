import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

export const selectMemoryOptions = {
  unitCpu: [
    { label: 'cpu', id: 'cpu' },
    { label: 'millicpu', id: 'millicpu' }
  ],
  unitMemory: [
    { label: 'Bytes', id: 'Bytes' },
    { label: 'KB', id: 'KB' },
    { label: 'KiB', id: 'KiB' },
    { label: 'MB', id: 'MB' },
    { label: 'MiB', id: 'MiB' },
    { label: 'GB', id: 'GB' },
    { label: 'GiB', id: 'GiB' },
    { label: 'TB', id: 'TB' },
    { label: 'TiB', id: 'TiB' },
    { label: 'PB', id: 'PB' },
    { label: 'PiB', id: 'PiB' },
    { label: 'EB', id: 'EB' },
    { label: 'EiB', id: 'EiB' }
  ]
}

export const handleAddItem = (
  currentTableData,
  resourcesDispatch,
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
    resourcesDispatch({
      type: removeNewItemObj
    })

    return resourcesDispatch({
      type: setAddNewItem,
      payload: false
    })
  }

  const generatedTableData = {
    isDefault: false,
    data: {
      name: newItemObj.name,
      mountPath: newItemObj.path
    }
  }
  const generatedPanelData = [...newJobData, generatedTableData.data]

  panelDispatch({
    type: setPreviousData,
    payload: [...previousData, generatedTableData]
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: [...currentTableData, generatedTableData]
  })
  resourcesDispatch({
    type: setAddNewItem,
    payload: false
  })
  resourcesDispatch({
    type: removeNewItemObj
  })
  setNewJobData(generatedPanelData)
}

export const handleEdit = (
  currentPanelData,
  currentTableData,
  resourcesDispatch,
  newName,
  panelDispatch,
  removeSelectedItem,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  const newDataArray = currentTableData.map(dataItem => {
    if (dataItem.data.name === selectedItem.name) {
      dataItem.data.name = newName || selectedItem.name
      dataItem.data.mountPath = selectedItem.mountPath
    }

    return dataItem
  })

  setCurrentPanelData(newDataArray.map(volume => volume.data))

  panelDispatch({
    type: setPreviousPanelData,
    payload: newDataArray
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: newDataArray
  })
  resourcesDispatch({
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
  setCurrentPanelData(
    currentPanelData.filter(
      dataItem => dataItem.name !== selectedItem.data.name
    )
  )
  panelDispatch({
    type: setPreviousPanelData,
    payload: previousPanelData.filter(
      dataItem =>
        (dataItem.name ?? dataItem.data.name) !== selectedItem.data.name
    )
  })
  panelDispatch({
    type: setCurrentTableData,
    payload: currentTableData.filter(
      dataItem =>
        (dataItem.name ?? dataItem.data.name) !== selectedItem.data.name
    )
  })
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

export const selectTypeOptions = {
  volumeType: [
    { label: 'V3IO', id: 'V3IO' },
    { label: 'Config Map', id: 'Config Map' },
    { label: 'Secret', id: 'Secret' },
    { label: 'PVC', id: 'PVC' }
  ]
}

export const generateCpuValue = cpu =>
  cpu.match(/m/) ? cpu.slice(0, cpu.length - 1) : cpu

export const generateMemoryValue = memory =>
  memory.match(/[a-zA-Z]/)
    ? memory.slice(0, memory.match(/[a-zA-Z]/).index)
    : memory
