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
import axios from 'axios'
import { useParams } from 'react-router-dom'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'
import { RoundedIcon } from 'igz-controls/components'

import { ReactComponent as Popout } from 'igz-controls/images/popout.svg'

import {
  fetchArtifactPreviewFromExtraData,
  getArtifactPreview
} from '../../utils/getArtifactPreview'

const DetailsPreview = ({ artifact, handlePreview }) => {
  const [preview, setPreview] = useState([])
  const [extraData, setExtraData] = useState([])
  const [noData, setNoData] = useState(false)
  const previewRef = useRef({ current: {} })
  const params = useParams()

  const popupButtonIsDisplayed = useMemo(() => {
    return (
      artifact.target_path &&
      (extraData.length > 0 || (!preview[0]?.error && !preview.every(item => item.hidden)))
    )
  }, [artifact.target_path, extraData.length, preview])

  const artifactsPreviewClassNames = classnames(
    popupButtonIsDisplayed && 'artifact-preview__with-popout'
  )

  useEffect(() => {
    return () => {
      setPreview([])
      setExtraData([])
      cancelRequest('cancel')
    }
  }, [artifact])

  useEffect(() => {
    getArtifactPreview(params.projectName, artifact, noData, setNoData, setPreview)
  }, [artifact, noData, params.projectName])

  useEffect(() => {
    if (artifact.extra_data && extraData.length === 0) {
      fetchArtifactPreviewFromExtraData(
        params.projectName,
        artifact,
        noData,
        setNoData,
        previewContent => setExtraData(state => [...state, previewContent]),
        new axios.CancelToken(cancel => {
          previewRef.current.cancel = cancel
        })
      )
    }
  }, [artifact, extraData.length, noData, params.projectName])

  const cancelRequest = message => {
    previewRef.current?.cancel && previewRef.current.cancel(message)
  }

  return (
    <div className="preview_container">
      {popupButtonIsDisplayed && (
        <div className="preview-icon__wrapper">
          <RoundedIcon onClick={handlePreview} className="preview_popout" tooltipText="Pop-out">
            <Popout />
          </RoundedIcon>
        </div>
      )}
      <div className={artifactsPreviewClassNames}>
        <ArtifactsPreview
          extraData={extraData}
          noData={noData}
          preview={preview}
          showExtraDataLoader={
            artifact.extra_data && extraData.length !== artifact.extra_data.length
          }
        />
      </div>
    </div>
  )
}

DetailsPreview.propTypes = {
  artifact: PropTypes.shape({}).isRequired,
  handlePreview: PropTypes.func.isRequired
}

export default React.memo(DetailsPreview, (prev, next) => isEqual(prev.artifact, next.artifact))
