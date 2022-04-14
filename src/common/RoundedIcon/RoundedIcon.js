import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import './roundedIcon.scss'

const RoundedIcon = React.forwardRef(
  (
    { children, className, disabled, id, isActive, onClick, tooltipText },
    ref
  ) => {
    const wrapperClassNames = classNames('round-icon-cp', className)
    const IconClassNames = classNames(
      'round-icon-cp__circle',
      isActive && 'round-icon-cp__circle-active'
    )

    return (
      <div className={wrapperClassNames} ref={ref}>
        <Tooltip
          hidden={!tooltipText}
          template={<TextTooltipTemplate text={tooltipText} />}
        >
          <button
            onClick={onClick}
            disabled={disabled}
            id={id}
            className={IconClassNames}
          >
            {children}
          </button>
        </Tooltip>
      </div>
    )
  }
)

RoundedIcon.defaultProps = {
  className: '',
  disabled: false,
  id: '',
  isActive: false,
  onClick: () => {},
  tooltipText: ''
}

RoundedIcon.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  tooltipText: PropTypes.string
}

export default React.memo(RoundedIcon)
