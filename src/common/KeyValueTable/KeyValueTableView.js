import React from 'react'
import PropTypes from 'prop-types'

import Input from '../Input/Input'
import Tooltip from '../Tooltip/Tooltip'
import Select from '../Select/Select'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import RoundedIcon from '../RoundedIcon/RoundedIcon'

import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Plus } from '../../images/plus.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'
import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

import './keyValueTable.scss'

const KeyValueTableView = ({
  addNewItemLabel,
  content,
  deleteItem,
  handleEditItem,
  handleResetForm,
  isAddNewItem,
  isEditMode,
  isKeyEditable,
  isKeyNotUnique,
  isKeyRequired,
  isValueRequired,
  keyHeader,
  keyLabel,
  keyOptions,
  keyType,
  keyValue,
  saveItem,
  selectedItem,
  setEditMode,
  setIsAddNewItem,
  setKey,
  setSelectedItem,
  setValidation,
  setValue,
  tableClassNames,
  validation,
  valueHeader,
  valueLabel,
  valueType,
  withEditMode
}) => {
  return (
    <div className={tableClassNames}>
      <div className="table-row table-row__header no-hover">
        <div className="table-cell__inputs-wrapper">
          <div className="table-cell table-cell__key">{keyHeader}</div>
          <div className="table-cell table-cell__value">{valueHeader}</div>
        </div>
        <div className="table-cell table-cell__actions" />
      </div>
      <div className="key-value-table__body">
        {content.map((contentItem, index) => {
          return isEditMode && index === selectedItem.index ? (
            <div className="table-row table-row_edit" key={index}>
              <div className="table-cell table-cell__key">
                {!isKeyEditable ? (
                  <Tooltip
                    template={<TextTooltipTemplate text={contentItem.key} />}
                  >
                    {contentItem.key}
                  </Tooltip>
                ) : keyType === 'select' ? (
                  <Select
                    density="dense"
                    onClick={key =>
                      setSelectedItem({
                        ...selectedItem,
                        newKey: key,
                        index
                      })
                    }
                    options={keyOptions}
                    selectedId={selectedItem.newKey ?? selectedItem.key}
                  />
                ) : (
                  <Input
                    className="input_edit"
                    density="dense"
                    invalid={
                      (selectedItem.newKey !== selectedItem.key &&
                        isKeyNotUnique(selectedItem.newKey, content)) ||
                      !validation.isEditKeyValid
                    }
                    invalidText={
                      isKeyNotUnique(selectedItem.newKey, content)
                        ? 'Name already exists'
                        : 'This field is invalid'
                    }
                    onChange={key =>
                      setSelectedItem({
                        ...selectedItem,
                        newKey: key,
                        index
                      })
                    }
                    required={isKeyRequired}
                    setInvalid={value =>
                      setValidation(state => ({
                        ...state,
                        isEditKeyValid: value
                      }))
                    }
                    type="text"
                    value={selectedItem.newKey ?? selectedItem.key}
                  />
                )}
              </div>
              <div className="table-cell table-cell__value">
                <Input
                  className="input_edit"
                  density="dense"
                  invalid={!validation.isEditValueValid}
                  onChange={value =>
                    setSelectedItem({
                      ...selectedItem,
                      value,
                      index
                    })
                  }
                  required={isValueRequired}
                  setInvalid={value =>
                    setValidation(state => ({
                      ...state,
                      isEditValueValid: value
                    }))
                  }
                  type={valueType}
                  value={
                    valueType === 'password'
                      ? ''
                      : selectedItem.newValue ?? selectedItem.value
                  }
                />
              </div>
              <div className="table-cell table-cell__actions">
                <RoundedIcon
                  className="key-value-table__btn"
                  disabled={
                    isValueRequired &&
                    isKeyRequired &&
                    (!validation.isEditKeyValid ||
                      !validation.isEditValueValid ||
                      (selectedItem.newKey !== selectedItem.key &&
                        isKeyNotUnique(selectedItem.newKey, content)))
                  }
                  onClick={handleEditItem}
                  tooltipText="Apply"
                >
                  <Checkmark />
                </RoundedIcon>
                <RoundedIcon
                  className="key-value-table__btn"
                  onClick={handleResetForm}
                  tooltipText="Discard changes"
                >
                  <Close />
                </RoundedIcon>
              </div>
            </div>
          ) : (
            <div
              className="table-row"
              key={index}
              onClick={() => {
                if (withEditMode) {
                  setSelectedItem({ ...contentItem, index })
                  setEditMode(true)
                  setIsAddNewItem(false)
                  setValidation({
                    isKeyValid: true,
                    isValueValid: true,
                    isEditKeyValid: true,
                    isEditValueValid: true
                  })
                }
              }}
            >
              <div className="table-cell__inputs-wrapper">
                <div className="table-cell table-cell__key">
                  <Tooltip
                    template={<TextTooltipTemplate text={contentItem.key} />}
                  >
                    {contentItem.key}
                  </Tooltip>
                </div>
                <div className="table-cell table-cell__value">
                  <Tooltip
                    template={<TextTooltipTemplate text={contentItem.value} />}
                  >
                    {contentItem.value}
                  </Tooltip>
                </div>
              </div>
              <div className="table-cell table-cell__actions">
                <RoundedIcon
                  className="key-value-table__btn"
                  onClick={event => {
                    event.preventDefault()
                  }}
                  tooltipText="Edit"
                >
                  <Edit />
                </RoundedIcon>

                <RoundedIcon
                  className="key-value-table__btn"
                  onClick={event => {
                    event.stopPropagation()
                    deleteItem(index, contentItem)
                  }}
                  tooltipText="Delete"
                >
                  <Delete />
                </RoundedIcon>
              </div>
            </div>
          )
        })}
      </div>
      {isAddNewItem ? (
        <div className="table-row table-row__last no-hover">
          <div className="table-cell__inputs-wrapper">
            <div className="table-cell table-cell__key">
              {keyType === 'select' ? (
                <Select
                  density="dense"
                  label={keyValue || keyLabel}
                  onClick={setKey}
                  options={keyOptions}
                />
              ) : (
                <Input
                  density="dense"
                  floatingLabel
                  label={keyLabel}
                  invalid={
                    isKeyNotUnique(keyValue, content) || !validation.isKeyValid
                  }
                  invalidText={
                    isKeyNotUnique(keyValue, content)
                      ? 'Name already exists'
                      : 'This field is invalid'
                  }
                  onChange={setKey}
                  required={isKeyRequired}
                  setInvalid={value =>
                    setValidation(state => ({
                      ...state,
                      isKeyValid: value
                    }))
                  }
                  type="text"
                />
              )}
            </div>
            <div className="table-cell table-cell__value">
              <Input
                density="dense"
                floatingLabel
                invalid={!validation.isValueValid}
                label={valueLabel}
                onChange={setValue}
                required={isValueRequired}
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isValueValid: value
                  }))
                }
                type={valueType}
              />
            </div>
          </div>
          <div className="table-cell table-cell__actions">
            <RoundedIcon
              className="btn-add"
              disabled={isKeyNotUnique(keyValue, content)}
              onClick={saveItem}
              tooltipText="Add item"
            >
              <Plus />
            </RoundedIcon>

            <RoundedIcon
              className="btn-add"
              onClick={handleResetForm}
              tooltipText="Discard changes"
            >
              <Close />
            </RoundedIcon>
          </div>
        </div>
      ) : (
        <div className="table-row table-row__last no-hover">
          <button
            className="add-new-item-btn"
            onClick={() => {
              handleResetForm()
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

KeyValueTableView.defaultProps = {
  isKeyEditable: true,
  keyLabel: 'Key',
  keyOptions: [],
  keyType: 'input',
  selectedItem: {},
  valueLabel: 'Value',
  valueType: 'text',
  withEditMode: false
}

KeyValueTableView.propTypes = {
  addNewItemLabel: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string
    })
  ).isRequired,
  deleteItem: PropTypes.func.isRequired,
  handleEditItem: PropTypes.func.isRequired,
  handleResetForm: PropTypes.func.isRequired,
  isAddNewItem: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isKeyEditable: PropTypes.bool.isRequired,
  isKeyNotUnique: PropTypes.func.isRequired,
  isKeyRequired: PropTypes.bool.isRequired,
  isValueRequired: PropTypes.bool.isRequired,
  keyHeader: PropTypes.string.isRequired,
  keyLabel: PropTypes.string,
  keyOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  ),
  keyType: PropTypes.string,
  keyValue: PropTypes.string.isRequired,
  saveItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.object,
  setEditMode: PropTypes.func.isRequired,
  setIsAddNewItem: PropTypes.func.isRequired,
  setKey: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  tableClassNames: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired,
  valueHeader: PropTypes.string.isRequired,
  valueLabel: PropTypes.string,
  valueType: PropTypes.string,
  withEditMode: PropTypes.bool
}

export default KeyValueTableView
