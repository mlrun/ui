import React from 'react'
import PropTypes from 'prop-types'

import './createJobCatdTemplate.scss'

const CreateJobCardTemplate = ({ name, status }) => {
  return (
    <div className="card-template">
      <h6 className="card-template__header">{name}</h6>
      <i className={status} />
    </div>
  )
}

CreateJobCardTemplate.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
}

export default CreateJobCardTemplate
