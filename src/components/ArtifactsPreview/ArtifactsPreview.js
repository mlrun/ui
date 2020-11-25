import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import Prism from 'prismjs'
import { isEmpty } from 'lodash'

import api from '../../api/artifacts-api'

import ArtifactsPreviewView from './ArtifactsPreviewView'
import Loader from '../../common/Loader/Loader'

import { createArtifactPreviewContent } from '../../utils/createArtifactPreviewContent'

import './artifactaPreview.scss'

const ArtifactsPreview = ({ artifact }) => {
  const [error, setError] = useState({
    text: '',
    body: ''
  })
  const [preview, setPreview] = useState([])
  const [showError, setShowError] = useState(false)

  const getArtifactPreview = useCallback((schema, path, user) => {
    return api.getArtifactPreview(schema, path, user).then(res => {
      return createArtifactPreviewContent(res)
    })
  }, [])

  useEffect(() => {
    if (artifact.schema && !artifact.extra_data) {
      setError({
        text: '',
        body: ''
      })
      setShowError(false)
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
            setError({
              text: '',
              body: ''
            })
            setShowError(false)
          })
          .catch(err => {
            setError({
              text: `${err.response.status} ${err.response.statusText}`,
              body: JSON.stringify(err.response, null, 2)
            })
          })
      })
    } else if (artifact.preview && !artifact.target_path) {
      setError({
        text: 'No preview',
        body: {}
      })
    } else {
      getArtifactPreview(
        artifact.target_path?.schema,
        artifact.target_path?.path,
        artifact.user || artifact.producer?.owner
      )
        .then(content => {
          setPreview([content])
          setError({
            text: '',
            body: ''
          })
          setShowError(false)
        })
        .catch(err => {
          setError({
            text: `${err.response.status} ${err.response.statusText}`,
            body: JSON.stringify(err.response, null, 2)
          })
        })
    }
  }, [artifact, getArtifactPreview])

  return error.text.length > 0 ? (
    <div className="error_container">
      {!isEmpty(error.body) && <h1>Failed with HTTP error:</h1>}
      <h3>{error.text}</h3>
      {!isEmpty(error.body) && (
        <button
          className="error-details btn"
          onClick={() => setShowError(state => !state)}
        >
          {showError ? 'Hide details' : 'View details'}
        </button>
      )}
      {showError && (
        <pre className="json-content">
          <code
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(error.body, Prism.languages.json, 'json')
            }}
          />
        </pre>
      )}
    </div>
  ) : preview.length === 0 ? (
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
