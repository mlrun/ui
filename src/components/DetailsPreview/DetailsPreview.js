import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'

import { ReactComponent as Popout } from '../../images/popout.svg'

import { getArtifactPreview } from '../../utils/getArtifactPreview'

const DetailsPreview = ({ artifact, handlePreview }) => {
  const [preview, setPreview] = useState([])
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    getArtifactPreview(artifact, noData, setNoData, setPreview)
  }, [artifact, noData])

  return (
    <div className="preview_container">
      {artifact.target_path && (
        <button onClick={() => handlePreview()} className="preview_popout">
          <Tooltip template={<TextTooltipTemplate text="Pop-out" />}>
            <Popout />
          </Tooltip>
        </button>
      )}
      <ArtifactsPreview noData={noData} preview={preview} />
    </div>
  )
}

DetailsPreview.propTypes = {
  artifact: PropTypes.shape({}).isRequired,
  handlePreview: PropTypes.func.isRequired
}

export default DetailsPreview
