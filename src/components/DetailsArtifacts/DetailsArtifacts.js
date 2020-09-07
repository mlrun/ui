import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import prettyBytes from 'pretty-bytes'
import { connect, useDispatch } from 'react-redux'

import DetailsArtifactsView from './DetailsArtifactsView'

import { formatDatetime, parseKeyValues } from '../../utils'
import artifactAction from '../../actions/artifacts'
import { generateArtifactPreviewData } from '../../utils/generateArtifactPreviewData'
import jobsActions from '../../actions/jobs'

const DetailsArtifacts = ({
  iteration,
  jobsStore,
  match,
  selectedItem,
  setIterationOptions
}) => {
  const [content, setContent] = useState([])
  const [artifactsIndex, setArtifactsIndex] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    let selectedJob = selectedItem

    if (iteration !== '0') {
      selectedJob =
        jobsStore.allJobsData.find(
          job =>
            job.metadata.uid === selectedItem.uid &&
            job.metadata.iteration === +iteration
        ) || {}
      selectedJob.artifacts = selectedJob.status?.artifacts || []
      selectedJob.startTime = formatDatetime(
        new Date(selectedJob.status?.start_time)
      )
      selectedJob.labels = parseKeyValues(selectedJob.metadata?.labels || {})
    }

    const generatedContent = selectedJob.artifacts.map(artifact => {
      const indexOfSchema = artifact.target_path.indexOf('://')
      const schema =
        indexOfSchema > 0 ? artifact.target_path.slice(0, indexOfSchema) : ''
      let generatedPreviewData = {
        preview: [],
        extraDataPath: ''
      }

      if (artifact.extra_data) {
        generatedPreviewData = generateArtifactPreviewData(
          artifact.extra_data,
          schema
        )
      }

      const target_path = {
        schema: schema,
        path: generatedPreviewData.extraDataPath
          ? generatedPreviewData.extraDataPath
          : indexOfSchema > 0
          ? artifact.target_path.slice(indexOfSchema + '://'.length)
          : artifact.target_path
      }
      const generatedArtifact = {
        date: formatDatetime(selectedJob.startTime),
        key: artifact.key,
        db_key: artifact.db_key,
        preview: generatedPreviewData.preview,
        size: artifact.size ? prettyBytes(artifact.size) : 'N/A',
        target_path: target_path,
        user: selectedJob?.labels
          ?.find(item => item.match(/v3io_user|owner/g))
          .replace(/(v3io_user|owner): /, '')
      }

      if (artifact.schema) {
        return {
          ...generatedArtifact,
          header: artifact.header,
          preview: artifact.preview,
          schema: artifact.schema
        }
      }

      return generatedArtifact
    })

    setContent(generatedContent)
  }, [iteration, jobsStore.allJobsData, selectedItem])

  useEffect(() => {
    const iterationsList = [0]

    jobsStore.allJobsData.forEach(job => {
      if (job.metadata.uid === selectedItem.uid) {
        if (!iterationsList.includes(job.metadata.iteration)) {
          iterationsList.push(job.metadata.iteration)
        }
      }
    })

    setIterationOptions(
      iterationsList.sort().map(iteration => ({
        label: iteration === 0 ? 'Main' : `${iteration}`,
        id: `${iteration}`
      }))
    )
  }, [jobsStore.allJobsData, selectedItem.uid, setIterationOptions])

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
      const newArtifactsIndex = artifactsIndex.filter(
        artifactIndex => artifactIndex !== index
      )

      if (artifactsIndex.indexOf(index) === -1) {
        newArtifactsIndex.push(index)
      }

      setArtifactsIndex(newArtifactsIndex)
    },
    [artifactsIndex]
  )

  return (
    <DetailsArtifactsView
      artifactsIndex={artifactsIndex}
      content={content}
      match={match}
      showArtifact={showArtifact}
      showPreview={showPreview}
    />
  )
}

DetailsArtifacts.propTypes = {
  iteration: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIterationOptions: PropTypes.func.isRequired
}

export default connect(({ jobsStore }) => ({ jobsStore }), { ...jobsActions })(
  DetailsArtifacts
)
