export const initialState = {
  editMode: {
    field: '',
    fieldType: ''
  }
}

export const detailsRequestedFeaturesActions = {
  RESET_EDIT_MODE: 'RESET_EDIT_MODE',
  SET_EDIT_MODE: 'SET_EDIT_MODE',
  SET_EDIT_MODE_FIELD_TYPE: 'SET_EDIT_MODE_FIELD_TYPE'
}

export const detailsRequestedFeaturesReducer = (state, { type, payload }) => {
  switch (type) {
    case detailsRequestedFeaturesActions.RESET_EDIT_MODE:
      return {
        ...initialState
      }
    case detailsRequestedFeaturesActions.SET_EDIT_MODE:
      return {
        ...state,
        editMode: payload
      }
    case detailsRequestedFeaturesActions.SET_EDIT_MODE_FIELD_TYPE:
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
