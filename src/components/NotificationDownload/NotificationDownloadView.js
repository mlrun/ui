import React from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'

import successDoneIcon from '../../images/success_done.png'
import unsuccessAlertIcon from '../../images/unsuccess_alert.png'

import './notificationdownloadview.scss'

const NotificationDownloadView = ({ status, retry, transitionStyles }) =>
  createPortal(
    <div className="notification_container" style={{ ...transitionStyles }}>
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
        {`Your download was ${status === 200 ? 'Successful' : 'unsuccessful'}`}
        {status !== 200 && (
          <div
            className="notification_body_button"
            onClick={() => {
              retry.func(retry.id, retry.url, retry.file)
            }}
          >
            RETRY
          </div>
        )}
      </div>
    </div>,
    document.getElementById('overlay_container')
  )

NotificationDownloadView.propTypes = {
  status: PropTypes.number.isRequired,
  retry: PropTypes.shape({
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    file: PropTypes.oneOf([PropTypes.string, PropTypes.any]),
    func: PropTypes.func.isRequired
  })
}

export default NotificationDownloadView
