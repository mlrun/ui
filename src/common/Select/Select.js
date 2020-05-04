import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import SelectOption from '../../elements/SelectOption/SelectOption'

import options from './selectData'

import { ReactComponent as Caret } from '../../images/dropdown.svg'

import './select.scss'

const Select = ({ disabled, label, match, onClick, option, page, value }) => {
  const [isOpen, setOpen] = useState(false)
  const history = useHistory()

  const selectOption = options[option].find(item => item.id === value)

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
      className={`select${isOpen ? ' active' : ''}`}
      onClick={() => toggleOpen(disabled)}
    >
      <div className="select__header">
        {label && <div className="select__label">{label}</div>}
        <div className="select__value">
          {value && selectOption.label}
          {selectOption?.sub && (
            <span className="sub-label">{selectOption.sub}</span>
          )}
        </div>
        <Caret className="select__caret" />
      </div>
      {isOpen && [
        <div className="overall" key={isOpen} />,
        <div
          className="select__body"
          onClick={() => {
            setOpen(false)
          }}
          key={!isOpen}
        >
          {options[option].map(item => (
            <SelectOption
              key={item.id}
              item={item}
              selectedId={value}
              status={option === 'status'}
              onClick={handleSelectOption}
            />
          ))}
        </div>
      ]}
    </div>
  )
}

Select.defaultProps = {
  disabled: false,
  onClick: null,
  label: '',
  page: ''
}

Select.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  match: PropTypes.shape({}).isRequired,
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  option: PropTypes.string.isRequired,
  page: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default React.memo(Select)
