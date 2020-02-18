import React from 'react'
import PropTypes from 'prop-types'
import Chip from '../Chip/Chip'
import { cutChips } from '../../utils/cutChips'

const ChipCell = ({ elements, className }) => {
  const handleShowElements = e => {
    if (
      e.target.className === 'table_body__results' ||
      e.target.className === 'table_body__parameters'
    ) {
      let blocksArr = document.getElementsByClassName('showChips')
      const parentBlock = e.target.closest('.table_body__chips__block')
      if (
        blocksArr.length > 0 &&
        !parentBlock.classList.contains('showChips')
      ) {
        blocksArr[0].classList.remove('showChips')
      }
      parentBlock.classList.contains('showChips')
        ? parentBlock.classList.remove('showChips')
        : parentBlock.classList.add('showChips')
    }
  }

  const chips = cutChips(elements, 2)

  return elements
    ? chips.sortedArr.map((item, i) => {
        return (
          <div
            className="jobs__table_body__chips__block"
            key={`${item.value}${i}`}
          >
            <Chip
              key={item.value}
              className={className}
              onClick={handleShowElements}
              value={item.value}
              title={item.value}
            />
            {elements.hiddenChips && (
              <div className="jobs__table_body__chips_hidden">
                {elements.hiddenChips.map(element => (
                  <Chip
                    key={element.value}
                    className={className}
                    value={element.value}
                    title={element.value}
                  />
                ))}
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
  elements: PropTypes.arrayOf(PropTypes.string)
}

export default ChipCell
