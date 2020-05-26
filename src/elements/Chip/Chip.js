import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { roundFloats } from '../../utils/roundFloats'

const Chip = ({ className, hiddenChips, onClick, value }) => {
  const chipClassNames = classnames('chip_short', hiddenChips && 'chip_hidden')
  const chipLabel = value.indexOf(':')
  const chipValue =
    chipLabel > 0 ? roundFloats(value.slice(chipLabel + 1)) : value
  const generatedValue =
    chipLabel > 0 ? `${value.slice(0, chipLabel + 1)} ${chipValue}` : chipValue

  if (!value.match(/^\+ [\d]+/g)) {
    return (
      <span className={className}>
        <i className={chipClassNames}>{generatedValue}</i>
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
