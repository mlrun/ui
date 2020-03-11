import React, { useRef, useState, useCallback, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

import Chip from '../Chip/Chip'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { cutChips } from '../../utils/cutChips'
import { sizeChips } from './SizeChips'

const ChipCell = ({ className, elements, handleShowElements }) => {
  const [chips, setChips] = useState(cutChips(elements, 0))
  const chipRef = useRef()

  const handleResize = useCallback(() => {
    if (chipRef.current) {
      const sizeParent =
        parseInt(chipRef.current.parentNode.offsetWidth / 100) * 100

      if (sizeParent <= 900) {
        setChips(sizeChips[`${sizeParent}px`](elements))
      } else {
        setChips(cutChips(elements, 6))
      }
    }
  }, [elements])

  useLayoutEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize, setChips, elements])

  return elements.length !== 0 ? (
    <div className="chips_wrapper" ref={chipRef}>
      {chips.sortedArr.map((item, i) => {
        return (
          <div className="table-body__chips__block" key={`${item.value}${i}`}>
            <Tooltip
              className="chip_wrapper"
              key={item.value}
              template={<TextTooltipTemplate text={item.value} />}
            >
              <Chip
                className={className}
                onClick={handleShowElements}
                value={item.value}
              />
            </Tooltip>
            {chips.hiddenChips && (
              <div className="table-body__chips_hidden">
                {chips.hiddenChips.map(element => {
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
            )}
          </div>
        )
      })}
    </div>
  ) : null
}

ChipCell.defaultProps = {
  elements: []
}

ChipCell.propTypes = {
  className: PropTypes.string.isRequired,
  elements: PropTypes.arrayOf(PropTypes.string),
  handleShowElements: PropTypes.func.isRequired
}

export default ChipCell
