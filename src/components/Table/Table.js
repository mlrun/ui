import React from 'react'
import PropTypes from 'prop-types'
import TableView from './TableView'

import './table.scss'

const Table = props => {
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
    <TableView
      hideChips={hideChips}
      handleHoverOnRowActions={handleHoverOnRowActions}
      handleMouseLeaveFromRowActions={handleMouseLeaveFromRowActions}
      {...props}
    />
  )
}

Table.defaultProps = {
  job: {},
  jobs: []
}

Table.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  job: PropTypes.shape({}),
  jobs: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired
}

export default Table
