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
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import ArtifactsPreview from './ArtifactsPreview'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { getArtifactPreview } from '../../utils/getArtifactPreview'
import { showArtifactsPreview } from '../../reducers/artifactsReducer'

import { ReactComponent as Popout } from 'igz-controls/images/popout.svg'

import './artifactsPreviewController.scss'

const ArtifactsPreviewController = ({
  artifactsIds,
  artifact,
  artifactId,
  withoutPopout = false
}) => {
  const [noData, setNoData] = useState(false)
  const [preview, setPreview] = useState({})
  const params = useParams()

  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      setPreview({})
    }
  }, [])

  useEffect(() => {
    if (artifactsIds.length > 0 && !preview[artifactId] && artifactsIds.includes(artifactId)) {
      getArtifactPreview(
        params.projectName,
        artifact,
        noData,
        setNoData,
        setPreview,
        true,
        artifactId
      )
    }
  }, [artifactsIds, setPreview, artifact, noData, params.projectName, preview, artifactId])

  const showPreview = () => {
    dispatch(
      showArtifactsPreview({
        isPreview: true,
        selectedItem: artifact
      })
    )
  }

  return (
    <>
      {artifactsIds.includes(artifactId) && (
        <div className="artifacts__preview">
          {!withoutPopout && (
            <Tooltip
              template={<TextTooltipTemplate text="Artifacts Preview" />}
              className="icon-popout"
            >
              <Popout onClick={showPreview} />
            </Tooltip>
          )}
          <ArtifactsPreview noData={noData} preview={preview[artifactId] || []} />
        </div>
      )}
    </>
  )
}

ArtifactsPreviewController.propTypes = {
  artifactsIds: PropTypes.array.isRequired,
  artifact: PropTypes.shape({}).isRequired,
  artifactId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  withoutPopout: PropTypes.bool
}

export default ArtifactsPreviewController
