import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ChipForm from '../../components/ChipForm/ChipForm'

import { ReactComponent as Close } from '../../images/close.svg'

import { getChipLabelAndValue } from '../../utils/getChipLabelAndValue'

const Chip = ({
  chip,
  chipIndex,
  className,
  editConfig,
  handleEditChip,
  handleIsEdit,
  handleRemoveChip,
  hiddenChips,
  isEditMode,
  onClick,
  setEditConfig
}) => {
  const chipClassNames = classnames(
    'chip_short',
    'data-ellipsis',
    hiddenChips && 'chip_hidden'
  )
  const { chipLabel, chipValue } = getChipLabelAndValue(chip)
  const generatedValue = chip.value.indexOf(':')
    ? `${chipLabel}: ${chipValue}`
    : chipValue

  if (!chip.value.match(/^\+ [\d]+/g)) {
    return isEditMode && chipIndex === editConfig.chipIndex ? (
      <ChipForm
        className="input-label-key"
        editConfig={editConfig}
        key={chip.value}
        onChange={handleEditChip}
        setEditConfig={setEditConfig}
        value={chip.value.match(/^(?<key>|.+?):\s?(?<value>|.+?)$/)?.groups}
      />
    ) : (
      <span className={className}>
        <div
          className={chipClassNames}
          onClick={event => handleIsEdit(event, chipIndex)}
        >
          {chip.delimiter ? (
            <span>
              {chipLabel}
              <span className="chip__delimiter">{chip.delimiter}</span>
              {chipValue}
            </span>
          ) : (
            generatedValue
          )}
        </div>
        {isEditMode && (
          <button
            className="job-labels__item-icon-close"
            onClick={() => handleRemoveChip(chipIndex)}
          >
            <Close />
          </button>
        )}
      </span>
    )
  }

  return (
    <span className={`${className} chips_button`} onClick={onClick}>
      {chip.value}
    </span>
  )
}

Chip.defaultProps = {
  chipIndex: null,
  editConfig: {},
  handleEditChip: () => {},
  handleIsEdit: () => {},
  handleRemoveChip: () => {},
  hiddenChips: false,
  isEditMode: false,
  onClick: null,
  setEditConfig: () => {}
}

Chip.propTypes = {
  chip: PropTypes.shape({}).isRequired,
  chipIndex: PropTypes.number,
  className: PropTypes.string.isRequired,
  editConfig: PropTypes.shape({}),
  handleEditChip: PropTypes.func,
  handleIsEdit: PropTypes.func,
  handleRemoveChip: PropTypes.func,
  hiddenChips: PropTypes.bool,
  isEditMode: PropTypes.bool,
  onClick: PropTypes.func,
  setEditConfig: PropTypes.func
}

export default Chip
