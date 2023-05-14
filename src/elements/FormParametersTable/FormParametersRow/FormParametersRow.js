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
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import classnames from 'classnames'
import { OnChange } from 'react-final-form-listeners'
import { isEmpty } from 'lodash'

import {
  FormCheckBox,
  FormInput,
  FormSelect,
  TextTooltipTemplate,
  Tip,
  Tooltip
} from 'igz-controls/components'
import { FormRowActions } from 'igz-controls/elements'

import { FORM_TABLE_EDITING_ITEM } from 'igz-controls/types'
import {
  getParameterTypeOptions,
  parameterTypeList,
  parameterTypeMap,
  parametersValueTypeOptions
} from '../formParametersTable.util'

import './formParametersRow.scss'

const FormParametersRow = ({
  applyChanges,
  deleteRow,
  disabled,
  discardOrDelete,
  editingItem,
  enterEditMode,
  fields,
  fieldsPath,
  formState,
  index,
  isCurrentRowEditing,
  isHyperOptionDisabled,
  rowPath,
  uniquenessValidator
}) => {
  const parameterTypeOptions = useMemo(() => {
    return getParameterTypeOptions(isHyperOptionDisabled)
  }, [isHyperOptionDisabled])
  const [fieldData, setFieldData] = useState(fields.value[index])
  const tableRowClassNames = classnames(
    'form-table__row',
    'form-table__parameter-row',
    fieldsPath === editingItem?.ui?.fieldsPath && editingItem?.ui?.index === index && 'active',
    !fieldData.data.isChecked && 'excluded'
  )

  const getValueValidationRules = parameterType => {
    if (parameterType === parameterTypeMap) {
      return [
        {
          name: 'invalidStructure',
          label: 'Value is not a valid `map` type',
          pattern: newValue => {
            try {
              const parsedValue = JSON.parse(String(newValue))
              return (
                typeof parsedValue === 'object' &&
                !Array.isArray(parsedValue) &&
                parsedValue !== null
              )
            } catch {
              return false
            }
          }
        }
      ]
    } else if (parameterType === parameterTypeList) {
      return [
        {
          name: 'invalidStructure',
          label: 'Value is not a valid `list` type',
          pattern: newValue => {
            try {
              const parsedValue = JSON.parse(String(newValue))
              return Array.isArray(parsedValue)
            } catch {
              return false
            }
          }
        }
      ]
    } else {
      return []
    }
  }

  const getValueTip = parameterType => {
    return parameterType === parameterTypeMap
      ? 'The valid `map` type should be in the JSON format\n e.g. {"hello": "world"}'
      : parameterType === parameterTypeList
      ? 'The valid `list` type should be in the JSON format\n e.g. ["hello", "world"]'
      : ''
  }

  useEffect(() => {
    setFieldData(fields.value[index])
  }, [fields.value, index])

  return (
    <>
      {!fieldData.isHidden && (
        <>
          {editingItem &&
          index === editingItem.ui?.index &&
          fieldsPath === editingItem.ui?.fieldsPath &&
          !disabled ? (
            <div className={tableRowClassNames} key={index}>
              <div className="form-table__cell form-table__cell_1">
                <FormInput
                  density="normal"
                  disabled={fields.value[index].isDefault}
                  name={`${rowPath}.data.name`}
                  placeholder="Name"
                  required
                  validationRules={[
                    {
                      name: 'uniqueness',
                      label: 'Name should be unique',
                      pattern: newValue => uniquenessValidator(fields, fieldsPath, newValue)
                    }
                  ]}
                />
              </div>
              <div className="form-table__cell form-table__cell_1">
                <FormSelect
                  density="normal"
                  disabled={fields.value[index].isDefault}
                  name={`${rowPath}.data.type`}
                  options={parametersValueTypeOptions}
                  required
                />
              </div>
              <div className="form-table__cell form-table__cell_1">
                <FormSelect
                  density="normal"
                  name={`${rowPath}.data.parameterType`}
                  options={parameterTypeOptions}
                  required
                />
              </div>
              <div className="form-table__cell form-table__cell_1">
                <FormInput
                  density="normal"
                  name={`${rowPath}.data.value`}
                  placeholder="Value/S"
                  required
                  tip={getValueTip(fields.value[index].data.type)}
                  validationRules={getValueValidationRules(fields.value[index].data.type)}
                />
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
              <div
                className={classnames(
                  'form-table__cell',
                  'form-table__cell_1',
                  'form-table__name-cell',
                  fields.value[index].isDefault && 'disabled'
                )}
              >
                <FormCheckBox
                  name={`${rowPath}.data.isChecked`}
                  onClick={event => event.stopPropagation()}
                />
                <Tooltip template={<TextTooltipTemplate text={fieldData.data.name} />}>
                  {fieldData.data.name}
                </Tooltip>
                {fields.value[index].doc && <Tip text={fields.value[index].doc} />}
              </div>
              <div
                className={classnames(
                  'form-table__cell',
                  'form-table__cell_1',
                  fields.value[index].isDefault && 'disabled'
                )}
              >
                <Tooltip template={<TextTooltipTemplate text={fieldData.data.type} />}>
                  {fieldData.data.type}
                </Tooltip>
              </div>
              <div className="form-table__cell form-table__cell_1">
                <Tooltip template={<TextTooltipTemplate text={fieldData.data.parameterType} />}>
                  {fieldData.data.parameterType}
                </Tooltip>
              </div>
              <div className="form-table__cell form-table__cell_1">
                <Tooltip template={<TextTooltipTemplate text={String(fieldData.data.value)} />}>
                  {String(fieldData.data.value)}
                </Tooltip>
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
        </>
      )}
      <OnChange name={`${rowPath}.data.type`}>
        {() => {
          if (
            isCurrentRowEditing(rowPath) &&
            (!isEmpty(fieldData?.data?.value) || formState.modified[`${rowPath}.data.value`])
          ) {
            setTimeout(() => {
              formState.form.mutators.setFieldState(`${rowPath}.data.value`, { modified: true })
            })
          }
        }}
      </OnChange>
    </>
  )
}

FormParametersRow.defaultProps = {
  disabled: false,
  editingItem: null,
  isHyperOptionDisabled: false
}

FormParametersRow.propTypes = {
  applyChanges: PropTypes.func.isRequired,
  deleteRow: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  discardOrDelete: PropTypes.func.isRequired,
  editingItem: FORM_TABLE_EDITING_ITEM,
  enterEditMode: PropTypes.func.isRequired,
  fields: PropTypes.shape({}).isRequired,
  fieldsPath: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  isHyperOptionDisabled: PropTypes.bool,
  rowPath: PropTypes.string.isRequired,
  uniquenessValidator: PropTypes.func.isRequired
}

export default FormParametersRow
