import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

import Chip from '../Chip/Chip'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import HiddenChipsBlock from '../HiddenChipsBlock/HiddenChipsBlock'

import { cutChips } from '../../utils/cutChips'
import { sizeChips } from './SizeChips'

import './chipCell.scss'

const ChipCell = ({ className, elements }) => {
  const [chips, setChips] = useState(cutChips(elements, 0))
  const [show, setShow] = useState(false)

  const chipRef = useRef()

  const handleResize = useCallback(() => {
    if (chipRef.current) {
      const sizeParent =
        parseInt(chipRef.current.parentNode.offsetWidth / 100) * 100

      if (sizeParent <= 900) {
        setChips(sizeChips[`${sizeParent}px`](elements))
      } else {
        setChips(cutChips(elements, 7))
      }
    }
  }, [elements])

  const handleShowElements = useCallback(() => {
    setShow(!show)
  }, [show])

  useEffect(() => {
    if (show) {
      window.addEventListener('click', handleShowElements)
      return () => window.removeEventListener('click', handleShowElements)
    }
  }, [show, handleShowElements])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return (
    elements.length !== 0 && (
      <div className="chips-wrapper" ref={chipRef}>
        {chips.sortedArr.map((item, i, arr) => {
          return (
            <div className={'chip-block'} key={`${item.value}${i}`}>
              <Tooltip
                className="tooltip-wrapper"
                key={item.value}
                template={<TextTooltipTemplate text={item.value} />}
              >
                <Chip
                  className={className}
                  onClick={handleShowElements}
                  value={item.value}
                />
              </Tooltip>
              {chips.sortedArr.length - 1 === i && show && (
                <HiddenChipsBlock
                  className={className}
                  chips={chips.hiddenChips}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  )
}

ChipCell.defaultProps = {
  elements: []
}

ChipCell.propTypes = {
  className: PropTypes.string.isRequired,
  elements: PropTypes.arrayOf(PropTypes.string)
}

export default React.memo(ChipCell)
