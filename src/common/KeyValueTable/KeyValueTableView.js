/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Input from '../Input/Input'
import Select from '../Select/Select'
import { Tooltip, TextTooltipTemplate, RoundedIcon } from 'igz-controls/components'

import { ReactComponent as Close } from 'igz-controls/images/close.svg'
import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark2.svg'

import './keyValueTable.scss'

const KeyValueTableView = ({
  addNewItemLabel,
  content,
  deleteItem,
  disabled,
  handleEditItem,
  handleResetForm,
  isAddNewItem,
  isEditMode,
  isKeyEditable = true,
  isKeyNotUnique,
  isKeyRequired,
  isValueRequired,
  keyHeader,
  keyLabel = 'Key',
  keyOptions = [],
  keyType = 'input',
  keyValue,
  saveItem,
  selectedItem = {},
  setEditMode,
  setIsAddNewItem,
  setKey,
  setSelectedItem,
  setValidation,
  setValue,
  tableClassNames,
  validation,
  valueHeader,
  valueLabel = 'Value',
  valueType = 'text',
  withEditMode = false
}) => {
  const addBtnClassNames = classnames('add-new-item-btn', disabled && 'disabled')

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
          return isEditMode && index === selectedItem.index && !disabled ? (
            <div className="table-row table-row_edit" key={index}>
              <div className="table-cell__inputs-wrapper">
                <div className="table-cell table-cell__key">
                  {!isKeyEditable ? (
                    <Tooltip template={<TextTooltipTemplate text={contentItem.key} />}>
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
                      valueType === 'password' ? '' : selectedItem.newValue ?? selectedItem.value
                    }
                  />
                </div>
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
                  id="key-value-table-apply"
                  onClick={handleEditItem}
                  tooltipText="Apply"
                >
                  <Checkmark />
                </RoundedIcon>
                <RoundedIcon
                  className="key-value-table__btn"
                  id="key-value-table-close"
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
                  <Tooltip template={<TextTooltipTemplate text={contentItem.key} />}>
                    {contentItem.key}
                  </Tooltip>
                </div>
                <div className="table-cell table-cell__value">
                  <Tooltip template={<TextTooltipTemplate text={contentItem.value} />}>
                    {contentItem.value}
                  </Tooltip>
                </div>
              </div>
              <div className="table-cell table-cell__actions">
                <RoundedIcon
                  className="key-value-table__btn"
                  id="key-value-table-edit"
                  onClick={event => {
                    event.preventDefault()
                  }}
                  tooltipText="Edit"
                >
                  <Edit />
                </RoundedIcon>

                <RoundedIcon
                  className="key-value-table__btn"
                  id="key-value-table-delete"
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
      {isAddNewItem && !disabled ? (
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
                  invalid={isKeyNotUnique(keyValue, content) || !validation.isKeyValid}
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
              id="key-value-table-apply"
              onClick={saveItem}
              tooltipText="Apply"
            >
              <Checkmark />
            </RoundedIcon>

            <RoundedIcon
              className="btn-add"
              id="key-value-table-discard"
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
            className={addBtnClassNames}
            onClick={() => {
              if (!disabled) {
                handleResetForm()
                setIsAddNewItem(true)
              }
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

KeyValueTableView.propTypes = {
  addNewItemLabel: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string
    })
  ).isRequired,
  deleteItem: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
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
