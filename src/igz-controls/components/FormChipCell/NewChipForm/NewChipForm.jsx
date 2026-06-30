/*
Copyright 2022 Iguazio Systems Ltd.
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
import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  forwardRef
} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty, get, isNil, throttle } from 'lodash'

import NewChipInput from '../NewChipInput/NewChipInput'
import OptionsMenu from '../../../elements/OptionsMenu/OptionsMenu'
import ValidationTemplate from '../../../elements/ValidationTemplate/ValidationTemplate'

import { CHIP_OPTIONS } from '../../../types'
import { CLICK, TAB, TAB_SHIFT } from '../../../constants'
import { getTextWidth } from '../formChipCell.util'
import { getTransitionEndEventName } from '../../../utils/common.util'

import Close from '../../../images/close.svg?react'

import './newChipForm.scss'

const defaultProps = {
  rules: {}
}

let NewChipForm = (
  {
    chip,
    chipIndex,
    chipOptions,
    className = '',
    editConfig,
    handleRemoveChip,
    isDeletable,
    isEditable,
    keyName,
    meta,
    onChange,
    setChipSizeIsRecalculated,
    setEditConfig,
    validationRules: rules = defaultProps.rules,
    valueName
  },
  ref
) => {
  const [chipData, setChipData] = useState({
    isKeyOnly: chip.isKeyOnly,
    key: chip.key,
    value: chip.value,
    keyFieldWidth: 0,
    valueFieldWidth: 0
  })
  const [selectedInput, setSelectedInput] = useState('key')
  const [validationRules, setValidationRules] = useState(rules)
  const [showValidationRules, setShowValidationRules] = useState(false)

  const { background, borderColor, borderRadius, density, font } = chipOptions
  const minWidthInput = useMemo(() => {
    return isEditable ? 25 : 20
  }, [isEditable])
  const minWidthValueInput = useMemo(() => {
    return isEditable ? 35 : 20
  }, [isEditable])
  const transitionEndEventName = useMemo(() => getTransitionEndEventName(), [])

  const refInputKey = React.useRef({})
  const refInputValue = React.useRef({})
  const refInputContainer = React.useRef()
  const validationRulesRef = React.useRef()

  const labelKeyClassName = classnames(
    className,
    !editConfig.isKeyFocused && 'item_edited',
    !isEmpty(get(meta, ['error', chipIndex, 'key'], [])) &&
      !isEmpty(chipData.key) &&
      !chip.disabled &&
      isEditable &&
      'item_edited_invalid'
  )
  const labelContainerClassName = classnames(
    'edit-chip-container',
    background && `edit-chip-container-background_${background}`,
    borderColor && `edit-chip-container-border_${borderColor}`,
    font && `edit-chip-container-font_${font}`,
    density && `edit-chip-container-density_${density}`,
    borderRadius && `edit-chip-container-border_${borderRadius}`,
    (editConfig.isEdit || editConfig.isNewChip) && 'edit-chip-container_edited',
    isEditable && chip.disabled && 'edit-chip-container_disabled edit-chip-container-font_disabled'
  )
  const labelValueClassName = classnames(
    'input-label-value',
    !editConfig.isValueFocused && 'item_edited',
    !isEmpty(get(meta, ['error', chipIndex, 'value'], [])) &&
      !isEmpty(chipData.value) &&
      isEditable &&
      'item_edited_invalid'
  )

  const closeButtonClass = classnames(
    'item-icon-close',
    !chip.disabled &&
      ((editConfig.chipIndex === chipIndex && isEditable) || (!isDeletable && !isEditable)) &&
      'item-icon-close invisible',
    !isEditable && !isDeletable && 'item-icon-close hidden'
  )

  const resizeChip = useCallback(() => {
    if (refInputKey.current) {
      const currentWidthKeyInput = getTextWidth(refInputKey.current) + 1
      const currentWidthValueInput = getTextWidth(refInputValue.current) + 1
      const maxWidthInput = ref.current?.clientWidth - 50
      const keyEllipsis = currentWidthKeyInput >= maxWidthInput / 2
      const valueEllipsis = currentWidthValueInput >= maxWidthInput / 2
      let keyFieldWidth = null
      let valueFieldWidth = null

      if (keyEllipsis && valueEllipsis) {
        keyFieldWidth = valueFieldWidth = maxWidthInput / 2
      } else if (keyEllipsis) {
        valueFieldWidth = !chipData.value ? minWidthValueInput : currentWidthValueInput

        const remainingPlace = maxWidthInput - valueFieldWidth

        keyFieldWidth =
          remainingPlace > currentWidthKeyInput ? currentWidthKeyInput : remainingPlace
      } else if (valueEllipsis) {
        keyFieldWidth = !chipData.key ? minWidthInput : currentWidthKeyInput

        const remainingPlace = maxWidthInput - keyFieldWidth

        valueFieldWidth =
          remainingPlace > currentWidthValueInput ? currentWidthValueInput : remainingPlace
      } else {
        keyFieldWidth =
          !chipData.key || currentWidthKeyInput <= minWidthInput
            ? minWidthInput
            : currentWidthKeyInput
        valueFieldWidth =
          !chipData.value || currentWidthValueInput <= minWidthValueInput
            ? minWidthValueInput
            : currentWidthValueInput
      }

      refInputKey.current.style.width = `${keyFieldWidth}px`

      if (!isEmpty(refInputValue.current)) {
        refInputValue.current.style.width = `${valueFieldWidth}px`
      }

      setChipData(prevState => ({
        ...prevState,
        keyFieldWidth,
        valueFieldWidth
      }))
      setChipSizeIsRecalculated(true)
    }
  }, [
    chipData.key,
    chipData.value,
    minWidthInput,
    minWidthValueInput,
    ref,
    setChipSizeIsRecalculated
  ])

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const observer = new ResizeObserver(resizeChip)

    observer.observe(element)

    return () => observer.unobserve(element)
  }, [ref, resizeChip])

  useEffect(() => {
    const resizeChipDebounced = throttle(resizeChip, 500)

    if (isEditable) {
      window.addEventListener('resize', resizeChipDebounced)
      window.addEventListener(transitionEndEventName, resizeChipDebounced)

      return () => {
        window.removeEventListener('resize', resizeChipDebounced)
        window.removeEventListener(transitionEndEventName, resizeChipDebounced)
      }
    }
  }, [isEditable, resizeChip, transitionEndEventName])

  useLayoutEffect(() => {
    if (!chipData.keyFieldWidth && !chipData.valueFieldWidth) {
      resizeChip()
    }
  }, [chipData.keyFieldWidth, chipData.valueFieldWidth, resizeChip])

  const outsideClick = useCallback(
    (event, forceOutsideClick) => {
      if (editConfig.chipIndex === chipIndex) {
        const elementPath = event.path ?? event.composedPath?.()

        if (!elementPath.includes(refInputContainer.current) || forceOutsideClick) {
          onChange(event, CLICK, true)
          window.getSelection().removeAllRanges()
          document.activeElement.blur()
        } else {
          event.stopPropagation()
        }
      }
    },
    [onChange, refInputContainer, chipIndex, editConfig.chipIndex]
  )

  const handleScroll = useCallback(
    event => {
      if (validationRulesRef?.current && !validationRulesRef.current.contains(event.target)) {
        setShowValidationRules(false)
        outsideClick(event, true)
      }
    },
    [outsideClick]
  )

  useEffect(() => {
    if (showValidationRules) {
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [handleScroll, showValidationRules])

  useEffect(() => {
    if (editConfig.chipIndex === chipIndex) {
      if (editConfig.isKeyFocused) {
        refInputKey.current.focus()
      } else if (editConfig.isValueFocused) {
        refInputValue.current.focus()
      }
    }
  }, [
    editConfig.isKeyFocused,
    editConfig.isValueFocused,
    refInputKey,
    refInputValue,
    chipIndex,
    editConfig.chipIndex
  ])

  useEffect(() => {
    if (showValidationRules) {
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [handleScroll, showValidationRules])

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
      if (editConfig.chipIndex === chipIndex && isEditable) {
        if (!event.shiftKey && event.key === TAB && editConfig.isValueFocused) {
          return onChange(event, TAB)
        } else if (event.shiftKey && event.key === TAB && editConfig.isKeyFocused) {
          return onChange(event, TAB_SHIFT)
        }
      }
      event.stopPropagation()
    },
    [editConfig, onChange, chipIndex, isEditable]
  )

  const handleOnFocus = useCallback(
    event => {
      const isKeyFocused = event.target.name === keyName

      if (editConfig.chipIndex === chipIndex) {
        if (isKeyFocused) {
          refInputKey.current.selectionStart = refInputKey.current.selectionEnd

          setEditConfig(prevConfig => ({
            ...prevConfig,
            isKeyFocused: true,
            isValueFocused: false
          }))
        } else {
          refInputValue.current.selectionStart = refInputValue.current.selectionEnd

          setEditConfig(prevConfig => ({
            ...prevConfig,
            isKeyFocused: false,
            isValueFocused: true
          }))
        }

        event && event.stopPropagation()
      } else if (isNil(editConfig.chipIndex)) {
        if (isKeyFocused) {
          refInputKey.current.selectionStart = refInputKey.current.selectionEnd
        } else {
          refInputValue.current.selectionStart = refInputValue.current.selectionEnd
        }
        setEditConfig({
          chipIndex,
          isEdit: true,
          isKeyFocused: isKeyFocused,
          isValueFocused: !isKeyFocused
        })
      }
    },
    [keyName, refInputKey, refInputValue, setEditConfig, editConfig.chipIndex, chipIndex]
  )

  const handleOnChange = useCallback(
    event => {
      const maxWidthInput = ref.current?.clientWidth - 50

      event.preventDefault()

      if (event.target.name === keyName) {
        const currentWidthKeyInput = getTextWidth(refInputKey.current)

        setChipData(prevState => ({
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
        const currentWidthValueInput = getTextWidth(refInputValue.current)

        setChipData(prevState => ({
          ...prevState,
          value: refInputValue.current.value,
          valueFieldWidth:
            refInputValue.current.value?.length <= 1
              ? minWidthValueInput
              : currentWidthValueInput >= maxWidthInput
                ? maxWidthInput
                : currentWidthValueInput > minWidthValueInput
                  ? currentWidthValueInput + 2
                  : minWidthValueInput
        }))
      }
    },
    [keyName, minWidthInput, ref, minWidthValueInput]
  )

  useLayoutEffect(() => {
    if (editConfig.chipIndex === chipIndex) {
      setSelectedInput(editConfig.isKeyFocused ? 'key' : editConfig.isValueFocused ? 'value' : null)
    }
  }, [editConfig.isKeyFocused, editConfig.isValueFocused, editConfig.chipIndex, chipIndex])

  useEffect(() => {
    if (meta.valid && showValidationRules) {
      setShowValidationRules(false)
    }
  }, [meta.valid, showValidationRules])

  useEffect(() => {
    if (meta.error) {
      setValidationRules(prevState => {
        return {
          ...prevState,
          [selectedInput]: prevState[selectedInput]?.map(rule => {
            return {
              ...rule,
              isValid: isEmpty(get(meta, ['error', editConfig.chipIndex, selectedInput], []))
                ? true
                : !meta.error[editConfig.chipIndex][selectedInput].some(
                    err => err && err.name === rule.name
                  )
            }
          })
        }
      })

      !showValidationRules && setShowValidationRules(true)
    }
  }, [meta, showValidationRules, selectedInput, editConfig.chipIndex])

  const getValidationRules = useCallback(() => {
    return validationRules[selectedInput]?.map(({ isValid = false, label, name }) => {
      return <ValidationTemplate valid={isValid} validationMessage={label} key={name} />
    })
  }, [selectedInput, validationRules])

  return (
    <div
      className={labelContainerClassName}
      onKeyDown={event => !chip.disabled && editConfig.isEdit && focusChip(event)}
      ref={refInputContainer}
    >
      <NewChipInput
        className={labelKeyClassName}
        disabled={
          chip.disabled ||
          !isEditable ||
          (!isNil(editConfig.chipIndex) && editConfig.chipIndex !== chipIndex)
        }
        name={keyName}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        placeholder={isEditable ? 'key' : ''}
        ref={refInputKey}
        style={{ width: chipData.keyFieldWidth }}
      />
      {!chipData.isKeyOnly && <div className="edit-chip-separator">:</div>}
      {!chipData.isKeyOnly && (
        <NewChipInput
          className={labelValueClassName}
          disabled={
            chip.disabled ||
            !isEditable ||
            (!isNil(editConfig.chipIndex) && editConfig.chipIndex !== chipIndex)
          }
          name={valueName}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          placeholder={isEditable ? 'value' : ''}
          ref={refInputValue}
          style={{ width: chipData.valueFieldWidth }}
        />
      )}

      <button
        disabled={chip.disabled}
        className={closeButtonClass}
        onClick={event => !chip.disabled && handleRemoveChip(event, chipIndex)}
      >
        <Close />
      </button>

      {!chip.disabled &&
        (editConfig.isKeyFocused ? !isEmpty(chipData.key) : !isEmpty(chipData.value)) &&
        editConfig.chipIndex === chipIndex &&
        !isEmpty(get(meta, ['error', editConfig.chipIndex, selectedInput], [])) && (
          <OptionsMenu show={showValidationRules} ref={{ refInputContainer, validationRulesRef }}>
            {getValidationRules()}
          </OptionsMenu>
        )}
    </div>
  )
}

NewChipForm = forwardRef(NewChipForm)

NewChipForm.displayName = 'NewChipForm'

NewChipForm.propTypes = {
  chip: PropTypes.object.isRequired,
  chipIndex: PropTypes.number.isRequired,
  chipOptions: CHIP_OPTIONS.isRequired,
  className: PropTypes.string,
  editConfig: PropTypes.object.isRequired,
  handleRemoveChip: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool.isRequired,
  isEditable: PropTypes.bool.isRequired,
  keyName: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  setChipSizeIsRecalculated: PropTypes.func.isRequired,
  setEditConfig: PropTypes.func.isRequired,
  validationRules: PropTypes.object,
  valueName: PropTypes.string.isRequired
}

export default NewChipForm
