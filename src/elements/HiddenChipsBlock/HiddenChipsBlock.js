import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Chip from '../Chip/Chip'

import './hiddenChipsBlock.scss'

const HiddenChipsBlock = ({ className, chips }) => {
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
      {chips?.map(element => {
        return (
          <Tooltip
            key={element.value}
            template={<TextTooltipTemplate text={element.value} />}
          >
            <Chip className={className} value={element.value} />
          </Tooltip>
        )
      })}
    </div>
  )
}

HiddenChipsBlock.propTypes = {
  className: PropTypes.string.isRequired,
  chips: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default HiddenChipsBlock
