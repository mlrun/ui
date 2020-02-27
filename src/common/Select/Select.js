import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import options from './selectData'

import caret from '../../images/caret.png'
import unchecked from '../../images/checkbox-unchecked.png'
import checked from '../../images/checkbox-checked.png'

import './select.scss'

const Select = ({ filter, onClick, value }) => {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', handlerScroll)
    return () => {
      window.removeEventListener('scroll', handlerScroll)
    }
  }, [isOpen])

  const handlerScroll = () => {
    setOpen(false)
  }

  return (
    <div
      className={`select ${isOpen && 'active'}`}
      onClick={() => setOpen(!isOpen)}
    >
      <div className="select_header">
        <div className="select_header_label">{filter} : </div>
        <div className="select_header_value">{value}</div>
        <img src={caret} alt="caret" />
      </div>
      {isOpen && [
        <div className="overall" key={isOpen} />,
        <div
          className="select_body"
          onClick={() => {
            setOpen(false)
          }}
          key={!isOpen}
        >
          {options[filter].map(item => (
            <div
              className="select_body_item"
              key={item}
              onClick={() => {
                onClick(item)
              }}
            >
              {filter === 'status' && (
                <>
                  <img
                    src={value === item ? checked : unchecked}
                    alt="status"
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
  filter: PropTypes.string.isRequired
}

export default Select
