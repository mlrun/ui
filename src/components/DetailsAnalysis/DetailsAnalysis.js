import React from 'react'
import PropTypes from 'prop-types'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'

import { ReactComponent as Popout } from '../../images/popout.svg'

const DetailsAnalysis = ({ artifact, handlePreview }) => {
  return (
    <div className="preview_container">
      <button onClick={() => handlePreview()} className="preview_popout">
        <Popout />
      </button>
      <ArtifactsPreview artifact={artifact} />
    </div>
  )
}

DetailsAnalysis.propTypes = {
  artifact: PropTypes.shape({}).isRequired,
  handlePreview: PropTypes.func.isRequired
}

export default DetailsAnalysis
