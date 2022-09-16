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
import { TransitionGroup, Transition } from 'react-transition-group'
import { connect } from 'react-redux'

import NotificationView from './NotificationView'

import notificationAction from '../../actions/notification'

const Notification = ({ notificationStore, removeNotification }) => {
  const defaultStyle = {
    position: 'fixed',
    right: '24px',
    bottom: '-100px',
    opacity: 0,
    zIndex: '1000'
  }
  const heightNotification = 60
  const offsetNotification = 60
  const duration = 500

  const handleRetry = item => {
    removeNotification(item.id)
    item.retry(item)
  }

  return (
    <TransitionGroup>
      {notificationStore.notification.map((item, index) => {
        const bottomPosition =
          (notificationStore.notification.length - index) * heightNotification +
          offsetNotification

        const transitionStyles = {
          entered: {
            transform: `translateY(-${bottomPosition}px)`,
            opacity: 1,
            transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`
          },
          exiting: {
            transform: 'translateY(0px)',
            opacity: 0,
            transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`
          }
        }

        return (
          <Transition
            key={`css${item.id}`}
            timeout={duration}
            classNames="notification_download"
            onEntered={() => {
              setTimeout(() => {
                removeNotification(item.id)
              }, 4000)
            }}
          >
            {state => (
              <NotificationView
                item={item}
                transitionStyles={{
                  ...defaultStyle,
                  ...transitionStyles[state]
                }}
                key={item.id}
                status={item.status}
                retry={handleRetry}
              />
            )}
          </Transition>
        )
      })}
    </TransitionGroup>
  )
}

export default connect(notificationStore => notificationStore, {
  ...notificationAction
})(Notification)
