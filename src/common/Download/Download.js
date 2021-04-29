import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'

import ProgressRing from '../ProgressRing/ProgressRing'

import { mainHttpClient } from '../../httpClient'
import notificationActions from '../../actions/notification'
import downloadFile from '../../utils/downloadFile'

import './download.scss'
import colors from '../../scss/colors.scss'

const DEFAULT_FILE_NAME = 'mlrun-file'

const Download = ({ fileName, path, schema, setNotification, user }) => {
  const [progress, setProgress] = useState(0)
  const [isDownload, setDownload] = useState(false)

  const downloadRef = useRef(null)

  const progressRingRadius = '20'
  const progressRingStroke = '3'

  let file =
    fileName ??
    path.match(/\/(?<filename>[^/]+)$/)?.groups?.filename ??
    DEFAULT_FILE_NAME

  const retryDownload = useCallback(
    item => {
      mainHttpClient
        .get(item.url)
        .then(response => {
          downloadFile(item.file, response)
          setNotification({
            status: response.status,
            url: response.config.url,
            id: Math.random(),
            message: 'Downloaded successfully'
          })
        })
        .catch(() => {
          setNotification({
            status: 400,
            url: item.url,
            file: item.file,
            id: Math.random(),
            message: 'Failed to download'
          })
        })
    },
    [setNotification]
  )

  const downloadCallback = useCallback(() => {
    if (isDownload) {
      const config = {
        onDownloadProgress: progressEvent => {
          const percentCompleted =
            (progressEvent.loaded * 100) / progressEvent.total
          setProgress(percentCompleted)
        },
        cancelToken: new axios.CancelToken(cancel => {
          downloadRef.current.cancel = cancel
        }),
        params: schema ? { schema, path, user } : { path, user }
      }

      mainHttpClient
        .get('/files', config)
        .then(response => {
          downloadFile(file, response)
          setNotification({
            status: response.status,
            url: response.config.url,
            id: Math.random(),
            message: 'Downloaded successfully'
          })
          if (downloadRef.current) {
            setDownload(false)
            setProgress(0)
          }
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            setDownload(false)
            return setProgress(0)
          }
          setNotification({
            status: 400,
            url: schema
              ? `/files?schema=${schema}&path=${path}&user=${user}`
              : `/files?path=${path}&user=${user}`,
            file,
            id: Math.random(),
            retry: item => retryDownload(item),
            message: 'Failed to download'
          })
          if (downloadRef.current) {
            setDownload(false)
            setProgress(0)
          }
        })
        .finally(() => {
          if (downloadRef.current) downloadRef.current.cancel = null
        })
    }
  }, [isDownload, schema, path, user, setNotification, file, retryDownload])

  useEffect(() => {
    let cancelFetch = downloadRef.current

    downloadCallback()

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
    <div className="download-container" ref={downloadRef} onClick={handleClick}>
      <ProgressRing
        radius={progressRingRadius}
        stroke={progressRingStroke}
        progress={progress}
        color={progress !== 0 ? colors.mulledWine : 'transparent'}
      >
        <g className={!isDownload ? 'download' : 'downloading'}>
          <circle r="12" cx="20px" cy="20px" />
          {!isDownload ? (
            <g className="download-container">
              <rect
                width="9.05318"
                height="1.50886"
                transform="matrix(-0.711236 -0.702953 0.711236 -0.702953 12.4389 19.0002)"
              />
              <rect
                width="9.05318"
                height="1.50886"
                transform="matrix(0.711236 -0.702953 0.711236 0.702953 11.4879 18.0004)"
              />
              <rect
                x="11.7744"
                y="17.5"
                width="13"
                height="1.5"
                transform="rotate(-90 11.7744 17.5)"
              />
              <rect x="5" y="19" width="15" height="1.5" />
            </g>
          ) : (
            <g className="cancel_container">
              <rect
                x="2.19238"
                y="1"
                width="13"
                height="1.5"
                transform="rotate(45 2.19238 1)"
              />
              <rect
                width="13"
                height="1.5"
                transform="matrix(-0.707107 0.707107 0.707107 0.707107 10.1924 1)"
              />
            </g>
          )}
        </g>
      </ProgressRing>
    </div>
  )
}

Download.defaultProps = {
  path: ''
}

Download.propTypes = {
  fileName: PropTypes.string,
  path: PropTypes.string.isRequired,
  schema: PropTypes.string
}

export default React.memo(connect(null, notificationActions)(Download))
