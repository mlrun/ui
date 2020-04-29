import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'

import ProgressRing from '../ProgressRing/ProgressRing'

import { mainHTTPClient } from '../../httpClient'
import notificationDownloadAction from '../../actions/notificationDownload'
import downloadFile from '../../utils/downloadFile'
import { DOWNLOAD_PROGRESS_RING } from '../../colorConstants'

import './download.scss'

const Download = ({ path, schema, setNotificationDownload, user }) => {
  const [progress, setProgress] = useState(0)
  const [isDownload, setDownload] = useState(false)

  const downloadRef = useRef(null)

  const progressRingRadius = '20'
  const progressRingStroke = '3'

  let file = path.match(/\b(?<=\/)([\w]+\.[\w\d]+)\b/gi)
    ? path.match(/\b(?<=\/)([\w]+\.[\w\d]+)\b/gi)[0]
    : null

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
        })
      }

      mainHTTPClient
        .get(
          schema
            ? `/files?schema=${schema}&path=${path}&user=${user}`
            : `/files?path=${path}&user=${user}`,
          config
        )
        .then(response => {
          downloadFile(file, response)
          setNotificationDownload({
            status: response.status,
            url: response.config.url,
            id: Math.random()
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
          setNotificationDownload({
            status: 400,
            url: schema
              ? `/files?schema=${schema}&path=${path}&user=${user}`
              : `/files?path=${path}&user=${user}`,
            file,
            id: Math.random()
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
  }, [file, isDownload, path, schema, user, setNotificationDownload])

  useEffect(() => {
    let cancelFetch = downloadRef.current

    downloadCallback()

    return () => {
      cancelFetch.cancel && cancelFetch.cancel()
    }
  }, [downloadCallback, downloadRef])

  const handleClick = () => {
    if (downloadRef.current && downloadRef.current.cancel) {
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
        color={progress !== 0 ? DOWNLOAD_PROGRESS_RING : 'transparent'}
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
  path: '',
  schema: ''
}

Download.propTypes = {
  path: PropTypes.string.isRequired,
  schema: PropTypes.string,
  setNotificationDownload: PropTypes.func.isRequired
}

export default React.memo(connect(null, notificationDownloadAction)(Download))
