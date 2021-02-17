import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import Prism from 'prismjs'
import { isEmpty } from 'lodash'

import api from '../../api/artifacts-api'

import ArtifactsPreviewView from './ArtifactsPreviewView'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'

import { createArtifactPreviewContent } from '../../utils/createArtifactPreviewContent'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import './artifactaPreview.scss'

const ArtifactsPreview = ({ artifact }) => {
  const [error, setError] = useState({
    text: '',
    body: ''
  })
  const [preview, setPreview] = useState([])
  const [showError, setShowError] = useState(false)
  const [noData, setNoData] = useState(false)

  const getArtifactPreview = useCallback((schema, path, user) => {
    return api.getArtifactPreview(schema, path, user).then(res => {
      return createArtifactPreviewContent(res)
    })
  }, [])

  useEffect(() => {
    if (artifact.schema && !artifact.extra_data) {
      if (!isEveryObjectValueEmpty(error)) {
        setError({
          text: '',
          body: ''
        })
        setShowError(false)
      }

      if (noData) {
        setNoData(false)
      }

      setPreview([
        {
          type: 'table',
          data: {
            headers: artifact.header,
            content: artifact.preview
          }
        }
      ])
    } else if (artifact.preview.length > 0 && !artifact.target_path) {
      if (!isEveryObjectValueEmpty(error)) {
        setError({
          text: '',
          body: ''
        })
        setShowError(false)
      }

      if (noData) {
        setNoData(false)
      }

      setPreview([
        {
          type: 'table',
          data: {
            headers: artifact.preview[0],
            content: artifact.preview.slice(1)
          }
        }
      ])
    } else if (artifact.preview.length > 0) {
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

            if (!isEveryObjectValueEmpty(error)) {
              setError({
                text: '',
                body: ''
              })
              setShowError(false)
            }

            if (noData) {
              setNoData(false)
            }
          })
          .catch(err => {
            setError({
              text: `${err.response.status} ${err.response.statusText}`,
              body: JSON.stringify(err.response, null, 2)
            })
          })
      })
    } else if (
      isEveryObjectValueEmpty(error) &&
      preview.length === 0 &&
      !artifact.target_path
    ) {
      setNoData(true)
    } else if (
      isEveryObjectValueEmpty(error) &&
      artifact.preview.length === 0
    ) {
      getArtifactPreview(
        artifact.target_path?.schema,
        artifact.target_path?.path,
        artifact.user || artifact.producer?.owner
      )
        .then(content => {
          setPreview([content])

          if (!isEveryObjectValueEmpty(error)) {
            setError({
              text: '',
              body: ''
            })
            setShowError(false)
          }

          if (noData) {
            setNoData(false)
          }
        })
        .catch(err => {
          setError({
            text: `${err.response.status} ${err.response.statusText}`,
            body: JSON.stringify(err.response, null, 2)
          })
        })
    }
  }, [
    artifact.extra_data,
    artifact.header,
    artifact.preview,
    artifact.producer,
    artifact.schema,
    artifact.target_path,
    artifact.user,
    error,
    getArtifactPreview,
    noData,
    preview.length
  ])

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
  ) : preview.length === 0 && !noData ? (
    <div className="loader-container">
      <Loader />
    </div>
  ) : noData ? (
    <NoData />
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
