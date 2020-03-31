import React from 'react'
import PropTypes from 'prop-types'

import './createJobCardTemplate.scss'

const CreateJobCardTemplate = ({
  name,
  status,
  func,
  handleSelectFunction
}) => {
  return (
    <div className="card-template" onClick={() => handleSelectFunction(func)}>
      <h6 className="card-template__header">{name}</h6>
      <i className={status} />
    </div>
  )
}

CreateJobCardTemplate.defaultProps = {
  status: ''
}

CreateJobCardTemplate.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
}

export default CreateJobCardTemplate
