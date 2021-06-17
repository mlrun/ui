import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Input from '../Input/Input'
import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Select from '../Select/Select'

import { ReactComponent as Plus } from '../../images/plus.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'
import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

import './keyValueTable.scss'

const KeyValueTable = ({
  addNewItem,
  addNewItemLabel,
  className,
  content,
  deleteItem,
  editItem,
  keyHeader,
  keyLabel,
  keyOptions,
  keyType,
  valueHeader,
  valueLabel,
  withEditMode
}) => {
  const [isAddNewItem, setIsAddNewItem] = useState(false)
  const [isEditMode, setEditMode] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

  const tableClassNames = classnames('key-value-table', className)

  const saveNewItem = () => {
    if (key !== '' && value !== '') {
      addNewItem({ key, value })
    }

    setKey('')
    setValue('')
    setIsAddNewItem(false)
  }

  const handleEditItem = () => {
    if (selectedItem.newKey !== '') {
      editItem(selectedItem)
    }

    setEditMode(false)
    setSelectedItem(null)
  }

  const isKeyNotUnique = (newKey, keys) => {
    return keyType !== 'select' && keys.some(({ key }) => newKey === key)
  }

  return (
    <div className={tableClassNames}>
      <div className="table-row table-row__header no-hover">
        <div className="table-cell table-cell__key">{keyHeader}</div>
        <div className="table-cell table-cell__value">{valueHeader}</div>
        <div className="table-cell table-cell__actions" />
      </div>
      {content.map((contentItem, index) => {
        return isEditMode && contentItem.key === selectedItem.key ? (
          <div className="table-row table-row_edit" key={index}>
            <div className="table-cell table-cell__key">
              {keyType === 'select' ? (
                <Select
                  density="dense"
                  onClick={key =>
                    setSelectedItem({
                      ...selectedItem,
                      newKey: key
                    })
                  }
                  options={keyOptions}
                  selectedId={selectedItem.newKey ?? selectedItem.key}
                />
              ) : (
                <Input
                  density="dense"
                  className="input_edit"
                  invalid={
                    selectedItem.newKey !== selectedItem.key &&
                    isKeyNotUnique(selectedItem.newKey, content)
                  }
                  invalidText="Name already exists"
                  onChange={key =>
                    setSelectedItem({
                      ...selectedItem,
                      newKey: key
                    })
                  }
                  type="text"
                  value={selectedItem.newKey ?? selectedItem.key}
                />
              )}
            </div>
            <div className="table-cell table-cell__value">
              <Input
                density="dense"
                className="input_edit"
                onChange={value =>
                  setSelectedItem({
                    ...selectedItem,
                    value
                  })
                }
                type="text"
                value={selectedItem.value}
              />
            </div>
            <div className="table-cell table-cell__actions">
              <button
                className="delete-btn"
                onClick={handleEditItem}
                disabled={
                  selectedItem.newKey !== selectedItem.key &&
                  isKeyNotUnique(selectedItem.newKey, content)
                }
              >
                <Checkmark />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="table-row"
            key={index}
            onClick={() => {
              if (withEditMode) {
                setSelectedItem(contentItem)
                setEditMode(true)
              }
            }}
          >
            <div className="table-cell table-cell__key">{contentItem.key}</div>
            <div className="table-cell table-cell__value">
              {contentItem.value}
            </div>
            <div className="table-cell table-cell__actions">
              <button
                className="delete-btn"
                onClick={() => {
                  deleteItem(index, contentItem)
                }}
              >
                <Delete />
              </button>
            </div>
          </div>
        )
      })}
      {isAddNewItem ? (
        <div className="table-row no-hover">
          {keyType === 'select' ? (
            <Select
              className="table-cell__key"
              density="dense"
              label={key || keyLabel}
              onClick={setKey}
              options={keyOptions}
            />
          ) : (
            <Input
              floatingLabel
              onChange={setKey}
              label={keyLabel}
              type="text"
              wrapperClassName="table-cell__key"
              invalid={isKeyNotUnique(key, content)}
              required
              requiredText="Name already exists"
            />
          )}

          <Input
            floatingLabel
            onChange={setValue}
            label={valueLabel}
            type="text"
            wrapperClassName="table-cell__value"
          />
          <button onClick={saveNewItem} disabled={isKeyNotUnique(key, content)}>
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
  className: '',
  editItem: () => {},
  keyLabel: 'Key',
  keyOptions: [],
  keyType: 'input',
  valueLabel: 'Value',
  withEditMode: false
}

KeyValueTable.propTypes = {
  addNewItem: PropTypes.func.isRequired,
  addNewItemLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string
    })
  ).isRequired,
  deleteItem: PropTypes.func.isRequired,
  editItem: PropTypes.func,
  keyHeader: PropTypes.string.isRequired,
  keyLabel: PropTypes.string,
  keyOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  ),
  keyType: PropTypes.string,
  valueHeader: PropTypes.string.isRequired,
  valueLabel: PropTypes.string,
  withEditMode: PropTypes.bool
}

export default KeyValueTable
