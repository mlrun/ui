export const initialState = {
  editMode: {
    field: '',
    fieldType: ''
  }
}

export const detailsInfoActions = {
  RESET_EDIT_MODE: 'RESET_EDIT_MODE',
  SET_EDIT_MODE: 'SET_EDIT_MODE'
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
    default:
      return state
  }
}
