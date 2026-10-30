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

import React, { useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

import createTextMaskInputElement from './core/createTextMaskInputElement'

const MaskedInput = ({
  mask,
  guide,
  value,
  pipe,
  placeholderChar,
  keepCharPositions,
  showMask,
  onBlur,
  onChange,
  ref,
  ...rest
}) => {
  const localRef = useRef(null)
  const textMaskRef = useRef(null)

  const setInputRef = el => {
    localRef.current = el
    if (typeof ref === 'function') {
      ref(el)
    } else if (ref) {
      ref.current = el
    }
  }

  const initTextMask = useCallback(() => {
    if (!localRef.current) return

    textMaskRef.current = createTextMaskInputElement({
      inputElement: localRef.current,
      mask,
      guide,
      pipe,
      placeholderChar,
      keepCharPositions,
      showMask
    })

    textMaskRef.current.update(value)
  }, [mask, guide, pipe, placeholderChar, keepCharPositions, showMask, value])

  useEffect(() => {
    initTextMask()
  }, [initTextMask])

  const handleChange = event => {
    textMaskRef.current?.update()
    if (onChange) {
      onChange(event)
    }
  }

  const handleBlur = event => {
    if (onBlur) {
      onBlur(event)
    }
  }

  return (
    <input
      ref={setInputRef}
      onBlur={handleBlur}
      onChange={handleChange}
      defaultValue={value}
      {...rest}
    />
  )
}

MaskedInput.displayName = 'MaskedInput'

MaskedInput.propTypes = {
  mask: PropTypes.any.isRequired,
  guide: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pipe: PropTypes.any,
  placeholderChar: PropTypes.string,
  keepCharPositions: PropTypes.bool,
  showMask: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func
}

export default MaskedInput
