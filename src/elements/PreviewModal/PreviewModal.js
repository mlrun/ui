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
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import prettyBytes from 'pretty-bytes'
import PropTypes from 'prop-types'

import ArtifactsPreview from '../../components/ArtifactsPreview/ArtifactsPreview'
import Download from '../../common/Download/Download'
import { Tooltip, TextTooltipTemplate, PopUpDialog } from 'igz-controls/components'

import { formatDatetime } from '../../utils'
import { getArtifactPreview } from '../../utils/getArtifactPreview'
import { closeArtifactsPreview } from '../../reducers/artifactsReducer'

import './previewModal.scss'

const PreviewModal = ({ item }) => {
  const [preview, setPreview] = useState([])
  const [noData, setNoData] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (preview.length === 0) {
      getArtifactPreview(item, noData, setNoData, setPreview)
    }
  }, [item, noData, preview.length])

  return (
    <PopUpDialog
      className="preview-modal"
      closePopUp={() => {
        dispatch(closeArtifactsPreview())
      }}
    >
      <div className="item-artifacts__modal-preview">
        <div className="preview-body">
          <div className="preview-item">
            <div className="item-data item-data__name data-ellipsis">
              <Tooltip template={<TextTooltipTemplate text={item.db_key || item.key} />}>
                {item.db_key || item.key}
              </Tooltip>
            </div>
            <div className="item-data item-data__path data-ellipsis">
              <Tooltip template={<TextTooltipTemplate text={item.target_path} />}>
                {item.target_path}
              </Tooltip>
            </div>
            {item.size && (
              <div className="item-data">
                size:
                {typeof item.size === 'string' ? item.size : prettyBytes(item.size)}
              </div>
            )}
            <div className="item-data">
              {formatDatetime(new Date(item.updated || item.date), 'N/A')}
            </div>
            <div className="preview-body__download">
              <Tooltip template={<TextTooltipTemplate text="Download" />}>
                <Download
                  path={`${item.target_path}${item.model_file ? item.model_file : ''}`}
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

export default PreviewModal
