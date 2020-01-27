import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JobsItemInternalView from './JobsItemInternalView'

const JobsItemInternal = ({ job, handleCancel, handleShowElements }) => {
  const [view, setView] = useState('Info')

  const handleMenuClick = (e, value) => {
    document
      .getElementsByClassName('jobs__table__item__menu_item active')[0]
      .classList.remove('active')
    e.target.classList.add('active')
    setView(value)
  }
  return (
    <JobsItemInternalView
      job={job}
      handleCancel={handleCancel}
      view={view}
      handleMenuClick={handleMenuClick}
      handleShowElements={handleShowElements}
    />
  )
}

JobsItemInternal.propTypes = {
  job: PropTypes.shape({}).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleShowElements: PropTypes.func.isRequired
}

export default JobsItemInternal
