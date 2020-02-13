import React from 'react'
import PropTypes from 'prop-types'
import JobsTableView from './JobsTableView'

import './jobs-table.scss'

const JobsTable = props => {
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

  const handleHoverOnRowActions = e => {
    const target = e.target.closest('.parent_row')
    target.lastElementChild.style.display = 'block'
  }

  const handleMouseLeaveFromRowActions = e => {
    const target = e.target.closest('.parent_row')
    const actions = document.getElementsByClassName('row__actions_visible')[0]
    target.lastElementChild.style.display = 'none'
    if (actions) {
      actions.classList.remove('row__actions_visible')
    }
  }

  return (
    <JobsTableView
      hideChips={hideChips}
      handleShowElements={handleShowElements}
      handleHoverOnRowActions={handleHoverOnRowActions}
      handleMouseLeaveFromRowActions={handleMouseLeaveFromRowActions}
      {...props}
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
