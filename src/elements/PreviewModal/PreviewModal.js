import React from 'react'
import ReactDOM from 'react-dom'
import prettyBytes from 'pretty-bytes'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import ArtifactsPreview from '../../components/ArtifactsPreview/ArtifactsPreview'
import Download from '../../common/Download/Download'

import artifactActions from '../../actions/artifacts'
import { formatDatetime } from '../../utils/datetime'

import { ReactComponent as Close } from '../../images/close.svg'

import './previewModal.scss'

const PreviewModal = ({ item }) => {
  const dispatch = useDispatch()

  return ReactDOM.createPortal(
    <div className="item-artifacts__modal-preview">
      <div className="preview-body">
        <div className="preview-item">
          <div className="item-data item-data__name">
            {item.db_key || item.key}
          </div>
          <div className="item-data item-data__path">
            {item.target_path.path}
          </div>
          {item.size && (
            <div className="item-data">
              size:
              {typeof item.size === 'string'
                ? item.size
                : prettyBytes(item.size)}
            </div>
          )}
          <div className="item-data">
            {formatDatetime(new Date(item.updated || item.date))}
          </div>
          <div className="preview-body__download">
            <Download
              path={item.target_path.path}
              schema={item.target_path.schema}
            />
          </div>
          <div
            className="preview-body__close"
            onClick={() => {
              dispatch(
                artifactActions.closeArtifactsPreview({
                  isPreview: false,
                  item: {}
                })
              )
            }}
          >
            <Close />
          </div>
        </div>
        <div className="item-artifacts__preview">
          <ArtifactsPreview artifact={item} />
        </div>
      </div>
    </div>,
    document.getElementById('overlay_container')
  )
}

PreviewModal.propTypes = {
  item: PropTypes.shape({}).isRequired
}

export default PreviewModal
