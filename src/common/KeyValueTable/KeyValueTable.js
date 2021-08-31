import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import KeyValueTableView from './KeyValueTableView'

const KeyValueTable = ({
  addNewItem,
  addNewItemLabel,
  className,
  content,
  deleteItem,
  editItem,
  isKeyRequired,
  isValueRequired,
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
  const [validation, setValidation] = useState({
    isKeyValid: true,
    isValueValid: true
  })
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

  const tableClassNames = classnames('key-value-table', className)

  const saveItem = () => {
    const save = () => {
      addNewItem({ key, value })
      setKey('')
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
      if (
        key.length > 0 &&
        validation.isKeyValid &&
        value.length > 0 &&
        validation.isValueValid
      ) {
        save()
      } else {
        setValidation(state => ({
          isKeyValid: key.length > 0 && state.isKeyValid,
          isValueValid: value.length > 0 && state.isValueValid
        }))
      }
    } else if (key.length === 0 && value.length === 0) {
      setKey('')
      setValue('')
      setIsAddNewItem(false)
    } else {
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
        validation.isKeyValid
      ) {
        saveEdit()
      } else {
        setValidation(state => ({
          ...state,
          isKeyValid: false
        }))
      }
    } else if (isValueRequired && !isKeyRequired) {
      if (selectedItem.value.length > 0 && validation.isValueValid) {
        saveEdit()
      } else {
        setValidation(state => ({
          ...state,
          isValueValid: false
        }))
      }
    } else if (isKeyRequired && isValueRequired) {
      if (
        (selectedItem.newKey?.length > 0 || selectedItem.key.length > 0) &&
        validation.isKeyValid &&
        selectedItem.value.length > 0 &&
        validation.isValueValid
      ) {
        saveEdit()
      }
    } else {
      saveEdit()
    }
  }

  const handleResetForm = () => {
    setKey('')
    setValue('')
    setIsAddNewItem(false)
    setValidation({
      isKeyValid: true,
      isValueValid: true
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
      handleEditItem={handleEditItem}
      handleResetForm={handleResetForm}
      isAddNewItem={isAddNewItem}
      isEditMode={isEditMode}
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
      withEditMode={withEditMode}
    />
  )
}

KeyValueTable.defaultProps = {
  className: '',
  editItem: () => {},
  isKeyRequired: false,
  isValueRequired: false,
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
  withEditMode: PropTypes.bool
}

export default KeyValueTable
