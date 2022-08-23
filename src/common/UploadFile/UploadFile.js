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
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import formatSize from 'pretty-bytes'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as DropFileIcon } from 'igz-controls/images/drop-file.svg'
import { ReactComponent as Warning } from 'igz-controls/images/warning.svg'

import './uploadFile.scss'

const UploadFile = ({ file, changeFile, required, requiredText }) => {
  const [isDragFile, setIsDragFile] = useState(false)

  const upLoadFileClassName = classnames(
    'uploadfile-container',
    isDragFile && 'on-focus',
    file && 'selected-file',
    required && 'uploadfile_required'
  )

  const handleDragEnter = event => {
    if (!file) {
      event.preventDefault()
      setIsDragFile(true)
    }
  }

  const handleDragOver = event => {
    if (!file) {
      event.preventDefault()
    }
  }

  const handleDragLeave = event => {
    if (!file) {
      event.preventDefault()
      setIsDragFile(false)
    }
  }

  const handleDrop = event => {
    if (!file) {
      const file = event.dataTransfer.files[0]
      event.preventDefault()
      setIsDragFile(false)
      changeFile(file)
    }
  }

  const handleChoseNewFile = () => {
    changeFile(null)
  }

  return (
    <div
      className={upLoadFileClassName}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DropFileIcon />
      {!file ? (
        <div className="uploadfile-container__text">
          Drop file here or
          <span className="uploadfile-container__text-browse">browse</span>
        </div>
      ) : (
        <>
          <div className="uploadfile-container__file">
            <span className="uploadfile-container__file-name">
              File {file.name}
            </span>
            <span className="uploadfile-container__file-size">
              {`(${formatSize(file.size)})`}
            </span>
          </div>
          <div
            className="uploadfile-container__new-file"
            onClick={handleChoseNewFile}
          >
            Choose another file
          </div>
        </>
      )}
      {required && !isDragFile && (
        <Tooltip
          className="warning-container"
          template={<TextTooltipTemplate warning text={requiredText} />}
        >
          <Warning />
        </Tooltip>
      )}
    </div>
  )
}

UploadFile.propTypes = {
  file: PropTypes.oneOfType([PropTypes.shape({})]),
  changeFile: PropTypes.func.isRequired,
  required: PropTypes.bool,
  requiredText: PropTypes.string
}

export default UploadFile
