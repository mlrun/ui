import React from 'react'
import PropTypes from 'prop-types'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'

import { ReactComponent as Popout } from '../../images/popout.svg'

const DetailsPreview = ({ artifact, handlePreview }) => {
  if (artifact.extra_data) {
    const previewItems = []

    Object.values(artifact.extra_data).forEach(dataItem => {
      if (dataItem.match(/html/)) {
        artifact.target_path.path = dataItem.replace(/^.*:\/\//, '')
      }

      if (dataItem.match(/json|yaml|png|jpg|jpeg|gif/)) {
        previewItems.push({
          schema: artifact.target_path.schema,
          path: dataItem.replace(/^.*:\/\//, '')
        })
      }
    })

    if (previewItems.length) {
      previewItems.push({
        schema: artifact.target_path.schema,
        path: artifact.target_path.path
      })
    }

    artifact.preview = previewItems
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
