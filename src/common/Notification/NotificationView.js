import React from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'

import { ReactComponent as SuccessDone } from '../../images/success_done.svg'
import { ReactComponent as UnsuccessAlert } from '../../images/unsuccess_alert.svg'

import './notificationView.scss'

const NotificationView = ({ item, status, retry, transitionStyles }) =>
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
        {item.message}
        {status !== 200 && (
          <div
            className="notification_body_button"
            onClick={() => {
              retry(item)
            }}
          >
            RETRY
          </div>
        )}
      </div>
    </div>,
    document.getElementById('overlay_container')
  )

NotificationView.propTypes = {
  item: PropTypes.shape({}).isRequired,
  status: PropTypes.number.isRequired,
  retry: PropTypes.func.isRequired,
  transitionStyles: PropTypes.shape({}).isRequired
}

export default NotificationView
