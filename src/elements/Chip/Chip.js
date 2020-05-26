import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const Chip = ({ className, hiddenChips, onClick, value }) => {
  const chipClassNames = classnames('chip_short', hiddenChips && 'chip_hidden')

  if (!value.match(/^\+ [\d]+/g)) {
    return (
      <span className={className}>
        <i className={chipClassNames}>{value}</i>
      </span>
    )
  }
  return (
    <span className={`${className} chips_button`} onClick={onClick}>
      {value}
    </span>
  )
}

Chip.defaultProps = {
  hiddenChips: false,
  onClick: null
}

Chip.propTypes = {
  className: PropTypes.string.isRequired,
  hiddenChips: PropTypes.bool,
  onClick: PropTypes.func,
  value: PropTypes.string.isRequired
}

export default Chip
