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
import { connect, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import DetailsArtifactsView from './DetailsArtifactsView'

import { generateContent, getJobAccordingIteration } from './detailsArtifacts.util'
import { generateArtifactIndexes } from '../Details/details.util'

import jobsActions from '../../actions/jobs'

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
  const iterationOptions = useSelector(store => store.detailsStore.iterationOptions)
  const params = useParams()

  const bestIteration = useMemo(
    () => selectedItem.results?.best_iteration,
    [selectedItem.results?.best_iteration]
  )

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
    if (!isNaN(parseInt(bestIteration))) {
      setIteration(`${bestIteration}`)
    } else if (selectedItem.iterationStats.length > 0 && iterationOptions.length > 0) {
      setIteration(iterationOptions[0].id)
    }

    return () => {
      setIteration('')
    }
  }, [bestIteration, setIteration, selectedItem.iterationStats, iterationOptions])

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
      setArtifactsIndexes([])
    }
  }, [fetchJob, iteration, params.jobId, params.projectName, selectedItem])

  const showArtifact = useCallback(
    index => {
      generateArtifactIndexes(artifactsIndexes, index, setArtifactsIndexes)
    },
    [artifactsIndexes, setArtifactsIndexes]
  )

  return (
    <DetailsArtifactsView
      artifactsIndexes={artifactsIndexes}
      content={content}
      iteration={iteration}
      loading={jobsStore.loading}
      showArtifact={showArtifact}
    />
  )
}

DetailsArtifacts.propTypes = {
  iteration: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIterationOption: PropTypes.func.isRequired
}

export default connect(({ jobsStore }) => ({ jobsStore }), { ...jobsActions })(DetailsArtifacts)
