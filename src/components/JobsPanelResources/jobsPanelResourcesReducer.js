export const initialState = {
  addNewVolume: false,
  newVolume: {
    name: '',
    type: '',
    typeName: '',
    path: '',
    accessKey: '',
    resourcesPath: ''
  },
  selectedVolume: {}
}

export const resourcesActions = {
  REMOVE_NEW_VOLUME_DATA: 'REMOVE_NEW_VOLUME_DATA',
  SET_ADD_NEW_VOLUME: 'SET_ADD_NEW_VOLUME',
  SET_NEW_VOLUME_NAME: 'SET_NEW_VOLUME_NAME',
  SET_NEW_VOLUME_PATH: 'SET_NEW_VOLUME_PATH',
  SET_NEW_VOLUME_TYPE: 'SET_NEW_VOLUME_TYPE',
  SET_NEW_VOLUME_TYPE_NAME: 'SET_NEW_VOLUME_TYPE_NAME',
  SET_NEW_VOLUME_ACCESS_KEY: 'SET_NEW_VOLUME_ACCESS_KEY',
  SET_NEW_VOLUME_RESOURCES_PATH: 'SET_NEW_VOLUME_RESOURCES_PATH',
  SET_SELECTED_VOLUME: 'SET_SELECTED_VOLUME'
}

export const jobsPanelResourcesReducer = (state, { type, payload }) => {
  switch (type) {
    case resourcesActions.REMOVE_NEW_VOLUME_DATA:
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
    case resourcesActions.SET_ADD_NEW_VOLUME:
      return {
        ...state,
        addNewVolume: payload
      }
    case resourcesActions.SET_NEW_VOLUME_NAME:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
          name: payload
        }
      }
    case resourcesActions.SET_NEW_VOLUME_PATH:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
          path: payload
        }
      }
    case resourcesActions.SET_NEW_VOLUME_TYPE:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
          type: payload
        }
      }
    case resourcesActions.SET_NEW_VOLUME_TYPE_NAME:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
          typeName: payload
        }
      }
    case resourcesActions.SET_NEW_VOLUME_ACCESS_KEY:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
          accessKey: payload
        }
      }
    case resourcesActions.SET_NEW_VOLUME_RESOURCES_PATH:
      return {
        ...state,
        newVolume: {
          ...state.newVolume,
          resourcesPath: payload
        }
      }
    case resourcesActions.SET_SELECTED_VOLUME:
      return {
        ...state,
        selectedVolume: payload
      }
    default:
      return state
  }
}
