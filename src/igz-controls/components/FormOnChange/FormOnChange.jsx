/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useEffect, useState } from 'react'
import { Field } from 'react-final-form'
import PropTypes from 'prop-types'

const OnChangeState = ({ inputValue, handler }) => {
  const [previousValue, setPreviousValue] = useState(inputValue)

  useEffect(() => {
    if (inputValue !== previousValue) {
      setPreviousValue(inputValue)
      handler(inputValue, previousValue)
    }
  }, [handler, inputValue, previousValue])

  return null
}

OnChangeState.propTypes = {
  inputValue: PropTypes.any.isRequired,
  handler: PropTypes.func.isRequired
}

const FormOnChange = ({ handler, name }) => {
  return (
    <Field
      name={name}
      subscription={{
        value: true
      }}
      allowNull
      render={({ input }) => <OnChangeState inputValue={input.value} handler={handler} />}
    />
  )
}

FormOnChange.propTypes = {
  handler: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
}

export default FormOnChange
