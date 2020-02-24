import React from 'react'
import HttpClient from '../../httpClient'
import PropTypes from 'prop-types'
import successDoneIcon from '../../images/success_done.png'
import unsuccessAlertIcon from '../../images/unsuccess_alert.png'
import downloadFile from '../../utils/downloadFile'
import notificationDownloadAction from '../../actions/notificationDownload'
import { createPortal } from 'react-dom'

import './notificationdownload.scss'

const NotificationDownload = ({ status, url, file, id, dispatch }) =>
  createPortal(
    <div className="notification_container">
      <div className="notification_body">
        <div
          className={`notification_body_wrapper notification_body_${
            status === 200 ? 'success' : 'alert'
          }_icon`}
        >
          <img
            className={status === 200 ? 'success_icon' : 'alert_icon'}
            src={status === 200 ? successDoneIcon : unsuccessAlertIcon}
            alt={status === 200 ? 'success' : 'alert'}
          />
        </div>
        {`Your download was ${
          status === 200 ? 'Successufull' : 'unsuccessufull'
        }`}
        {status !== 200 && (
          <div
            className="notification_body_button"
            onClick={() => {
              dispatch(
                notificationDownloadAction.removeNotificationDownload(id)
              )
              HttpClient(url)
                .then(response => {
                  downloadFile(file, response)
                  dispatch(
                    notificationDownloadAction.setNotificationDownload({
                      status: response.status,
                      url: response.config.url,
                      id: Math.random()
                    })
                  )
                })
                .catch(err => {
                  dispatch(
                    notificationDownloadAction.setNotificationDownload({
                      status: 400,
                      url: url,
                      file: file,
                      id: Math.random()
                    })
                  )
                })
            }}
          >
            RETRY
          </div>
        )}
      </div>
    </div>,
    document.getElementById('overlay_container')
  )

NotificationDownload.propTypes = {
  status: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  file: PropTypes.string
}

export default NotificationDownload
