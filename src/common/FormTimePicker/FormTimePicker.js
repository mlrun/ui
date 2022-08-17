import React from 'react'
import { Field } from 'react-final-form'
import PropTypes from 'prop-types'

import TimePicker from '../TimePicker/TimePicker'

const FormTimePicker = ({ className, label, name }) => {
  return (
    <Field name={name}>
      {({ input }) => (
        <TimePicker
          className={className}
          label={label}
          onBlur={input.onBlur}
          onChange={input.onChange}
          onFocus={input.onFocus}
          value={input.value}
        />
      )}
    </Field>
  )
}

FormTimePicker.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired
}

export default FormTimePicker
