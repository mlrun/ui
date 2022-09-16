/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
        String(value).startsWith('/User') &&
          (artifact.user || artifact.producer?.owner),
        String(value).replace(/.*\./g, '')
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
