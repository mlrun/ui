import React from 'react'
import PropTypes from 'prop-types'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'
import { DETAILS_ANALYSIS_TAB } from '../../constants'

const DetailsAnalysis = ({ artifact }) => {
  return (
    <div className="preview_container">
      <ArtifactsPreview artifact={artifact} tab={DETAILS_ANALYSIS_TAB} />
    </div>
  )
}

DetailsAnalysis.propTypes = {
  artifact: PropTypes.shape({}).isRequired
}

export default DetailsAnalysis
