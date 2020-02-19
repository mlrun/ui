import React, { useState, useEffect, useCallback, useRef } from 'react'
import HttpClient from '../../httpClient'
import ProgressRing from '../ProgressRing/ProgressRing'
import download from '../../images/download-icon.png'
import cancel from '../../images/download-cancel.png'
import axios from 'axios'
import { createPortal } from 'react-dom'
import './download.scss'

const Download = ({ path, schema }) => {
  const [progress, setProgress] = useState(0)
  const [isDownload, setDownload] = useState(false)
  const [isShowNotification, setShowNotification] = useState(false)
  const [status, setStatus] = useState('success')
  let [file] = path.match(/\b(?<=\/)([\w]+\.[\w\d]+)\b/gi)

  const downloadRef = useRef(null)

  const Download = useCallback(() => {
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
          const link = document.createElement('a')
          link.href = URL.createObjectURL(new Blob([response.data]))
          link.download = file
          link.click()
          link.remove()
          return 'success'
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            return error.message === 'cancel' && 'cancel'
          }
          return 'failed'
        })
        .then(item => {
          if (/success|cancel|failed/.test(item)) {
            setStatus(item)
            setDownload(false)
            setProgress(0)
            setShowNotification(true)
            setTimeout(() => {
              if (downloadRef.current) {
                setStatus('success')
                setShowNotification(false)
              }
            }, 2000)
          }
          if (downloadRef.current) downloadRef.current.cancel = null
        })
    }
  }, [file, isDownload, path, schema])

  useEffect(() => {
    let cancelFetch = downloadRef.current
    Download()
    return () => {
      cancelFetch.cancel && cancelFetch.cancel()
    }
  }, [Download, downloadRef])

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
      {isShowNotification &&
        createPortal(
          <div className={`notification_container ${status}_notification`}>
            <div>Download Status:</div>
            <div>{status.charAt(0).toUpperCase() + status.slice(1)}</div>
          </div>,
          document.body
        )}
    </div>
  )
}
export default React.memo(Download)
