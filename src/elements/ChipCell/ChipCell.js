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
  return chips
    ? chips.sortedArr.map((item, i) => {
        return (
          <div className="table_body__chips__block" key={`${item}${i}`}>
            <Chip
              key={item}
              className={className}
              onClick={handleShowElements}
              value={item}
              title={item}
            />
            {chips.hiddenChips && (
              <div className="table_body__chips_hidden">
                {chips.hiddenChips.map(element => (
                  <Chip
                    key={element}
                    className={className}
                    value={element}
                    title={element}
                    onClick={handleShowElements}
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
  elements: PropTypes.shape({})
}

export default ChipCell
