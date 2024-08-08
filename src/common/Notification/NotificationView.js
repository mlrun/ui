/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as CloseIcon } from 'igz-controls/images/close.svg'
import { ReactComponent as SuccessDone } from 'igz-controls/images/success_done.svg'
import { ReactComponent as UnsuccessAlert } from 'igz-controls/images/unsuccess_alert.svg'

import './notificationView.scss'

const NotificationView = ({
  item,
  isSuccessResponse,
  handleRemoveNotification,
  retry,
  transitionStyles
}) => {
  return (
    <div className="notification" style={{ ...transitionStyles }}>
      <div className="notification__body">
        <button
          className="notification__button-close"
          onClick={() => handleRemoveNotification(item.id)}
        >
          <CloseIcon />
        </button>
        <div
          className={`notification__body__status notification__body__icon-${
            isSuccessResponse ? 'success' : 'alert'
          }`}
        >
          <div className={isSuccessResponse ? 'icon-success' : 'icon-alert'}>
            {isSuccessResponse ? <SuccessDone /> : <UnsuccessAlert />}
          </div>
        </div>
        {item.message}
        {!isSuccessResponse && item.retry && (
          <div
            className="notification__body__button-retry"
            onClick={() => {
              retry(item)
            }}
          >
            RETRY
          </div>
        )}
      </div>
    </div>
  )
}

NotificationView.propTypes = {
  item: PropTypes.shape({}).isRequired,
  isSuccessResponse: PropTypes.bool.isRequired,
  handleRemoveNotification: PropTypes.func.isRequired,
  retry: PropTypes.func.isRequired,
  transitionStyles: PropTypes.shape({}).isRequired
}

export default NotificationView
