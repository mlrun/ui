import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import options from './selectData'

import caret from '../../images/caret.png'
import unchecked from '../../images/checkbox-unchecked.png'
import checked from '../../images/checkbox-checked.png'

import './select.scss'

const Select = ({ filter, match, onClick, page, value }) => {
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
        <div className="label">{filter}:</div>
        <div className="value">{value}</div>
        <img src={caret} alt="caret" className="caret" />
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
          {options[filter].map(item => (
            <div
              className="select__item"
              key={item}
              onClick={() => handleSelectOption(item)}
            >
              {filter === 'status' && (
                <>
                  <img
                    src={value === item ? checked : unchecked}
                    alt="status"
                    className="item-status"
                  />
                  <span className={`status_${item.toLowerCase()}`} />
                </>
              )}
              {item}
            </div>
          ))}
        </div>
      ]}
    </div>
  )
}

Select.propTypes = {
  filter: PropTypes.string.isRequired,
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default Select
