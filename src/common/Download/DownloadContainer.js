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
import { useDispatch, useSelector } from 'react-redux'
import { Transition, TransitionGroup } from 'react-transition-group'
import { isEmpty } from 'lodash'

import DownloadItem from './DownloadItem'

import { setShowDownloadsList } from '../../reducers/downloadReducer'

import { ReactComponent as CloseIcon } from 'igz-controls/images/close.svg'

import './downloadContainer.scss'

const DownloadContainer = () => {
  const downloadStore = useSelector(store => store.downloadStore)
  const dispatch = useDispatch()
  const duration = 500

  const defaultStyle = {
    transform: 'translateY(130px)',
    opacity: 0
  }

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

  const handleCancel = () => {
    dispatch(setShowDownloadsList(false))
  }

  return (
    <TransitionGroup component={null}>
      {!isEmpty(downloadStore.downloadList) && downloadStore.showDownloadsList && (
        <Transition timeout={duration}>
          {state => (
            <div
              className="download-container"
              data-testid="download-container"
              style={{ ...defaultStyle, ...transitionStyles[state] }}
            >
              <div className="download-container__header">Downloads</div>
              <button className="notification__button-close" onClick={handleCancel}>
                <CloseIcon />
              </button>
              <div className="download-container__body">
                {downloadStore.downloadList.map((downloadItem, index) => {
                  return <DownloadItem downloadItem={downloadItem} key={index} />
                })}
              </div>
            </div>
          )}
        </Transition>
      )}
    </TransitionGroup>
  )
}

export default DownloadContainer
