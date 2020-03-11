import React from 'react'
import PropTypes from 'prop-types'

const Chip = ({ className, onClick, value }) => {
  if (value.length > 15) {
    return (
      <span className={className}>
        <i className="table-body__chips_short">{value}</i>
      </span>
    )
  }
  return (
    <span className={className} count-chips="true" onClick={onClick}>
      {value}
    </span>
  )
}

Chip.defaultProps = {
  onClick: null
}

Chip.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  value: PropTypes.string.isRequired
}

export default Chip
