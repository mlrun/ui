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
import React, { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { isArray, isEmpty, isObject } from 'lodash'

import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'

import { REQUEST_CANCELED } from '../../constants'
import { fetchArtifactPreviewFromPath } from '../../utils/getArtifactPreview'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

const DetailsAnalysis = ({ artifact }) => {
  const [preview, setPreview] = useState([])
  const [noData, setNoData] = useState(false)
  const params = useParams()
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const previewIsFetchedRef = useRef(false)
  const abortControllersListRef = useRef([])
  const dispatch = useDispatch()

  const fetchPreviewFromAnalysis = useCallback(() => {
    Object.entries(artifact.analysis).forEach(([name, path]) => {
      const previewAbortController = new AbortController()

      abortControllersListRef.current.push(previewAbortController)

      fetchArtifactPreviewFromPath(
        params.projectName,
        { ...artifact, size: null },
        path,
        noData,
        setNoData,
        content => setPreview(prevState => [...prevState, { ...content[0], header: name }]),
        frontendSpec.artifact_limits,
        previewAbortController.signal
      )
    })
  }, [artifact, noData, params.projectName, frontendSpec])

  useEffect(() => {
    if (artifact.analysis && preview.length === 0 && !previewIsFetchedRef.current && frontendSpec) {
      if (isObject(artifact.analysis) && !isArray(artifact.analysis)) {
        fetchPreviewFromAnalysis()
      } else {
        showErrorNotification(dispatch, '', '', 'The analysis type is malformed. Expected dict')
        queueMicrotask(() => {
          setNoData(true)
        })
      }

      previewIsFetchedRef.current = true
    } else if (!artifact.analysis || isEmpty(artifact.analysis)) {
      queueMicrotask(() => {
        setNoData(true)
      })
    }
  }, [artifact.analysis, fetchPreviewFromAnalysis, preview.length, frontendSpec, dispatch])

  useEffect(() => {
    const abortControllersList = abortControllersListRef.current

    return () => {
      abortControllersList.forEach(controller => controller.abort(REQUEST_CANCELED))
      abortControllersListRef.current = []
      previewIsFetchedRef.current = false
    }
  }, [artifact.analysis, params.projectName])

  return (
    <div className="preview_container">
      <ArtifactsPreview noData={noData} preview={preview} />
    </div>
  )
}

DetailsAnalysis.propTypes = {
  artifact: PropTypes.object.isRequired
}

export default DetailsAnalysis
