import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import caret from '../../images/caret.png'
import unchecked from '../../images/checkbox-unchecked.png'
import checked from '../../images/checkbox-checked.png'
import './select.scss'

const Select = ({ filter }) => {
  const options = {
    status: ['All', 'Completed', 'Running', 'Failed'],
    tree: ['Latest'],
    period: ['Last 7 days', 'Last 14 days', 'Last months', 'Last 6 months']
  }
  const [isOpen, setOpen] = useState(false)
  const [value, setValue] = useState(options[filter][0])

  useEffect(() => {
    const handlerScroll = () => {
      setOpen(false)
    }
    window.addEventListener('scroll', handlerScroll)
    return () => {
      window.removeEventListener('scroll', handlerScroll)
    }
  })

  return (
    <div
      className={'select_container' + (isOpen === true ? ' active' : '')}
      onClick={() => setOpen(!isOpen)}
    >
      <div className="select_header">
        <div className="select_header_label">{filter} : </div>
        <div className="select_header_value">{value}</div>
        <img src={caret} alt="caret" />
      </div>
      {isOpen && <div className="overall" />}
      {isOpen && (
        <div
          className="select_body"
          onClick={() => {
            setOpen(false)
          }}
        >
          {options[filter].map(item => (
            <div
              className="select_body_item"
              key={item}
              onClick={() => {
                setValue(item)
              }}
            >
              {filter === 'status' && (
                <>
                  <img
                    src={value.includes(item) ? checked : unchecked}
                    alt="status"
                  />
                  <span className={`status_${item.toLowerCase()}`} />
                </>
              )}
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

Select.propTypes = {
  filter: PropTypes.string.isRequired
}

export default Select
