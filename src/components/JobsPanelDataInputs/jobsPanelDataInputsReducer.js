export const initialState = {
  addNewInput: false,
  artifacts: [],
  comboboxMatches: [],
  newInput: {
    name: '',
    path: {
      pathType: '',
      project: '',
      artifact: ''
    }
  },
  inputArtifactPathEntered: false,
  newInputDefaultPathProject: '',
  inputProjectPathEntered: false,
  newInputUrlPath: '',
  pathPlaceholder: '',
  projects: [],
  selectedDataInput: {
    data: {
      name: '',
      path: {
        pathType: '',
        value: '',
        url: ''
      }
    }
  }
}

export const inputsActions = {
  REMOVE_NEW_INPUT_DATA: 'REMOVE_NEW_INPUT_DATA',
  SET_ADD_NEW_INPUT: 'SET_ADD_NEW_INPUT',
  SET_ARTIFACTS: 'SET_ARTIFACTS',
  SET_COMBOBOX_MATCHES: 'SET_COMBOBOX_MATCHES',
  SET_NEW_INPUT_DEFAULT_PATH_PROJECT: 'SET_NEW_INPUT_DEFAULT_PATH_PROJECT',
  SET_NEW_INPUT_NAME: 'SET_NEW_INPUT_NAME',
  SET_NEW_INPUT_PATH: 'SET_NEW_INPUT_PATH',
  SET_INPUT_ARTIFACT_PATH_ENTERED: 'SET_INPUT_ARTIFACT_PATH_ENTERED',
  SET_INPUT_PROJECT_PATH_ENTERED: 'SET_INPUT_PROJECT_PATH_ENTERED',
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
            project: '',
            artifact: ''
          }
        }
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
    case inputsActions.SET_COMBOBOX_MATCHES:
      return {
        ...state,
        comboboxMatches: payload
      }
    case inputsActions.SET_INPUT_ARTIFACT_PATH_ENTERED:
      return {
        ...state,
        inputArtifactPathEntered: payload
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
        }
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
