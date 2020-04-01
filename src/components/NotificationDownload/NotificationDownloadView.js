import React from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'

import { ReactComponent as SuccessDone } from '../../images/success_done.svg'
import { ReactComponent as UnsuccessAlert } from '../../images/unsuccess_alert.svg'

import './notificationDownloadView.scss'

const NotificationDownloadView = ({ status, retry, transitionStyles }) =>
  createPortal(
    <div className="notification_container" style={{ ...transitionStyles }}>
      <div className="notification_body">
        <div
          className={`notification_body_wrapper notification_body_${
            status === 200 ? 'success' : 'alert'
          }_icon`}
        >
          <div className={status === 200 ? 'success_icon' : 'alert_icon'}>
            {status === 200 ? <SuccessDone /> : <UnsuccessAlert />}
          </div>
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
