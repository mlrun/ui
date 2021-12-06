import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ReactComponent as Checkmark } from '../../../images/success_done.svg'
import { ReactComponent as Close } from '../../../images/close.svg'

import classes from './ValidationTemplate.module.scss'

const ValidationTemplate = ({ valid, validationMessage }) => {
  return (
    <li
      className={classnames(classes.validation_option, valid && 'text-muted')}
    >
      <i className={classes.validation_option__icon}>
        {valid ? (
          <Checkmark className={classes.validation_option__icon_valid} />
        ) : (
          <Close className={classes.validation_option__icon_invalid} />
        )}
      </i>
      <span>{validationMessage}</span>
    </li>
  )
}

ValidationTemplate.propTypes = {
  valid: PropTypes.bool.isRequired,
  validationMessage: PropTypes.string.isRequired
}

export default ValidationTemplate
