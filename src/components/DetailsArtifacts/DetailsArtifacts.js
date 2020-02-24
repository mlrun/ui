import React from 'react'
import PropTypes from 'prop-types'
import prettyBytes from 'pretty-bytes'
import { connect } from 'react-redux'

import DetailsArtifactsView from './DetailsArtifactsView'

import { formatDatetime } from '../../utils'

const DetailsArtifacts = ({ jobsStore }) => {
  const items = jobsStore.selectedJob.artifacts.map(item => {
    const index = item.target_path.indexOf('://')
    const target_path = {
      schema: item.target_path.includes('://')
        ? item.target_path.slice(0, index)
        : '',
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

  const handleClick = e => {
    const viewedBlocks = document.getElementsByClassName('view')
    if (
      viewedBlocks.length > 0 &&
      !e.target
        .closest('div.table__item_artifacts_wrapper')
        .classList.contains('view')
    ) {
      viewedBlocks[0].classList.remove('view')
    } else {
      e.target
        .closest('div.table__item_artifacts_wrapper')
        .classList.contains('view')
        ? e.target
            .closest('div.table__item_artifacts_wrapper')
            .classList.remove('view')
        : e.target
            .closest('div.table__item_artifacts_wrapper')
            .classList.add('view')
    }
  }

  return (
    <DetailsArtifactsView
      items={items}
      handleClick={handleClick}
      artifacts={jobsStore.artifacts}
    />
  )
}

DetailsArtifacts.propTypes = {
  jobsStore: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => jobsStore)(DetailsArtifacts)
