import React from 'react'
import { Field, FormSpy } from 'react-final-form'

const FormDirtySpy = () => {
  return (
    <FormSpy subscription={{ dirtyFields: true }}>
      {({ dirtyFields }) =>
        // This keeps dirty fields mounted between pages.
        Object.keys(dirtyFields).map((name, idx) => (
          <Field key={idx} name={name} subscription={{}} render={() => null} />
        ))
      }
    </FormSpy>
  )
}

export default FormDirtySpy
