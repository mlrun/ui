import React, { useState, useLayoutEffect, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import caret from '../../images/caret.png'
import unchecked from '../../images/checkbox-unchecked.png'
import checked from '../../images/checkbox-checked.png'
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

const statusOptions = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Completed',
    value: 'completed'
  },
  {
    label: 'Running',
    value: 'running'
  },
  {
    label: 'Failed',
    value: 'failed'
  }
]

const treeOptions = [
  {
    label: 'Latest',
    value: 'latest'
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

const templateStatusOptions = (filter, item, index, onChange, value) => {
  return (
    <div
      key={index}
      className="select_body_item"
      onClick={() => onChange({ [filter]: [item.value] })}
    >
      <img
        src={value.includes(item.value) ? checked : unchecked}
        alt="status"
      />
      <span className={'status_' + item.value}></span>
      <div>{item.label}</div>
    </div>
  )
}

const factoryOptions = (filter, options, onChange, value) => {
  let arrayOptions = options.map((item, index) => {
    return filter === 'status'
      ? templateStatusOptions(filter, item, index, onChange, value)
      : templateOptions(filter, item, index, onChange)
  })
  return arrayOptions
}

const Select = ({ label, onChange, value }) => {
  const [isOpen, setOpen] = useState(false)
  const [_value, setValue] = useState('')

  const statusChange = useCallback(
    item => {
      let {
        status: [statusItem]
      } = item
      if (statusItem === 'all') {
        onChange({ status: ['all'] })
      } else {
        let newValue = value.filter(item => item !== 'all')
        if (newValue.length === 0 || !newValue.includes(statusItem)) {
          newValue.push(statusItem)
        } else {
          newValue = newValue.filter(item => item !== statusItem)
        }
        if (newValue.length === 0 || newValue.length === 3) {
          newValue = ['all']
        }
        onChange({ status: [...newValue] })
      }
    },
    [onChange, value]
  )

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
    if (typeof value === 'object') {
      var checkedOptions = []
      statusOptions.forEach((item, index) => {
        if (value.includes(item.value)) {
          checkedOptions.push(item.label)
        }
      })
      let label = checkedOptions.join(', ')
      setValue(label)
    }
    if (label === 'Tree:') {
      treeOptions.forEach((item, index) => {
        if (item.value === value) {
          setValue(item.label)
        }
      })
    }
  }, [value, label])

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
      <div
        className="select_header"
        title={/status/gi.test(label) ? _value : ''}
      >
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
          {/period/gi.test(label) &&
            factoryOptions('period', periodOptions, onChange, null)}
          {/group/gi.test(label) &&
            factoryOptions('group', groupOptions, onChange, null)}
          {/status/gi.test(label) &&
            factoryOptions('status', statusOptions, statusChange, value)}
          {/tree/gi.test(label) &&
            factoryOptions('tree', treeOptions, onChange, value)}
        </div>
      )}
    </div>
  )
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ])
}

export default Select
