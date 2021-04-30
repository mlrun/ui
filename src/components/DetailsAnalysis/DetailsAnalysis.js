import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'

import api from '../../api/artifacts-api'
import { createArtifactPreviewContent } from '../../utils/createArtifactPreviewContent'

const DetailsAnalysis = ({ artifact }) => {
  const [preview, setPreview] = useState([])
  const [noData, setNoData] = useState(false)

  const getArtifactPreview = useCallback((path, user, fileFormat) => {
    return api.getArtifactPreview(path, user, fileFormat).then(res => {
      return createArtifactPreviewContent(res, fileFormat)
    })
  }, [])

  const fetchPreviewFromAnalysis = useCallback(() => {
    Object.entries(artifact.analysis).forEach(([key, value]) => {
      getArtifactPreview(
        value,
        value.startsWith('/User') &&
          (artifact.user || artifact.producer?.owner),
        value.replace(/.*\./g, '')
      )
        .then(content => {
          setPreview(prevState => [...prevState, { ...content, header: key }])

          if (noData) {
            setNoData(false)
          }
        })
        .catch(err => {
          setPreview(state => [
            ...state,
            {
              header: key,
              error: {
                text: `${err.response?.status} ${err.response?.statusText}`,
                body: JSON.stringify(err.response, null, 2)
              },
              content: [],
              type: 'error'
            }
          ])
        })
    })
  }, [
    artifact.analysis,
    artifact.producer,
    artifact.user,
    getArtifactPreview,
    noData
  ])

  useEffect(() => {
    if (artifact.analysis && preview.length === 0) {
      fetchPreviewFromAnalysis()
    } else if (!artifact.analysis) {
      setNoData(true)
    }
  }, [artifact.analysis, fetchPreviewFromAnalysis, preview.length])

  return (
    <div className="preview_container">
      <ArtifactsPreview noData={noData} preview={preview} />
    </div>
  )
}

DetailsAnalysis.propTypes = {
  artifact: PropTypes.shape({}).isRequired
}

export default DetailsAnalysis
