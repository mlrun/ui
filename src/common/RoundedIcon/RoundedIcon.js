import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import './roundedIcon.scss'

const RoundedIcon = React.forwardRef(
  ({ children, className, id, onClick, tooltipText }, ref) => {
    const wrapperClassNames = classNames('round-icon-cp', className)

    return (
      <div className={wrapperClassNames} ref={ref}>
        <Tooltip
          hidden={!tooltipText}
          template={<TextTooltipTemplate text={tooltipText} />}
        >
          <button onClick={onClick} id={id} className="round-icon-cp__icon">
            <i>{children}</i>
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
