import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Chip from '../../common/Chip/Chip'

import { getChipLabelAndValue } from '../../utils/getChipLabelAndValue'

import './hiddenChipsBlock.scss'

const HiddenChipsBlock = ({ className, chips, handleShowElements }) => {
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
      {chips?.map(element => {
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
            <Chip className={className} chip={element} hiddenChips />
          </Tooltip>
        )
      })}
    </div>
  )
}
HiddenChipsBlock.defaultProps = {
  chips: []
}

HiddenChipsBlock.propTypes = {
  className: PropTypes.string.isRequired,
  chips: PropTypes.arrayOf(PropTypes.shape({})),
  handleShowElements: PropTypes.func.isRequired
}

export default HiddenChipsBlock
