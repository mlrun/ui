import React, { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SelectOption from '../../elements/SelectOption/SelectOption'
import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import PopUpDialog from '../PopUpDialog/PopUpDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'

import { SELECT_OPTIONS } from '../../types'
import { TERTIARY_BUTTON } from '../../constants'

import { ReactComponent as Caret } from '../../images/dropdown.svg'

import './select.scss'

const Select = ({
  className,
  density,
  disabled,
  floatingLabel,
  hideSelectedOption,
  label,
  labelAtTop,
  onClick,
  options,
  search,
  selectType,
  selectedId,
  selectedItemAction,
  withoutBorder
}) => {
  const selectRef = useRef()
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { width: dropdownWidth } =
    selectRef?.current?.getBoundingClientRect() || {}
  const selectClassName = classNames(
    'select',
    className,
    `select-${density}`,
    isOpen && 'select_active',
    withoutBorder && 'without-border',
    label.length === 0 && 'without-label',
    disabled && 'disabled'
  )
  const selectLabelClassName = classNames(
    'select__label',
    selectedId && floatingLabel && !labelAtTop && 'select__label_floating',
    labelAtTop && 'select__label_top'
  )
  const selectValueClassName = classNames(
    'select__value',
    selectedId && floatingLabel && 'select__value_floating'
  )
  const selectedOption = options.find(option => option.id === selectedId)

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true)
    }

    window.addEventListener('click', clickHandler)

    return () => {
      window.removeEventListener('click', clickHandler)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  const clickHandler = event => {
    if (selectRef.current !== event.target.closest('.select')) {
      setOpen(false)
    }
  }

  const handleScroll = event => {
    if (!event.target.closest('.select__body')) {
      setOpen(false)
    }
  }

  const toggleOpen = () => {
    !disabled && setOpen(!isOpen)
  }

  const handleCloseSelectBody = useCallback(event => {
    event.stopPropagation()

    if (
      !event.target.classList.contains('disabled') &&
      !event.target.closest('.select__search')
    ) {
      setOpen(false)
      setSearchValue('')
    }
  }, [])

  const handleSelectOptionClick = (selectedOption, option) => {
    if (selectedOption !== selectedId) {
      option.handler && option.handler()
      onClick && onClick(selectedOption)
    }
  }

  return (
    <div
      data-testid="select"
      ref={selectRef}
      className={selectClassName}
      onClick={() => toggleOpen()}
    >
      <div data-testid="select-header" className="select__header">
        {label && (
          <div data-testid="select-label" className={selectLabelClassName}>
            {label}
          </div>
        )}
        {!hideSelectedOption && (
          <div data-testid="selected-option" className={selectValueClassName}>
            {selectedId && selectedOption?.label}
            {selectedOption?.subLabel && (
              <span data-testid="select-subLabel" className="sub-label">
                {selectedOption.subLabel}
              </span>
            )}
          </div>
        )}
        {selectedId && selectedItemAction && (
          <div className="actions">
            {selectedItemAction.handler ? (
              <Tooltip
                template={
                  <TextTooltipTemplate text={selectedItemAction.tooltip} />
                }
              >
                <button
                  onClick={event => {
                    if (selectedItemAction.confirm) {
                      setConfirmDialogOpen(true)
                    } else {
                      selectedItemAction.handler(selectedId)
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
          </div>
        )}
        <Caret className="select__caret" />
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
              selectedItemAction.handler(selectedId)
              setConfirmDialogOpen(false)
            },
            label: selectedItemAction.confirm.btnConfirmLabel,
            variant: selectedItemAction.confirm.btnConfirmType
          }}
          header={selectedItemAction.confirm.title}
          message={selectedItemAction.confirm.message}
        />
      )}
      {isOpen && (
        <PopUpDialog
          className="select__options-list"
          customPosition={{
            element: selectRef,
            position: 'bottom-right'
          }}
          style={{ width: `${dropdownWidth}px` }}
        >
          <div
            data-testid="select-body"
            className="select__body"
            onClick={handleCloseSelectBody}
          >
            {search && (
              <div className="select__search">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={event => setSearchValue(event.target.value)}
                />
              </div>
            )}
            {options
              .filter(option => {
                return (
                  !search ||
                  option.label.toLowerCase().includes(searchValue.toLowerCase())
                )
              })
              .map(option => {
                return (
                  <SelectOption
                    item={option}
                    key={option.id}
                    onClick={selectedOption => {
                      handleSelectOptionClick(selectedOption, option)
                    }}
                    selectType={selectType}
                    selectedId={selectedId}
                  />
                )
              })}
          </div>
        </PopUpDialog>
      )}
    </div>
  )
}

Select.defaultProps = {
  className: '',
  density: 'normal',
  disabled: false,
  hideSelectedOption: false,
  label: '',
  labelAtTop: false,
  onClick: null,
  search: false,
  selectType: '',
  selectedId: '',
  withoutBorder: false
}

Select.propTypes = {
  className: PropTypes.string,
  density: PropTypes.oneOf(['dense', 'normal', 'medium', 'chunky']),
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  hideSelectedOption: PropTypes.bool,
  label: PropTypes.string,
  labelAtTop: PropTypes.bool,
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  options: SELECT_OPTIONS.isRequired,
  search: PropTypes.bool,
  selectType: PropTypes.string,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  withoutBorder: PropTypes.bool
}

export default React.memo(Select)
