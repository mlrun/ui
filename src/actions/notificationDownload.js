const notificationDownload = {
  setNotificationDownload: notification => ({
    type: 'SET_NOTIFICATION_DOWNLOAD',
    payload: notification
  }),
  removeNotificationDownload: index => ({
    type: 'REMOVE_NOTIFICATION_DOWNLOAD',
    payload: index
  })
}

export default notificationDownload
