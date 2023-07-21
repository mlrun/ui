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
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { RoundedIcon, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { mainHttpClient } from '../../httpClient'
import downloadFile from '../../utils/downloadFile'
import { removeDownloadItem } from '../../reducers/downloadReducer'

import { ReactComponent as Close } from 'igz-controls/images/close.svg'
import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'

const DEFAULT_FILE_NAME = 'mlrun-file'

const DownloadItem = ({ downloadItem }) => {
  const [progress, setProgress] = useState(0)
  const [isDownload, setDownload] = useState(true)
  const [isSuccessResponse, setIsSuccessResponse] = useState(null)
  const params = useParams()

  const downloadRef = useRef(null)
  const dispatch = useDispatch()

  let file = useMemo(
    () =>
      downloadItem.fileName ??
      downloadItem.path.match(/\/(?<filename>[^/]+)$/)?.groups?.filename ??
      DEFAULT_FILE_NAME,
    [downloadItem.fileName, downloadItem.path]
  )

  const downloadCallback = useCallback(() => {
    if (isDownload) {
      const config = {
        onDownloadProgress: progressEvent => {
          const percentCompleted = (progressEvent.loaded * 100) / progressEvent.total
          setProgress(percentCompleted)
        },
        cancelToken: new axios.CancelToken(cancel => {
          if (downloadRef.current) {
            downloadRef.current.cancel = cancel
          }
        }),
        params: { path: downloadItem.path },
        responseType: 'arraybuffer'
      }

      if (downloadItem.path.startsWith('/User')) {
        config.params.user = downloadItem.user
      }

      mainHttpClient
        .get(`projects/${params.projectName}/files`, config)
        .then(response => {
          downloadFile(file, response)
          if (downloadRef.current) {
            setDownload(false)
            setIsSuccessResponse(true)
          }
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            setDownload(false)
            return setProgress(0)
          }
          if (downloadRef.current) {
            setDownload(false)
            setProgress(0)
          }
        })
        .finally(() => {
          if (downloadRef.current) {
            downloadRef.current.cancel = null
          }
          setTimeout(() => {
            dispatch(removeDownloadItem(downloadItem.id))
          }, 1000)
        })
    }
  }, [
    isDownload,
    downloadItem.path,
    params.projectName,
    downloadItem.user,
    file,
    dispatch,
    downloadItem.id
  ])

  useEffect(() => {
    let cancelFetch = downloadRef.current

    setTimeout(() => {
      downloadCallback()
    }, 1000)

    return () => {
      cancelFetch.cancel && cancelFetch.cancel()
    }
  }, [downloadCallback, downloadRef])

  const handleClick = () => {
    if (downloadRef.current?.cancel) {
      return downloadRef.current.cancel('cancel')
    }

    setDownload(!isDownload)
  }

  return (
    <div className="download-item" ref={downloadRef}>
      <Tooltip className="download-item__filename" template={<TextTooltipTemplate text={file} />}>
        {file}
      </Tooltip>
      <div className="download-item__status">
        {isDownload ? (
          `${Math.floor(progress)}%`
        ) : isSuccessResponse ? (
          <div className="download-item__message_succeed">Done</div>
        ) : (
          <div className="download-item__message_failed">Failed</div>
        )}
      </div>
      <div className="download-item__buttons">
        {isDownload ? (
          <RoundedIcon onClick={handleClick}>
            <Close />
          </RoundedIcon>
        ) : !isSuccessResponse ? (
          <RoundedIcon
            onClick={() => {
              setDownload(true)
            }}
          >
            <RefreshIcon />
          </RoundedIcon>
        ) : null}
      </div>
    </div>
  )
}

DownloadItem.propTypes = {
  downloadItem: PropTypes.shape({
    filename: PropTypes.string,
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    user: PropTypes.string
  }).isRequired
}

export default React.memo(DownloadItem)
