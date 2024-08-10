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
import { useDispatch, useSelector } from 'react-redux'
import { inRange } from 'lodash'

import NotificationView from './NotificationView'
import DownloadContainer from '../Download/DownloadContainer'

import { removeNotification } from '../../reducers/notificationReducer'

const Notification = () => {
  const dispatch = useDispatch()
  const notificationStore = useSelector(store => store.notificationStore)

  const defaultStyle = {
    transform: 'translateY(130px)',
    opacity: 0
  }

  const duration = 500

  const handleRemoveNotification = itemId => {
    dispatch(removeNotification(itemId))
  }

  const handleRetry = item => {
    handleRemoveNotification(item.id)
    item.retry(item)
  }

  return (
    <div className="notifications-wrapper">
      <TransitionGroup component={null}>
        {notificationStore.notification.map(item => {
          const isSuccessResponse = inRange(item.status, 200, 300)

          const transitionStyles = {
            entered: {
              transform: 'translateY(0)',
              opacity: 1,
              transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`
            },
            exiting: {
              transform: 'translateY(130px)',
              opacity: 0,
              transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`
            }
          }

          return (
            <Transition
              key={`css${item.id}`}
              timeout={duration}
              onEntered={() => {
                setTimeout(() => {
                  handleRemoveNotification(item.id)
                }, 10000)
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
                  isSuccessResponse={isSuccessResponse}
                  handleRemoveNotification={handleRemoveNotification}
                  retry={handleRetry}
                />
              )}
            </Transition>
          )
        })}
      </TransitionGroup>
      <DownloadContainer />
    </div>
  )
}

export default Notification
