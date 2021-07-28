export const initialState = {
  editMode: {
    field: '',
    fieldType: ''
  }
}

export const detailsInfoActions = {
  RESET_EDIT_MODE: 'RESET_EDIT_MODE',
  SET_EDIT_MODE: 'SET_EDIT_MODE',
  SET_EDIT_MODE_FIELD_TYPE: 'SET_EDIT_MODE_FIELD_TYPE'
}

export const detailsInfoReducer = (state, { type, payload }) => {
  switch (type) {
    case detailsInfoActions.RESET_EDIT_MODE:
      return {
        ...initialState
      }
    case detailsInfoActions.SET_EDIT_MODE:
      return {
        ...state,
        editMode: payload
      }
    case detailsInfoActions.SET_EDIT_MODE_FIELD_TYPE:
      return {
        editMode: {
          ...state.editMode,
          fieldType: payload
        }
      }
    default:
      return state
  }
}
