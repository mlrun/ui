export const initialState = {
  addNewInput: false,
  newInput: {
    name: '',
    path: ''
  },
  selectedDataInput: {}
}

export const inputsActions = {
  REMOVE_NEW_INPUT_DATA: 'REMOVE_NEW_INPUT_DATA',
  SET_ADD_NEW_INPUT: 'SET_ADD_NEW_INPUT',
  SET_NEW_INPUT_NAME: 'SET_NEW_INPUT_NAME',
  SET_NEW_INPUT_PATH: 'SET_NEW_INPUT_PATH',
  SET_SELECTED_INPUT: 'SET_SELECTED_INPUT'
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
    case inputsActions.SET_ADD_NEW_INPUT:
      return {
        ...state,
        addNewInput: payload
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
    case inputsActions.SET_SELECTED_INPUT:
      return {
        ...state,
        selectedDataInput: payload
      }
    default:
      return state
  }
}
