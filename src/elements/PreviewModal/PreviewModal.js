import React from 'react'
import ReactDOM from 'react-dom'
import prettyBytes from 'pretty-bytes'

import ArtifactsPreview from '../../components/ArtifactsPreview/ArtifactsPreview'
import Download from '../../common/Download/Download'

import { formatDatetime } from '../../utils/datetime'
import closeIcon from '../../images/cancel.png'

import './previewmodal.scss'

const PreviewModal = ({ item, cancel }) => {
  return ReactDOM.createPortal(
    <div className="preview_artifact_container">
      <div className="preview_body">
        <div className="preview_info">
          <div className="preview_info_name">{item.key}</div>
          <div className="preview_info_path">{item.target_path.path}</div>
          {item.size && (
            <div className="preview_info_size">
              size: {prettyBytes(item.size)}
            </div>
          )}
          <div className="preview_info_date">
            {formatDatetime(new Date(item.updated || item.date))}
          </div>
          <div className="preview_info_download">
            <Download
              path={item.target_path.path}
              schema={item.target_path.schema}
            />
          </div>
          <div
            className="preview_info_close"
            onClick={() => {
              cancel({
                isPreview: false,
                item: {}
              })
            }}
          >
            <img src={closeIcon} alt="close" />
          </div>
        </div>
        <div className="artifact_container_view">
          <ArtifactsPreview artifact={item} />
        </div>
      </div>
    </div>,
    document.getElementById('overlay_container')
  )
}

export default PreviewModal
