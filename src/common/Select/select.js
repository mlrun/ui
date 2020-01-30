import React, { useState, useLayoutEffect, useEffect } from 'react'
import caret from '../../images/caret.png'
import './select.scss'

const date = (date, day, month = null) => {
  if (day) {
    date.setDate(date.getDate() - day)
  } else {
    date.setMonth(date.getMonth() - month)
  }
  return date.getTime()
}

const periodOptions = [
  {
    label: 'Last 7 days',
    value: date(new Date(), 7)
  },
  {
    label: 'Last 14 days',
    value: date(new Date(), 14)
  },
  {
    label: 'Last months',
    value: date(new Date(), null, 1)
  },
  {
    label: 'Last 6 months',
    value: date(new Date(), null, 6)
  }
]

const groupOptions = [
  {
    label: 'Name',
    value: 'name'
  },
  {
    label: 'None',
    value: 'none'
  }
]

const templateOptions = (filter, item, index, onChange) => (
  <div
    className="select_body_item"
    key={index}
    onClick={() => {
      onChange({ [filter]: item.value })
    }}
  >
    {item.label}
  </div>
)

const factoryOptions = (filter, options, onChange) => {
  let arrayOptions = options.map((item, index) => {
    return templateOptions(filter, item, index, onChange)
  })
  return arrayOptions
}

const Select = ({ label, onChange, value }) => {
  const [isOpen, setOpen] = useState(false)
  const [_value, setValue] = useState('')

  useLayoutEffect(() => {
    if (typeof value === 'number') {
      periodOptions.forEach(item => {
        if (
          new Date(value).toLocaleDateString('en-US') ===
          new Date(item.value).toLocaleDateString('en-US') // Both values are formatted in this format d/m/y
        ) {
          setValue(item.label)
        }
      })
    }
    if (typeof value === 'string') {
      groupOptions.forEach(item => {
        if (item.value === value) {
          setValue(item.label)
        }
      })
    }
  }, [value])

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
        <div className="select_header_value">{_value}</div>
        <img src={caret} alt="caret"></img>
      </div>
      {isOpen && <div className="overall"></div>}
      {isOpen && (
        <div
          className="select_body"
          onClick={() => {
            setOpen(false)
          }}
        >
          {/Period/.test(label) &&
            factoryOptions('period', periodOptions, onChange)}
          {/Group/.test(label) &&
            factoryOptions('group', groupOptions, onChange)}
        </div>
      )}
    </div>
  )
}

export default Select
