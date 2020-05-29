import React from 'react'
import PropTypes from 'prop-types'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'

import { ReactComponent as Popout } from '../../images/popout.svg'

const DetailsPreview = ({ artifact, handlePreview }) => {
  if (artifact.extra_data) {
    artifact.target_path.path = Object.values(
      artifact.extra_data
    ).find(dataItem => dataItem.match(/html/))
  }

  return (
    <div className="preview_container">
      <button onClick={() => handlePreview()} className="preview_popout">
        <Popout />
      </button>
      <ArtifactsPreview artifact={artifact} />
    </div>
  )
}

DetailsPreview.propTypes = {
  artifact: PropTypes.shape({}).isRequired,
  handlePreview: PropTypes.func.isRequired
}

export default DetailsPreview
