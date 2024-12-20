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

import { RoundedIcon, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import downloadFile from '../../utils/downloadFile'
import { ARTIFACT_MAX_CHUNK_SIZE, ARTIFACT_MAX_DOWNLOAD_SIZE, REQUEST_CANCELED } from '../../constants'
import { removeDownloadItem } from '../../reducers/downloadReducer'
import api from '../../api/artifacts-api'

import { ReactComponent as Close } from 'igz-controls/images/close.svg'
import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'

const DEFAULT_FILE_NAME = 'mlrun-file'

const DownloadItem = ({ downloadItem }) => {
  const [progress, setProgress] = useState(0)
  const [isDownload, setDownload] = useState(true)
  const [isSuccessResponse, setIsSuccessResponse] = useState(null)
  const [isFileTooLarge, setFileTooLarge] = useState(false)
  const downloadAbortControllerRef = useRef(null)
  const timeoutRef = useRef(null)
  const dispatch = useDispatch()

  let file = useMemo(
    () =>
      downloadItem.fileName ??
      downloadItem.path.match(/\/(?<filename>[^/]+)$/)?.groups?.filename ??
      DEFAULT_FILE_NAME,
    [downloadItem.fileName, downloadItem.path]
  )
  const failedDownloadMessage = `Failed${isFileTooLarge ? '. The file is too large' : ''}`

  const downloadCallback = useCallback(async () => {
    if (isDownload) {
      let isFileTooLargeLocal = false
      
      try {
        downloadAbortControllerRef.current = new AbortController()

        const user = downloadItem.path.startsWith('/User') && downloadItem.user
        const chunkSize = downloadItem.artifactLimits?.max_chunk_size ?? ARTIFACT_MAX_CHUNK_SIZE
        const downloadLimit =
          downloadItem.artifactLimits?.max_download_size ?? ARTIFACT_MAX_DOWNLOAD_SIZE
        let fileSize = downloadItem.fileSize

        if (!fileSize) {
          const { data: fileStats } = await api.getArtifactPreviewStats(
            downloadItem.projectName,
            downloadItem.path,
            user,
            downloadAbortControllerRef.current?.signal
          )

          fileSize = fileStats.size
        }

        if (fileSize > downloadLimit) {
          setDownload(false)
          setProgress(0)
          setFileTooLarge(true)
          isFileTooLargeLocal = true
        } else {
          const config = {
            onDownloadProgress: progressEvent => {
              const percentCompleted =
                ((progressEvent.loaded + config.params.offset) * 100) / fileSize
              setProgress(percentCompleted)
            },
            signal: downloadAbortControllerRef.current.signal,
            params: { path: downloadItem.path, size: chunkSize, offset: 0 },
            responseType: 'arraybuffer'
          }
          let fullFile = new Blob()
          let response = {}

          if (user) {
            config.params.user = user
          }

          while (config.params.offset < fileSize) {
            response = await api.getArtifactPreview(downloadItem.projectName, config)

            if (response?.data) {
              fullFile = new Blob([fullFile, response.data])
            } else {
              throw new Error('Error during loading the file')
            }

            config.params.offset += response.data.byteLength ?? chunkSize
          }

          response.data = fullFile

          downloadFile(file, response)

          if (downloadAbortControllerRef.current) {
            setDownload(false)
            setIsSuccessResponse(true)
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          setDownload(false)

          return setProgress(0)
        }

        if (downloadAbortControllerRef.current) {
          setDownload(false)
          setProgress(0)
        }
      } finally {
        if (downloadAbortControllerRef.current) {
          downloadAbortControllerRef.current = null
        }

        timeoutRef.current = setTimeout(
          () => {
            dispatch(removeDownloadItem(downloadItem.id))
          },
          isFileTooLargeLocal ? 10000 : 5000
        )
      }
    }
  }, [isDownload, downloadItem, file, dispatch])

  useEffect(() => {
    let cancelFetch = downloadAbortControllerRef.current

    setTimeout(() => {
      downloadCallback()
    }, 1000)

    return () => {
      cancelFetch && cancelFetch.abort(REQUEST_CANCELED)
    }
  }, [downloadCallback, downloadAbortControllerRef])

  const handleCancel = () => {
    if (downloadAbortControllerRef.current) {
      return downloadAbortControllerRef.current.abort(REQUEST_CANCELED)
    }

    setDownload(!isDownload)
  }

  const handleRetry = () => {
    setDownload(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  return (
    <div className="download-item" data-testid="download-item">
      <Tooltip className="download-item__filename" template={<TextTooltipTemplate text={file} />}>
        {file}
      </Tooltip>
      <div className="download-item__status">
        {isDownload ? (
          `${Math.floor(progress)}%`
        ) : isSuccessResponse ? (
          <div className="download-item__message_succeed">Done</div>
        ) : (
          <div className="download-item__message_failed">
            {failedDownloadMessage}
          </div>
        )}
      </div>
      {!isFileTooLarge ? (
        <div className="download-item__buttons">
          {isDownload ? (
            <RoundedIcon onClick={handleCancel}>
              <Close />
            </RoundedIcon>
          ) : !isSuccessResponse ? (
            <RoundedIcon onClick={handleRetry}>
              <RefreshIcon />
            </RoundedIcon>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

DownloadItem.propTypes = {
  downloadItem: PropTypes.shape({
    artifactLimits: PropTypes.shape({
      max_chunk_size: PropTypes.number,
      max_download_size: PropTypes.number,
      max_preview_size: PropTypes.number

    }),
    filename: PropTypes.string,
    fileSize: PropTypes.number,
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    user: PropTypes.string
  }).isRequired
}

export default React.memo(DownloadItem)
