import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Input from '../Input/Input'
import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Plus } from '../../images/plus.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

import './keyValueTable.scss'

const KeyValueTable = ({
  addNewItem,
  addNewItemLabel,
  content,
  deleteItem,
  keyHeader,
  keyLabel,
  valueHeader,
  valueLabel
}) => {
  const [isAddNewItem, setIsAddNewItem] = useState(false)
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

  const saveNewItem = () => {
    if (key !== '' && value !== '' && !content.find(item => item.key === key)) {
      addNewItem({ key: key, value: value })
    }
    setKey('')
    setValue('')
    setIsAddNewItem(false)
  }

  return (
    <div className="key-value-table">
      <div className="table-row table-row__header no-hover">
        <div className="table-cell table-cell__key">{keyHeader}</div>
        <div className="table-cell table-cell__value">{valueHeader}</div>
        <div className="table-cell table-cell__actions" />
      </div>
      {content.map((contentItem, index) => (
        <div className="table-row" key={index}>
          <div className="table-cell table-cell__key">{contentItem.key}</div>
          <div className="table-cell table-cell__value">
            {contentItem.value}
          </div>
          <div className="table-cell table-cell__actions">
            <button
              className="delete-btn"
              onClick={() => {
                deleteItem(index)
              }}
            >
              <Delete />
            </button>
          </div>
        </div>
      ))}
      {isAddNewItem ? (
        <div className="table-row no-hover">
          <Input onChange={setKey} label={keyLabel} floatingLabel type="text" />
          <Input
            onChange={setValue}
            label={valueLabel}
            floatingLabel
            type="text"
          />
          <button onClick={saveNewItem}>
            <Tooltip template={<TextTooltipTemplate text="Add item" />}>
              <Plus />
            </Tooltip>
          </button>
        </div>
      ) : (
        <div className="table-row no-hover">
          <button
            className="add-new-item-btn"
            onClick={() => {
              setIsAddNewItem(true)
            }}
          >
            <Plus />
            {addNewItemLabel}
          </button>
        </div>
      )}
    </div>
  )
}

KeyValueTable.defaultProps = {
  keyLabel: 'Key',
  valueLabel: 'Value'
}

KeyValueTable.propTypes = {
  addNewItem: PropTypes.func.isRequired,
  addNewItemLabel: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string
    })
  ).isRequired,
  deleteItem: PropTypes.func.isRequired,
  keyHeader: PropTypes.string.isRequired,
  keyLabel: PropTypes.string,
  valueHeader: PropTypes.string.isRequired,
  valueLabel: PropTypes.string
}

export default KeyValueTable
