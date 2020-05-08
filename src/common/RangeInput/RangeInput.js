import React from 'react'
import PropTypes from 'prop-types'

import Input from '../Input/Input'

import { ReactComponent as Arrow } from '../../images/range-arrow.svg'

import './rangeInput.scss'

const RangeInput = ({ floatingLabel, infoLabel, label, onChange, value }) => {
  const handleIncrease = () => {
    onChange(++value)
  }

  const handleDecrease = () => {
    if (value <= 0) return

    onChange(--value)
  }
  return (
    <div className="range">
      <Input
        className="range__input"
        floatingLabel={floatingLabel}
        infoLabel={infoLabel}
        label={label}
        onChange={onChange}
        type="number"
        value={value}
      />
      <button className="range__icon increase" onClick={handleIncrease}>
        <Arrow />
      </button>
      <button className="range__icon decrease" onClick={handleDecrease}>
        <Arrow />
      </button>
    </div>
  )
}

RangeInput.defaultProps = {
  floatingLabel: false,
  infoLabel: undefined,
  label: ''
}

RangeInput.propTypes = {
  floatingLabel: PropTypes.bool,
  infoLabel: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default React.memo(RangeInput)
