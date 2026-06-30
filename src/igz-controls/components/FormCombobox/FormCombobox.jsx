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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Field, useField } from 'react-final-form'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import OptionsMenu from '../../elements/OptionsMenu/OptionsMenu'
import ValidationTemplate from '../../elements/ValidationTemplate/ValidationTemplate'
import PopUpDialog from '../PopUpDialog/PopUpDialog'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../Tooltip/Tooltip'

import { checkPatternsValidity } from '../../utils/validation.util'
import { useDetectOutsideClick } from '../../hooks'
import { COMBOBOX_SELECT_OPTIONS, COMBOBOX_SUGGESTION_LIST, DENSITY } from '../../types'

import Arrow from '../../images/arrow.svg?react'
import SearchIcon from '../../images/search.svg?react'
import WarningIcon from '../../images/warning.svg?react'
import ExclamationMarkIcon from '../../images/exclamation-mark.svg?react'

import './formCombobox.scss'

const FormCombobox = ({
  comboboxClassName = '',
  density = 'normal',
  disabled = false,
  hideSearchInput = false,
  inputDefaultValue = '',
  inputPlaceholder = '',
  invalidText = 'Invalid',
  label = '',
  maxSuggestedMatches = 1,
  name,
  onBlur = null,
  onChange = null,
  onFocus = null,
  required = false,
  rules = [],
  selectDefaultValue = {
    label: '',
    id: '',
    className: ''
  },
  selectOptions,
  selectPlaceholder = '',
  suggestionList = [],
  validator = null,
  withoutBorder = false
}) => {
  const { input, meta } = useField(name)
  const [inputValue, setInputValue] = useState(inputDefaultValue)
  const [selectValue, setSelectValue] = useState(selectDefaultValue)
  const [dropdownStyle, setDropdownStyle] = useState({
    left: '0px'
  })
  const [showSelectDropdown, setShowSelectDropdown] = useState(false)
  const [showSuggestionList, setShowSuggestionList] = useState(false)
  const [dropdownList, setDropdownList] = useState(suggestionList)
  const [searchIsFocused, setSearchIsFocused] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [validationRules, setValidationRules] = useState(rules)
  const [showValidationRules, setShowValidationRules] = useState(false)
  const comboboxRef = useRef()
  const selectRef = useRef()
  const inputRef = useRef()
  const suggestionListRef = useRef()
  useDetectOutsideClick(comboboxRef, () => setShowValidationRules(false))

  const labelClassNames = classnames('form-field__label', disabled && 'form-field__label-disabled')
  const inputClassNames = classnames(
    'form-field-combobox__input',
    selectValue.id.length === 0 && 'form-field-combobox__input_hidden'
  )

  useEffect(() => {
    setValidationRules(prevState =>
      prevState.map(rule => ({
        ...rule,
        isValid:
          !meta.error || !Array.isArray(meta.error)
            ? true
            : !meta.error.some(err => err.name === rule.name)
      }))
    )
  }, [meta.error])

  useEffect(() => {
    if (!searchIsFocused) {
      if (JSON.stringify(dropdownList) !== JSON.stringify(suggestionList)) {
        setDropdownList(suggestionList)
      }
    }
  }, [dropdownList, suggestionList, searchIsFocused])

  useEffect(() => {
    setIsInvalid(
      meta.invalid && (meta.validating || meta.modified || (meta.submitFailed && meta.touched))
    )
  }, [meta.invalid, meta.modified, meta.submitFailed, meta.touched, meta.validating])

  const handleOutsideClick = useCallback(
    event => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target) &&
        suggestionListRef.current &&
        !suggestionListRef.current.contains(event.target)
      ) {
        setSearchIsFocused(false)
        setShowSelectDropdown(false)
        setShowSuggestionList(false)
        input.onBlur(new Event('blur'))
        onBlur && onBlur(input.value)
      }
    },
    [input, onBlur]
  )

  const handleScroll = event => {
    if (comboboxRef.current && comboboxRef.current.contains(event.target)) return

    if (
      !event.target.closest('.pop-up-dialog') &&
      !event.target.classList.contains('form-field-combobox')
    ) {
      setShowValidationRules(false)
      setShowSelectDropdown(false)
      setShowSuggestionList(false)
      inputRef.current.blur()
    }
  }

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick)

    return () => {
      window.removeEventListener('click', handleOutsideClick)
    }
  }, [handleOutsideClick])

  useEffect(() => {
    if (showValidationRules || showSelectDropdown || showSuggestionList) {
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [showSelectDropdown, showSuggestionList, showValidationRules])

  const getValidationRules = () => {
    return validationRules.map(({ isValid = false, label, name }) => {
      return <ValidationTemplate valid={isValid} validationMessage={label} key={name} />
    })
  }

  const handleInputChange = event => {
    const target = event.target

    setDropdownStyle({
      left: `${target.selectionStart < 30 ? target.selectionStart : 30}ch`
    })

    if (searchIsFocused) {
      setSearchIsFocused(false)
    }

    setInputValue(target.value)
    input.onChange(`${selectValue.id}${target.value}`)
    onChange && onChange(selectValue.id, target.value)

    if (dropdownList.length > 0) {
      setShowSuggestionList(true)
    }
  }

  const handleSelectOptionClick = selectedOption => {
    if (selectedOption.id !== selectValue.id) {
      setSelectValue(selectedOption)
      input.onChange(selectedOption.id)
      setInputValue('')
      onChange && onChange(selectedOption.id)
      setShowSelectDropdown(false)
      inputRef.current.disabled = false
      inputRef.current.focus()
    } else {
      setShowSelectDropdown(false)
      inputRef.current.disabled = false
      inputRef.current.focus()
    }
  }

  const handleSuggestionListOptionClick = option => {
    const inputValueItems = inputValue.split('/')
    const valueIndex = inputValueItems.length - 1
    let formattedValue = option.customDelimiter
      ? inputValueItems[valueIndex].replace(new RegExp(`${option.customDelimiter}.*`), '') +
        option.id
      : option.id

    if (inputValueItems.length <= maxSuggestedMatches - 1) formattedValue += '/'

    inputValueItems[valueIndex] = formattedValue

    if (searchIsFocused) {
      setSearchIsFocused(false)
    }

    if (inputValueItems.join('/') !== inputValue) {
      setInputValue(inputValueItems.join('/'))
      input.onChange(`${selectValue.id}${inputValueItems.join('/')}`)
      onChange && onChange(selectValue.id, inputValueItems.join('/'))
    }

    setShowSuggestionList(false)
    inputRef.current.focus()
    setDropdownStyle({
      left: `${inputRef.current.selectionStart < 30 ? inputRef.current.selectionStart : 30}ch`
    })
  }

  const inputOnFocus = event => {
    onFocus && onFocus()
    input.onFocus(new Event('focus'))

    if (showSelectDropdown) {
      setShowSelectDropdown(false)
    }

    // browser need some time to calculate cursor position after onFocus fired
    if (!inputRef.current.selectionStart) {
      setTimeout(() => {
        setDropdownStyle({
          left: `${event.target.selectionStart < 30 ? event.target.selectionStart : 30}ch`
        })
        setShowSuggestionList(true)
      })
    } else {
      setShowSuggestionList(true)
    }
  }

  const suggestionListSearchChange = event => {
    event.persist()
    setDropdownList(() =>
      suggestionList.filter(option => {
        return option.id.startsWith(event.target.value)
      })
    )
  }

  const toggleSelect = useCallback(() => {
    if (showSelectDropdown) {
      setShowSelectDropdown(false)
      input.onBlur(new Event('blur'))
      onBlur && onBlur(input.value)
    } else {
      setShowSuggestionList(false)
      setShowValidationRules(false)
      setDropdownStyle({
        left: '0px'
      })
      setShowSelectDropdown(true)
      input.onFocus(new Event('focus'))
      onFocus && onFocus(input.value)
    }
  }, [input, onBlur, onFocus, showSelectDropdown])

  const validateField = (value = '', allValues) => {
    const valueToValidate = value.startsWith(selectValue.id)
      ? value.substring(selectValue.id.length)
      : (value ?? '')
    let validationError = null

    if (!isEmpty(validationRules)) {
      const [newRules, isValidField] = checkPatternsValidity(rules, valueToValidate)
      const invalidRules = newRules.filter(rule => !rule.isValid)

      if (!isValidField) {
        validationError = invalidRules.map(rule => ({ name: rule.name, label: rule.label }))
      }
    }

    if (isEmpty(validationError)) {
      if (valueToValidate.startsWith(' ')) {
        validationError = { name: 'empty', label: invalidText }
      } else if (required && valueToValidate.trim().length === 0) {
        validationError = { name: 'required', label: 'This field is required' }
      }
    }

    if (!validationError && validator) {
      validationError = validator(value, allValues)
    }

    return validationError
  }

  const warningIconClick = () => {
    setShowValidationRules(state => !state)
    setShowSelectDropdown(false)
  }

  const comboboxClassNames = classnames(
    comboboxClassName,
    'form-field-combobox',
    'form-field',
    isInvalid && 'form-field-combobox_invalid'
  )
  const iconClassNames = classnames(
    showSelectDropdown && 'form-field-combobox__icon_open',
    'form-field-combobox__icon'
  )
  const selectValueClassNames = classnames(selectValue.className)

  const wrapperClassNames = classnames(
    'form-field__wrapper',
    `form-field__wrapper-${density}`,
    disabled && 'form-field__wrapper-disabled',
    isInvalid && 'form-field__wrapper-invalid',
    withoutBorder && 'without-border'
  )

  return (
    <Field name={name} validate={validateField}>
      {({ input, meta }) => (
        <div
          className={comboboxClassNames}
          ref={comboboxRef}
          data-testid={name ? `${name}-form-combobox` : 'form-combobox'}
        >
          {label && (
            <div className={labelClassNames}>
              <label data-testid="label" htmlFor={input.name}>
                {label}
                {(required || validationRules.find(rule => rule.name === 'required')) && (
                  <span className="form-field__label-mandatory"> *</span>
                )}
              </label>
            </div>
          )}
          <div className={wrapperClassNames}>
            <div className="form-field__icons">
              <Arrow className={iconClassNames} onClick={toggleSelect} />
            </div>
            <div className="form-field-combobox__select form-field__control" ref={selectRef}>
              <div className="form-field-combobox__select-header" onClick={toggleSelect}>
                <span className={selectValueClassNames}>{selectValue.id}</span>
                {selectValue.id.length === 0 && selectPlaceholder && (
                  <div className="form-field-combobox__placeholder">
                    <label>{selectPlaceholder}</label>
                  </div>
                )}
              </div>
              {showSelectDropdown && (
                <PopUpDialog
                  headerIsHidden
                  customPosition={{
                    element: selectRef,
                    position: 'bottom-right'
                  }}
                  className="form-field-combobox__dropdown form-field-combobox__dropdown-select"
                >
                  <ul className="form-field-combobox__dropdown-list" ref={suggestionListRef}>
                    {selectOptions.map(option => {
                      if (!option.hidden) {
                        const selectOptionClassNames = classnames(
                          'form-field-combobox__dropdown-list-option',
                          option.className
                        )

                        return (
                          <li
                            className={selectOptionClassNames}
                            key={option.id}
                            onClick={() => handleSelectOptionClick(option)}
                          >
                            {option.label}
                          </li>
                        )
                      }
                    })}
                  </ul>
                </PopUpDialog>
              )}
            </div>
            <input
              autoComplete="off"
              className={inputClassNames}
              data-testid={name ? `${name}-form-combobox-input` : 'form-combobox-input'}
              id={input.name}
              onChange={handleInputChange}
              onFocus={inputOnFocus}
              placeholder={inputPlaceholder}
              ref={inputRef}
              required={required}
              type="text"
              value={inputValue}
            />
            {showSuggestionList && (dropdownList.length > 0 || searchIsFocused) && (
              <PopUpDialog
                headerIsHidden
                customPosition={{
                  element: selectRef,
                  position: 'bottom-right'
                }}
                className="form-field-combobox__dropdown form-field-combobox__dropdown-suggestions"
                style={{
                  ...dropdownStyle
                }}
              >
                <div ref={suggestionListRef}>
                  {!hideSearchInput && (
                    <div className="form-field-combobox__search-wrapper">
                      <input
                        autoComplete="off"
                        data-testid={name ? `${name}-form-combobox-search` : 'form-combobox-search'}
                        className="form-field-combobox__search form-field__control"
                        onChange={suggestionListSearchChange}
                        onFocus={() => setSearchIsFocused(true)}
                        placeholder="Type to search"
                        type="text"
                      />
                      <SearchIcon />
                    </div>
                  )}
                  <ul className="form-field-combobox__dropdown-list">
                    {searchIsFocused && dropdownList.length === 0 ? (
                      <li className="form-field-combobox__dropdown-list-option" key="no data">
                        No data
                      </li>
                    ) : (
                      dropdownList.map(value => (
                        <li
                          className="form-field-combobox__dropdown-list-option"
                          key={value.id}
                          onClick={() => handleSuggestionListOptionClick(value)}
                        >
                          {value.label}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </PopUpDialog>
            )}
            <div className="form-field__icons">
              {isInvalid && !Array.isArray(meta.error) && (
                <Tooltip
                  className="form-field__warning"
                  template={<TextTooltipTemplate text={meta.error?.label ?? invalidText} warning />}
                >
                  <ExclamationMarkIcon />
                </Tooltip>
              )}
              {isInvalid && Array.isArray(meta.error) && (
                <button className="form-field__warning" onClick={warningIconClick}>
                  <WarningIcon />
                </button>
              )}
            </div>
            {!isEmpty(validationRules) && (
              <OptionsMenu show={showValidationRules} ref={{ refInputContainer: comboboxRef }}>
                {getValidationRules()}
              </OptionsMenu>
            )}
          </div>
        </div>
      )}
    </Field>
  )
}

FormCombobox.propTypes = {
  comboboxClassName: PropTypes.string,
  density: DENSITY,
  disabled: PropTypes.bool,
  hideSearchInput: PropTypes.bool,
  inputDefaultValue: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  invalidText: PropTypes.string,
  label: PropTypes.string,
  maxSuggestedMatches: PropTypes.number,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  required: PropTypes.bool,
  rules: PropTypes.array,
  selectDefaultValue: PropTypes.shape({}),
  selectOptions: COMBOBOX_SELECT_OPTIONS.isRequired,
  selectPlaceholder: PropTypes.string,
  suggestionList: COMBOBOX_SUGGESTION_LIST,
  validator: PropTypes.func,
  withoutBorder: PropTypes.bool
}

export default FormCombobox
