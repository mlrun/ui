import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ChipForm from '../../elements/ChipForm/ChipForm'

import { ReactComponent as Close } from '../../images/close.svg'

import { getChipLabelAndValue } from '../../utils/getChipLabelAndValue'

import './chip.scss'

const Chip = ({
  background,
  boldValues,
  border,
  chip,
  chipIndex,
  className,
  density,
  editConfig,
  font,
  form,
  handleEditChip,
  handleIsEdit,
  handleRemoveChip,
  hiddenChips,
  isEditMode,
  onClick,
  setEditConfig
}) => {
  const chipClassNames = classnames(
    'chip',
    className && className,
    density && `chip-density_${density}`,
    form && `chip-${form}`,
    background && `chip-background_${background}`,
    border && `chip-border_${border}`,
    font && `chip-font_${font}`,
    isEditMode && 'editable'
  )
  const chipContentClassNames = classnames(
    'chip_short',
    'data-ellipsis',
    hiddenChips && 'chip_hidden'
  )
  const chipValueClassNames = classnames(
    'chip__value',
    boldValues && 'chip-value_bold'
  )
  const { chipLabel, chipValue } = getChipLabelAndValue(chip)

  if (!chip.value.match(/^\+ [\d]+/g)) {
    return isEditMode && chipIndex === editConfig.chipIndex ? (
      <ChipForm
        background={background}
        border={border}
        className="input-label-key"
        density={density}
        editConfig={editConfig}
        font={font}
        form={form}
        key={chip.value}
        onChange={handleEditChip}
        setEditConfig={setEditConfig}
        value={chip.value.match(/^(?<key>|.+?):\s?(?<value>|.+?)$/)?.groups}
      />
    ) : (
      <span className={chipClassNames}>
        <div
          className={chipContentClassNames}
          onClick={event => handleIsEdit(event, chipIndex)}
        >
          {chip.delimiter ? (
            <span>
              {chipLabel}
              <span className="chip__delimiter">{chip.delimiter}</span>
              <span className={chipValueClassNames}>{chipValue}</span>
            </span>
          ) : (
            <span>
              {chip.value.indexOf(':') && (
                <span className="chip__label">{`${chipLabel}: `}</span>
              )}
              <span className={chipValueClassNames}>{chipValue}</span>
            </span>
          )}
        </div>
        {isEditMode && (
          <button
            className="item-icon-close"
            onClick={() => handleRemoveChip(chipIndex)}
          >
            <Close />
          </button>
        )}
      </span>
    )
  }

  return (
    <span className={`${chipClassNames} chips_button`} onClick={onClick}>
      {chip.value}
    </span>
  )
}

Chip.defaultProps = {
  background: 'purple',
  boldValues: false,
  border: 'none',
  chipIndex: null,
  density: 'dense',
  editConfig: {},
  font: 'purple',
  form: 'square',
  handleEditChip: () => {},
  handleIsEdit: () => {},
  handleRemoveChip: () => {},
  hiddenChips: false,
  isEditMode: false,
  onClick: null,
  setEditConfig: () => {}
}

Chip.propTypes = {
  background: PropTypes.oneOf(['none', 'orange', 'green', 'purple', 'grey']),
  boldValues: PropTypes.bool,
  font: PropTypes.oneOf(['primary', 'white', 'green', 'purple', 'orange']),
  border: PropTypes.oneOf(['none', 'orange', 'green', 'purple', 'grey']),
  chip: PropTypes.shape({}).isRequired,
  chipIndex: PropTypes.number,
  className: PropTypes.string,
  density: PropTypes.oneOf(['dense', 'normal', 'medium']),
  editConfig: PropTypes.shape({}),
  form: PropTypes.oneOf(['round', 'square']),
  handleEditChip: PropTypes.func,
  handleIsEdit: PropTypes.func,
  handleRemoveChip: PropTypes.func,
  hiddenChips: PropTypes.bool,
  isEditMode: PropTypes.bool,
  onClick: PropTypes.func,
  setEditConfig: PropTypes.func
}

export default Chip
