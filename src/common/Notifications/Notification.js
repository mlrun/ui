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
import React, { useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Transition } from 'react-transition-group'
import { inRange } from 'lodash'
import PropTypes from 'prop-types'

import { removeNotification } from '../../reducers/notificationReducer'

import { NOTIFICATION_DURATION } from '../../constants'

import { ReactComponent as CloseIcon } from 'igz-controls/images/close.svg'
import { ReactComponent as SuccessDone } from 'igz-controls/images/success_done.svg'
import { ReactComponent as UnsuccessAlert } from 'igz-controls/images/unsuccess_alert.svg'

import './notification.scss'

const Notification = ({ notification, ...rest }) => {
  // rest is required for Transition
  const dispatch = useDispatch()
  const nodeRef = useRef()

  const defaultStyle = {
    transform: 'translateY(130px)',
    opacity: 0
  }
  const transitionStyles = {
    entered: {
      transform: 'translateY(0)',
      opacity: 1,
      transition: `transform ${NOTIFICATION_DURATION}ms ease-in-out, opacity ${NOTIFICATION_DURATION}ms ease-in-out`
    },
    exiting: {
      transform: 'translateY(130px)',
      opacity: 0,
      transition: `transform ${NOTIFICATION_DURATION}ms ease-in-out, opacity ${NOTIFICATION_DURATION}ms ease-in-out`
    }
  }

  const isSuccessResponse = useMemo(
    () => inRange(notification.status, 200, 300),
    [notification.status]
  )
  const handleRemoveNotification = itemId => {
    dispatch(removeNotification(itemId))
  }
  const handleRetry = item => {
    handleRemoveNotification(item.id)
    item.retry(item)
  }

  return (
    <Transition
      nodeRef={nodeRef}
      timeout={NOTIFICATION_DURATION}
      onEntered={() => {
        setTimeout(() => {
          handleRemoveNotification(notification.id)
        }, 10000)
      }}
      {...rest}
    >
      {state => (
        <div
          className="notification"
          style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}
        >
          <div className="notification__body">
            <button
              className="notification__button-close"
              onClick={() => handleRemoveNotification(notification.id)}
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
            {notification.message}
            {!isSuccessResponse && notification.retry && (
              <div
                className="notification__body__button-retry"
                onClick={() => {
                  handleRetry(notification)
                }}
              >
                RETRY
              </div>
            )}
          </div>
        </div>
      )}
    </Transition>
  )
}

Notification.prototype = {
  notification: PropTypes.object.isRequired
}

export default Notification
