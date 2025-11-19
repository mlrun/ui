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
import React, { useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Transition } from 'react-transition-group'
import { inRange } from 'lodash'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { useTimeout } from '../../hooks/useTimeout'

import { removeNotification } from 'igz-controls/reducers/notificationReducer'

import { NOTIFICATION_DURATION } from '../../constants'

import CloseIcon from 'igz-controls/images/close.svg?react'
import SuccessDone from 'igz-controls/images/success_done.svg?react'
import UnsuccessAlert from 'igz-controls/images/unsuccess_alert.svg?react'

import './notification.scss'

const Notification = ({ notification, timeoutMs = 10000, ...rest }) => {
  // rest is required for Transition
  const dispatch = useDispatch()
  const nodeRef = useRef()

  const { pauseTimeout, resumeTimeout, cancelTimeout } = useTimeout(
    () => dispatch(removeNotification(notification.id)),
    timeoutMs
  )

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
    cancelTimeout()
  }
  const handleRetry = item => {
    handleRemoveNotification(item.id)
    cancelTimeout()
    item.retry(item)
  }

  const progressbarClasses = classnames(
    'notification__progress-bar',
    isSuccessResponse ? 'notification__progress-bar-success' : 'notification__progress-bar-alert'
  )

  useEffect(() => {
    const element = nodeRef.current

    if (element) {
      element.addEventListener('mouseenter', pauseTimeout)
      element.addEventListener('mouseleave', resumeTimeout)
    }

    return () => {
      if (element) {
        element.removeEventListener('mouseenter', pauseTimeout)
        element.removeEventListener('mouseleave', resumeTimeout)
      }
    }
  }, [pauseTimeout, resumeTimeout])

  return (
    <Transition nodeRef={nodeRef} timeout={NOTIFICATION_DURATION} {...rest}>
      {state => (
        <div
          className="notification"
          style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}
          ref={nodeRef}
        >
          <div className="notification__body">
            <div
              className={`notification__body__status notification__body__icon-${
                isSuccessResponse ? 'success' : 'alert'
              }`}
            >
              <div className={isSuccessResponse ? 'icon-success' : 'icon-alert'}>
                {isSuccessResponse ? <SuccessDone /> : <UnsuccessAlert />}
              </div>
            </div>
            <div className="notification__body__message">{notification.message}</div>
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
          <button
            className="notification__button-close"
            onClick={() => {
              handleRemoveNotification(notification.id)
            }}
          >
            <CloseIcon />
          </button>
          <div className="notification__progress-bar__wrapper">
            <div className="notification__progress-bar__bg"></div>
            <div
              role="progressbar"
              aria-hidden="false"
              aria-label="notification timer"
              className={progressbarClasses}
              style={{ animationDuration: `${timeoutMs}ms` }}
            ></div>
          </div>
        </div>
      )}
    </Transition>
  )
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
  timeoutMs: PropTypes.number
}

export default Notification
