import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Chip from '../Chip/Chip'

import './hiddenChipsBlock.scss'

const HiddenChipsBlock = ({ className, chips }) => {
  return (
    <div className="chip-block-hidden">
      {chips.map(element => {
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
