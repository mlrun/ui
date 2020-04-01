import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import api from '../../api/artifacts-api'

import ArtifactsPreviewView from './ArtifactsPreviewView'

import { createArtifactPreviewContent } from '../../utils/createArtifactPreviewContent'

const ArtifactsPreview = ({ artifact }) => {
  const [isError, setIsError] = useState(false)
  const [preview, setPreview] = useState({
    type: null,
    data: null
  })

  useEffect(() => {
    if (artifact.schema) {
      setPreview({
        type: 'table',
        data: {
          headers: artifact.header,
          content: artifact.preview
        }
      })
    } else {
      getArtifactPreview(
        artifact.target_path.schema,
        artifact.target_path.path,
        artifact.user
      )
    }
  }, [artifact.target_path, artifact])

  const getArtifactPreview = (schema, path, user) => {
    return api
      .getArtifactPreview(schema, path, user)
      .then(res => {
        const artifact = createArtifactPreviewContent(res)
        setPreview(artifact)
        setIsError(false)
      })
      .catch(err => {
        setIsError(true)
      })
  }

  return isError ? (
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

export default ArtifactsPreview
