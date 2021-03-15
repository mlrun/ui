import { inputsActions } from './jobsPanelDataInputsReducer'
import { isNil } from 'lodash'

import { joinDataOfArrayOrObject } from '../../utils'
import {
  AZURE_STORAGE_INPUT_PATH_SCHEME,
  GOOGLE_STORAGE_INPUT_PATH_SCHEME,
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  S3_INPUT_PATH_SCHEME,
  V3IO_INPUT_PATH_SCHEME
} from '../../constants'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

export const generateComboboxMatchesList = (
  artifacts,
  featureVectors,
  inputStorePathTypeEntered,
  inputProjectPathEntered,
  inputProjectItemPathEntered,
  newInput,
  projects,
  projectName,
  selectedDataInputPath
) => {
  if (!inputStorePathTypeEntered) {
    return storePathTypes
  } else if (!inputProjectPathEntered) {
    return projects.filter(project => {
      return isEveryObjectValueEmpty(selectedDataInputPath)
        ? project.id.startsWith(newInput.path.project)
        : project.id.startsWith(selectedDataInputPath.value.split('/')[1])
    })
  } else if (!inputProjectItemPathEntered) {
    const selectedStorePathType =
      newInput.path.storePathType || selectedDataInputPath.value.split('/')[0]
    const projectItems =
      selectedStorePathType === 'artifacts'
        ? artifacts
        : selectedStorePathType === 'feature-vectors'
        ? featureVectors
        : null

    return projectItems
      ? projectItems.filter(projectItem => {
          return isEveryObjectValueEmpty(selectedDataInputPath)
            ? projectItem.id.startsWith(newInput.path.projectItem)
            : projectItem.id.startsWith(
                selectedDataInputPath.value.split('/')[2]
              )
        })
      : []
  } else {
    return []
  }
}

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
    (!newInputUrlPath &&
      (newItemObj.path.pathType.length === 0 ||
        newItemObj.path.storePathType.length === 0 ||
        newItemObj.path.project.length === 0 ||
        newItemObj.path.projectItem.length === 0))
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

  const isUrlPath = [
    AZURE_STORAGE_INPUT_PATH_SCHEME,
    GOOGLE_STORAGE_INPUT_PATH_SCHEME,
    S3_INPUT_PATH_SCHEME,
    V3IO_INPUT_PATH_SCHEME
  ].includes(newItemObj.path.pathType)

  panelDispatch({
    type: setPreviousData,
    payload: [
      ...previousData,
      {
        isDefault: false,
        data: {
          name: newItemObj.name,
          path: {
            pathType: newItemObj.path.pathType,
            value: newInputUrlPath
              ? ''
              : `${newItemObj.path.storePathType}/${newItemObj.path.project}/${newItemObj.path.projectItem}`,
            url: newInputUrlPath ?? ''
          }
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
          path: {
            pathType: newItemObj.path.pathType,
            value: newInputUrlPath
              ? ''
              : `${newItemObj.path.storePathType}/${newItemObj.path.project}/${newItemObj.path.projectItem}`,
            url: newInputUrlPath ?? ''
          }
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
  inputsDispatch({
    type: inputsActions.SET_COMBOBOX_MATCHES,
    payload: []
  })
  setNewJobData({
    ...newJobData,
    [newItemObj.name]: isUrlPath
      ? newItemObj.path.pathType + newInputUrlPath
      : `${newItemObj.path.pathType}${newItemObj.path.storePathType}/${newItemObj.path.project}/${newItemObj.path.projectItem}`
  })
}

export const handleEdit = (
  currentPanelData,
  currentTableData,
  inputsDispatch,
  panelDispatch,
  removeSelectedItem,
  selectedItem,
  setCurrentPanelData,
  setCurrentTableData,
  setPreviousPanelData
) => {
  const currentDataObj = { ...currentPanelData }

  if (selectedItem.newDataInputName) {
    delete currentDataObj[selectedItem.name]
    currentDataObj[selectedItem.newDataInputName] = joinDataOfArrayOrObject(
      selectedItem.path,
      ''
    )
  } else {
    currentDataObj[selectedItem.name] = joinDataOfArrayOrObject(
      selectedItem.path,
      ''
    )
  }

  setCurrentPanelData({ ...currentDataObj })

  const newDataArray = currentTableData.map(dataItem => {
    if (dataItem.data.name === selectedItem.name) {
      dataItem.data.name = selectedItem.newDataInputName || selectedItem.name
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
    payload: {
      data: {
        name: '',
        path: {
          pathType: '',
          value: '',
          url: ''
        }
      }
    }
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

export const storePathTypes = [
  {
    label: 'Artifacts',
    id: 'artifacts'
  },
  {
    label: 'Feature vectors',
    id: 'feature-vectors'
  }
]

export const pathPlaceholders = {
  [S3_INPUT_PATH_SCHEME]: 'bucket/path',
  [GOOGLE_STORAGE_INPUT_PATH_SCHEME]: 'bucket/path',
  [AZURE_STORAGE_INPUT_PATH_SCHEME]: 'container/path',
  [V3IO_INPUT_PATH_SCHEME]: '/container-name/file'
}

export const handleInputPathTypeChange = (
  inputsDispatch,
  newInput,
  pathType,
  pathPlaceholder,
  newInputDefaultPathProject,
  currentProject
) => {
  if (pathType !== MLRUN_STORAGE_INPUT_PATH_SCHEME) {
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
    payload: pathPlaceholders[pathType] || ''
  })
  inputsDispatch({
    type: inputsActions.SET_NEW_INPUT_URL_PATH,
    payload: ''
  })
  inputsDispatch({
    type: inputsActions.SET_NEW_INPUT_PATH,
    payload: {
      pathType: pathType,
      storePathType: '',
      project: '',
      projectItem: ''
    }
  })
}

export const handleInputPathChange = (inputsDispatch, inputsState, path) => {
  if (
    [
      AZURE_STORAGE_INPUT_PATH_SCHEME,
      GOOGLE_STORAGE_INPUT_PATH_SCHEME,
      S3_INPUT_PATH_SCHEME,
      V3IO_INPUT_PATH_SCHEME
    ].includes(inputsState.newInput.path.pathType)
  ) {
    return inputsDispatch({
      type: inputsActions.SET_NEW_INPUT_URL_PATH,
      payload: path
    })
  }

  const pathItems = path.split('/')

  if (path.length === 0 && inputsState.newInputDefaultPathProject.length > 0) {
    inputsDispatch({
      type: inputsActions.SET_NEW_INPUT_DEFAULT_PATH_PROJECT,
      payload: ''
    })
  }

  if (isNil(pathItems[2])) {
    if (inputsState.artifacts.length > 0) {
      inputsDispatch({
        type: inputsActions.SET_ARTIFACTS,
        payload: []
      })
    }

    if (inputsState.featureVectors.length > 0) {
      inputsDispatch({
        type: inputsActions.SET_FEATURE_VECTORS,
        payload: []
      })
    }
  }

  inputsDispatch({
    type: inputsActions.SET_NEW_INPUT_PATH,
    payload: {
      ...inputsState.newInput.path,
      storePathType: pathItems[0] ?? inputsState.newInput.path.storePathType,
      project: pathItems[1] ?? inputsState.newInput.path.project,
      projectItem: pathItems[2] ?? inputsState.newInput.path.projectItem
    }
  })

  const projectItems =
    inputsState[pathItems[0] === 'artifacts' ? 'artifacts' : 'featureVectors']
  const projectItemIsEntered = projectItems.find(
    projectItem => projectItem.id === pathItems[2]
  )

  inputsDispatch({
    type: inputsActions.SET_INPUT_STORE_PATH_TYPE_ENTERED,
    payload: typeof pathItems[1] === 'string'
  })
  inputsDispatch({
    type: inputsActions.SET_INPUT_PROJECT_PATH_ENTERED,
    payload: typeof pathItems[2] === 'string'
  })
  inputsDispatch({
    type: inputsActions.SET_INPUT_PROJECT_ITEM_PATH_ENTERED,
    payload: Boolean(projectItemIsEntered)
  })
}
