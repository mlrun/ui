import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Chip from '../Chip/Chip'
import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import HiddenChipsBlock from '../../elements/HiddenChipsBlock/HiddenChipsBlock'

import { ReactComponent as Add } from '../../images/add.svg'

import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { getChipLabelAndValue } from '../../utils/getChipLabelAndValue'
import { CHIP_OPTIONS } from '../../types'

const ChipCellView = React.forwardRef(
  (
    {
      chips,
      chipOptions,
      className,
      editConfig,
      handleAddNewChip,
      handleEditChip,
      handleIsEdit,
      handleRemoveChip,
      handleShowElements,
      isEditMode,
      setEditConfig,
      showHiddenChips
    },
    ref
  ) => {
    const buttonAddClassNames = classnames(
      'button-add',
      className,
      chipOptions.background &&
        `button-add-background_${chipOptions.background}`,
      chipOptions.borderColor && `button-add-border_${chipOptions.borderColor}`,
      chipOptions.font && `button-add-font_${chipOptions.font}`,
      chipOptions.density && `button-add-density_${chipOptions.density}`
    )

    return (
      (isEditMode || !isEveryObjectValueEmpty(chips)) && (
        <div className="chips-wrapper" ref={ref}>
          {chips.visibleChips.map((chip, index) => {
            const { chipLabel, chipValue } = getChipLabelAndValue(chip)

            return (
              <div className={'chip-block'} key={`${chip.value}${index}`}>
                <Tooltip
                  className="tooltip-wrapper"
                  hidden={editConfig.isEdit || /^\+ [\d]+/g.test(chip.value)}
                  key={chip.value}
                  template={
                    <TextTooltipTemplate
                      text={
                        chip.delimiter ? (
                          <span>
                            {chipLabel}
                            <span className="chip__delimiter">
                              {chip.delimiter}
                            </span>
                            {chipValue}
                          </span>
                        ) : (
                          chip.value
                        )
                      }
                    />
                  }
                >
                  <Chip
                    chip={chip}
                    chipIndex={index}
                    chipOptions={chipOptions}
                    className={className}
                    editConfig={editConfig}
                    handleEditChip={handleEditChip}
                    handleIsEdit={handleIsEdit}
                    handleRemoveChip={handleRemoveChip}
                    isEditMode={isEditMode}
                    onClick={handleShowElements}
                    setEditConfig={setEditConfig}
                    ref={ref}
                  />
                </Tooltip>
                {chips.visibleChips.length - 1 === index && showHiddenChips && (
                  <HiddenChipsBlock
                    chipOptions={chipOptions}
                    className={className}
                    chips={chips.hiddenChips}
                    chipIndex={index}
                    editConfig={editConfig}
                    handleEditChip={handleEditChip}
                    handleIsEdit={handleIsEdit}
                    handleRemoveChip={handleRemoveChip}
                    handleShowElements={handleShowElements}
                    isEditMode={isEditMode}
                    setEditConfig={setEditConfig}
                  />
                )}
              </div>
            )
          })}
          {isEditMode && (
            <button
              className={buttonAddClassNames}
              onClick={() => handleAddNewChip(':')}
            >
              <Add />
            </button>
          )}
        </div>
      )
    )
  }
)

ChipCellView.defaultProps = {
  chips: {},
  className: '',
  editChip: () => {},
  editConfig: {},
  handleAddNewChip: () => {},
  handleIsEdit: () => {},
  handleShowElements: () => {},
  isEditMode: false,
  removeChip: () => {},
  setEditConfig: () => {},
  show: false
}

ChipCellView.propTypes = {
  chips: PropTypes.shape({}),
  chipOptions: CHIP_OPTIONS.isRequired,
  className: PropTypes.string,
  editConfig: PropTypes.shape({}),
  handleAddNewChip: PropTypes.func,
  handleEditChip: PropTypes.func,
  handleIsEdit: PropTypes.func,
  handleRemoveChip: PropTypes.func,
  handleShowElements: PropTypes.func,
  isEditMode: PropTypes.bool,
  setEditConfig: PropTypes.func,
  show: PropTypes.bool
}

export default ChipCellView
