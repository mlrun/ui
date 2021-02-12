export const initialState = {
  editMode: {
    field: '',
    fieldType: ''
  },
  fieldsData: {}
}

export const detailsInfoActions = {
  SET_EDIT_MODE: 'SET_EDIT_MODE',
  SET_EDIT_MODE_FIELD_TYPE: 'SET_EDIT_MODE_FIELD_TYPE',
  SET_FIELDS_DATA: 'SET_FIELDS_DATA'
}

export const detailsInfoReducer = (state, { type, payload }) => {
  switch (type) {
    case detailsInfoActions.SET_EDIT_MODE:
      return {
        ...state,
        editMode: payload
      }
    case detailsInfoActions.SET_EDIT_MODE_FIELD_TYPE:
      return {
        ...state,
        editMode: {
          ...state.editMode,
          fieldType: payload
        }
      }
    case detailsInfoActions.SET_FIELDS_DATA:
      return {
        ...state,
        fieldsData: payload
      }
    default:
      return state
  }
}
