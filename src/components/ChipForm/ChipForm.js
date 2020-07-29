import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './chipForm.scss'

const ChipForm = ({
  className,
  editConfig,
  value,
  onChange,
  setEditConfig
}) => {
  const [chip, setChip] = useState({
    ...value,
    keyFieldWidth: 0,
    valueFieldWidth: 0
  })
  const minWidthInput = 25
  const minWidthValueInput = 40
  const maxWidthInput = 250

  const refInputKey = React.createRef()
  const refInputValue = React.createRef()
  const refInputContainer = React.createRef()

  const labelKeyClassName = classnames(
    className,
    !editConfig.isKeyFocused && 'job-labels__item_edited'
  )
  const labelContainerClassName = classnames(
    'edit-label-container',
    (editConfig.isEdit || editConfig.isNewChip) && 'edit-label-container_edited'
  )
  const labelValueClassName = classnames(
    classnames(
      'input-label-value',
      !editConfig.isValueFocused && 'job-labels__item_edited'
    )
  )

  useLayoutEffect(() => {
    if (!chip.keyFieldWidth && !chip.valueFieldWidth) {
      const currentWidthKeyInput = refInputKey.current.scrollWidth
      const currentWidthValueInput = refInputValue.current.scrollWidth

      if (chip.key && chip.value) {
        setChip(prevState => ({
          ...prevState,
          keyFieldWidth:
            currentWidthKeyInput >= maxWidthInput
              ? maxWidthInput
              : currentWidthKeyInput,
          valueFieldWidth:
            currentWidthValueInput >= maxWidthInput
              ? maxWidthInput
              : currentWidthValueInput
        }))
      } else {
        setChip(prevState => ({
          ...prevState,
          keyFieldWidth: minWidthInput,
          valueFieldWidth: minWidthValueInput
        }))
      }
    }
  }, [refInputKey, refInputValue, setChip, chip])

  useEffect(() => {
    if (editConfig.isKeyFocused) {
      refInputKey.current.focus()
    } else if (editConfig.isValueFocused) {
      refInputValue.current.focus()
    }
  }, [
    editConfig.isKeyFocused,
    editConfig.isValueFocused,
    refInputKey,
    refInputValue
  ])

  const outsideClick = useCallback(
    event => {
      event.stopPropagation()

      if (!event.path.includes(refInputContainer.current)) {
        onChange(chip, 'Click')
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

      if (!event.shiftKey && event.key === 'Tab' && editConfig.isValueFocused) {
        onChange(chip, 'Tab')
      } else if (
        event.shiftKey &&
        event.key === 'Tab' &&
        editConfig.isKeyFocused
      ) {
        onChange(chip, 'Tab+Shift')
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        setChip(prevState => ({
          ...prevState,
          keyFieldWidth: editConfig.isKeyFocused
            ? minWidthInput
            : prevState.keyFieldWidth,
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
        refInputValue.current.selectionStart =
          refInputValue.current.selectionEnd

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
    [refInputKey, refInputValue]
  )

  return (
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
      <div className="edit-label-separator">:</div>
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
  )
}

ChipForm.defaultProps = {
  label: {
    key: '',
    value: ''
  }
}

ChipForm.propTypes = {
  editConfig: PropTypes.shape({}).isRequired,
  label: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  setEditConfig: PropTypes.func.isRequired
}

export default ChipForm
