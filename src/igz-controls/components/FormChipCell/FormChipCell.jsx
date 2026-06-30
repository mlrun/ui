/*
Copyright 2022 Iguazio Systems Ltd.
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
import React, { useState, useCallback, useMemo } from 'react'
import lodash, { get, isEmpty, set, isNil } from 'lodash'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import FormChipCellView from './FormChipCellView'

import { CHIP_OPTIONS, VISIBLE_CHIPS_MAX_LENGTH } from '../../types'
import { CLICK, TAB, TAB_SHIFT } from '../../constants'
import { areArraysEqual } from '../../utils/common.util'
import { checkPatternsValidity } from '../../utils/validation.util'
import { generateChipsList } from '../../utils/generateChipsList.util'
import { uniquenessError } from './formChipCell.util'
import { useChipCell } from '../../hooks'

import './formChipCell.scss'

let FormChipCell = ({
  chipOptions = {
    background: 'purple',
    boldValue: false,
    borderRadius: 'primary',
    borderColor: 'transparent',
    density: 'dense',
    font: 'purple'
  },
  className = '',
  children,
  delimiter = null,
  formState,
  initialValues,
  isDeletable = false,
  isEditable = false,
  label = null,
  name,
  onClick = () => {},
  onExitEditModeCallback = null,
  shortChips = false,
  validationRules = {},
  validator = null,
  visibleChipsMaxLength = null,
  withInitialParentWidth = false
}) => {
  const chipsClassName = classnames('chips', className)
  const [chipSizeIsRecalculated, setChipSizeIsRecalculated] = useState(false)
  const {
    chipsCellRef,
    chipsWrapperRef,
    handleShowElements,
    hiddenChipsCounterRef,
    hiddenChipsPopUpRef,
    setChipsSizes,
    setShowHiddenChips,
    showChips,
    showHiddenChips,
    visibleChipsCount
  } = useChipCell(isEditable, visibleChipsMaxLength, withInitialParentWidth)

  const [editConfig, setEditConfig] = useState({
    chipIndex: null,
    isEdit: false,
    isKeyFocused: false,
    isValueFocused: false,
    isNewChip: false
  })

  let chips = useMemo(() => {
    return isEditable || visibleChipsMaxLength === 'all'
      ? {
          visibleChips: get(formState.values, name),
          hiddenChips: []
        }
      : generateChipsList(
          get(formState.values, name),
          visibleChipsMaxLength ? visibleChipsMaxLength : visibleChipsCount
        )
  }, [visibleChipsMaxLength, isEditable, visibleChipsCount, formState.values, name])

  const checkChipsList = useCallback(
    currentChipsList => {
      if (areArraysEqual(get(initialValues, name), currentChipsList, ['id'])) {
        set(formState.initialValues, name, currentChipsList)
      }

      formState.form.mutators.setFieldState(name, { modified: true })
      formState.form.mutators.setFieldState(name, { touched: true })
    },
    [initialValues, name, formState]
  )

  const handleAddNewChip = useCallback(
    (event, fields) => {
      const fieldsLength = fields.value?.length || 0

      if (!editConfig.isEdit && !editConfig.chipIndex) {
        formState.form.mutators.push(name, {
          id: fieldsLength + new Date(),
          key: '',
          value: '',
          delimiter: delimiter
        })
      }

      if (showHiddenChips) {
        setShowHiddenChips(false)
      }

      setEditConfig({
        chipIndex: fieldsLength,
        isEdit: true,
        isKeyFocused: true,
        isValueFocused: false,
        isNewChip: true
      })

      event && event.preventDefault()
    },
    [
      editConfig.isEdit,
      editConfig.chipIndex,
      showHiddenChips,
      formState.form.mutators,
      name,
      delimiter,
      setShowHiddenChips
    ]
  )

  const handleRemoveChip = useCallback(
    (event, fields, chipIndex, isOutsideClick = false) => {
      checkChipsList(
        lodash
          .chain(formState)
          .get(['values', name])
          .filter((_, index) => index !== chipIndex)
          .value()
      )

      if (fields.length === 1) {
        formState.form.change(name, [])
      } else {
        fields.remove(chipIndex)
      }

      onExitEditModeCallback && onExitEditModeCallback()
      event && !isOutsideClick && event.stopPropagation()
    },
    [checkChipsList, formState, name, onExitEditModeCallback]
  )

  const handleEditChip = useCallback(
    (event, fields, nameEvent, isOutsideClick) => {
      const { key, value } = fields.value[editConfig.chipIndex]
      const isChipNotEmpty = !!(key?.trim() && value?.trim())

      if (nameEvent === CLICK) {
        if (!isChipNotEmpty) {
          handleRemoveChip(event, fields, editConfig.chipIndex, isOutsideClick)
        }

        setEditConfig({
          chipIndex: null,
          isEdit: false,
          isKeyFocused: false,
          isValueFocused: false,
          isNewChip: false
        })
        isChipNotEmpty && onExitEditModeCallback && onExitEditModeCallback()
      } else if (nameEvent === TAB) {
        if (!isChipNotEmpty) {
          handleRemoveChip(event, fields, editConfig.chipIndex)
        }

        setEditConfig(prevState => {
          const lastChipSelected = prevState.chipIndex + 1 > fields.value.length - 1

          isChipNotEmpty && lastChipSelected && onExitEditModeCallback && onExitEditModeCallback()

          return {
            chipIndex: lastChipSelected ? null : prevState.chipIndex + 1,
            isEdit: !lastChipSelected,
            isKeyFocused: !lastChipSelected,
            isValueFocused: false,
            isNewChip: false
          }
        })
      } else if (nameEvent === TAB_SHIFT) {
        if (!isChipNotEmpty) {
          handleRemoveChip(event, fields, editConfig.chipIndex)
        }

        setEditConfig(prevState => {
          const firstChipIsSelected = prevState.chipIndex === 0

          isChipNotEmpty &&
            firstChipIsSelected &&
            onExitEditModeCallback &&
            onExitEditModeCallback()

          return {
            chipIndex: firstChipIsSelected ? null : prevState.chipIndex - 1,
            isEdit: !firstChipIsSelected,
            isKeyFocused: false,
            isValueFocused: !firstChipIsSelected,
            isNewChip: false
          }
        })
      }

      checkChipsList(get(formState.values, name))

      if (
        (editConfig.chipIndex > 0 && editConfig.chipIndex < fields.value.length - 1) ||
        (fields.value.length > 1 && editConfig.chipIndex === 0 && nameEvent !== TAB_SHIFT) ||
        (fields.value.length > 1 &&
          editConfig.chipIndex === fields.value.length - 1 &&
          nameEvent !== TAB)
      ) {
        event && event.preventDefault()
      }
    },
    [
      editConfig.chipIndex,
      checkChipsList,
      formState.values,
      name,
      onExitEditModeCallback,
      handleRemoveChip
    ]
  )

  const handleToEditMode = useCallback(
    (event, chipIndex, keyName) => {
      if (isEditable) {
        const { clientX: pointerCoordinateX, clientY: pointerCoordinateY } = event
        let isKeyClicked = false
        const isClickedInsideInputElement = (
          pointerCoordinateX,
          pointerCoordinateY,
          inputElement
        ) => {
          if (inputElement) {
            const {
              top: topPosition,
              left: leftPosition,
              right: rightPosition,
              bottom: bottomPosition
            } = inputElement.getBoundingClientRect()
            if (pointerCoordinateX > rightPosition || pointerCoordinateX < leftPosition)
              return false
            if (pointerCoordinateY > bottomPosition || pointerCoordinateY < topPosition)
              return false

            return true
          }
        }
        event.stopPropagation()

        if (event.target.nodeName !== 'INPUT') {
          if (event.target.firstElementChild) {
            isKeyClicked = isClickedInsideInputElement(
              pointerCoordinateX,
              pointerCoordinateY,
              event.target.firstElementChild
            )
          }
        } else {
          isKeyClicked = event.target.name === keyName
        }

        setEditConfig(preState => ({
          ...preState,
          chipIndex,
          isEdit: true,
          isKeyFocused: isKeyClicked,
          isValueFocused: !isKeyClicked
        }))
      }

      onClick && onClick()
    },
    [isEditable, onClick]
  )

  const validateFields = fieldsArray => {
    if (!fieldsArray) return null

    let errorData = []

    const uniquenessValidator = (newValue, idx) => {
      return !fieldsArray.some(({ key }, index) => {
        return newValue === key && index !== idx
      })
    }

    if (!isEmpty(validationRules)) {
      errorData = fieldsArray.map(chip => {
        const [keyValidation, valueValidation] = validateChip(chip)

        if (keyValidation && valueValidation) return { key: keyValidation, value: valueValidation }

        if (keyValidation) return { key: keyValidation }

        if (valueValidation) return { value: valueValidation }

        return null
      })
    }

    // uniqueness
    fieldsArray.forEach((chip, index) => {
      const isUnique = uniquenessValidator(chip.key, index)

      if (!isUnique) {
        if (get(errorData, [index, 'key'], false)) {
          errorData.at(index).key.push(uniquenessError)
        } else {
          set(errorData, [index, 'key'], [uniquenessError])
        }
      }
    })

    if (isEmpty(errorData) && validator) {
      errorData = validator(fieldsArray)
    }

    if (errorData.every(label => isNil(label))) {
      return null
    }

    return errorData
  }

  const validateChip = ({ key, value, disabled }) => {
    const validateField = (value, field) => {
      const [newRules, isValidField] = checkPatternsValidity(
        validationRules[field].filter(rule => rule.pattern),
        value
      )

      if (isValidField) return null

      const invalidRules = newRules.filter(rule => !rule.isValid)

      return invalidRules.map(rule => ({ name: rule.name, label: rule.label }))
    }

    return disabled ? [null, null] : [validateField(key, 'key'), validateField(value, 'value')]
  }

  return (
    <div className={chipsClassName} data-testid={`${name}-chips`}>
      {label && <div className="chips__label">{label}</div>}
      <div className={label ? 'chips__wrapper' : ''}>
        <FormChipCellView
          chipOptions={chipOptions}
          chipSizeIsRecalculated={chipSizeIsRecalculated}
          chips={chips}
          editConfig={editConfig}
          formState={formState}
          handleAddNewChip={handleAddNewChip}
          handleEditChip={handleEditChip}
          handleRemoveChip={handleRemoveChip}
          handleShowElements={handleShowElements}
          handleToEditMode={handleToEditMode}
          isDeletable={isDeletable}
          isEditable={isEditable}
          name={name}
          ref={{ chipsCellRef, chipsWrapperRef, hiddenChipsCounterRef, hiddenChipsPopUpRef }}
          setChipSizeIsRecalculated={setChipSizeIsRecalculated}
          setChipsSizes={setChipsSizes}
          setEditConfig={setEditConfig}
          shortChips={shortChips}
          showChips={showChips}
          showHiddenChips={showHiddenChips}
          validateFields={validateFields}
          validationRules={validationRules}
          visibleChipsMaxLength={visibleChipsMaxLength}
        >
          {children}
        </FormChipCellView>
      </div>
    </div>
  )
}

FormChipCell.propTypes = {
  chipOptions: CHIP_OPTIONS,
  children: PropTypes.node,
  className: PropTypes.string,
  delimiter: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  formState: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  isDeletable: PropTypes.bool,
  isEditable: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onExitEditModeCallback: PropTypes.func,
  shortChips: PropTypes.bool,
  validationRules: PropTypes.object,
  validator: PropTypes.func,
  visibleChipsMaxLength: VISIBLE_CHIPS_MAX_LENGTH,
  withInitialParentWidth: PropTypes.bool
}

FormChipCell = React.memo(FormChipCell)

export default FormChipCell
