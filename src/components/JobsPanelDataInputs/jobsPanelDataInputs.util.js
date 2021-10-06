import { inputsActions } from './jobsPanelDataInputsReducer'
import { isNil } from 'lodash'

import { joinDataOfArrayOrObject } from '../../utils'
import {
  AZURE_STORAGE_INPUT_PATH_SCHEME,
  GOOGLE_STORAGE_INPUT_PATH_SCHEME,
  HTTP_STORAGE_INPUT_PATH_SCHEME,
  HTTPS_STORAGE_INPUT_PATH_SCHEME,
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  S3_INPUT_PATH_SCHEME,
  V3IO_INPUT_PATH_SCHEME
} from '../../constants'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { getParsedResource } from '../../utils/resources'
import { pathPlaceholders } from '../../utils/panelPathScheme'
import { isNameNotUnique } from '../JobsPanel/jobsPanel.util'

export const generateComboboxMatchesList = (
  artifacts,
  artifactsReferences,
  featureVectors,
  featureVectorsReferences,
  inputStorePathTypeEntered,
  inputProjectPathEntered,
  inputProjectItemPathEntered,
  inputProjectItemReferencePathEntered,
  newInput,
  projects,
  projectName,
  selectedDataInputPath
) => {
  if (!inputStorePathTypeEntered) {
    return storePathTypes.some(type =>
      type.id.startsWith(newInput.path.storePathType)
    )
      ? storePathTypes
      : []
  } else if (
    !inputProjectPathEntered &&
    storePathTypes.some(
      type =>
        type.id === newInput.path.storePathType ||
        type.id === selectedDataInputPath.value.split('/')[0]
    )
  ) {
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
  } else if (!inputProjectItemReferencePathEntered) {
    const selectedStorePathType =
      newInput.path.storePathType || selectedDataInputPath.value.split('/')[0]
    const projectItemsReferences =
      selectedStorePathType === 'artifacts'
        ? artifactsReferences
        : selectedStorePathType === 'feature-vectors'
        ? featureVectorsReferences
        : null

    return projectItemsReferences
      ? projectItemsReferences.filter(projectItem => {
          return isEveryObjectValueEmpty(selectedDataInputPath)
            ? projectItem.id.startsWith(newInput.path.projectItemReference)
            : projectItem.id.startsWith(
                getParsedResource(selectedDataInputPath.value.split('/')[2])[1]
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
  dataInputs,
  setCurrentTableData,
  setPreviousData,
  setNewJobData,
  newInputUrlPath,
  setDataInputsValidations
) => {
  const isMlRunStorePath =
    newItemObj.path.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
  let mlRunStorePath = ''

  if (isMlRunStorePath) {
    mlRunStorePath = `${newItemObj.path.storePathType}/${newItemObj.path.project}/${newItemObj.path.projectItem}${newItemObj.path.projectItemReference}`

    inputsDispatch({
      type: inputsActions.SET_NEW_INPUT_URL_PATH,
      payload: ''
    })
  }

  const pathInputIsValid = isPathInputValid(
    newItemObj.path.pathType,
    isMlRunStorePath ? mlRunStorePath : newInputUrlPath
  )

  if (newItemObj.name.length === 0 || !pathInputIsValid) {
    setDataInputsValidations({
      isNameValid:
        !isNameNotUnique(newItemObj.name, dataInputs) &&
        newItemObj.name.length > 0,
      isPathValid: pathInputIsValid
    })
  } else {
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
              value: isMlRunStorePath ? mlRunStorePath : newInputUrlPath
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
              value: isMlRunStorePath ? mlRunStorePath : newInputUrlPath
            }
          }
        }
      ]
    })
    setNewJobData({
      ...newJobData,
      [newItemObj.name]: isMlRunStorePath
        ? `${newItemObj.path.pathType}${mlRunStorePath}`
        : `${newItemObj.path.pathType}${newInputUrlPath}`
    })
    resetDataInputsData(inputsDispatch, setDataInputsValidations)
  }
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
    type: removeSelectedItem
  })
}

export const resetDataInputsData = (
  inputsDispatch,
  setDataInputsValidations
) => {
  inputsDispatch({
    type: inputsActions.REMOVE_NEW_INPUT_DATA
  })
  inputsDispatch({
    type: inputsActions.SET_PATH_PLACEHOLDER,
    payload: ''
  })
  inputsDispatch({
    type: inputsActions.SET_ADD_NEW_INPUT,
    payload: false
  })
  inputsDispatch({
    type: inputsActions.SET_COMBOBOX_MATCHES,
    payload: []
  })
  setDataInputsValidations({
    isNameValid: true,
    isPathValid: true
  })
  inputsDispatch({
    type: inputsActions.SET_NEW_INPUT_URL_PATH,
    payload: ''
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
    id: MLRUN_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-v3io',
    label: 'V3IO',
    id: V3IO_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-s3',
    label: 'S3',
    id: S3_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-http',
    label: 'HTTP',
    id: HTTP_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-https',
    label: 'HTTPS',
    id: HTTPS_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-az',
    label: 'Azure storage',
    id: AZURE_STORAGE_INPUT_PATH_SCHEME
  },
  {
    className: 'path-type-gs',
    label: 'Google storage',
    id: GOOGLE_STORAGE_INPUT_PATH_SCHEME
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

export const handleInputPathTypeChange = (
  inputsDispatch,
  newInput,
  pathType,
  pathPlaceholder,
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
      projectItem: '',
      projectItemReference: ''
    }
  })
}

export const handleInputPathChange = (inputsDispatch, inputsState, path) => {
  if (inputsState.newInput.path.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
    if (
      path.length === 0 &&
      inputsState.newInputDefaultPathProject.length > 0
    ) {
      inputsDispatch({
        type: inputsActions.SET_NEW_INPUT_DEFAULT_PATH_PROJECT,
        payload: ''
      })
    }

    handleStoreInputPathChange(true, inputsDispatch, inputsState, path)
  } else {
    return inputsDispatch({
      type: inputsActions.SET_NEW_INPUT_URL_PATH,
      payload: path
    })
  }
}

export const handleStoreInputPathChange = (
  isNewInput,
  inputsDispatch,
  inputsState,
  path
) => {
  const pathItems = path.split('/')
  const [projectItem, projectItemReference] = getParsedResource(pathItems[2])

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

  if (!projectItemReference) {
    if (inputsState.artifactsReferences.length > 0) {
      inputsDispatch({
        type: inputsActions.SET_ARTIFACTS_REFERENCES,
        payload: []
      })
    }

    if (inputsState.featureVectorsReferences.length > 0) {
      inputsDispatch({
        type: inputsActions.SET_FEATURE_VECTORS_REFERENCES,
        payload: []
      })
    }
  }

  if (isNewInput) {
    inputsDispatch({
      type: inputsActions.SET_NEW_INPUT_PATH,
      payload: {
        ...inputsState.newInput.path,
        storePathType: pathItems[0] ?? inputsState.newInput.path.storePathType,
        project: pathItems[1] ?? inputsState.newInput.path.project,
        projectItem: projectItem ?? inputsState.newInput.path.projectItem,
        projectItemReference:
          projectItemReference ?? inputsState.newInput.path.projectItemReference
      }
    })
  }

  const projectItems =
    inputsState[pathItems[0] === 'artifacts' ? 'artifacts' : 'featureVectors']
  const projectItemIsEntered = projectItems.find(
    project => project.id === projectItem
  )
  const projectItemsReferences =
    inputsState[
      pathItems[0] === 'artifacts'
        ? 'artifactsReferences'
        : 'featureVectorsReferences'
    ]
  const projectItemReferenceIsEntered = projectItemsReferences.find(
    projectItemRef => projectItemRef.id === projectItemReference
  )
  const isInputStorePathTypeValid = storePathTypes.some(type =>
    type.id.startsWith(pathItems[0])
  )

  inputsDispatch({
    type: inputsActions.SET_INPUT_STORE_PATH_TYPE_ENTERED,
    payload: isInputStorePathTypeValid && typeof pathItems[1] === 'string'
  })
  inputsDispatch({
    type: inputsActions.SET_INPUT_PROJECT_PATH_ENTERED,
    payload: typeof pathItems[2] === 'string'
  })
  inputsDispatch({
    type: inputsActions.SET_INPUT_PROJECT_ITEM_PATH_ENTERED,
    payload: Boolean(projectItemIsEntered)
  })
  inputsDispatch({
    type: inputsActions.SET_INPUT_PROJECT_ITEM_REFERENCE_PATH_ENTERED,
    payload: Boolean(projectItemReferenceIsEntered)
  })
}

export const isPathInputValid = (pathInputType, pathInputValue) => {
  switch (pathInputType) {
    case MLRUN_STORAGE_INPUT_PATH_SCHEME:
      return /^(artifacts|feature-vectors)\/(.+?)\/(.+?)(#(.+?))?(:(.+?))?(@(.+))?$/.test(
        pathInputValue
      )
    case HTTP_STORAGE_INPUT_PATH_SCHEME:
    case HTTPS_STORAGE_INPUT_PATH_SCHEME:
      return pathInputValue.split('/')?.[1]?.length > 0
    default:
      return pathInputValue.length > 0
  }
}

export const pathTips = {
  [MLRUN_STORAGE_INPUT_PATH_SCHEME]:
    'artifacts/my-project/my-artifact:my-tag" or "artifacts/my-project/my-artifact@my-uid',
  [S3_INPUT_PATH_SCHEME]: 'bucket/path',
  [GOOGLE_STORAGE_INPUT_PATH_SCHEME]: 'bucket/path',
  [AZURE_STORAGE_INPUT_PATH_SCHEME]: 'container/path',
  [V3IO_INPUT_PATH_SCHEME]: 'container-name/file'
}
