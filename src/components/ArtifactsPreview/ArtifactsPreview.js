import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import api from '../../api/artifacts-api'

import ArtifactsPreviewView from './ArtifactsPreviewView'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import PreviewError from './PreviewError/PreviewError'

import { createArtifactPreviewContent } from '../../utils/createArtifactPreviewContent'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import {
  fetchPreviewFromAnalysis,
  fetchPreviewFromPreviewData,
  fetchPreviewFromTargetPath,
  setPreviewFromPreviewData,
  setPreviewFromSchema
} from './artifactPreview.util'

import './artifactaPreview.scss'

const ArtifactsPreview = ({ artifact }) => {
  const [error, setError] = useState({
    text: '',
    body: ''
  })
  const [preview, setPreview] = useState([])
  const [showError, setShowError] = useState(false)
  const [noData, setNoData] = useState(false)

  const getArtifactPreview = useCallback((schema, path, user, fileFormat) => {
    return api.getArtifactPreview(schema, path, user, fileFormat).then(res => {
      return createArtifactPreviewContent(res)
    })
  }, [])

  useEffect(() => {
    if (artifact.analysis && preview.length === 0) {
      fetchPreviewFromAnalysis(
        artifact,
        error,
        getArtifactPreview,
        noData,
        setError,
        setNoData,
        setPreview,
        setShowError
      )
    } else if (artifact.schema && !artifact.extra_data) {
      setPreviewFromSchema(
        artifact,
        error,
        noData,
        setError,
        setNoData,
        setPreview,
        setShowError
      )
    } else if (
      artifact.preview.length > 0 &&
      !artifact.target_path &&
      !artifact.analysis
    ) {
      setPreviewFromPreviewData(
        artifact,
        error,
        noData,
        setError,
        setNoData,
        setPreview,
        setShowError
      )
    } else if (artifact.preview.length > 0 && !artifact.analysis) {
      fetchPreviewFromPreviewData(
        artifact,
        error,
        getArtifactPreview,
        noData,
        setError,
        setNoData,
        setPreview,
        setShowError
      )
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
      fetchPreviewFromTargetPath(
        artifact,
        error,
        getArtifactPreview,
        noData,
        setError,
        setNoData,
        setPreview,
        setShowError
      )
    }
  }, [artifact, error, getArtifactPreview, noData, preview.length])

  return error.text.length > 0 ? (
    <PreviewError
      error={error}
      setShowError={setShowError}
      showError={showError}
    />
  ) : preview.length === 0 && !noData ? (
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
        setShowError={setShowError}
        showError={showError}
      />
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
