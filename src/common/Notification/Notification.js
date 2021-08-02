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
