import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import classes from './RoundedIcon.module.scss'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

const RoundedIcon = ({ onClick, className, children, tooltipText }) => {
  const wrapperClassNames = classNames(classes.wrapper, className)
  return (
    <div className={wrapperClassNames}>
      <button onClick={onClick}>
        <Tooltip template={<TextTooltipTemplate text={tooltipText} />}>
          {children}
        </Tooltip>
      </button>
    </div>
  )
}

RoundedIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  tooltipText: PropTypes.string
}

export default RoundedIcon
