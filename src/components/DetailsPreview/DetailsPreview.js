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
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as Popout } from 'igz-controls/images/popout.svg'

import { getArtifactPreview } from '../../utils/getArtifactPreview'

const DetailsPreview = ({ artifact, handlePreview }) => {
  const [preview, setPreview] = useState([])
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    getArtifactPreview(artifact, noData, setNoData, setPreview)

    return () => {
      setPreview([])
    }
  }, [artifact, noData])

  const artifactsPreviewClassNames = classnames(
    artifact.target_path && 'artifact-preview__with-popout'
  )

  return (
    <div className="preview_container">
      {artifact.target_path && (
        <button onClick={() => handlePreview()} className="preview_popout">
          <Tooltip template={<TextTooltipTemplate text="Pop-out" />}>
            <Popout />
          </Tooltip>
        </button>
      )}
      <ArtifactsPreview
        className={artifactsPreviewClassNames}
        noData={noData}
        preview={preview}
      />
    </div>
  )
}

DetailsPreview.propTypes = {
  artifact: PropTypes.shape({}).isRequired,
  handlePreview: PropTypes.func.isRequired
}

export default DetailsPreview
