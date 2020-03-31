import React from 'react'
import PropTypes from 'prop-types'

const Chip = ({ className, onClick, value }) => {
  if (!value.match(/^\+ [\d]+/g)) {
    return (
      <span className={className}>
        <i className="chip-short">{value}</i>
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
