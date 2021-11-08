import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import classes from './RoundedIcon.module.scss'

const RoundedIcon = React.forwardRef(
  ({ onClick, className, children, id, tooltipText }, ref) => {
    const wrapperClassNames = classNames(classes.roundIconWrapper, className)
    return (
      <div className={wrapperClassNames} ref={ref}>
        <Tooltip
          hidden={!tooltipText || tooltipText === ''}
          template={<TextTooltipTemplate text={tooltipText} />}
        >
          <button onClick={onClick} id={id}>
            {children}
          </button>
        </Tooltip>
      </div>
    )
  }
)

RoundedIcon.defaultProps = {
  className: '',
  id: '',
  onClick: () => {},
  tooltipText: ''
}

RoundedIcon.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
  tooltipText: PropTypes.string
}

export default React.memo(RoundedIcon)
