import React from 'react'
import PropTypes from 'prop-types'

const JobInternalInputs = ({ job }) => {
  return (
    <div>
      <ul className="jobs__table__item_inputs">
        {Object.entries(job.inputs || {}).map(([key, value]) => (
          <li className="jobs__table__item_inputs_item" key={key}>
            <div>{key}</div>
            <div>{value}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

JobInternalInputs.propTypes = {
  job: PropTypes.shape({}).isRequired
}

export default JobInternalInputs
