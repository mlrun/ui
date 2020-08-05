import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SelectOption from '../../elements/SelectOption/SelectOption'

import { ReactComponent as Caret } from '../../images/dropdown.svg'

import './select.scss'

const Select = ({
  className,
  disabledOptions,
  disabled,
  floatingLabel,
  label,
  onClick,
  options,
  selectType,
  selectedId
}) => {
  const [isOpen, setOpen] = useState(false)
  const selectedOption = options.find(option => option.id === selectedId)
  const selectClassName = classNames('select', className, isOpen && 'active')
  const selectLabelClassName = classNames(
    'select__label',
    selectedId && floatingLabel && 'select__label_floating'
  )
  const selectValueClassName = classNames(
    'select__value',
    selectedId && floatingLabel && 'select__value_floating'
  )

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

  const handleSelectValue = useCallback(event => {
    event.stopPropagation()

    if (!event.target.classList.contains('disabled')) {
      setOpen(false)
    }
  }, [])

  return (
    <div className={selectClassName} onClick={() => toggleOpen(disabled)}>
      <div className="select__header">
        {label && <div className={selectLabelClassName}>{label}</div>}
        <div className={selectValueClassName}>
          {selectedId && selectedOption?.label}
          {selectedOption?.subLabel && (
            <span className="sub-label">{selectedOption.subLabel}</span>
          )}
        </div>
        <Caret className="select__caret" />
      </div>
      {isOpen && (
        <>
          <div className="overall" />
          <div className="select__body" onClick={handleSelectValue}>
            {options.map(item => {
              return (
                <SelectOption
                  disabled={disabledOptions.includes(item.id.toLowerCase())}
                  item={item}
                  key={item.id}
                  onClick={item => onClick(item)}
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
  label: '',
  onClick: null,
  selectType: '',
  selectedId: '',
  disabledOptions: []
}

Select.propTypes = {
  className: PropTypes.string,
  disabledOptions: PropTypes.array,
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  options: PropTypes.array.isRequired,
  selectType: PropTypes.string,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default React.memo(Select)
