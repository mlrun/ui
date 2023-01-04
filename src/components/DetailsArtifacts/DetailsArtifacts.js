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
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import DetailsArtifactsView from './DetailsArtifactsView'

import jobsActions from '../../actions/jobs'
import { getArtifactPreview } from '../../utils/getArtifactPreview'
import { generateContent, getJobAccordingIteration } from './detailsArtifacts.util'
import { showArtifactsPreview } from '../../reducers/artifactsReducer'

const DetailsArtifacts = ({
  fetchJob,
  iteration,
  jobsStore,
  selectedItem,
  setIteration,
  setIterationOption
}) => {
  const [content, setContent] = useState([])
  const [artifactsIndexes, setArtifactsIndexes] = useState([])
  const [preview, setPreview] = useState({})
  const [noData, setNoData] = useState(false)
  const params = useParams()

  const dispatch = useDispatch()

  const bestIteration = useMemo(
    () => selectedItem.results?.best_iteration,
    [selectedItem.results?.best_iteration]
  )

  useEffect(() => {
    if (!isNaN(parseInt(bestIteration))) {
      setIteration(`${bestIteration}`)
    }

    return () => {
      setIteration('')
    }
  }, [bestIteration, setIteration])

  useEffect(() => {
    if (selectedItem.iterationStats.length > 0) {
      const iterIndex = selectedItem.iterationStats[0].indexOf('iter')
      const iterationsList = []

      selectedItem.iterationStats.forEach((item, index) => {
        if (index !== 0) {
          iterationsList.push(item[iterIndex])
        }
      })

      setIterationOption(
        iterationsList
          .sort((a, b) => a - b)
          .map(iteration => ({
            label:
              iteration === bestIteration ? `${bestIteration} (Best iteration)` : `${iteration}`,
            id: `${iteration}`
          }))
      )
    }
  }, [bestIteration, selectedItem.iterationStats, setIterationOption])

  useEffect(() => {
    if (selectedItem.iterationStats.length > 0 && iteration) {
      fetchJob(params.projectName, params.jobId, iteration).then(job => {
        const selectedJob = getJobAccordingIteration(job)

        setContent(generateContent(selectedJob))
      })
    } else if (selectedItem.iterationStats.length === 0) {
      setContent(generateContent(selectedItem))
    }

    return () => {
      setContent([])
      setPreview({})
      setArtifactsIndexes([])
    }
  }, [fetchJob, iteration, params.jobId, params.projectName, selectedItem])

  useEffect(() => {
    if (artifactsIndexes.length > 0) {
      artifactsIndexes.forEach(artifactIndex => {
        if (!preview[artifactIndex]) {
          getArtifactPreview(
            params.projectName,
            content[artifactIndex],
            noData,
            setNoData,
            setPreview,
            true,
            artifactIndex
          )
        }
      })
    }
  }, [artifactsIndexes, content, noData, params.projectName, preview])

  const showPreview = artifact => {
    dispatch(
      showArtifactsPreview({
        isPreview: true,
        selectedItem: artifact
      })
    )
  }

  const showArtifact = useCallback(
    index => {
      const newArtifactsIndexes = artifactsIndexes.filter(artifactIndex => artifactIndex !== index)

      if (!artifactsIndexes.includes(index)) {
        newArtifactsIndexes.push(index)
      }

      setArtifactsIndexes(newArtifactsIndexes)
    },
    [artifactsIndexes]
  )

  return (
    <DetailsArtifactsView
      artifactsIndexes={artifactsIndexes}
      content={content}
      iteration={iteration}
      loading={jobsStore.loading}
      noData={noData}
      preview={preview}
      showArtifact={showArtifact}
      showPreview={showPreview}
    />
  )
}

DetailsArtifacts.propTypes = {
  iteration: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIterationOption: PropTypes.func.isRequired
}

export default connect(({ jobsStore }) => ({ jobsStore }), { ...jobsActions })(DetailsArtifacts)
