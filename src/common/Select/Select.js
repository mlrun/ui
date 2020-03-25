import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import SelectOption from '../../elements/SelectOption/SelectOption'

import options from './selectData'

import caret from '../../images/caret.png'

import './select.scss'

const Select = ({ option, label, match, onClick, page, value }) => {
  const [isOpen, setOpen] = useState(false)
  const history = useHistory()

  useEffect(() => {
    window.addEventListener('scroll', handlerScroll)
    return () => {
      window.removeEventListener('scroll', handlerScroll)
    }
  }, [isOpen])

  const handlerScroll = () => {
    setOpen(false)
  }

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
      onClick={() => setOpen(!isOpen)}
    >
      <div className="select__header">
        {label && <div className="select__label">{label}:</div>}
        <div className="select__value">{value}</div>
        <img src={caret} alt="caret" className="select__caret" />
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
              key={item}
              item={item}
              value={value}
              status={option === 'status'}
              match={match}
              onClick={handleSelectOption}
              link={option === 'create' || page === 'jobs'}
            />
          ))}
        </div>
      ]}
    </div>
  )
}

Select.defaultProps = {
  onClick: () => {},
  label: ''
}

Select.propTypes = {
  label: PropTypes.string,
  match: PropTypes.shape({}).isRequired,
  option: PropTypes.string.isRequired,
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  page: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default Select
