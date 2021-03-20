import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import './button.scss'

const Button = ({ className, label, tooltip, variant, ...restProps }) => {
  const buttonClassName = classNames('btn', `btn-${variant}`, className)

  return (
    <Tooltip
      template={<TextTooltipTemplate text={tooltip} />}
      hidden={!tooltip}
    >
      <button {...restProps} className={buttonClassName}>
        {label}
      </button>
    </Tooltip>
  )
}

Button.defaultProps = {
  className: '',
  label: 'Button',
  tooltip: '',
  variant: 'tertiary'
}

Button.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  tooltip: PropTypes.string,
  variant: PropTypes.PropTypes.oneOf([
    'primary',
    'secondary',
    'tertiary',
    'danger',
    'label'
  ]).isRequired
}

export default Button
