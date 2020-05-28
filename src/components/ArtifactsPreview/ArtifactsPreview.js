import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import artifactsAction from '../../actions/artifacts'

import ArtifactsPreviewView from './ArtifactsPreviewView'

import { createArtifactPreviewContent } from '../../utils/createArtifactPreviewContent'

const ArtifactsPreview = ({
  artifact,
  artifactsStore,
  fetchArtifactPreview
}) => {
  const [preview, setPreview] = useState({
    type: null,
    data: null
  })

  // useEffect(() => {
  //   if (artifact.schema) {
  //     setPreview({
  //       type: 'table',
  //       data: {
  //         headers: artifact.header,
  //         content: artifact.preview
  //       }
  //     })
  //   } else {
  //     fetchArtifactPreview(
  //       artifact.target_path.schema,
  //       artifact.target_path.path,
  //       artifact.user || artifact.producer.owner
  //     ).then(result => {
  //       console.log(result)
  //       setPreview(createArtifactPreviewContent(result))
  //     })
  //   }
  // }, [artifact.target_path, fetchArtifactPreview])

  return artifactsStore.error ? (
    <div className="error_container">
      <h1>Sorry, something went wrong.</h1>
      <h3>We're working on it and we'll get it fixed as soon as we can.</h3>
    </div>
  ) : (
    <ArtifactsPreviewView preview={preview} />
  )
}

ArtifactsPreview.propTypes = {
  artifact: PropTypes.shape({}).isRequired
}

export default connect(
  artifactsStore => artifactsStore,
  artifactsAction
)(ArtifactsPreview)
