import React from 'react'
import PropTypes from 'prop-types'
import Chip from '../Chip/Chip'
import { cutChips } from '../../utils/cutChips'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

const ChipCell = ({ className, elements, handleShowElements, maxLength }) => {
  const chips = cutChips(elements, maxLength)

  return elements
    ? chips.sortedArr.map((item, i) => {
        return (
          <div className="table_body__chips__block" key={`${item.value}${i}`}>
            <Tooltip
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
              <div className="table_body__chips_hidden">
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
      })
    : null
}

ChipCell.defaultProps = {
  elements: []
}

ChipCell.propTypes = {
  className: PropTypes.string.isRequired,
  elements: PropTypes.arrayOf(PropTypes.string),
  handleShowElements: PropTypes.func.isRequired,
  maxLength: PropTypes.number.isRequired
}

export default ChipCell
