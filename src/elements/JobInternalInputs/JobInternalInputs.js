import React from 'react'
import PropTypes from 'prop-types'

const JobInternalInputs = ({ job }) => {
  const keys = Object.keys(job.inputs)
  const values = Object.values(job.inputs)
  return (
    <div>
      <ul className="jobs__table__item_inputs">
        {keys.map((item, i) => (
          <li className="jobs__table__item_inputs_item" key={item}>
            <div>{item}</div>
            <div>{values[i]}</div>
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
