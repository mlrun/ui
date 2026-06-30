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
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Field, useField } from 'react-final-form'

import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import PopUpDialog from '../PopUpDialog/PopUpDialog'
import SelectOption from '../../elements/SelectOption/SelectOption'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../Tooltip/Tooltip'

import { DENSITY, SELECT_OPTIONS } from '../../types'
import { TERTIARY_BUTTON } from '../../constants'

import Caret from '../../images/dropdown.svg?react'

import './formSelect.scss'

let FormSelect = ({
  className = '',
  density = 'normal',
  disabled = false,
  hideSelectedOption = false,
  label = '',
  multiple = false,
  name,
  onChange = null,
  options,
  placeholder = '',
  preventWidthOverflow = false,
  required = false,
  scrollToView = true,
  search = false,
  selectedItemAction = null,
  tooltip = '',
  withSelectedIcon = true,
  withoutBorder = false
}) => {
  const { input, meta } = useField(name)
  const [isInvalid, setIsInvalid] = useState(false)
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const optionsListRef = useRef()
  const popUpRef = useRef()
  const selectRef = useRef()
  const searchRef = useRef()
  const { width: selectWidth } = selectRef?.current?.getBoundingClientRect() || {}

  const selectWrapperClassNames = classNames(
    'form-field__wrapper',
    `form-field__wrapper-${density}`,
    disabled && 'form-field__wrapper-disabled',
    isOpen && 'form-field__wrapper-active',
    isInvalid && 'form-field__wrapper-invalid',
    withoutBorder && 'without-border'
  )

  const selectLabelClassName = classNames(
    'form-field__label',
    disabled && 'form-field__label-disabled'
  )

  const selectValueClassName = classNames(
    'form-field__select-value',
    !input.value && 'form-field__select-placeholder'
  )

  const selectedOption = options.find(option => option.id === input.value)

  const getFilteredOptions = useCallback(
    options => {
      return options.filter(option => {
        return !search || option.label.toLowerCase().includes(searchValue.toLowerCase())
      })
    },
    [search, searchValue]
  )

  const sortedOptionsList = useMemo(() => {
    if (scrollToView) {
      return getFilteredOptions(options)
    }

    const optionsList = [...options]

    const selectedOption = optionsList.filter((option, idx, arr) => {
      if (option.id === input.value) {
        arr.splice(idx, 1)
        return true
      }
      return false
    })

    return getFilteredOptions([...selectedOption, ...optionsList])
  }, [input.value, getFilteredOptions, options, scrollToView])

  const getSelectValue = () => {
    if (!input.value || !input.value.length) {
      return `Select Option${multiple ? 's' : ''}`
    }

    const multipleValue =
      multiple && input.value.includes('all') && input.value.length > 1
        ? options
            .filter(option => option.id !== 'all')
            .filter(option => input.value.includes(option.id))
            .map(option => option.label)
            .join(', ')
        : options
            .filter(option => input.value.includes(option.id))
            .map(option => option.label)
            .join(', ')

    return !multiple
      ? selectedOption?.label
      : input.value.length <= 2
        ? multipleValue
        : `${input.value.length} items selected`
  }

  useEffect(() => {
    setIsInvalid(
      meta.invalid && (meta.validating || meta.modified || (meta.submitFailed && meta.touched))
    )
  }, [meta.invalid, meta.modified, meta.submitFailed, meta.touched, meta.validating])

  const openMenu = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true)
      input.onFocus(new Event('focus'))
    }
  }, [input, isOpen])

  const closeMenu = useCallback(() => {
    if (isOpen) {
      setIsOpen(false)
      input.onBlur(new Event('blur'))
    }
  }, [input, isOpen])

  const clickHandler = useCallback(
    event => {
      if (selectRef.current !== event.target.closest('.form-field-select')) {
        closeMenu()
      }
    },
    [closeMenu]
  )

  const handleScroll = useCallback(
    event => {
      if (!event.target.closest('.options-list__body')) {
        closeMenu()
      }
    },
    [closeMenu]
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true)
    }

    window.addEventListener('click', clickHandler)

    return () => {
      window.removeEventListener('click', clickHandler)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [clickHandler, handleScroll, isOpen])

  const scrollOptionToView = useCallback(() => {
    const selectedOptionEl = optionsListRef.current.querySelector(
      `[data-custom-id="${input.value}"]`
    )

    if (!selectedOptionEl) return

    searchValue
      ? optionsListRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      : setTimeout(() => {
          selectedOptionEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }, 0)
  }, [input.value, searchValue])

  useEffect(() => {
    if (isOpen && optionsListRef.current && scrollToView) {
      scrollOptionToView()
    }
  }, [isOpen, scrollOptionToView, scrollToView])

  useEffect(() => {
    if (isOpen && search && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isOpen, search])

  const toggleOpen = () => {
    if (isOpen) {
      closeMenu()
    } else {
      !disabled && openMenu()
    }
  }

  const handleCloseSelectBody = useCallback(
    event => {
      event.stopPropagation()
      if (multiple) return

      if (
        !event.target.classList.contains('disabled') &&
        !event.target.closest('.options-list__search')
      ) {
        closeMenu()
        setSearchValue('')
      }
    },
    [closeMenu, multiple]
  )

  const handleSelectOptionClick = (selectedOption, option) => {
    if (selectedOption !== input.value) {
      option.handler && option.handler()
      onChange && onChange(selectedOption)

      setTimeout(() => {
        input.onChange(selectedOption)
      })
    }
  }

  const validateField = value => {
    if (required) {
      return value ? undefined : 'Required'
    }
  }

  return (
    <Field name={name} validate={validateField}>
      {({ input, meta }) => (
        <Tooltip
          className="select-tooltip"
          template={<TextTooltipTemplate text={tooltip} />}
          hidden={!tooltip}
        >
          <div
            data-testid={name ? `${name}-form-field-select` : 'form-field-select'}
            ref={selectRef}
            className={`form-field-select ${className}`}
            onClick={toggleOpen}
          >
            {label && (
              <div className={selectLabelClassName}>
                <label data-testid={name ? `${name}-form-select-label` : 'form-select-label'}>
                  {label}
                  {meta.error && <span className="form-field__label-mandatory"> *</span>}
                </label>
              </div>
            )}
            <div data-testid="select-header" className={selectWrapperClassNames}>
              <div className="form-field__control">
                {!hideSelectedOption && (
                  <div data-testid="selected-option" className="form-field__select">
                    <span className={selectValueClassName}>{getSelectValue() || placeholder}</span>
                  </div>
                )}
              </div>
              <div className="form-field__icons">
                {input.value && selectedItemAction && (
                  <>
                    {selectedItemAction.handler ? (
                      <Tooltip template={<TextTooltipTemplate text={selectedItemAction.tooltip} />}>
                        <button
                          onClick={event => {
                            if (selectedItemAction.confirm) {
                              setConfirmDialogOpen(true)
                            } else {
                              selectedItemAction.handler(input.value)
                            }

                            event.stopPropagation()
                          }}
                        >
                          {selectedItemAction.icon}
                        </button>
                      </Tooltip>
                    ) : (
                      <span>{selectedItemAction.icon}</span>
                    )}
                  </>
                )}
                <span>
                  <Caret className="form-field__caret" />
                </span>
              </div>
            </div>
            {isConfirmDialogOpen && (
              <ConfirmDialog
                cancelButton={{
                  handler: () => {
                    setConfirmDialogOpen(false)
                  },
                  label: 'Cancel',
                  variant: TERTIARY_BUTTON
                }}
                closePopUp={() => {
                  setConfirmDialogOpen(false)
                }}
                confirmButton={{
                  handler: () => {
                    selectedItemAction.handler(input.value)
                    setConfirmDialogOpen(false)
                  },
                  label: selectedItemAction.confirm.btnConfirmLabel,
                  variant: selectedItemAction.confirm.btnConfirmType
                }}
                header={selectedItemAction.confirm.title}
                isOpen={isConfirmDialogOpen}
                message={selectedItemAction.confirm.message}
              />
            )}
            {isOpen && (
              <PopUpDialog
                className="form-field form-field-select__options-list"
                headerIsHidden
                ref={popUpRef}
                customPosition={{
                  element: selectRef,
                  position: 'bottom-right',
                  autoHorizontalPosition: true
                }}
                style={{
                  maxWidth: `${selectWidth < 500 && !preventWidthOverflow ? 500 : selectWidth}px`,
                  minWidth: `${selectWidth}px`
                }}
              >
                <div
                  data-testid="select-body"
                  className="options-list__body"
                  onClick={handleCloseSelectBody}
                >
                  {search && (
                    <div className="options-list__search">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={event => setSearchValue(event.target.value)}
                        ref={searchRef}
                        autoFocus
                      />
                    </div>
                  )}
                  <ul className="options-list" ref={optionsListRef}>
                    {sortedOptionsList.map(option => {
                      return (
                        <SelectOption
                          item={option}
                          key={option.id}
                          name={name}
                          onClick={selectedOption => {
                            handleSelectOptionClick(selectedOption, option)
                          }}
                          multiple={multiple}
                          selectedId={!multiple ? input.value : ''}
                          withSelectedIcon={withSelectedIcon}
                        />
                      )
                    })}
                  </ul>
                </div>
              </PopUpDialog>
            )}
            <input {...input} type="hidden" />
          </div>
        </Tooltip>
      )}
    </Field>
  )
}

FormSelect.propTypes = {
  className: PropTypes.string,
  density: DENSITY,
  disabled: PropTypes.bool,
  hideSelectedOption: PropTypes.bool,
  label: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: SELECT_OPTIONS.isRequired,
  placeholder: PropTypes.string,
  preventWidthOverflow: PropTypes.bool,
  required: PropTypes.bool,
  scrollToView: PropTypes.bool,
  search: PropTypes.bool,
  selectedItemAction: PropTypes.object,
  tooltip: PropTypes.string,
  withSelectedIcon: PropTypes.bool,
  withoutBorder: PropTypes.bool
}

FormSelect = React.memo(FormSelect)

export default FormSelect
