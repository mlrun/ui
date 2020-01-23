import React from 'react'
import PropTypes from 'prop-types'
import Chip from '../Chip/Chip'

const ChipCell = ({ elements, className }) => {
  return elements
    ? elements.sortedArr.map((item, i) => {
        return (
          <div className="jobs__table_body__chips__block" key={item.value + i}>
            <Chip
              key={item.value}
              className={className}
              onClick={item.onClick}
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
  elements: PropTypes.shape({})
}

export default ChipCell
