import React, { useEffect, useState } from 'react'
import { Field, FormSpy } from 'react-final-form'

const FormDirtySpy = () => {
  const [dirtyFieldsList, setDirtyFieldsList] = useState({})
  const [modifiedFieldsList, setModifiedFieldsList] = useState({})

  useEffect(() => {
    return () => {
      setDirtyFieldsList({})
      setModifiedFieldsList({})
    }
  }, [])

  return (
    // This keeps dirty fields mounted between pages.
    <>
      <FormSpy
        subscription={{ dirtyFields: true, modified: true }}
        onChange={({ dirtyFields, modified }) => {
          setTimeout(() => {
            setDirtyFieldsList(dirtyFields)
            setModifiedFieldsList(modified)
          })
        }}
      />
      <>
        {Object.keys(dirtyFieldsList)
          .filter(field => modifiedFieldsList[field])
          .map((name, idx) => {
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
