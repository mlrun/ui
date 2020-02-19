import React from 'react'
import PropTypes from 'prop-types'

const DetailsInputs = ({ inputs }) => {
  return (
    <div>
      <ul className="jobs__table__item_inputs">
        {Object.entries(inputs || {}).map(([key, value]) => (
          <li className="jobs__table__item_inputs_item" key={key}>
            <div>{key}</div>
            <div>{value}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

DetailsInputs.propTypes = {
  inputs: PropTypes.shape({}).isRequired
}

export default DetailsInputs
