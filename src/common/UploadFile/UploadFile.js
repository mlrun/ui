import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import formatSize from 'pretty-bytes'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as DropFileIcon } from '../../images/drop-file.svg'
import { ReactComponent as Warning } from '../../images/warning.svg'

import './uploadFile.scss'

const UploadFile = forwardRef(
  ({ changeFile, file, id, isValid, required, requiredText, variant }, ref) => {
    const [isDragFile, setIsDragFile] = useState(false)

    const upLoadFileClassName = classnames(
      'uploadfile-container',
      isDragFile && 'on-focus',
      file && 'selected-file',
      required && 'uploadfile_required'
    )

    const inputFileClassName = classnames(
      'input-file',
      file && 'input-file__active',
      file && !isValid && 'input-file__invalid'
    )

    const handleChange = event => {
      const file = event.target.files[0]
      changeFile(file)
    }

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

    if (variant === 'input') {
      return (
        <div className={inputFileClassName} ref={ref}>
          <input
            type="file"
            name={id}
            id={id}
            className="input-file__input"
            onChange={handleChange}
          />
          <label className="input-file__label" htmlFor={id}>
            <span className="input-file__label-placeholder">File Name</span>
            <span className="input-file__label-name">{file?.name ?? ''}</span>
            <span className="input-file__label-btn">Browse</span>
          </label>
        </div>
      )
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
              <span className="uploadfile-container__file-name">File {file.name}</span>
              <span className="uploadfile-container__file-size">
                {`(${formatSize(file.size)})`}
              </span>
            </div>
            <div className="uploadfile-container__new-file" onClick={handleChoseNewFile}>
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
)

UploadFile.defaultProps = {
  id: 'upload-file'
}

UploadFile.propTypes = {
  file: PropTypes.oneOfType([PropTypes.shape({})]),
  changeFile: PropTypes.func.isRequired,
  required: PropTypes.bool,
  requiredText: PropTypes.string
}

export default UploadFile
