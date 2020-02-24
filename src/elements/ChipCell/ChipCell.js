import React from 'react'
import PropTypes from 'prop-types'
import Chip from '../Chip/Chip'
import { cutChips } from '../../utils/cutChips'

const ChipCell = ({ className, elements, handleShowElements, maxLength }) => {
  const chips = cutChips(elements, maxLength)

  return elements
    ? chips.sortedArr.map((item, i) => {
        return (
          <div className="table_body__chips__block" key={`${item.value}${i}`}>
            <Chip
              key={item.value}
              className={className}
              onClick={handleShowElements}
              title={item.value}
              value={item.value}
            />
            {chips.hiddenChips && (
              <div className="table_body__chips_hidden">
                {chips.hiddenChips.map(element => {
                  return (
                    <Chip
                      key={element.value}
                      className={className}
                      title={element.value}
                      value={element.value}
                    />
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
