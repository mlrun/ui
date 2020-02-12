import React, { useState } from 'react'
import HttpClient from '../../httpClient'
import ProgressRing from '../ProgressRing/ProgressRing'
import download from '../../images/download-icon.png'
import cancel from '../../images/download-cancel.png'
import axios from 'axios'
import { createPortal } from 'react-dom'
import './download.scss'

const Download = ({ path }) => {
  const [progress, setProgress] = useState(0)
  const [isShowNotification, setShowNotification] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState('success')

  let [schema] = /^([\w\d]+)(?=:)/gi.test(path)
    ? path.match(/^([\w\d]+)(?=:)/gi)
    : []
  let [file] = path.match(/\b(?<=\/)([\w]+\.[\w\d]+)\b/gi)
  let [_path] = path.match(/(?<=\/{2})([\w\W\d]+)|^\/([\w\W\d]+)/gi)

  const handleClick = e => {
    e.persist()

    const artifact = {
      cancelDownloadSource: axios.CancelToken.source()
    }

    const config = {
      onDownloadProgress: progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total + 0.1)
        )
        setProgress(percentCompleted)
      }
    }

    HttpClient.get(
      schema ? `/files?schema=${schema}&path=${_path}` : `/files?path=${_path}`,
      config
    )
      .then(response => {
        artifact.content = URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = artifact.content
        link.download = file
        link.click()
        link.remove()
        setProgress(0)
        setShowNotification(true)
        setTimeout(() => {
          setShowNotification(false)
        }, 2000)
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          return
        } else {
          setProgress(0)
          setDownloadStatus('failed')
          setShowNotification(true)
          setTimeout(() => {
            setShowNotification(false)
          }, 2000)
        }
      })
      .finally(() => {
        URL.revokeObjectURL(artifact.content)
      })
  }

  return (
    <div className="download_container" onClick={handleClick}>
      <ProgressRing
        radius="20"
        stroke="3"
        progress={progress}
        color={progress !== 0 ? '#49436D' : '#fff'}
      >
        <image
          href={progress === 0 ? download : cancel}
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
                : 'failed_notification'
            }`}
          >
            <div>Download Status:</div>
            <div>{downloadStatus === 'success' ? 'Success' : 'Failed'}</div>
          </div>,
          document.body
        )}
    </div>
  )
}
export default Download
