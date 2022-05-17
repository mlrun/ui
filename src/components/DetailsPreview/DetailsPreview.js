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
