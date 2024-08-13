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
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import KeyValueTableView from './KeyValueTableView'

const KeyValueTable = ({
  addNewItem,
  addNewItemLabel,
  className = '',
  content,
  deleteItem,
  defaultKeyValue = '',
  disabled = false,
  editItem = () => {},
  isKeyEditable,
  isKeyRequired = false,
  isValueRequired = false,
  keyHeader,
  keyLabel = 'Key',
  keyOptions = [],
  keyType = 'input',
  valueHeader,
  valueLabel = 'Value',
  valueType = 'text',
  withEditMode = false
}) => {
  const [isAddNewItem, setIsAddNewItem] = useState(false)
  const [isEditMode, setEditMode] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [validation, setValidation] = useState({
    isKeyValid: true,
    isValueValid: true,
    isEditKeyValid: true,
    isEditValueValid: true
  })
  const [key, setKey] = useState(defaultKeyValue || '')
  const [value, setValue] = useState('')

  const tableClassNames = classnames('key-value-table', className)

  useEffect(() => {
    return () => {
      setValidation({
        isKeyValid: true,
        isValueValid: true,
        isEditKeyValid: true,
        isEditValueValid: true
      })
    }
  }, [isAddNewItem])

  const saveItem = () => {
    const save = () => {
      addNewItem({ key, value })
      setKey(defaultKeyValue || '')
      setValue('')
      setIsAddNewItem(false)
    }

    if (isKeyRequired && !isValueRequired) {
      if (key.length > 0 && validation.isKeyValid) {
        save()
      } else {
        setValidation(state => ({
          ...state,
          isKeyValid: false
        }))
      }
    } else if (isValueRequired && !isKeyRequired) {
      if (value.length > 0 && validation.isValueValid) {
        save()
      } else {
        setValidation(state => ({
          ...state,
          isValueValid: false
        }))
      }
    } else if (isKeyRequired && isValueRequired) {
      if (key.length > 0 && validation.isKeyValid && value.length > 0 && validation.isValueValid) {
        save()
      } else {
        setValidation(state => ({
          ...state,
          isKeyValid: key.length > 0 && state.isKeyValid,
          isValueValid: value.length > 0 && state.isValueValid
        }))
      }
    } else if (key.length === 0 && value.length === 0) {
      setKey(defaultKeyValue || '')
      setValue('')
      setIsAddNewItem(false)
    } else if (validation.isKeyValid && validation.isValueValid) {
      save()
    }
  }

  const handleEditItem = () => {
    const saveEdit = () => {
      editItem(selectedItem)
      setEditMode(false)
      setSelectedItem(null)
    }

    if (isKeyRequired && !isValueRequired) {
      if (
        (selectedItem.newKey?.length > 0 || selectedItem.key.length > 0) &&
        validation.isEditKeyValid
      ) {
        saveEdit()
      } else {
        setValidation(state => ({
          ...state,
          isEditKeyValid: false
        }))
      }
    } else if (isValueRequired && !isKeyRequired) {
      if (selectedItem.value.length > 0 && validation.isEditValueValid) {
        saveEdit()
      } else {
        setValidation(state => ({
          ...state,
          isEditValueValid: false
        }))
      }
    } else if (isKeyRequired && isValueRequired) {
      if (
        (selectedItem.newKey?.length > 0 || selectedItem.key.length > 0) &&
        validation.isEditKeyValid &&
        selectedItem.value.length > 0 &&
        validation.isEditValueValid
      ) {
        saveEdit()
      }
    } else {
      saveEdit()
    }
  }

  const handleResetForm = () => {
    setKey(defaultKeyValue || '')
    setValue('')
    setIsAddNewItem(false)
    setEditMode(false)

    setValidation({
      isKeyValid: true,
      isValueValid: true,
      isEditKeyValid: true,
      isEditValueValid: true
    })
  }

  const isKeyNotUnique = (newKey, keys) => {
    return keyType !== 'select' && keys.some(({ key }) => newKey === key)
  }

  return (
    <KeyValueTableView
      addNewItemLabel={addNewItemLabel}
      content={content}
      deleteItem={deleteItem}
      disabled={disabled}
      handleEditItem={handleEditItem}
      handleResetForm={handleResetForm}
      isAddNewItem={isAddNewItem}
      isEditMode={isEditMode}
      isKeyEditable={isKeyEditable}
      isKeyNotUnique={isKeyNotUnique}
      isKeyRequired={isKeyRequired}
      isValueRequired={isValueRequired}
      keyHeader={keyHeader}
      keyLabel={keyLabel}
      keyOptions={keyOptions}
      keyType={keyType}
      keyValue={key}
      saveItem={saveItem}
      selectedItem={selectedItem}
      setEditMode={setEditMode}
      setIsAddNewItem={setIsAddNewItem}
      setKey={setKey}
      setSelectedItem={setSelectedItem}
      setValidation={setValidation}
      setValue={setValue}
      tableClassNames={tableClassNames}
      validation={validation}
      valueHeader={valueHeader}
      valueLabel={valueLabel}
      valueType={valueType}
      withEditMode={withEditMode}
    />
  )
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
  defaultKeyValue: PropTypes.string,
  deleteItem: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  editItem: PropTypes.func,
  isKeyRequired: PropTypes.bool,
  isValueRequired: PropTypes.bool,
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
  valueType: PropTypes.string,
  withEditMode: PropTypes.bool
}

export default KeyValueTable
