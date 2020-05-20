import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import SelectOption from '../../elements/SelectOption/SelectOption'

import { ReactComponent as Caret } from '../../images/dropdown.svg'

import './select.scss'

const Select = ({
  className,
  disabled,
  floatingLabel,
  label,
  match,
  onClick,
  options,
  page,
  selectType,
  selectedId
}) => {
  const [isOpen, setOpen] = useState(false)
  const history = useHistory()

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

  const handleSelectOption = item => {
    if (match.params.jobId || match.params.name) {
      history.push(
        `/projects/${match.params.projectName}/${page.toLowerCase()}`
      )
    }

    onClick(item)
  }

  return (
    <div
      className={`select ${className} ${isOpen ? ' active' : ''}`}
      onClick={() => toggleOpen(disabled)}
    >
      <div className="select__header">
        {label && (
          <div
            className={`select__label ${selectedId &&
              floatingLabel &&
              'select__label_floating'}`}
          >
            {label}
          </div>
        )}
        <div
          className={`select__value ${selectedId &&
            floatingLabel &&
            'select__value_floating'}`}
        >
          {selectedId && selectedOption?.label}
          {selectedOption?.subLabel && (
            <span className="sub-label">{selectedOption.subLabel}</span>
          )}
        </div>
        <Caret className="select__caret" />
      </div>
      {isOpen && (
        <>
          <div className="overall" key={isOpen} />
          <div
            className="select__body"
            onClick={() => {
              setOpen(false)
            }}
          >
            {options.map(item => (
              <SelectOption
                item={item}
                key={item.id}
                onClick={handleSelectOption}
                selectType={selectType}
                selectedId={selectedId}
              />
            ))}
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
  page: '',
  selectType: '',
  selectedId: ''
}

Select.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  label: PropTypes.string,
  match: PropTypes.shape({}).isRequired,
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  options: PropTypes.array.isRequired,
  page: PropTypes.string,
  selectType: PropTypes.string,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default React.memo(Select)
