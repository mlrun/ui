import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import classes from './RoundedIcon.module.scss'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

const RoundedIcon = React.forwardRef(
  ({ onClick, className, children, tooltipText }, ref) => {
    const wrapperClassNames = classNames(classes.wrapper, className)
    return (
      <div className={wrapperClassNames} ref={ref}>
        <Tooltip
          hidden={tooltipText === ''}
          template={<TextTooltipTemplate text={tooltipText} />}
        >
          <button onClick={onClick}>{children}</button>
        </Tooltip>
      </div>
    )
  }
)

RoundedIcon.defaultProps = {
  tooltipText: ''
}

RoundedIcon.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  tooltipText: PropTypes.string
}

export default React.memo(RoundedIcon)
