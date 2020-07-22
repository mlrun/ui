import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { roundFloats } from '../../utils/roundFloats'

import { ReactComponent as Close } from '../../images/close.svg'
import ChipForm from '../../components/ChipForm/ChipForm'

const Chip = ({
  chipIndex,
  className,
  editChip,
  editConfig,
  isEditMode,
  handleIsEdit,
  hiddenChips,
  onClick,
  removeChip,
  setEditConfig,
  value
}) => {
  const chipClassNames = classnames(
    'chip_short',
    'data-ellipsis',
    hiddenChips && 'chip_hidden'
  )
  const chipLabel = value.indexOf(':')
  const chipValue =
    chipLabel > 0 ? roundFloats(value.slice(chipLabel + 1)) : value
  const generatedValue =
    chipLabel > 0 ? `${value.slice(0, chipLabel + 1)} ${chipValue}` : chipValue

  if (!value.match(/^\+ [\d]+/g)) {
    return isEditMode && chipIndex === editConfig.chipIndex ? (
      <ChipForm
        className="input-label-key"
        editConfig={editConfig}
        key={value}
        onChange={editChip}
        setEditConfig={setEditConfig}
        value={value.match(/^(?<key>|.+?)\W{1,2}(?<value>|.+?)$/)?.groups}
      />
    ) : (
      <span className={className}>
        <div
          className={chipClassNames}
          onClick={event => isEditMode && handleIsEdit(event, chipIndex)}
        >
          {generatedValue}
        </div>
        {isEditMode && (
          <button
            className="job-labels__item-icon-close"
            onClick={() => removeChip(chipIndex)}
          >
            <Close />
          </button>
        )}
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
  onClick: null,
  isEditMode: false
}

Chip.propTypes = {
  chipIndex: PropTypes.number,
  className: PropTypes.string.isRequired,
  editChip: PropTypes.func,
  editConfig: PropTypes.shape({}),
  isEditMode: PropTypes.bool,
  handleIsEdit: PropTypes.func,
  hiddenChips: PropTypes.bool,
  onClick: PropTypes.func,
  removeChip: PropTypes.func,
  setEditConfig: PropTypes.func,
  value: PropTypes.string.isRequired
}

export default Chip
