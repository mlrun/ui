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
import React, { useCallback, useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty, pick } from 'lodash'

import { FormSelect, FormInput, TextTooltipTemplate, Tooltip } from 'igz-controls/components'
import { FormRowActions } from 'igz-controls/elements'
import FormOnChange from '../../../common/FormOnChange/FormOnChange'

import { FORM_TABLE_EDITING_ITEM } from 'igz-controls/types'
import { generateVolumeInputsData } from '../formVolumesTable.util'

import './formVolumeRow.scss'

const FormVolumesRow = ({
  applyChanges,
  deleteRow,
  disabled,
  discardOrDelete,
  editingItem,
  enterEditMode,
  fields,
  fieldsPath,
  index,
  isCurrentRowEditing,
  rowPath,
  setFieldValue
}) => {
  const [fieldData, setFieldData] = useState(fields.value[index])
  const [fieldRowData, setFieldRowData] = useState([])
  const tableRowClassNames = classnames(
    'form-table__row',
    'form-table__volume-row',
    isCurrentRowEditing(rowPath) && 'form-table__row_active'
  )

  const accessKeyFocusHandler = useCallback(
    (accessKey, secretRef) => {
      if (accessKey === secretRef) {
        setFieldValue(`${rowPath}.data.accessKey`, '')
      }
    },
    [rowPath, setFieldValue]
  )

  useLayoutEffect(() => {
    setFieldRowData(
      generateVolumeInputsData(fields.value[index], fields, editingItem, accessKeyFocusHandler)
    )
    setFieldData(fields.value[index])
  }, [accessKeyFocusHandler, editingItem, fields, index])

  const handleTypeChange = useCallback(() => {
    if (isCurrentRowEditing(rowPath)) {
      const fieldNewData = pick(fields.value[index].data, ['name', 'type', 'mountPath'])

      setFieldValue(`${rowPath}.data`, fieldNewData)
    }
  }, [fields.value, index, isCurrentRowEditing, rowPath, setFieldValue])

  return (
    <>
      {!fieldData.isHidden && (
        <>
          {isCurrentRowEditing(rowPath) && !isEmpty(fieldRowData) && !disabled ? (
            <div className={tableRowClassNames} key={index}>
              <div className="form-table__row_multiline">
                {fieldRowData.map(inputData => {
                  return (
                    !inputData.inputHidden && (
                      <div
                        key={inputData.fieldPath}
                        className="form-table__cell form-table__volume-cell"
                      >
                        {inputData.type === 'input' && (
                          <FormInput
                            customRequiredLabel={inputData.customRequiredLabel}
                            density="normal"
                            disabled={inputData.inputDisabled}
                            label={inputData.label}
                            tip={inputData.tip}
                            name={`${rowPath}.${inputData.fieldPath}`}
                            placeholder={inputData.placeholder}
                            required={inputData.required}
                            focused={inputData.focused}
                            onFocus={inputData.onFocus}
                            validationRules={inputData.validationRules ?? []}
                          />
                        )}
                        {inputData.type === 'select' && (
                          <FormSelect
                            density="normal"
                            disabled={inputData.inputDisabled}
                            label={inputData.label}
                            name={`${rowPath}.${inputData.fieldPath}`}
                            options={inputData.options}
                            required={inputData.required}
                          />
                        )}
                      </div>
                    )
                  )
                })}
              </div>
              <FormRowActions
                applyChanges={applyChanges}
                deleteRow={deleteRow}
                discardOrDelete={discardOrDelete}
                editingItem={editingItem}
                fieldsPath={fieldsPath}
                index={index}
              />
            </div>
          ) : (
            <div
              className={tableRowClassNames}
              key={index}
              onClick={event => !disabled && enterEditMode(event, fields, fieldsPath, index)}
            >
              {fieldRowData.map(inputData => {
                return (
                  !inputData.textHidden && (
                    <div key={inputData.fieldPath} className="form-table__cell form-table__cell_1">
                      <Tooltip
                        template={
                          <TextTooltipTemplate text={inputData.displayValue ?? inputData.value} />
                        }
                      >
                        {inputData.displayValue ?? inputData.value}
                      </Tooltip>
                    </div>
                  )
                )
              })}
              <FormRowActions
                applyChanges={applyChanges}
                deleteRow={deleteRow}
                discardOrDelete={discardOrDelete}
                editingItem={editingItem}
                fieldsPath={fieldsPath}
                index={index}
              />
            </div>
          )}
        </>
      )}
      <FormOnChange handler={handleTypeChange} name={`${rowPath}.data.type`} />
    </>
  )
}

FormVolumesRow.defaultProps = {
  disabled: false,
  editingItem: null
}

FormVolumesRow.propTypes = {
  applyChanges: PropTypes.func.isRequired,
  deleteRow: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  discardOrDelete: PropTypes.func.isRequired,
  editingItem: FORM_TABLE_EDITING_ITEM,
  enterEditMode: PropTypes.func.isRequired,
  fields: PropTypes.shape({}).isRequired,
  fieldsPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  rowPath: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired
}

export default FormVolumesRow
