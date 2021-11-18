import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import * as classes from './groupButton.module.scss'

const GroupButton = ({ children, className }) => {
  const wrapperClasses = classNames(classes['group-btn'], className)
  return <div className={wrapperClasses}>{children}</div>
}

GroupButton.propTypes = {
  className: PropTypes.string
}

export default GroupButton
