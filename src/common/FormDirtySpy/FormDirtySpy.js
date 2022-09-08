import React, { useEffect, useState } from 'react'
import { Field, FormSpy } from 'react-final-form'

const FormDirtySpy = () => {
  const [dirtyFieldsList, setDirtyFieldsList] = useState({})

  useEffect(() => {
    return () => {
      setDirtyFieldsList({})
    }
  }, [])

  return (
    // This keeps dirty fields mounted between pages.
    <>
      <FormSpy
        subscription={{ dirtyFields: true }}
        onChange={({ dirtyFields }) => {
          setTimeout(() => {
            setDirtyFieldsList(dirtyFields)
          })
        }}
      />
      <>
        {Object.keys(dirtyFieldsList).map((name, idx) => {
          return (
            <Field
              key={idx}
              name={name}
              subscription={{}}
              render={() => {
                return null
              }}
            />
          )
        })}
      </>
    </>
  )
}

export default FormDirtySpy
