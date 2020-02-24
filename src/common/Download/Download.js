import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import HttpClient from '../../httpClient'
import notificationDownloadAction from '../../actions/notificationDownload'
import axios from 'axios'
import ProgressRing from '../ProgressRing/ProgressRing'
import download from '../../images/download-icon.png'
import cancel from '../../images/download-cancel.png'
import { connect } from 'react-redux'
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
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total + 0.1)
          )
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
        color={progress !== 0 ? '#49436D' : '#fff'}
      >
        <image
          href={!isDownload ? download : cancel}
          x="7.5"
          y="7.5"
          height="25px"
          width="25px"
        />
      </ProgressRing>
    </div>
  )
}

Download.defaultProps = {
  schema: ''
}

Download.propTypes = {
  path: PropTypes.string.isRequired,
  schema: PropTypes.string
}

export default React.memo(connect(null, notificationDownloadAction)(Download))
