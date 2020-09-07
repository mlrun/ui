import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import api from '../../api/artifacts-api'

import ArtifactsPreviewView from './ArtifactsPreviewView'
import Loader from '../../common/Loader/Loader'

import { createArtifactPreviewContent } from '../../utils/createArtifactPreviewContent'

import './artifactaPreview.scss'

const ArtifactsPreview = ({ artifact }) => {
  const [isError, setIsError] = useState(false)
  const [preview, setPreview] = useState([])

  const getArtifactPreview = useCallback((schema, path, user) => {
    return api.getArtifactPreview(schema, path, user).then(res => {
      return createArtifactPreviewContent(res)
    })
  }, [])

  useEffect(() => {
    if (artifact.schema && !artifact.extra_data) {
      setIsError(false)
      setPreview([
        {
          type: 'table',
          data: {
            headers: artifact.header,
            content: artifact.preview
          }
        }
      ])
    } else if (artifact.preview.length) {
      artifact.preview.forEach(previewItem => {
        getArtifactPreview(
          previewItem.schema,
          previewItem.path,
          artifact.user || artifact.producer.owner
        )
          .then(content => {
            setPreview(prevState => [
              ...prevState,
              { ...content, header: previewItem.header }
            ])
            setIsError(false)
          })
          .catch(() => {
            setIsError(true)
          })
      })
    } else {
      getArtifactPreview(
        artifact.target_path.schema,
        artifact.target_path.path,
        artifact.user || artifact.producer.owner
      )
        .then(content => {
          setPreview([content])
          setIsError(false)
        })
        .catch(() => {
          setIsError(true)
        })
    }
  }, [artifact, getArtifactPreview])

  return isError ? (
    <div className="error_container">
      <h1>Sorry, something went wrong.</h1>
      <h3>We're working on it and we'll get it fixed as soon as we can.</h3>
    </div>
  ) : !preview.length ? (
    <div className="loader-container">
      <Loader />
    </div>
  ) : (
    preview.map((previewItem, index) => (
      <ArtifactsPreviewView key={index} preview={previewItem} />
    ))
  )
}

ArtifactsPreview.propTypes = {
  artifact: PropTypes.shape({}).isRequired
}

export default React.memo(
  ArtifactsPreview,
  (prev, next) => prev.artifact.key === next.artifact.key
)
