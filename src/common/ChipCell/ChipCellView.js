import React from 'react'
import PropTypes from 'prop-types'

import Chip from '../Chip/Chip'
import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import HiddenChipsBlock from '../../elements/HiddenChipsBlock/HiddenChipsBlock'

import { ReactComponent as Add } from '../../images/add.svg'

const ChipCellView = React.forwardRef(
  (
    {
      addChip,
      chips,
      className,
      editChip,
      editConfig,
      elements,
      handleIsEdit,
      handleShowElements,
      isEditMode,
      removeChip,
      setEditConfig,
      show
    },
    ref
  ) =>
    (isEditMode || elements.length !== 0) && (
      <div className="chips-wrapper" ref={ref}>
        {chips.visibleChips.map((item, index) => {
          return (
            <div className={'chip-block'} key={`${item.value}${index}`}>
              <Tooltip
                className="tooltip-wrapper"
                key={item.value}
                template={
                  editConfig.isEdit ? (
                    <span />
                  ) : (
                    <TextTooltipTemplate text={item.value} />
                  )
                }
              >
                <Chip
                  chipIndex={index}
                  className={className}
                  editConfig={editConfig}
                  editChip={editChip}
                  isEditMode={isEditMode}
                  handleIsEdit={handleIsEdit}
                  removeChip={removeChip}
                  onClick={handleShowElements}
                  setEditConfig={setEditConfig}
                  value={item.value}
                />
              </Tooltip>
              {chips.visibleChips.length - 1 === index && show && (
                <HiddenChipsBlock
                  className={className}
                  chips={chips.hiddenChips}
                />
              )}
            </div>
          )
        })}
        {isEditMode && (
          <button
            className="job-labels__button-add"
            onClick={() => addChip(':')}
          >
            <Add />
          </button>
        )}
      </div>
    )
)

ChipCellView.defaultProps = {
  addChip: () => {},
  chips: {},
  className: '',
  editChip: () => {},
  editConfig: {},
  elements: [],
  handleIsEdit: () => {},
  handleShowElements: () => {},
  isEditMode: false,
  removeChip: () => {},
  setEditConfig: () => {},
  show: false
}

ChipCellView.propTypes = {
  addChip: PropTypes.func,
  chips: PropTypes.shape({}),
  className: PropTypes.string,
  editChip: PropTypes.func,
  editConfig: PropTypes.shape({}),
  elements: PropTypes.array,
  handleIsEdit: PropTypes.func,
  handleShowElements: PropTypes.func,
  isEditMode: PropTypes.bool,
  removeChip: PropTypes.func,
  setEditConfig: PropTypes.func,
  show: PropTypes.bool
}

export default ChipCellView
