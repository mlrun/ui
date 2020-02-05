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
      !e.target.closest('tr').classList.contains('view')
    ) {
      viewedBlocks[0].classList.remove('view')
    }
    e.persist()
    getArtifacts(schema, path).then(() => {
      e.target.closest('tr').classList.contains('view')
        ? e.target.closest('tr').classList.remove('view')
        : e.target.closest('tr').classList.add('view')
    })
  }

  const handleDownloadClick = (schema, path) => {
    const artifact = {
      cancelDownloadSource: axios.CancelToken.source()
    }
    const config = {
      onDownloadProgress: progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        setProgress(percentCompleted)
      }
    }
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
        setTimeout(() => setDownloadStatus(''), 2000)
        setProgress(0)
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
