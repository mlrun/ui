import React from 'react'
import PropTypes from 'prop-types'
import { Field, useField } from 'react-final-form'

const NewChipInput = React.forwardRef(({ name, onChange, onFocus, ...inputProps }, ref) => {
  const { input } = useField(name)

  const handleInputChange = (event) => {
    input.onChange(event)
    onChange && onChange(event)
  }

  const handleInputFocus = event => {
    input.onFocus(event)
    onFocus && onFocus(event)
  }

  return (
    <Field name={name}>
      {({ input }) => (
        <input
          autoComplete="off"
          data-testid="input"
          ref={ref}
          type="text"
          id={input.name}
          {...{
            ...inputProps,
            ...input
          }}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
      )}
    </Field>
  )
})

NewChipInput.defaultProps = {}

NewChipInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired
}

export default NewChipInput
