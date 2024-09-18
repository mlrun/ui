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
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { isEqual } from 'lodash'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'
import ArtifactsExtraData from '../../elements/ArtifactsExtraData/ArtifactsExtraData'
import { RoundedIcon } from 'igz-controls/components'

import { getArtifactPreview } from '../../utils/getArtifactPreview'

import { ReactComponent as Popout } from 'igz-controls/images/popout.svg'
import { REQUEST_CANCELED } from '../../constants'
import { useSelector } from 'react-redux'

const DetailsPreview = ({ artifact, handlePreview }) => {
  const [preview, setPreview] = useState([])
  const [noData, setNoData] = useState(false)
  const params = useParams()
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const previewIsFetchedRef = useRef(false)
  const previewAbortControllerRef = useRef(new AbortController())

  const popupButtonIsDisplayed = useMemo(() => {
    return (
      artifact.target_path &&
      (artifact.extra_data?.length > 0 ||
        (!preview[0]?.error && !preview.every(item => item.hidden)))
    )
  }, [artifact.extra_data, artifact.target_path, preview])

  const artifactsPreviewClassNames = classnames(
    popupButtonIsDisplayed && 'artifact-preview__with-popout'
  )

  useEffect(() => {
    return () => {
      setPreview([])
    }
  }, [artifact])

  useEffect(() => {
    if (!previewIsFetchedRef.current && frontendSpec) {
      previewAbortControllerRef.current = new AbortController()

      getArtifactPreview(
        params.projectName,
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
  }, [artifact, noData, params.projectName, frontendSpec])

  useEffect(() => {
    const abortController = previewAbortControllerRef.current

    return () => {
      abortController.abort(REQUEST_CANCELED)
      previewIsFetchedRef.current = false
    }
  }, [artifact, params.projectName])

  return (
    <div className="preview_container">
      <div className="preview_container__header">
        <div className="preview_container__header-text">
          {artifact.header_original_length &&
            artifact.header_original_length > preview[0]?.data?.headers?.length && (
              <span>This table presents partial data. To view complete data, download it.</span>
            )}
        </div>
        {popupButtonIsDisplayed && (
          <div className="preview-icon__wrapper">
            <RoundedIcon
              onClick={handlePreview}
              className="preview_popout"
              tooltipText="Pop-out"
              id="details-preview"
            >
              <Popout />
            </RoundedIcon>
          </div>
        )}
      </div>
      <div className={artifactsPreviewClassNames}>
        {preview[0]?.hidden && artifact.extra_data?.length > 0 ? null : (
          <ArtifactsPreview noData={noData} preview={preview} />
        )}
        {artifact.extra_data?.length > 0 && <ArtifactsExtraData artifact={artifact} />}
      </div>
    </div>
  )
}

DetailsPreview.propTypes = {
  artifact: PropTypes.shape({}).isRequired,
  handlePreview: PropTypes.func.isRequired
}

export default React.memo(DetailsPreview, (prev, next) => isEqual(prev.artifact, next.artifact))
