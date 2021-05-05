import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SelectOption from '../../elements/SelectOption/SelectOption'

import { ReactComponent as Caret } from '../../images/dropdown.svg'

import './select.scss'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import PopUpDialog from '../PopUpDialog/PopUpDialog'
import Button from '../Button/Button'

const Select = ({
  className,
  disabled,
  disabledOptions,
  floatingLabel,
  hideSelectedOption,
  label,
  onClick,
  options,
  search,
  selectType,
  selectedId,
  selectedItemAction,
  withoutBorder
}) => {
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const selectClassName = classNames(
    'select',
    className,
    isOpen && 'select_active',
    withoutBorder && 'without-border',
    disabled && 'disabled'
  )
  const selectLabelClassName = classNames(
    'select__label',
    selectedId && floatingLabel && 'select__label_floating'
  )
  const selectValueClassName = classNames(
    'select__value',
    selectedId && floatingLabel && 'select__value_floating'
  )
  const selectedOption = options.find(option => option.id === selectedId)

  useEffect(() => {
    window.addEventListener('scroll', handlerScroll)

    return () => {
      window.removeEventListener('scroll', handlerScroll)
    }
  }, [isOpen])

  const handlerScroll = () => {
    setOpen(false)
  }

  const toggleOpen = disabled => (disabled ? null : setOpen(!isOpen))

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
      className={selectClassName}
      onClick={() => toggleOpen(disabled)}
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
        <PopUpDialog
          headerText={selectedItemAction.confirm.title}
          closePopUp={() => {
            setConfirmDialogOpen(false)
          }}
        >
          <div>{selectedItemAction.confirm.description}</div>
          <div className="pop-up-dialog__footer-container">
            <Button
              variant="tertiary"
              label="Cancel"
              className="pop-up-dialog__btn_cancel"
              onClick={() => {
                setConfirmDialogOpen(false)
              }}
            />
            <Button
              variant={selectedItemAction.confirm.btnConfirmType}
              label={selectedItemAction.confirm.btnConfirmLabel}
              onClick={() => {
                selectedItemAction.handler(selectedId)
                setConfirmDialogOpen(false)
              }}
            />
          </div>
        </PopUpDialog>
      )}
      {isOpen && (
        <>
          <div className="overall" />
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
                    disabled={disabledOptions.includes(option.id.toLowerCase())}
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
        </>
      )}
    </div>
  )
}

Select.defaultProps = {
  className: '',
  disabled: false,
  disabledOptions: [],
  hideSelectedOption: false,
  label: '',
  onClick: null,
  search: false,
  selectType: '',
  selectedId: '',
  withoutBorder: false
}

Select.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  disabledOptions: PropTypes.array,
  floatingLabel: PropTypes.bool,
  hideSelectedOption: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      className: PropTypes.string
    })
  ).isRequired,
  search: PropTypes.bool,
  selectType: PropTypes.string,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  withoutBorder: PropTypes.bool
}

export default React.memo(Select)
