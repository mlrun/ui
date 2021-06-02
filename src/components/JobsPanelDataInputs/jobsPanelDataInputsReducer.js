export const initialState = {
  addNewInput: false,
  projects: [],
  artifacts: [],
  artifactsReferences: [],
  featureVectors: [],
  featureVectorsReferences: [],
  comboboxMatches: [],
  inputStorePathTypeEntered: false,
  inputProjectPathEntered: false,
  inputProjectItemPathEntered: false,
  inputProjectItemReferencePathEntered: false,
  newInputDefaultPathProject: '',
  newInputUrlPath: '',
  pathPlaceholder: '',
  newInput: {
    name: '',
    path: {
      pathType: '',
      storePathType: '',
      project: '',
      projectItem: '',
      projectItemReference: ''
    }
  },
  selectedDataInput: {
    data: {
      name: '',
      path: {
        pathType: '',
        value: ''
      }
    }
  }
}

export const inputsActions = {
  REMOVE_NEW_INPUT_DATA: 'REMOVE_NEW_INPUT_DATA',
  REMOVE_SELECTED_INPUT: 'REMOVE_SELECTED_INPUT',
  SET_ADD_NEW_INPUT: 'SET_ADD_NEW_INPUT',
  SET_ARTIFACTS: 'SET_ARTIFACTS',
  SET_ARTIFACTS_REFERENCES: 'SET_ARTIFACTS_REFERENCES',
  SET_FEATURE_VECTORS: 'SET_FEATURE_VECTORS',
  SET_FEATURE_VECTORS_REFERENCES: 'SET_FEATURE_VECTORS_REFERENCES',
  SET_COMBOBOX_MATCHES: 'SET_COMBOBOX_MATCHES',
  SET_NEW_INPUT_DEFAULT_PATH_PROJECT: 'SET_NEW_INPUT_DEFAULT_PATH_PROJECT',
  SET_NEW_INPUT_NAME: 'SET_NEW_INPUT_NAME',
  SET_NEW_INPUT_PATH: 'SET_NEW_INPUT_PATH',
  SET_INPUT_PROJECT_ITEM_PATH_ENTERED: 'SET_INPUT_PROJECT_ITEM_PATH_ENTERED',
  SET_INPUT_PROJECT_ITEM_REFERENCE_PATH_ENTERED:
    'SET_INPUT_PROJECT_ITEM_REFERENCE_PATH_ENTERED',
  SET_INPUT_PROJECT_PATH_ENTERED: 'SET_INPUT_PROJECT_PATH_ENTERED',
  SET_INPUT_STORE_PATH_TYPE_ENTERED: 'SET_INPUT_STORE_PATH_TYPE_ENTERED',
  SET_NEW_INPUT_URL_PATH: 'SET_NEW_INPUT_URL_PATH',
  SET_PATH_PLACEHOLDER: 'SET_PATH_PLACEHOLDER',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_SELECTED_INPUT: 'SET_SELECTED_INPUT'
}

export const jobsPanelDataInputsReducer = (state, { type, payload }) => {
  switch (type) {
    case inputsActions.REMOVE_NEW_INPUT_DATA:
      return {
        ...state,
        newInput: {
          name: '',
          path: {
            pathType: '',
            storePathType: '',
            project: '',
            projectItem: '',
            projectItemReference: ''
          }
        },
        projects: [],
        artifacts: [],
        artifactsReferences: [],
        featureVectors: [],
        featureVectorsReferences: [],
        comboboxMatches: [],
        inputStorePathTypeEntered: false,
        inputProjectPathEntered: false,
        inputProjectItemPathEntered: false,
        inputProjectItemReferencePathEntered: false
      }
    case inputsActions.REMOVE_SELECTED_INPUT:
      return {
        ...state,
        selectedDataInput: {
          data: {
            name: '',
            path: {
              pathType: '',
              value: ''
            }
          }
        },
        projects: [],
        artifacts: [],
        artifactsReferences: [],
        featureVectors: [],
        featureVectorsReferences: [],
        comboboxMatches: [],
        inputStorePathTypeEntered: false,
        inputProjectPathEntered: false,
        inputProjectItemPathEntered: false,
        inputProjectItemReferencePathEntered: false
      }
    case inputsActions.SET_ADD_NEW_INPUT:
      return {
        ...state,
        addNewInput: payload
      }
    case inputsActions.SET_ARTIFACTS:
      return {
        ...state,
        artifacts: payload
      }
    case inputsActions.SET_ARTIFACTS_REFERENCES:
      return {
        ...state,
        artifactsReferences: payload
      }
    case inputsActions.SET_FEATURE_VECTORS:
      return {
        ...state,
        featureVectors: payload
      }
    case inputsActions.SET_FEATURE_VECTORS_REFERENCES:
      return {
        ...state,
        featureVectorsReferences: payload
      }
    case inputsActions.SET_COMBOBOX_MATCHES:
      return {
        ...state,
        comboboxMatches: payload
      }
    case inputsActions.SET_INPUT_PROJECT_ITEM_PATH_ENTERED:
      return {
        ...state,
        inputProjectItemPathEntered: payload
      }
    case inputsActions.SET_INPUT_PROJECT_ITEM_REFERENCE_PATH_ENTERED:
      return {
        ...state,
        inputProjectItemReferencePathEntered: payload
      }
    case inputsActions.SET_NEW_INPUT_DEFAULT_PATH_PROJECT:
      return {
        ...state,
        newInputDefaultPathProject: payload
      }
    case inputsActions.SET_NEW_INPUT_NAME:
      return {
        ...state,
        newInput: {
          ...state.newInput,
          name: payload
        }
      }
    case inputsActions.SET_NEW_INPUT_PATH:
      return {
        ...state,
        newInput: {
          ...state.newInput,
          path: payload
        },
        inputStorePathTypeEntered: false,
        inputProjectPathEntered: false,
        inputProjectItemPathEntered: false,
        inputProjectItemReferencePathEntered: false
      }
    case inputsActions.SET_INPUT_STORE_PATH_TYPE_ENTERED:
      return {
        ...state,
        inputStorePathTypeEntered: payload
      }
    case inputsActions.SET_INPUT_PROJECT_PATH_ENTERED:
      return {
        ...state,
        inputProjectPathEntered: payload
      }
    case inputsActions.SET_NEW_INPUT_URL_PATH:
      return {
        ...state,
        newInputUrlPath: payload
      }
    case inputsActions.SET_PATH_PLACEHOLDER:
      return {
        ...state,
        pathPlaceholder: payload
      }
    case inputsActions.SET_PROJECTS:
      return {
        ...state,
        projects: payload
      }
    case inputsActions.SET_SELECTED_INPUT:
      return {
        ...state,
        selectedDataInput: payload
      }
    default:
      return state
  }
}
