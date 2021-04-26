export const initialState = {
  editMode: {
    field: '',
    fieldType: ''
  },
  fieldsData: {}
}

export const detailsRequestedFeaturesActions = {
  SET_EDIT_MODE: 'SET_EDIT_MODE',
  SET_EDIT_MODE_FIELD_TYPE: 'SET_EDIT_MODE_FIELD_TYPE',
  SET_FIELDS_DATA: 'SET_FIELDS_DATA'
}

export const detailsRequestedFeaturesReducer = (state, { type, payload }) => {
  switch (type) {
    case detailsRequestedFeaturesActions.SET_EDIT_MODE:
      return {
        ...state,
        editMode: payload
      }
    case detailsRequestedFeaturesActions.SET_EDIT_MODE_FIELD_TYPE:
      return {
        ...state,
        editMode: {
          ...state.editMode,
          fieldType: payload
        }
      }
    case detailsRequestedFeaturesActions.SET_FIELDS_DATA:
      return {
        ...state,
        fieldsData: payload
      }
    default:
      return state
  }
}
