const initialState = {
  notification: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_NOTIFICATION_DOWNLOAD':
      return {
        ...state,
        notification: [...state.notification, payload]
      }
    case 'REMOVE_NOTIFICATION_DOWNLOAD':
      return {
        ...state,
        notification: state.notification.filter(item => item.id !== payload)
      }
    default:
      return state
  }
}
