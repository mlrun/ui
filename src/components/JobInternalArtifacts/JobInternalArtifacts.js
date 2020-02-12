import React, { useState } from 'react'
import PropTypes from 'prop-types'
import prettyBytes from 'pretty-bytes'
import { connect } from 'react-redux'
import axios from 'axios'

import JobInternalArtifactsView from './JobInternalArtifactsView'

import jobsApi from '../../api/jobs-api'
import jobsActions from '../../actions/jobs'
import { formatDatetime } from '../../utils'

const JobInternalArtifacts = ({
  jobsStore,
  getArtifacts,
  setDownloadStatus
}) => {
  const [progress, setProgress] = useState(0)

  const items = jobsStore.selectedJob.artifacts.map(item => {
    const index = item.target_path.indexOf('://')
    const target_path = {
      schema: item.target_path.includes('://')
        ? item.target_path.slice(0, index)
        : null,
      path: item.target_path.includes('://')
        ? item.target_path.slice(index + '://'.length)
        : item.target_path
    }
    return {
      key: item.key,
      target_path: target_path,
      size: item.size ? prettyBytes(item.size) : 'N/A',
      date: formatDatetime(jobsStore.selectedJob.startTime)
    }
  })

  const handleClick = (e, schema, path) => {
    const viewedBlocks = document.getElementsByClassName('view')
    if (
      viewedBlocks.length > 0 &&
      !e.target
        .closest('div.jobs__table__item_artifacts_wrapper')
        .classList.contains('view')
    ) {
      viewedBlocks[0].classList.remove('view')
    }
    e.persist()
    getArtifacts(schema, path).then(() => {
      e.target
        .closest('div.jobs__table__item_artifacts_wrapper')
        .classList.contains('view')
        ? e.target
            .closest('div.jobs__table__item_artifacts_wrapper')
            .classList.remove('view')
        : e.target
            .closest('div.jobs__table__item_artifacts_wrapper')
            .classList.add('view')
    })
  }

  const handleDownloadClick = (e, schema, path) => {
    e.persist()
    const artifact = {
      cancelDownloadSource: axios.CancelToken.source()
    }
    const config = {
      onDownloadProgress: progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total + 0.1)
        )
        setProgress(percentCompleted)
      }
    }
    e.target.closest('div').classList.add('progress')
    jobsApi
      .getJobArtifacts(schema, path, config)
      .then(result => {
        artifact.content = URL.createObjectURL(new Blob([result.data]))
        const link = document.createElement('a')
        link.href = artifact.content
        link.setAttribute('download', path.split('/').pop())
        document.body.appendChild(link)
        link.click()
        link.remove()
        setDownloadStatus('Success')
        setProgress(0)
        e.target.closest('td').classList.remove('progress')
      })
      .then(() => {
        setTimeout(() => setDownloadStatus(''), 3000)
        setTimeout(() => {
          document
            .getElementsByClassName('jobs_download_status')[0]
            .classList.remove('jobs_download_status__success')
        }, 2000)
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          return
        } else {
          setDownloadStatus('Failed')
        }
      })
      .finally(() => {
        URL.revokeObjectURL(artifact.content)
      })
  }

  return (
    <JobInternalArtifactsView
      items={items}
      handleClick={handleClick}
      artifacts={jobsStore.artifacts}
      handleDownloadClick={handleDownloadClick}
      progress={progress}
    />
  )
}

JobInternalArtifacts.propTypes = {
  getArtifacts: PropTypes.func.isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  setDownloadStatus: PropTypes.func.isRequired
}

export default connect(
  jobsStore => jobsStore,
  jobsActions
)(JobInternalArtifacts)
