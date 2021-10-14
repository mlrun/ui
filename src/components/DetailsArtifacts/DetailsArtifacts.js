import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect, useDispatch } from 'react-redux'

import DetailsArtifactsView from './DetailsArtifactsView'

import artifactAction from '../../actions/artifacts'
import jobsActions from '../../actions/jobs'
import { getArtifactPreview } from '../../utils/getArtifactPreview'
import {
  generateContent,
  getJobAccordingIteration
} from './detailsArtifacts.util'

const DetailsArtifacts = ({
  iteration,
  jobsStore,
  match,
  selectedItem,
  setIterationOption
}) => {
  const [content, setContent] = useState([])
  const [artifactsIndexes, setArtifactsIndexes] = useState([])
  const [preview, setPreview] = useState({})
  const [noData, setNoData] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    let selectedJob = selectedItem

    setArtifactsIndexes([])

    if (iteration !== '0') {
      selectedJob = getJobAccordingIteration(
        iteration,
        jobsStore.allJobsData,
        selectedItem
      )
    }

    setContent(generateContent(selectedJob))

    return () => {
      setContent([])
      setPreview({})
    }
  }, [iteration, jobsStore.allJobsData, selectedItem])

  useEffect(() => {
    const iterationsList = [0, 1]

    jobsStore.allJobsData.forEach(job => {
      if (job.metadata.uid === selectedItem.uid) {
        if (!iterationsList.includes(job.metadata.iteration)) {
          iterationsList.push(job.metadata.iteration)
        }
      }
    })

    setIterationOption(
      iterationsList.sort().map(iteration => ({
        label: iteration === 0 ? 'Main' : `${iteration}`,
        id: `${iteration}`
      }))
    )
  }, [dispatch, jobsStore.allJobsData, selectedItem.uid, setIterationOption])

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
      const newArtifactsIndexes = artifactsIndexes.filter(
        artifactIndex => artifactIndex !== index
      )

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
      match={match}
      noData={noData}
      preview={preview}
      showArtifact={showArtifact}
      showPreview={showPreview}
    />
  )
}

DetailsArtifacts.propTypes = {
  iteration: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIterationOption: PropTypes.func.isRequired
}

export default connect(({ jobsStore }) => ({ jobsStore }), { ...jobsActions })(
  DetailsArtifacts
)
