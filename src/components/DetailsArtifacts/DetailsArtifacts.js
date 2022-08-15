import React, { useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import DetailsArtifactsView from './DetailsArtifactsView'

import artifactAction from '../../actions/artifacts'
import jobsActions from '../../actions/jobs'
import { getArtifactPreview } from '../../utils/getArtifactPreview'
import { generateContent, getJobAccordingIteration } from './detailsArtifacts.util'

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
  }, [artifactsIndexes, content, noData, preview])

  const showPreview = artifact => {
    dispatch(
      artifactAction.showArtifactsPreview({
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
