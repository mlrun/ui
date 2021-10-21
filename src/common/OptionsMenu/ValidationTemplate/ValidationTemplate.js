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
      <i className={classes.validation__icon}>
        {valid ? (
          <Checkmark className={classes.valid__icon} />
        ) : (
          <Close className={classes.invalid__icon} />
        )}
      </i>
      <span>{validationMessage}</span>
    </li>
  )
}

ValidationTemplate.propTypes = {
  valid: PropTypes.bool.isRequired,
  validationMessage: PropTypes.string
}

export default ValidationTemplate
