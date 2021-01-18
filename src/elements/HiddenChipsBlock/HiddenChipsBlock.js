import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Chip from '../../common/Chip/Chip'

import { getChipLabelAndValue } from '../../utils/getChipLabelAndValue'

import './hiddenChipsBlock.scss'

const HiddenChipsBlock = ({
  chipIndex,
  chips,
  className,
  editConfig,
  handleEditChip,
  handleIsEdit,
  handleRemoveChip,
  handleShowElements,
  isEditMode,
  setEditConfig
}) => {
  const [isTop, setIsTop] = useState(false)
  const hiddenRef = useRef()
  const offset = 28

  useEffect(() => {
    if (hiddenRef?.current) {
      const { height } = hiddenRef.current.getBoundingClientRect()

      if (
        hiddenRef.current.offsetParent.getBoundingClientRect().top -
          hiddenRef.current.offsetParent.clientHeight -
          height -
          offset <
        0
      ) {
        setIsTop(true)
      }
    }
  }, [hiddenRef, offset])

  useEffect(() => {
    if (chips.length === 0) {
      handleShowElements()
    }
  })

  return (
    <div
      ref={hiddenRef}
      className={`chip-block-hidden ${!isTop ? 'top' : 'bottom'}`}
    >
      {chips?.map((element, index) => {
        const { chipLabel, chipValue } = getChipLabelAndValue(element)

        return (
          <Tooltip
            key={element.value}
            template={
              <TextTooltipTemplate
                text={
                  element.delimiter ? (
                    <span>
                      {chipLabel}
                      <span className="chip__delimiter">
                        {element.delimiter}
                      </span>
                      {chipValue}
                    </span>
                  ) : (
                    element.value
                  )
                }
              />
            }
          >
            <Chip
              chipIndex={index + chipIndex}
              chip={element}
              className={className}
              editConfig={editConfig}
              handleEditChip={handleEditChip}
              handleIsEdit={handleIsEdit}
              handleRemoveChip={handleRemoveChip}
              hiddenChips
              isEditMode={isEditMode}
              setEditConfig={setEditConfig}
            />
          </Tooltip>
        )
      })}
    </div>
  )
}
HiddenChipsBlock.defaultProps = {
  chips: []
}

HiddenChipsBlock.defaultProps = {
  chips: [],
  chipIndex: 0,
  editChip: () => {},
  editConfig: {},
  handleIsEdit: () => {},
  isEditMode: false,
  removeChip: () => {},
  setEditConfig: () => {}
}

HiddenChipsBlock.propTypes = {
  className: PropTypes.string.isRequired,
  chips: PropTypes.arrayOf(PropTypes.shape({})),
  chipIndex: PropTypes.number,
  editConfig: PropTypes.shape({}),
  handleEditChip: PropTypes.func,
  handleIsEdit: PropTypes.func,
  handleRemoveChip: PropTypes.func,
  handleShowElements: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  setEditConfig: PropTypes.func
}

export default HiddenChipsBlock
