import React, { useState, useEffect } from 'react'
import HttpClient from '../../httpClient'
import ProgressRing from '../ProgressRing/ProgressRing'
import download from '../../images/download-icon.png'
import cancel from '../../images/download-cancel.png'
import axios from 'axios'
import { createPortal } from 'react-dom'
import './download.scss'

let cancelDownload = null

const configDownload = (
  setProgress,
  setShowNotification,
  setDownload,
  setDownloadStatus
) => {
  setProgress(0)
  setShowNotification(true)
  setDownload(false)
  cancelDownload = null
  setTimeout(() => {
    setDownloadStatus('success')
    setShowNotification(false)
  }, 2000)
}

const Download = ({ path, schema }) => {
  const [progress, setProgress] = useState(0)
  const [isDownload, setDownload] = useState(false)
  const [isShowNotification, setShowNotification] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState('success')
  let [file] = path.match(/\b(?<=\/)([\w]+\.[\w\d]+)\b/gi)

  const CancelToken = axios.CancelToken

  useEffect(() => {
    const Download = () => {
      if (cancelDownload) {
        cancelDownload()
        return
      }

      if (isDownload) {
        const artifact = {
          cancelDownloadSource: axios.CancelToken.source()
        }

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
          schema
            ? `/files?schema=${schema}&path=${path}`
            : `/files?path=${path}`,
          config
        )
          .then(response => {
            artifact.content = URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = artifact.content
            link.download = file
            link.click()
            link.remove()
            configDownload(
              setProgress,
              setShowNotification,
              setDownload,
              setDownloadStatus
            )
          })
          .catch(error => {
            if (axios.isCancel(error)) {
              setDownloadStatus('cancel')
              configDownload(
                setProgress,
                setShowNotification,
                setDownload,
                setDownloadStatus
              )
              return
            } else {
              setDownloadStatus('failed')
              configDownload(
                setProgress,
                setShowNotification,
                setDownload,
                setDownloadStatus
              )
            }
          })
          .finally(() => {
            URL.revokeObjectURL(artifact.content)
            cancelDownload = null
          })
      }
    }

    Download()
  }, [isDownload, CancelToken, file, path, schema])

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
          <div
            className={`notification_container ${
              downloadStatus === 'success'
                ? 'success_notification'
                : downloadStatus === 'cancel'
                ? 'cancel_notification'
                : 'failed_notification'
            }`}
          >
            <div>Download Status:</div>
            <div>
              {downloadStatus === 'success'
                ? 'Success'
                : downloadStatus === 'cancel'
                ? 'Cancel'
                : 'Failed'}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
export default Download
