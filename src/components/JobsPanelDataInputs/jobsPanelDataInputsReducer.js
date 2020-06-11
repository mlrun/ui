export const initialState = {
  addNewInput: false,
  addNewVolume: false,
  newInput: {
    name: '',
    path: ''
  },
  newVolume: {
    name: '',
    type: '',
    typeName: '',
    path: '',
    accessKey: '',
    resourcesPath: ''
  },
  selectedDataInput: {},
  selectedVolume: {}
}

export const inputsActions = {
  REMOVE_NEW_INPUT_DATA: 'REMOVE_NEW_INPUT_DATA',
  REMOVE_NEW_VOLUME_DATA: 'REMOVE_NEW_VOLUME_DATA',
  SET_ADD_NEW_INPUT: 'SET_ADD_NEW_INPUT',
  SET_ADD_NEW_VOLUME: 'SET_ADD_NEW_VOLUME',
  SET_NEW_INPUT_NAME: 'SET_NEW_INPUT_NAME',
  SET_NEW_VOLUME_NAME: 'SET_NEW_VOLUME_NAME',
  SET_NEW_INPUT_PATH: 'SET_NEW_INPUT_PATH',
  SET_NEW_VOLUME_PATH: 'SET_NEW_VOLUME_PATH',
  SET_NEW_VOLUME_TYPE: 'SET_NEW_VOLUME_TYPE',
  SET_NEW_VOLUME_TYPE_NAME: 'SET_NEW_VOLUME_TYPE_NAME',
  SET_NEW_VOLUME_ACCESS_KEY: 'SET_NEW_VOLUME_ACCESS_KEY',
  SET_NEW_VOLUME_RESOURCES_PATH: 'SET_NEW_VOLUME_RESOURCES_PATH',
  SET_SELECTED_INPUT: 'SET_SELECTED_INPUT',
  SET_SELECTED_VOLUME: 'SET_SELECTED_VOLUME'
}

export const jobsPanelDataInputsReducer = (state, { type, payload }) => {
  switch (type) {
    case inputsActions.REMOVE_NEW_INPUT_DATA:
      return {
        ...state,
        newInput: {
          name: '',
          path: ''
        }
      }
    case inputsActions.REMOVE_NEW_VOLUME_DATA:
      return {
        ...state,
        newVolume: {
          name: '',
          type: '',
          typeName: '',
          path: '',
          accessKey: '',
          resourcesPath: ''
        }
      }
    case inputsActions.SET_ADD_NEW_INPUT:
      return {
        ...state,
        addNewInput: payload
      }
    case inputsActions.SET_ADD_NEW_VOLUME:
      return {
        ...state,
        addNewVolume: payload
      }
    case inputsActions.SET_NEW_INPUT_NAME:
      return {
        ...state,
        newInput: {
          ...state.newInput,
          name: payload
        }
      }
    case inputsActions.SET_NEW_VOLUME_NAME:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
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
    case inputsActions.SET_NEW_VOLUME_PATH:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
          path: payload
        }
      }
    case inputsActions.SET_NEW_VOLUME_TYPE:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
          type: payload
        }
      }
    case inputsActions.SET_NEW_VOLUME_TYPE_NAME:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
          typeName: payload
        }
      }
    case inputsActions.SET_NEW_VOLUME_ACCESS_KEY:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
          accessKey: payload
        }
      }
    case inputsActions.SET_NEW_VOLUME_RESOURCES_PATH:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
          resourcesPath: payload
        }
      }
    case inputsActions.SET_SELECTED_INPUT:
      return {
        ...state,
        selectedDataInput: payload
      }
    case inputsActions.SET_SELECTED_VOLUME:
      return {
        ...state,
        selectedVolume: payload
      }
    default:
      return state
  }
}
