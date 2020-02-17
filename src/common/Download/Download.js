import React, { useState, useEffect, useCallback } from 'react'
import HttpClient from '../../httpClient'
import ProgressRing from '../ProgressRing/ProgressRing'
import download from '../../images/download-icon.png'
import cancel from '../../images/download-cancel.png'
import axios from 'axios'
import { createPortal } from 'react-dom'
import './download.scss'

let cancelDownload = null

const Download = ({ path, schema }) => {
  const [progress, setProgress] = useState(0)
  const [isDownload, setDownload] = useState(false)
  const [isShowNotification, setShowNotification] = useState(false)
  const [status, setStatus] = useState('success')
  let [file] = path.match(/\b(?<=\/)([\w]+\.[\w\d]+)\b/gi)

  const CancelToken = axios.CancelToken

  const Download = useCallback(() => {
    if (cancelDownload) {
      cancelDownload()
      return
    }

    if (isDownload) {
      const config = {
        onDownloadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total + 0.1)
          )
          setProgress(percentCompleted)
        },
        cancelToken: new CancelToken(cancel => {
          cancelDownload = cancel
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
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            setStatus('cancel')
            return
          }
          setStatus('failed')
        })
        .finally(() => {
          setDownload(false)
          setProgress(0)
          setShowNotification(true)
          setTimeout(() => {
            setStatus('success')
            setShowNotification(false)
          }, 2000)
          cancelDownload = null
        })
    }
  }, [CancelToken, file, isDownload, path, schema])

  useEffect(() => {
    Download()
  }, [Download])

  return (
    <div
      className="download_container"
      onClick={() => setDownload(!isDownload)}
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
export default Download
