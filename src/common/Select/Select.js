import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SelectOption from '../../elements/SelectOption/SelectOption'

import { ReactComponent as Caret } from '../../images/dropdown.svg'

import './select.scss'

const Select = ({
  className,
  disabled,
  disabledOptions,
  floatingLabel,
  hideSelectedOption,
  label,
  onClick,
  options,
  selectType,
  selectedId
}) => {
  const [isOpen, setOpen] = useState(false)
  const selectClassName = classNames('select', className, isOpen && 'active')
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

    if (!event.target.classList.contains('disabled')) {
      setOpen(false)
    }
  }, [])

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
        <Caret className="select__caret" />
      </div>
      {isOpen && (
        <>
          <div className="overall" />
          <div
            data-testid="select-body"
            className="select__body"
            onClick={handleCloseSelectBody}
          >
            {options.map(option => {
              return (
                <SelectOption
                  disabled={disabledOptions.includes(option.id.toLowerCase())}
                  item={option}
                  key={option.id}
                  onClick={selectedOption => {
                    option.handler && option.handler()
                    onClick && onClick(selectedOption)
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
  selectType: '',
  selectedId: ''
}

Select.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  disabledOptions: PropTypes.array,
  floatingLabel: PropTypes.bool,
  hideSelectedOption: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  options: PropTypes.array.isRequired,
  selectType: PropTypes.string,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default React.memo(Select)
