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
import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import { isPlainObject } from 'lodash'

import {
  FormCheckBox,
  FormInput,
  FormRadio,
  FormSelect,
  FormToggle,
  TextTooltipTemplate,
  Tip,
  Tooltip
} from 'igz-controls/components'
import { FormRowActions } from 'igz-controls/elements'
import FormOnChange from '../../../common/FormOnChange/FormOnChange'

import {
  parameterTypeList,
  parameterTypeDict,
  parametersValueTypeOptions,
  parameterTypeBool,
  parameterTypeInt,
  parameterTypeFloat,
  parameterTypeStr,
  parameterTypeValueMap
} from '../formParametersTable.util'
import { parseParameterType } from '../../../components/JobWizard/JobWizard.util'
import { FORM_TABLE_EDITING_ITEM } from 'igz-controls/types'

import { ReactComponent as CustomIcon } from 'igz-controls/images/custom.svg'

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
  getTableArrayErrors,
  index,
  isCurrentRowEditing,
  rowPath,
  uniquenessValidator,
  withHyperparameters,
  withRequiredParameters
}) => {
  const [fieldData, setFieldData] = useState(fields.value[index])
  const [typeIsChanging, setTypeIsChanging] = useState(false)
  const tableRowClassNames = classnames(
    'form-table__row',
    !fieldData.data?.isChecked && 'form-table__row_excluded'
  )
  const tableGeneralRowClassNames = classnames(
    tableRowClassNames,
    fieldData.isRequired && index in getTableArrayErrors(fieldsPath) && 'form-table__row_invalid'
  )
  const tableEditingRowClassNames = classnames(tableRowClassNames, 'form-table__row_active')

  const getValueValidationRules = parameterType => {
    if (parameterType === parameterTypeDict) {
      return [
        {
          name: 'invalidStructure',
          label: 'Value is not a valid `dict` type',
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
    } else if (parameterType === parameterTypeInt) {
      return [
        {
          name: 'invalidInt',
          label: 'Value is not a valid `integer` type',
          pattern: newValue => {
            return parseInt(String(newValue)) === Number(newValue)
          }
        }
      ]
    } else {
      return []
    }
  }

  const getHyperValueValidationRules = fieldData => {
    const parameterType = fieldData.data.type

    return [
      {
        name: 'invalidStructure',
        label: `Not valid ${parameterTypeValueMap[parameterType] ?? ''} type`,
        pattern: newValue => {
          try {
            const parsedValue = JSON.parse(String(newValue))
            const valueIsArray = Array.isArray(parsedValue)

            if (valueIsArray) {
              if (fieldData.isUnsupportedType) {
                return parsedValue.every(hyperItemValue => {
                  const hyperItemType = parseParameterType(hyperItemValue)
                  return Boolean(parameterTypeValueMap[hyperItemType])
                })
              }

              return parsedValue.every(valueItem => {
                switch (parameterType) {
                  case parameterTypeStr:
                    return typeof valueItem === 'string'
                  case parameterTypeInt:
                    return Number.isInteger(valueItem)
                  case parameterTypeFloat:
                    return Number.isFinite(valueItem) && valueItem % 1 !== 0
                  case parameterTypeBool:
                    return typeof valueItem === 'boolean'
                  case parameterTypeList:
                    return Array.isArray(valueItem)
                  case parameterTypeDict:
                    return isPlainObject(valueItem)
                  default:
                    return false
                }
              })
            }

            return false
          } catch {
            return false
          }
        }
      }
    ]
  }

  const getValueTip = parameterType => {
    switch (parameterType) {
      case parameterTypeDict:
        return 'The valid `dict` type must be in the JSON format\n e.g. {"hello": "world"}'
      case parameterTypeList:
        return 'The valid `list` type must be in the JSON format\n e.g. ["hello", "world"]'
      default:
        return ''
    }
  }

  const getHyperValueTip = fieldData => {
    if (fieldData.isUnsupportedType) {
      return 'Example: ["hello", "world", 1, false, {}, []]'
    }

    const parameterType = fieldData.data.type
    switch (parameterType) {
      case parameterTypeStr:
        return 'Example: ["hello", "world"]'
      case parameterTypeInt:
        return 'Example: [1, 2, 3]'
      case parameterTypeFloat:
        return 'Example: [1.1, 1.2, 1.3]'
      case parameterTypeBool:
        return 'Example: [true, false]'
      case parameterTypeList:
        return 'Example: [["hello", "world"], [1, 2, 3]]'
      case parameterTypeDict:
        return 'Example: [{"hello": "world"}, {"test": true}]'
      default:
        return ''
    }
  }

  const resetValue = (newType, newIsHyper) => {
    if (isCurrentRowEditing(rowPath)) {
      queueMicrotask(() => {
        const fieldCurrentData = fields.value[index]
        const fieldType = newType ?? fieldCurrentData.data.type
        const fieldIsHyper = newIsHyper ?? fieldCurrentData.data.isHyper
        const parsedNumber = parseFloat(fieldCurrentData.data.value)
        let newValue =
          fieldType === parameterTypeBool && !fieldIsHyper ? 'false' : fieldIsHyper ? '[]' : ''

        if (newType && fieldCurrentData.isUnsupportedType) {
          formState.form.change(`${rowPath}.isUnsupportedType`, false)
        }

        const stringValueIsRetained =
          typeof (fieldCurrentData.data.value === 'string' || isFinite(parsedNumber)) &&
          fieldCurrentData.data.value !== '' &&
          (fieldIsHyper ||
            (![parameterTypeInt, parameterTypeFloat, parameterTypeBool].includes(fieldType) &&
              fieldCurrentData.data.type !== parameterTypeBool))
        const numberValueIsRetained =
          !fieldIsHyper &&
          [parameterTypeInt, parameterTypeFloat].includes(fieldType) &&
          isFinite(parsedNumber)

        if (stringValueIsRetained || numberValueIsRetained) {
          newValue = numberValueIsRetained ? parsedNumber : String(fieldCurrentData.data.value)
        }

        formState.form.change(`${rowPath}.data.value`, newValue)

        setTimeout(() => {
          formState.form.mutators.setFieldState(`${rowPath}.data.value`, {
            modified: stringValueIsRetained || numberValueIsRetained
          })
        })

        setTypeIsChanging(false)
      })
    }
  }

  const isRowDisabled = () => {
    return disabled || !fieldData.data?.isChecked
  }

  useEffect(() => {
    setFieldData(fields.value[index])
  }, [fields.value, index])

  return (
    <>
      {!fieldData.isHidden &&
        ((!fieldData.data.isHyper && !withHyperparameters) || withHyperparameters) && (
          <>
            {isCurrentRowEditing(rowPath) && !disabled ? (
              <div className={tableEditingRowClassNames} key={index}>
                <div className="form-table__cell form-table__cell_min">
                  {!fieldData.isRequired && (
                    <FormCheckBox
                      name={`${rowPath}.data.isChecked`}
                      onClick={event => event.stopPropagation()}
                    />
                  )}
                </div>
                {withHyperparameters && (
                  <div className="form-table__cell form-table__cell_hyper">
                    <FormToggle
                      density="normal"
                      label="Hyper"
                      name={`${rowPath}.data.isHyper`}
                      onChange={() => {
                        setTypeIsChanging(true)
                      }}
                    />
                  </div>
                )}
                <div className="form-table__cell form-table__cell_2">
                  <FormInput
                    label="Name"
                    disabled={fieldData.isPredefined}
                    name={`${rowPath}.data.name`}
                    placeholder="Name"
                    required
                    validationRules={[
                      {
                        name: 'uniqueness',
                        label: 'Name must be unique',
                        pattern: newValue => uniquenessValidator(fields, fieldsPath, newValue)
                      }
                    ]}
                  />
                </div>
                <div className="form-table__cell form-table__cell_1">
                  <FormSelect
                    label="Type"
                    onChange={() => {
                      setTypeIsChanging(true)
                    }}
                    name={`${rowPath}.data.type`}
                    options={fieldData?.parameterTypeOptions || parametersValueTypeOptions}
                    required={!fieldData.isPredefined}
                  />
                </div>
                <div className="form-table__cell form-table__cell_3">
                  {fieldData.data.isHyper && !typeIsChanging ? (
                    <FormInput
                      label="Values (comma separated)"
                      name={`${rowPath}.data.value`}
                      placeholder="Values"
                      required
                      tip={getHyperValueTip(fieldData)}
                      validationRules={getHyperValueValidationRules(fieldData)}
                    />
                  ) : fieldData.data.type === parameterTypeBool && !typeIsChanging ? (
                    <div className="radio-buttons-container">
                      <FormRadio name={`${rowPath}.data.value`} value="true" label="True" />
                      <FormRadio name={`${rowPath}.data.value`} value="false" label="False" />
                    </div>
                  ) : !typeIsChanging ? (
                    <FormInput
                      type={
                        [parameterTypeInt, parameterTypeFloat].includes(fieldData.data.type)
                          ? 'number'
                          : 'input'
                      }
                      label="Value"
                      name={`${rowPath}.data.value`}
                      placeholder="Value"
                      required
                      tip={getValueTip(fieldData.data.type)}
                      validationRules={getValueValidationRules(fieldData.data.type)}
                    />
                  ) : null}
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
                className={tableGeneralRowClassNames}
                key={index}
                onClick={event =>
                  !isRowDisabled() && enterEditMode(event, fields, fieldsPath, index)
                }
              >
                <div className="form-table__cell form-table__cell_min">
                  {!fieldData.isRequired && (
                    <FormCheckBox
                      name={`${rowPath}.data.isChecked`}
                      onClick={event => event.stopPropagation()}
                    />
                  )}
                </div>
                {withHyperparameters && (
                  <div className="form-table__cell form-table__cell_hyper">
                    <FormToggle name={`${rowPath}.data.isHyper`} disabled />
                  </div>
                )}
                <div className="form-table__cell form-table__cell_2 form-table__name-cell">
                  <div
                    className={classnames(
                      'form-table__name',
                      fieldData.isRequired &&
                        withRequiredParameters &&
                        'form-table__name_with-asterisk'
                    )}
                  >
                    <Tooltip template={<TextTooltipTemplate text={fieldData.data.name} />}>
                      {fieldData.data.name}
                    </Tooltip>
                  </div>
                  {!fieldData.isPredefined && (
                    <Tooltip
                      className="parameter-icon"
                      template={<TextTooltipTemplate text="Custom Parameter" />}
                    >
                      <CustomIcon />
                    </Tooltip>
                  )}
                  {fieldData.doc && <Tip className="parameter-icon" text={fieldData.doc} />}
                </div>
                <div className="form-table__cell form-table__cell_1">
                  <Tooltip template={<TextTooltipTemplate text={fieldData.data.type} />}>
                    {fieldData.data.type}
                  </Tooltip>
                </div>
                <div className="form-table__cell form-table__cell_3">
                  {fieldData.data.type === parameterTypeBool && !fieldData.data.isHyper ? (
                    <div className="radio-buttons-container">
                      <FormRadio
                        readOnly
                        name={`${rowPath}.data.value`}
                        value="true"
                        label="True"
                      />
                      <FormRadio
                        readOnly
                        name={`${rowPath}.data.value`}
                        value="false"
                        label="False"
                      />
                    </div>
                  ) : (
                    <Tooltip template={<TextTooltipTemplate text={String(fieldData.data.value)} />}>
                      {String(fieldData.data.value)}
                    </Tooltip>
                  )}
                </div>
                <FormRowActions
                  applyChanges={applyChanges}
                  deleteButtonIsHidden={fieldData.isPredefined}
                  deleteRow={deleteRow}
                  disabled={isRowDisabled()}
                  discardOrDelete={discardOrDelete}
                  editingItem={editingItem}
                  fieldsPath={fieldsPath}
                  hidden={!fieldData.data?.isChecked}
                  index={index}
                />
              </div>
            )}
          </>
        )}
      <FormOnChange handler={newType => resetValue(newType)} name={`${rowPath}.data.type`} />
      <FormOnChange
        handler={newIsHyper => resetValue(null, newIsHyper)}
        name={`${rowPath}.data.isHyper`}
      />
    </>
  )
}

FormParametersRow.defaultProps = {
  disabled: false,
  editingItem: null,
  withHyperparameters: false,
  withRequiredParameters: true
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
  isCurrentRowEditing: PropTypes.func.isRequired,
  rowPath: PropTypes.string.isRequired,
  uniquenessValidator: PropTypes.func.isRequired,
  withHyperparameters: PropTypes.bool,
  withRequiredParameters: PropTypes.bool
}

export default FormParametersRow
