import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { BUTTON_VARIANTS } from '../../types'
import { TERTIARY_BUTTON } from '../../constants'

import './button.scss'

const Button = forwardRef(
  ({ children, className, label, tooltip, variant, ...restProps }, ref) => {
    const buttonClassName = classNames('btn', `btn-${variant}`, className)

    return (
      <Tooltip
        template={<TextTooltipTemplate text={tooltip} />}
        hidden={!tooltip}
      >
        <button {...restProps} className={buttonClassName} ref={ref}>
          {children || label}
        </button>
      </Tooltip>
    )
  }
)

Button.defaultProps = {
  className: '',
  label: 'Button',
  tooltip: '',
  variant: TERTIARY_BUTTON
}

Button.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  tooltip: PropTypes.string,
  variant: BUTTON_VARIANTS.isRequired
}

export default Button
