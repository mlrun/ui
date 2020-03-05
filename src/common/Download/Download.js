import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'

import ProgressRing from '../ProgressRing/ProgressRing'

import HttpClient from '../../httpClient'
import notificationDownloadAction from '../../actions/notificationDownload'
import downloadFile from '../../utils/downloadFile'

import './download.scss'

const Download = ({ path, schema, setNotificationDownload }) => {
  const [progress, setProgress] = useState(0)
  const [isDownload, setDownload] = useState(false)
  let file = path.match(/\b(?<=\/)([\w]+\.[\w\d]+)\b/gi)
    ? path.match(/\b(?<=\/)([\w]+\.[\w\d]+)\b/gi)[0]
    : null
  const downloadRef = useRef(null)

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

      HttpClient.get(
        schema ? `/files?schema=${schema}&path=${path}` : `/files?path=${path}`,
        config
      )
        .then(response => {
          downloadFile(file, response)
          setNotificationDownload({
            status: response.status,
            url: response.config.url,
            id: Math.random()
          })
          setDownload(false)
          setProgress(0)
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            setDownload(false)
            setProgress(0)
            return
          }
          setNotificationDownload({
            status: 400,
            url: schema
              ? `/files?schema=${schema}&path=${path}`
              : `/files?path=${path}`,
            file,
            id: Math.random()
          })
          setDownload(false)
          setProgress(0)
        })
        .finally(() => {
          if (downloadRef.current) downloadRef.current.cancel = null
        })
    }
  }, [file, isDownload, path, schema, setNotificationDownload])

  useEffect(() => {
    let cancelFetch = downloadRef.current
    downloadCallback()
    return () => {
      cancelFetch.cancel && cancelFetch.cancel()
    }
  }, [downloadCallback, downloadRef])

  return (
    <div
      className="download_container"
      ref={downloadRef}
      onClick={() => {
        if (downloadRef.current && downloadRef.current.cancel) {
          downloadRef.current.cancel('cancel')
          return
        }
        setDownload(!isDownload)
      }}
    >
      <ProgressRing
        radius="20"
        stroke="3"
        progress={progress}
        color={progress !== 0 ? '#49436D' : '#transparent'}
      >
        <g className={!isDownload ? 'download' : 'downloading'}>
          <circle r="12" cx="20px" cy="20px" />
          {!isDownload ? (
            <g className="download_container">
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
  schema: PropTypes.string
}

export default React.memo(connect(null, notificationDownloadAction)(Download))
