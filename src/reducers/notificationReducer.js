import { SET_NOTIFICATION, REMOVE_NOTIFICATION } from '../constants'

const initialState = {
  notification: []
}

const notificationReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_NOTIFICATION:
      return {
        ...state,
        notification: [...state.notification, payload]
      }
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notification: state.notification.filter(item => item.id !== payload)
      }
    default:
      return state
  }
}

export default notificationReducer
