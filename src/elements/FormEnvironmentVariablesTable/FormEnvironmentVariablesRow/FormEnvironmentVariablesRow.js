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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import {
  FormInput,
  FormOnChange,
  FormSelect,
  TextTooltipTemplate,
  Tip,
  Tooltip
} from 'igz-controls/components'
import { FormRowActions } from 'igz-controls/elements'

import { environmentVariablesTypeOptions } from '../formEnvironmentVariablesTable.util'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { FORM_TABLE_EDITING_ITEM } from 'igz-controls/types'
import { ENV_VARIABLE_TYPE_SECRET } from '../../../constants'

import './formEnvironmentVariablesRow.scss'

const FormEnvironmentVariablesRow = ({
  applyChanges,
  deleteRow,
  disabled = false,
  discardOrDelete,
  editingItem = null,
  enterEditMode,
  fields,
  fieldsPath,
  index,
  isCurrentRowEditing,
  rowPath,
  setFieldValue,
  uniquenessValidator
}) => {
  const [fieldData, setFieldData] = useState(fields.value[index])

  const tableRowClassNames = classnames(
    'form-table__row',
    isCurrentRowEditing(rowPath) && 'form-table__row_active'
  )

  const valueColumn = useMemo(
    () =>
      fieldData.data.type === ENV_VARIABLE_TYPE_SECRET
        ? fieldData.data.secretName && fieldData.data.secretKey
          ? `${fieldData.data.secretName}:${fieldData.data.secretKey}`
          : fieldData.data.secretName
        : fieldData.data.value,
    [fieldData.data.secretKey, fieldData.data.secretName, fieldData.data.type, fieldData.data.value]
  )

  useEffect(() => {
    setFieldData(fields.value[index])
  }, [fields.value, index])

  const handleTypeChange = useCallback(
    type => {
      if (isCurrentRowEditing(rowPath)) {
        setFieldValue(`${rowPath}.data`, {
          key: fields.value[index].data.key,
          type
        })
      }
    },
    [fields.value, index, isCurrentRowEditing, rowPath, setFieldValue]
  )

  return (
    <>
      {isCurrentRowEditing(rowPath) && !disabled ? (
        <div className={tableRowClassNames} key={index}>
          <div className="form-table__cell form-table__cell_2">
            <FormInput
              density="normal"
              name={`${rowPath}.data.key`}
              placeholder="Name"
              required
              validationRules={[
                {
                  name: 'uniqueness',
                  label: 'Name must be unique',
                  pattern: newValue => uniquenessValidator(fields, newValue)
                }
              ]}
            />
          </div>
          <div className="form-table__cell form-table__cell_1">
            <FormSelect
              density="normal"
              name={`${rowPath}.data.type`}
              options={environmentVariablesTypeOptions}
              required
            />
          </div>
          <div className="form-table__cell form-table__cell_3">
            {fieldData.data.type === 'value' && (
              <FormInput
                density="normal"
                name={`${rowPath}.data.value`}
                placeholder="Value"
                required
              />
            )}
            {fieldData.data.type === 'secret' && (
              <>
                <FormInput
                  className="secret-name"
                  density="normal"
                  name={`${rowPath}.data.secretName`}
                  placeholder="Secret Name"
                  required
                  validationRules={getValidationRules('environmentVariables.secretName')}
                />
                <FormInput
                  density="normal"
                  name={`${rowPath}.data.secretKey`}
                  placeholder="Secret Key"
                  required
                  validationRules={getValidationRules('environmentVariables.secretKey')}
                />
              </>
            )}
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
          onClick={event => enterEditMode(event, fields, fieldsPath, index)}
        >
          <div className={classnames('form-table__cell', 'form-table__cell_2')}>
            <Tooltip template={<TextTooltipTemplate text={fieldData.data.key} />}>
              {fieldData.data.key}
            </Tooltip>
            {fields.value[index].doc && <Tip text={fields.value[index].doc} />}
          </div>
          <div className={classnames('form-table__cell', 'form-table__cell_1')}>
            <Tooltip template={<TextTooltipTemplate text={fieldData.data.type} />}>
              {fieldData.data.type}
            </Tooltip>
          </div>
          <div className={classnames('form-table__cell', 'form-table__cell_3')}>
            <Tooltip template={<TextTooltipTemplate text={valueColumn} />}>{valueColumn}</Tooltip>
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
      )}
      <FormOnChange handler={handleTypeChange} name={`${rowPath}.data.type`} />
    </>
  )
}

FormEnvironmentVariablesRow.propTypes = {
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
  setFieldValue: PropTypes.func.isRequired,
  uniquenessValidator: PropTypes.func.isRequired
}

export default FormEnvironmentVariablesRow
