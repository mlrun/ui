import React from 'react'
import PropTypes from 'prop-types'
import prettyBytes from 'pretty-bytes'
import { connect } from 'react-redux'

import JobInternalArtifactsView from './JobInternalArtifactsView'

import jobsActions from '../../actions/jobs'
import { formatDatetime } from '../../utils'

const JobInternalArtifacts = ({ jobsStore, getArtifacts }) => {
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
    if (viewedBlocks.length > 0) {
      viewedBlocks[0].classList.remove('view')
    }
    e.persist()
    getArtifacts(schema, path).then(() => {
      e.target.parentNode.classList.add('view')
    })
  }

  return (
    <JobInternalArtifactsView
      items={items}
      handleClick={handleClick}
      artifacts={jobsStore.artifacts}
    />
  )
}

JobInternalArtifacts.propTypes = {
  getArtifacts: PropTypes.func.isRequired,
  jobsStore: PropTypes.shape({}).isRequired
}

export default connect(
  jobsStore => jobsStore,
  jobsActions
)(JobInternalArtifacts)
