import React from 'react'
import PropTypes from 'prop-types'

import Chip from '../Chip/Chip'
import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import HiddenChipsBlock from '../../elements/HiddenChipsBlock/HiddenChipsBlock'

import { ReactComponent as Add } from '../../images/add.svg'

import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { getChipLabelAndValue } from '../../utils/getChipLabelAndValue'

const ChipCellView = React.forwardRef(
  (
    {
      chips,
      className,
      editConfig,
      handleAddNewChip,
      handleEditChip,
      handleIsEdit,
      handleRemoveChip,
      handleShowElements,
      isEditMode,
      setEditConfig,
      show
    },
    ref
  ) =>
    (isEditMode || !isEveryObjectValueEmpty(chips)) && (
      <div className="chips-wrapper" ref={ref}>
        {chips.visibleChips.map((chip, index) => {
          const { chipLabel, chipValue } = getChipLabelAndValue(chip)

          return (
            <div className={'chip-block'} key={`${chip.value}${index}`}>
              <Tooltip
                className="tooltip-wrapper"
                key={chip.value}
                template={
                  editConfig.isEdit ? (
                    <span />
                  ) : (
                    <TextTooltipTemplate
                      text={
                        chip.delimiter && !chip.value.match(/^\+ [\d]+/g) ? (
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
                  )
                }
              >
                <Chip
                  chipIndex={index}
                  className={className}
                  editConfig={editConfig}
                  handleEditChip={handleEditChip}
                  isEditMode={isEditMode}
                  handleIsEdit={handleIsEdit}
                  handleRemoveChip={handleRemoveChip}
                  onClick={handleShowElements}
                  setEditConfig={setEditConfig}
                  chip={chip}
                />
              </Tooltip>
              {chips.visibleChips.length - 1 === index && show && (
                <HiddenChipsBlock
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
          <button className="button-add" onClick={() => handleAddNewChip(':')}>
            <Add />
          </button>
        )}
      </div>
    )
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
