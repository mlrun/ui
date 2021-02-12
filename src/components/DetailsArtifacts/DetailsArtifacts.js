import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import prettyBytes from 'pretty-bytes'
import { connect, useDispatch } from 'react-redux'

import DetailsArtifactsView from './DetailsArtifactsView'

import { formatDatetime, parseKeyValues } from '../../utils'
import artifactAction from '../../actions/artifacts'
import { generateArtifactPreviewData } from '../../utils/generateArtifactPreviewData'
import jobsActions from '../../actions/jobs'
import { detailsActions } from '../DetailsInfo/detailsReducer'

const DetailsArtifacts = ({
  detailsDispatch,
  iteration,
  jobsStore,
  match,
  selectedItem
}) => {
  const [content, setContent] = useState([])
  const [artifactsIndexes, setArtifactsIndexes] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    let selectedJob = selectedItem

    setArtifactsIndexes([])

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
    const iterationsList = [0, 1]

    jobsStore.allJobsData.forEach(job => {
      if (job.metadata.uid === selectedItem.uid) {
        if (!iterationsList.includes(job.metadata.iteration)) {
          iterationsList.push(job.metadata.iteration)
        }
      }
    })

    detailsDispatch({
      type: detailsActions.SET_ITERATION_OPTIONS,
      payload: iterationsList.sort().map(iteration => ({
        label: iteration === 0 ? 'Main' : `${iteration}`,
        id: `${iteration}`
      }))
    })
  }, [detailsDispatch, jobsStore.allJobsData, selectedItem.uid])

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
      showArtifact={showArtifact}
      showPreview={showPreview}
    />
  )
}

DetailsArtifacts.propTypes = {
  detailsDispatch: PropTypes.func.isRequired,
  iteration: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default connect(({ jobsStore }) => ({ jobsStore }), { ...jobsActions })(
  DetailsArtifacts
)
