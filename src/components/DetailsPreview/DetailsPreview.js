import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'

import { ReactComponent as Popout } from '../../images/popout.svg'

import { getArtifactPreview } from '../../utils/getArtifactPreview'

const DetailsPreview = ({ artifact, handlePreview }) => {
  const [preview, setPreview] = useState([])
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    if (preview.length === 0) {
      getArtifactPreview(artifact, noData, setNoData, setPreview)
    }
  }, [artifact, noData, preview.length])

  return (
    <div className="preview_container">
      {artifact.target_path && (
        <button onClick={() => handlePreview()} className="preview_popout">
          <Popout />
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
