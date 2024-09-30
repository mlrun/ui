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
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import prettyBytes from 'pretty-bytes'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import ArtifactsPreview from '../../components/ArtifactsPreview/ArtifactsPreview'
import Download from '../../common/Download/Download'
import { Tooltip, TextTooltipTemplate, PopUpDialog } from 'igz-controls/components'
import ArtifactsExtraData from '../ArtifactsExtraData/ArtifactsExtraData'

import { formatDatetime } from '../../utils'
import { getArtifactPreview } from '../../utils/getArtifactPreview'
import { closeArtifactsPreview } from '../../reducers/artifactsReducer'
import { REQUEST_CANCELED } from '../../constants'

import './previewModal.scss'

const PreviewModal = ({ artifact }) => {
  const [preview, setPreview] = useState([])
  const [noData, setNoData] = useState(false)
  const dispatch = useDispatch()
  const params = useParams()
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const previewIsFetchedRef = useRef(false)
  const previewAbortControllerRef = useRef(new AbortController())

  useEffect(() => {
    if (preview.length === 0 && !previewIsFetchedRef.current && frontendSpec) {
      previewAbortControllerRef.current = new AbortController()

      getArtifactPreview(
        params.projectName || artifact?.project,
        artifact,
        noData,
        setNoData,
        setPreview,
        false,
        null,
        frontendSpec.artifact_limits,
        previewAbortControllerRef.current.signal
      )

      previewIsFetchedRef.current = true
    }
  }, [artifact, frontendSpec, noData, params.projectName, preview.length])

  useEffect(() => {
    const abortController = previewAbortControllerRef.current

    return () => {
      abortController.abort(REQUEST_CANCELED)
      previewIsFetchedRef.current = false
    }
  }, [artifact, params.projectName])

  useEffect(() => {
    return () => {
      setPreview([])
    }
  }, [])

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
            <div className="item-data item-data__header">Name</div>
            <div className="item-data item-data__path item-data__header">Path</div>
            {(artifact.ui.size || artifact.size) && (
              <div className="item-data item-data__header">Size</div>
            )}
            <div className="item-data item-data__header">Updated</div>
            <div className="preview-body__download"></div>
          </div>
          <div className="preview-item">
            <div className="item-data item-data__name data-ellipsis">
              <Tooltip template={<TextTooltipTemplate text={artifact.db_key || artifact.key} />}>
                {artifact.db_key || artifact.key}
              </Tooltip>
            </div>
            <div className="item-data item-data__path data-ellipsis">
              <Tooltip template={<TextTooltipTemplate text={artifact.target_path} />}>
                {artifact.target_path}
              </Tooltip>
            </div>
            {(artifact.ui.size || artifact.size) && (
              <div className="item-data">
                {artifact.ui.size
                  ? artifact.ui.size
                  : typeof artifact.size === 'string'
                    ? artifact.size
                    : prettyBytes(artifact.size)}
              </div>
            )}
            <div className="item-data">
              {formatDatetime(artifact.updated || artifact.ui.date, 'N/A')}
            </div>
            <div className="preview-body__download">
              <Download
                onlyIcon
                path={`${artifact.target_path}${artifact.model_file ? artifact.model_file : ''}`}
                user={artifact.ui.user ?? artifact.producer?.owner}
                fileSize={artifact.size}
                projectName={params.projectName || artifact?.project}
              />
            </div>
          </div>
          {artifact.header_original_length &&
            artifact.header_original_length > preview[0]?.data?.headers?.length && (
              <div className="preview-message">
                This table presents partial data. To view complete data, download it.
              </div>
            )}
          <div className="item-artifacts__preview">
            {preview[0]?.hidden && artifact.extra_data?.length > 0 ? null : (
              <ArtifactsPreview noData={noData} preview={preview} />
            )}
            {artifact.extra_data?.length > 0 && <ArtifactsExtraData artifact={artifact} />}
          </div>
        </div>
      </div>
    </PopUpDialog>
  )
}

PreviewModal.propTypes = {
  artifact: PropTypes.shape({}).isRequired
}

export default PreviewModal
