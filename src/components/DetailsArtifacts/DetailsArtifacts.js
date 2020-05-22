import React from 'react'
import PropTypes from 'prop-types'
import prettyBytes from 'pretty-bytes'
import { connect, useDispatch } from 'react-redux'

import DetailsArtifactsView from './DetailsArtifactsView'

import { formatDatetime } from '../../utils'

const DetailsArtifacts = ({ jobsStore, selectedItem }) => {
  const dispatch = useDispatch()

  const items = selectedItem.artifacts.map(item => {
    const index = item.target_path.indexOf('://')
    const target_path = {
      schema: item.target_path.includes('://')
        ? item.target_path.slice(0, index)
        : '',
      path: item.target_path.includes('://')
        ? item.target_path.slice(index + '://'.length)
        : item.target_path
    }
    if (item.schema) {
      return {
        schema: item.schema,
        header: item.header,
        preview: item.preview,
        key: item.key,
        target_path: target_path,
        size: item.size ? prettyBytes(item.size) : 'N/A',
        date: formatDatetime(selectedItem.startTime),
        user: selectedItem?.labels
          ?.find(item => item.match(/v3io_user|owner/g))
          .replace(/(v3io_user|owner): /, '')
      }
    }
    return {
      key: item.key,
      target_path: target_path,
      size: item.size ? prettyBytes(item.size) : 'N/A',
      date: formatDatetime(selectedItem.startTime),
      user: selectedItem?.labels
        ?.find(item => item.match(/v3io_user|owner/g))
        .replace(/(v3io_user|owner): /, '')
    }
  })

  const handleClick = e => {
    const viewedBlocks = document.getElementsByClassName('view')
    if (
      viewedBlocks.length > 0 &&
      !e.target
        .closest('div.table-item_artifacts_wrapper')
        .classList.contains('view')
    ) {
      viewedBlocks[0].classList.remove('view')
    } else {
      e.target
        .closest('div.table-item_artifacts_wrapper')
        .classList.contains('view')
        ? e.target
            .closest('div.table-item_artifacts_wrapper')
            .classList.remove('view')
        : e.target
            .closest('div.table-item_artifacts_wrapper')
            .classList.add('view')
    }
  }

  return (
    <DetailsArtifactsView
      items={items}
      handleClick={handleClick}
      artifacts={jobsStore.artifacts}
      dispatch={dispatch}
    />
  )
}

DetailsArtifacts.propTypes = {
  jobsStore: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => jobsStore)(DetailsArtifacts)
