import React, { useEffect, useState } from 'react'
import prettyBytes from 'pretty-bytes'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ArtifactsPreview from '../../components/ArtifactsPreview/ArtifactsPreview'
import Download from '../../common/Download/Download'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import artifactActions from '../../actions/artifacts'
import { formatDatetime } from '../../utils'
import { getArtifactPreview } from '../../utils/getArtifactPreview'

import './previewModal.scss'

const PreviewModal = ({ closeArtifactsPreview, item }) => {
  const [preview, setPreview] = useState([])
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    if (preview.length === 0) {
      getArtifactPreview(item, noData, setNoData, setPreview)
    }
  }, [item, noData, preview.length])

  return (
    <PopUpDialog
      className="preview-modal"
      closePopUp={() => {
        closeArtifactsPreview({
          isPreview: false,
          selectedItem: {}
        })
      }}
    >
      <div className="item-artifacts__modal-preview">
        <div className="preview-body">
          <div className="preview-item">
            <div className="item-data item-data__name">
              {item.db_key || item.key}
            </div>
            <div className="item-data item-data__path">{item.target_path}</div>
            {item.size && (
              <div className="item-data">
                size:
                {typeof item.size === 'string'
                  ? item.size
                  : prettyBytes(item.size)}
              </div>
            )}
            <div className="item-data">
              {formatDatetime(new Date(item.updated || item.date), 'N/A')}
            </div>
            <div className="preview-body__download">
              <Tooltip template={<TextTooltipTemplate text="Download" />}>
                <Download
                  path={`${item.target_path}${
                    item.model_file ? item.model_file : ''
                  }`}
                  user={item.user ?? item.producer?.owner}
                />
              </Tooltip>
            </div>
          </div>
          <div className="item-artifacts__preview">
            <ArtifactsPreview noData={noData} preview={preview} />
          </div>
        </div>
      </div>
    </PopUpDialog>
  )
}

PreviewModal.propTypes = {
  item: PropTypes.shape({}).isRequired
}

export default connect(null, { ...artifactActions })(PreviewModal)
