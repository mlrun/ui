import { inputsActions } from './jobsPanelDataInputsReducer'
import { isNil } from 'lodash'

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
  setNewJobData,
  setPathPlaceholder,
  newInputUrlPath,
  setNewInputUrl
) => {
  if (
    newItemObj.name.length === 0 ||
    ((newItemObj.path.pathType.length === 0 ||
      newItemObj.path.project.length === 0 ||
      newItemObj.path.artifact.length === 0) &&
      !newInputUrlPath)
  ) {
    inputsDispatch({
      type: removeNewItemObj
    })
    inputsDispatch({
      type: setPathPlaceholder,
      payload: ''
    })
    inputsDispatch({
      type: setNewInputUrl,
      payload: ''
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
          path:
            newItemObj.path.pathType === AZURE_STORAGE_INPUT_PATH_SCHEME ||
            newItemObj.path.pathType === GOOGLE_STORAGE_INPUT_PATH_SCHEME ||
            newItemObj.path.pathType === S3_INPUT_PATH_SCHEME ||
            newItemObj.path.pathType === V3IO_INPUT_PATH_SCHEME
              ? `${newItemObj.path.pathType}${newInputUrlPath}`
              : `${newItemObj.path.pathType}${newItemObj.path.project}/${newItemObj.path.artifact}`
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
          path:
            newItemObj.path.pathType === AZURE_STORAGE_INPUT_PATH_SCHEME ||
            newItemObj.path.pathType === GOOGLE_STORAGE_INPUT_PATH_SCHEME ||
            newItemObj.path.pathType === S3_INPUT_PATH_SCHEME ||
            newItemObj.path.pathType === V3IO_INPUT_PATH_SCHEME
              ? newItemObj.path.pathType + newInputUrlPath
              : `${newItemObj.path.pathType}${newItemObj.path.project}/${newItemObj.path.artifact}`
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
  inputsDispatch({
    type: setPathPlaceholder,
    payload: ''
  })
  setNewJobData({
    ...newJobData,
    [newItemObj.name]:
      newItemObj.path.pathType === AZURE_STORAGE_INPUT_PATH_SCHEME ||
      newItemObj.path.pathType === GOOGLE_STORAGE_INPUT_PATH_SCHEME ||
      newItemObj.path.pathType === S3_INPUT_PATH_SCHEME ||
      newItemObj.path.pathType === V3IO_INPUT_PATH_SCHEME
        ? newItemObj.path.pathType + newInputUrlPath
        : `${newItemObj.path.pathType}${newItemObj.path.project}/${newItemObj.path.artifact}`
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

export const comboboxSelectList = [
  {
    className: 'path-type-store',
    label: 'MLRun store',
    id: 'store://'
  },
  {
    className: 'path-type-v3io',
    label: 'V3IO',
    id: 'v3io://'
  },
  {
    className: 'path-type-s3',
    label: 'S3',
    id: 's3://'
  },
  {
    className: 'path-type-http',
    label: 'HTTP',
    id: 'http://'
  },
  {
    className: 'path-type-https',
    label: 'HTTPS',
    id: 'https://'
  },
  {
    className: 'path-type-az',
    label: 'Azure storage',
    id: 'az://'
  },
  {
    className: 'path-type-gs',
    label: 'Google storage',
    id: 'gs://'
  }
]

export const AZURE_STORAGE_INPUT_PATH_SCHEME = 'az://'
export const GOOGLE_STORAGE_INPUT_PATH_SCHEME = 'gs://'
export const HTTP_STORAGE_INPUT_PATH_SCHEME = 'http://'
export const HTTPS_STORAGE_INPUT_PATH_SCHEME = 'https://'
export const MLRUN_STORAGE_INPUT_PATH_SCHEME = 'store://'
export const S3_INPUT_PATH_SCHEME = 's3://'
export const V3IO_INPUT_PATH_SCHEME = 'v3io://'

export const handleInputPathTypeChange = (
  inputsDispatch,
  newInput,
  pathType,
  pathPlaceholder,
  newInputDefaultPathProject,
  currentProject
) => {
  if (
    pathType === AZURE_STORAGE_INPUT_PATH_SCHEME ||
    pathType === GOOGLE_STORAGE_INPUT_PATH_SCHEME ||
    pathType === HTTP_STORAGE_INPUT_PATH_SCHEME ||
    pathType === HTTPS_STORAGE_INPUT_PATH_SCHEME ||
    pathType === S3_INPUT_PATH_SCHEME ||
    pathType === V3IO_INPUT_PATH_SCHEME
  ) {
    inputsDispatch({
      type: inputsActions.SET_NEW_INPUT_DEFAULT_PATH_PROJECT,
      payload: ''
    })
  } else {
    inputsDispatch({
      type: inputsActions.SET_NEW_INPUT_DEFAULT_PATH_PROJECT,
      payload: `${currentProject}/`
    })
  }

  inputsDispatch({
    type: inputsActions.SET_PATH_PLACEHOLDER,
    payload:
      pathType === S3_INPUT_PATH_SCHEME ||
      pathType === GOOGLE_STORAGE_INPUT_PATH_SCHEME
        ? 'bucket/path'
        : pathType === AZURE_STORAGE_INPUT_PATH_SCHEME
        ? 'container/path'
        : pathType === V3IO_INPUT_PATH_SCHEME
        ? '/container-name/file'
        : ''
  })
  inputsDispatch({
    type: inputsActions.SET_NEW_INPUT_URL_PATH,
    payload: ''
  })
  inputsDispatch({
    type: inputsActions.SET_NEW_INPUT_PATH,
    payload: {
      pathType: pathType,
      project: '',
      artifact: ''
    }
  })
}

export const handleInputPathChange = (inputsDispatch, inputsState, path) => {
  const pathScheme = inputsState.newInput.path.pathType

  if (
    pathScheme === AZURE_STORAGE_INPUT_PATH_SCHEME ||
    pathScheme === GOOGLE_STORAGE_INPUT_PATH_SCHEME ||
    pathScheme === S3_INPUT_PATH_SCHEME ||
    pathScheme === V3IO_INPUT_PATH_SCHEME
  ) {
    return inputsDispatch({
      type: inputsActions.SET_NEW_INPUT_URL_PATH,
      payload: path
    })
  }

  const pathItems = path.split('/')
  const artifactIsEntered = inputsState.artifacts.find(
    artifact => artifact.id === pathItems[1]
  )

  if (path.length === 0 && inputsState.newInputDefaultPathProject.length > 0) {
    inputsDispatch({
      type: inputsActions.SET_NEW_INPUT_DEFAULT_PATH_PROJECT,
      payload: ''
    })
  }

  if (isNil(pathItems[1]) && inputsState.artifacts.length > 0) {
    inputsDispatch({
      type: inputsActions.SET_ARTIFACTS,
      payload: []
    })
  }

  if (
    pathItems[0] !== inputsState.newInput.path.project ||
    (!isNil(pathItems[1]) &&
      pathItems[1] !== inputsState.newInput.path.artifact)
  ) {
    inputsDispatch({
      type: inputsActions.SET_NEW_INPUT_PATH,
      payload: {
        ...inputsState.newInput.path,
        project: pathItems[0],
        artifact: pathItems[1] ?? inputsState.newInput.path.artifact
      }
    })
  }

  inputsDispatch({
    type: inputsActions.SET_NEW_INPUT_PROJECT_PATH_ENTERED,
    payload: typeof pathItems[1] === 'string'
  })
  inputsDispatch({
    type: inputsActions.SET_NEW_INPUT_ARTIFACT_PATH_ENTERED,
    payload: !!artifactIsEntered
  })
}
