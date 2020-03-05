import React from 'react'
import { TransitionGroup, Transition } from 'react-transition-group'
import { useSelector, useDispatch } from 'react-redux'

import NotificationDownloadView from '../../elements/NotificationDownloadView/NotificationDownloadView'

const NotificationDownload = () => {
  const state = useSelector(state => state.notificationDownloadStore)
  const dispatch = useDispatch()

  const defaultStyle = {
    position: 'fixed',
    bottom: '-100px',
    opacity: 0,
    zIndex: '1000'
  }
  const heightNotification = 60
  const offsetNotification = 60
  const duration = 500

  return (
    <TransitionGroup>
      {state.notification.map((item, index) => {
        const bottomPosition =
          (state.notification.length - index) * heightNotification +
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
              setTimeout(
                () => {
                  dispatch({
                    type: 'REMOVE_NOTIFICATION_DOWNLOAD',
                    payload: item.id
                  })
                },
                item.status === 200 ? 1500 : 2500
              )
            }}
          >
            {state => (
              <NotificationDownloadView
                transitionStyles={{
                  ...defaultStyle,
                  ...transitionStyles[state]
                }}
                key={item.id}
                status={item.status}
                url={item.url}
                file={item.file || null}
                id={item.id}
                dispatch={dispatch}
              />
            )}
          </Transition>
        )
      })}
    </TransitionGroup>
  )
}

export default NotificationDownload
