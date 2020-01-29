import React, { useState } from 'react'
import { useEffect } from 'react'
import caret from '../../images/caret.png'
import './select.scss'
import { useLayoutEffect } from 'react'

const Select = ({ label, options, defaultIndex, onChange }) => {
  const [isOpen, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const newOptions = options.map((item, index) => {
    return (
      <div
        className="select_body_item"
        key={index}
        onClick={() => {
          onChange(item.value)
          setValue(item.label)
          setOpen(false)
        }}
      >
        {item.label}
      </div>
    )
  })

  useLayoutEffect(() => {
    if (defaultIndex !== undefined) {
      if (defaultIndex < options.length && value === '') {
        setValue(options[defaultIndex].label)
      } else if (defaultIndex > options.length && value === '') {
        setValue(options[0].label)
      }
    } else {
      setValue(options[0].label)
    }
  }, [defaultIndex, options, value, onChange])

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
    <div className="select_container" onClick={() => setOpen(!isOpen)}>
      <div className="select_header">
        <div className="select_header_label">{label}</div>
        <div className="select_header_value">{value}</div>
        <img src={caret} alt="caret"></img>
      </div>
      {isOpen && <div className="overall"></div>}
      {isOpen && <div className="select_body">{newOptions}</div>}
    </div>
  )
}

export default Select
