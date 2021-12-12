import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ChipForm from '../ChipForm/ChipForm'

import { ReactComponent as Close } from '../../images/close.svg'

import { getChipLabelAndValue } from '../../utils/getChipLabelAndValue'
import { CHIP, CHIP_OPTIONS } from '../../types'

import './chip.scss'

const Chip = React.forwardRef(
  (
    {
      chip,
      chipIndex,
      chipOptions,
      className,
      editConfig,
      handleEditChip,
      handleIsEdit,
      handleRemoveChip,
      hiddenChips,
      isDeleteMode,
      isEditMode,
      onClick,
      setChipsSizes,
      setEditConfig,
      shortChip,
      showChips,
      textOverflowEllipsis
    },
    ref
  ) => {
    const chipRef = React.useRef()
    const { chipLabel, chipValue } = getChipLabelAndValue(chip)
    const {
      background,
      boldValue,
      borderColor,
      density,
      font,
      borderRadius
    } = chipOptions

    const chipClassNames = classnames(
      'chip',
      'chip__content',
      (textOverflowEllipsis || isEditMode) && 'data-ellipsis',
      shortChip && 'chip_short',
      hiddenChips && 'chip_hidden',
      density && `chip-density_${density}`,
      borderRadius && `chip-border_${borderRadius}`,
      background && `chip-background_${background}`,
      borderColor && `chip-border_${borderColor}`,
      font && `chip-font_${font}`,
      isEditMode && 'editable',
      (showChips || isEditMode) && 'chip_visible',
      className
    )
    const chipLabelClassNames = classnames(
      'chip__label',
      (textOverflowEllipsis || isEditMode) && 'data-ellipsis'
    )
    const chipValueClassNames = classnames(
      'chip__value',
      (textOverflowEllipsis || isEditMode) && 'data-ellipsis',
      boldValue && 'chip-value_bold'
    )

    useEffect(() => {
      if (chipRef.current && setChipsSizes) {
        setChipsSizes(state => ({
          ...state,
          [chipIndex]: chipRef.current.getBoundingClientRect().width
        }))
      }
    }, [chipIndex, setChipsSizes])

    if (!chip.value.match(/^\+ [\d]+/g)) {
      return isEditMode && chipIndex === editConfig.chipIndex ? (
        <ChipForm
          chipOptions={chipOptions}
          className="input-label-key"
          editConfig={editConfig}
          key={chip.value}
          onChange={handleEditChip}
          ref={ref}
          setEditConfig={setEditConfig}
          value={chip.value.match(/^(?<key>|.+?):\s?(?<value>|.+?)$/)?.groups}
        />
      ) : (
        <div
          className={chipClassNames}
          ref={chipRef}
          onClick={event => handleIsEdit(event, chipIndex)}
        >
          {chipLabel && <div className={chipLabelClassNames}>{chipLabel}</div>}
          {chipValue && (
            <>
              <div className="chip__delimiter">{chip.delimiter ?? ':'}</div>
              <div className={chipValueClassNames}>{chipValue}</div>
            </>
          )}
          {(isEditMode || isDeleteMode) && (
            <button
              className="item-icon-close"
              onClick={event => handleRemoveChip(event, chipIndex)}
            >
              <Close />
            </button>
          )}
        </div>
      )
    }

    return (
      <span className={`${chipClassNames} chips_button`} onClick={onClick}>
        {chip.value}
      </span>
    )
  }
)

Chip.defaultProps = {
  chipIndex: null,
  editConfig: {},
  handleEditChip: () => {},
  handleIsEdit: () => {},
  handleRemoveChip: () => {},
  hiddenChips: false,
  isDeleteMode: false,
  isEditMode: false,
  onClick: null,
  setChipsSizes: () => {},
  setEditConfig: () => {},
  shortChip: false,
  textOverflowEllipsis: false
}

Chip.propTypes = {
  chip: CHIP.isRequired,
  chipIndex: PropTypes.number,
  chipOptions: CHIP_OPTIONS.isRequired,
  className: PropTypes.string,
  editConfig: PropTypes.shape({}),
  handleEditChip: PropTypes.func,
  handleIsEdit: PropTypes.func,
  handleRemoveChip: PropTypes.func,
  hiddenChips: PropTypes.bool,
  isDeleteMode: PropTypes.bool,
  isEditMode: PropTypes.bool,
  onClick: PropTypes.func,
  setChipsSizes: PropTypes.func,
  setEditConfig: PropTypes.func,
  shortChip: PropTypes.bool,
  showChips: PropTypes.bool.isRequired,
  textOverflowEllipsis: PropTypes.bool
}

export default Chip
