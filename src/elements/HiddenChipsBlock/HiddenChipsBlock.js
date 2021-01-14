import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Chip from '../../common/Chip/Chip'

import './hiddenChipsBlock.scss'

const HiddenChipsBlock = ({
  chipIndex,
  chips,
  className,
  editChip,
  editConfig,
  handleIsEdit,
  isEditMode,
  setEditConfig,
  removeChip
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

  return (
    <div
      ref={hiddenRef}
      className={`chip-block-hidden ${!isTop ? 'top' : 'bottom'}`}
    >
      {chips?.map((element, index) => {
        return (
          <Tooltip
            key={element.value}
            template={<TextTooltipTemplate text={element.value} />}
          >
            <Chip
              chipIndex={index + chipIndex}
              className={className}
              editChip={editChip}
              editConfig={editConfig}
              handleIsEdit={handleIsEdit}
              isEditMode={isEditMode}
              removeChip={removeChip}
              setEditConfig={setEditConfig}
              value={element.value}
            />
          </Tooltip>
        )
      })}
    </div>
  )
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
  chips: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  chipIndex: PropTypes.number,
  editChip: PropTypes.func,
  editConfig: PropTypes.shape({}),
  handleIsEdit: PropTypes.func,
  isEditMode: PropTypes.bool,
  removeChip: PropTypes.func,
  setEditConfig: PropTypes.func
}

export default HiddenChipsBlock
