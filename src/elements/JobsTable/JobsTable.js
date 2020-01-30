import React from 'react'
import PropTypes from 'prop-types'

import './jobs-table.scss'
import JobsTableView from './JobsTableView'

const JobsTable = ({
  jobs,
  handleSelectJob,
  job,
  handleCancel,
  loading,
  match
}) => {
  const handleShowElements = e => {
    if (
      e.target.className === 'jobs__table_body__results' ||
      e.target.className === 'jobs__table_body__parameters'
    ) {
      let blocksArr = document.getElementsByClassName('showChips')
      const parentBlock = e.target.closest('.jobs__table_body__chips__block')
      if (
        blocksArr.length > 0 &&
        !parentBlock.classList.contains('showChips')
      ) {
        blocksArr[0].classList.remove('showChips')
      }
      parentBlock.classList.contains('showChips')
        ? parentBlock.classList.remove('showChips')
        : parentBlock.classList.add('showChips')
    }
  }

  const hideChips = e => {
    if (
      e.target.className !== 'jobs__table_body__results' &&
      e.target.className !== 'jobs__table_body__parameters'
    ) {
      const block = document.getElementsByClassName(
        'jobs__table_body__chips__block showChips'
      )[0]
      if (block) {
        block.classList.remove('showChips')
      }
    }
  }

  return (
    <JobsTableView
      hideChips={hideChips}
      loading={loading}
      job={job}
      jobs={jobs}
      handleShowElements={handleShowElements}
      handleSelectJob={handleSelectJob}
      handleCancel={handleCancel}
      match={match}
    />
  )
}

JobsTable.defaultProps = {
  job: {},
  jobs: []
}

JobsTable.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleSelectJob: PropTypes.func.isRequired,
  job: PropTypes.shape({}),
  jobs: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired
}

export default JobsTable
