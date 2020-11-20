import { SET_NOTIFICATION, REMOVE_NOTIFICATION } from '../constants'

const notificationActions = {
  setNotification: notification => ({
    type: SET_NOTIFICATION,
    payload: notification
  }),
  removeNotification: index => ({
    type: REMOVE_NOTIFICATION,
    payload: index
  })
}

export default notificationActions
