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
import React, { useState, useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

import { OptionsMenu, ValidationTemplate } from 'igz-controls/elements'

import { TAB, TAB_SHIFT } from 'igz-controls/constants'
import { CHIP_OPTIONS } from '../../types'

import './chipForm.scss'

const ChipForm = React.forwardRef(
  (
    {
      checkValidation = null,
      chipOptions,
      className,
      editConfig,
      onChange,
      setEditConfig,
      value,
      validationRules = []
    },
    ref
  ) => {
    const [chip, setChip] = useState({
      ...value,
      keyFieldWidth: 0,
      valueFieldWidth: 0
    })
    const maxWidthInput = useMemo(() => {
      return ref.current?.clientWidth - 50
    }, [ref])
    const { background, borderColor, density, font, borderRadius } = chipOptions
    const minWidthInput = 25
    const minWidthValueInput = 35

    const refInputKey = React.createRef()
    const refInputValue = React.createRef()
    const refInputContainer = React.createRef()

    const labelKeyClassName = classnames(
      className,
      !editConfig.isKeyFocused && 'item_edited',
      !isEmpty(validationRules) && 'item_edited_invalid'
    )
    const labelContainerClassName = classnames(
      'edit-chip-container',
      background && `edit-chip-container-background_${background}`,
      borderColor && `edit-chip-container-border_${borderColor}`,
      font && `edit-chip-container-font_${font}`,
      density && `edit-chip-container-density_${density}`,
      borderRadius && `edit-chip-container-border_${borderRadius}`,
      (editConfig.isEdit || editConfig.isNewChip) && 'edit-chip-container_edited'
    )
    const labelValueClassName = classnames(
      'input-label-value',
      !editConfig.isValueFocused && 'item_edited'
    )

    useLayoutEffect(() => {
      if (!chip.keyFieldWidth && !chip.valueFieldWidth) {
        const currentWidthKeyInput = refInputKey.current.scrollWidth + 1
        const currentWidthValueInput = refInputValue.current.scrollWidth + 1

        if (chip.key && chip.value) {
          setChip(prevState => ({
            ...prevState,
            keyFieldWidth:
              currentWidthKeyInput >= maxWidthInput ? maxWidthInput : currentWidthKeyInput,
            valueFieldWidth:
              currentWidthValueInput >= maxWidthInput ? maxWidthInput : currentWidthValueInput
          }))
        } else {
          setChip(prevState => ({
            ...prevState,
            keyFieldWidth: minWidthInput,
            valueFieldWidth: minWidthValueInput
          }))
        }
      }
    }, [
      chip.key,
      chip.keyFieldWidth,
      chip.value,
      chip.valueFieldWidth,
      maxWidthInput,
      refInputKey,
      refInputValue
    ])

    useEffect(() => {
      if (editConfig.isKeyFocused) {
        refInputKey.current.focus()
      } else if (editConfig.isValueFocused) {
        refInputValue.current.focus()
      }
    }, [editConfig.isKeyFocused, editConfig.isValueFocused, refInputKey, refInputValue])

    const outsideClick = useCallback(
      event => {
        event.stopPropagation()
        const elementPath = event.path ?? event.composedPath?.()

        if (!elementPath.includes(refInputContainer.current)) {
          onChange(event, chip, 'Click')
        }
      },
      [chip, onChange, refInputContainer]
    )

    useEffect(() => {
      if (editConfig.isEdit) {
        document.addEventListener('click', outsideClick, true)

        return () => {
          document.removeEventListener('click', outsideClick, true)
        }
      }
    }, [outsideClick, editConfig.isEdit])

    const focusChip = useCallback(
      event => {
        event.stopPropagation()

        if (!event.shiftKey && event.key === TAB && editConfig.isValueFocused) {
          onChange(event, chip, TAB)
        } else if (event.shiftKey && event.key === TAB && editConfig.isKeyFocused) {
          onChange(event, chip, TAB_SHIFT)
        }

        if (event.key === 'Backspace' || event.key === 'Delete') {
          setChip(prevState => ({
            ...prevState,
            keyFieldWidth: editConfig.isKeyFocused ? minWidthInput : prevState.keyFieldWidth,
            valueFieldWidth: editConfig.isValueFocused
              ? minWidthValueInput
              : prevState.valueFieldWidth
          }))
        }
      },
      [editConfig, onChange, chip]
    )

    const handleOnFocus = useCallback(
      event => {
        if (event.target.name === 'key') {
          refInputKey.current.selectionStart = refInputKey.current.selectionEnd

          setEditConfig(prevState => ({
            ...prevState,
            isKeyFocused: true,
            isValueFocused: false
          }))
        } else {
          refInputValue.current.selectionStart = refInputValue.current.selectionEnd

          setEditConfig(prevState => ({
            ...prevState,
            isKeyFocused: false,
            isValueFocused: true
          }))
        }
      },
      [refInputKey, refInputValue, setEditConfig]
    )

    const handleOnChange = useCallback(
      event => {
        event.preventDefault()

        if (event.target.name === 'key') {
          const currentWidthKeyInput = refInputKey.current.scrollWidth
          checkValidation && checkValidation(refInputKey.current.value)

          setChip(prevState => ({
            ...prevState,
            key: refInputKey.current.value,
            keyFieldWidth:
              refInputKey.current.value.length <= 1
                ? minWidthInput
                : currentWidthKeyInput >= maxWidthInput
                  ? maxWidthInput
                  : currentWidthKeyInput > minWidthInput
                    ? currentWidthKeyInput + 2
                    : minWidthInput
          }))
        } else {
          const currentWidthValueInput = refInputValue.current.scrollWidth

          setChip(prevState => ({
            ...prevState,
            value: refInputValue.current.value,
            valueFieldWidth:
              refInputValue.current.value.length <= 1
                ? minWidthValueInput
                : currentWidthValueInput >= maxWidthInput
                  ? maxWidthInput
                  : currentWidthValueInput > minWidthValueInput
                    ? currentWidthValueInput + 2
                    : minWidthValueInput
          }))
        }
      },
      [checkValidation, maxWidthInput, refInputKey, refInputValue]
    )

    const getValidationRules = useCallback(() => {
      return validationRules.map(({ isValid = false, label, name }) => {
        return <ValidationTemplate valid={isValid} validationMessage={label} key={name} />
      })
    }, [validationRules])

    return (
      <>
        <div
          ref={refInputContainer}
          className={labelContainerClassName}
          onKeyDown={event => editConfig.isEdit && focusChip(event)}
        >
          <input
            autoComplete="off"
            className={labelKeyClassName}
            name="key"
            style={{ width: chip.keyFieldWidth }}
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            placeholder="key"
            ref={refInputKey}
            type="text"
            value={chip.key}
          />
          <div className="edit-chip-separator">:</div>
          <input
            autoComplete="off"
            className={labelValueClassName}
            name="value"
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            placeholder="value"
            ref={refInputValue}
            style={{ width: chip.valueFieldWidth }}
            type="text"
            value={chip.value}
          />
        </div>
        {validationRules.length > 0 && (
          <OptionsMenu show={validationRules.length > 0} ref={refInputContainer}>
            {getValidationRules()}
          </OptionsMenu>
        )}
      </>
    )
  }
)

ChipForm.propTypes = {
  checkValidation: PropTypes.func,
  chipOptions: CHIP_OPTIONS.isRequired,
  editConfig: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  setEditConfig: PropTypes.func.isRequired,
  validationRules: PropTypes.array
}

export default ChipForm
