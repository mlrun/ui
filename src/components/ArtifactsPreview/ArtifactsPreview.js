import React, { useState } from 'react'
import PropTypes from 'prop-types'

import ArtifactsPreviewView from './ArtifactsPreviewView'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'

const ArtifactsPreview = ({ noData, preview }) => {
  const [showErrorBody, setShowErrorBody] = useState(false)

  return preview.length === 0 && !noData ? (
    <div className="loader-container">
      <Loader />
    </div>
  ) : noData ? (
    <NoData />
  ) : (
    preview.map((previewItem, index) => (
      <ArtifactsPreviewView
        key={index}
        preview={previewItem}
        setShowErrorBody={setShowErrorBody}
        showErrorBody={showErrorBody}
      />
    ))
  )
}

ArtifactsPreview.propTypes = {
  noData: PropTypes.bool.isRequired,
  preview: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string,
      error: PropTypes.shape({
        text: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired
      }),
      type: PropTypes.string.isRequired,
      data: PropTypes.shape({
        headers: PropTypes.arrayOf(PropTypes.string),
        content: PropTypes.any.isRequired
      })
    })
  ).isRequired
}

export default ArtifactsPreview
