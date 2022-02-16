import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ReactComponent as Checkmark } from '../../../images/success_done.svg'
import { ReactComponent as Close } from '../../../images/close.svg'

import './ValidationTemplate.scss'

const ValidationTemplate = ({ valid, validationMessage }) => {
  return (
    <li className={classnames('validation-option', valid && 'text-muted')}>
      <i className="validation-option__icon">
        {valid ? (
          <Checkmark className="validation-option__icon_valid" />
        ) : (
          <Close className="validation-option__icon_invalid" />
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
