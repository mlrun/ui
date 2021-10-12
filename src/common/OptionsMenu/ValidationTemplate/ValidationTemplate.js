import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ReactComponent as Checkmark } from '../../../images/success_done.svg'
import { ReactComponent as Close } from '../../../images/close.svg'

import './validationTemplate.scss'

const ValidationTemplate = ({ valid, validationMessage }) => {
  return (
    <li className={classnames('validation-option', valid && 'text-muted')}>
      <i className="validation__icon">
        {valid ? (
          <Checkmark className="valid-icon" />
        ) : (
          <Close className="invalid-icon" />
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
