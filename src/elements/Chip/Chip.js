import React from 'react'
import PropTypes from 'prop-types'

const Chip = ({ className, title, onClick, value }) => {
  if (value.length > 15) {
    return (
      <span className={className} title={title}>
        <i className="table-body__chips_short">{value}</i>
      </span>
    )
  }
  return (
    <span className={className} title={title} onClick={onClick}>
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
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

export default Chip
