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
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FieldArray } from 'react-final-form-arrays'

import FormSelect from '../../components/FormSelect/FormSelect'
import FormInput from '../../components/FormInput/FormInput'
import Tooltip from '../../components/Tooltip/Tooltip'
import TextTooltipTemplate from '../../components/TooltipTemplate/TextTooltipTemplate'
import FormActionButton from '../../elements/FormActionButton/FormActionButton'
import FormRowActions from '../../elements/FormRowActions/FormRowActions'

import { useFormTable } from '../../hooks'
import { INPUT_VALIDATION_RULES } from '../../types'

const FormKeyValueTable = ({
  actionButtonId = '',
  addNewItemLabel = 'Add new item',
  className = '',
  defaultKey = '',
  disabled = false,
  exitEditModeTriggerItem = null,
  fieldsPath,
  formState,
  isKeyEditable = true,
  isKeyRequired = true,
  isValueRequired = true,
  keyHeader = 'Key',
  keyLabel = 'Key',
  keyOptions = null,
  keyValidationRules = [],
  onExitEditModeCallback = () => {},
  valueHeader = 'Value',
  valueLabel = 'Value',
  valueType = 'text',
  valueValidationRules = []
}) => {
  const tableClassNames = classnames(
    'form-table form-key-value-table',
    disabled && 'form-table_disabled',
    className
  )
  const {
    addNewRow,
    applyChanges,
    bottomScrollRef,
    deleteRow,
    discardOrDelete,
    editingItem,
    enterEditMode,
    isCurrentRowEditing
  } = useFormTable(formState, exitEditModeTriggerItem, onExitEditModeCallback)

  const uniquenessValidator = (fields, newValue) => {
    return !fields.value.some(({ data: { key } }, index) => {
      return newValue.trim() === key.trim() && index !== editingItem.ui.index
    })
  }

  const getKeyTextTemplate = keyValue => {
    return <Tooltip template={<TextTooltipTemplate text={keyValue} />}>{keyValue}</Tooltip>
  }

  return (
    <div className={tableClassNames} data-testid={fieldsPath}>
      <div className="form-table__row form-table__header-row no-hover">
        <div className="form-table__cell form-table__cell_1">{keyHeader}</div>
        <div className="form-table__cell form-table__cell_1">{valueHeader}</div>
        <div className="form-table__cell form-table__actions-cell" />
      </div>
      <FieldArray name={fieldsPath}>
        {({ fields }) => (
          <>
            {fields.map((rowPath, index) => {
              const tableRowClassNames = classnames(
                'form-table__row',
                isCurrentRowEditing(rowPath) && 'form-table__row_active'
              )

              return editingItem && index === editingItem.ui.index && !disabled ? (
                <div className={tableRowClassNames} key={index}>
                  <div className="form-table__cell form-table__cell_1">
                    {keyOptions ? (
                      <FormSelect
                        name={`${rowPath}.data.key`}
                        density="normal"
                        options={keyOptions}
                      />
                    ) : isKeyEditable || editingItem.ui.isNew ? (
                      <FormInput
                        className="input_edit"
                        placeholder={keyLabel}
                        density="normal"
                        name={`${rowPath}.data.key`}
                        required={isKeyRequired}
                        validationRules={[
                          ...keyValidationRules,
                          {
                            name: 'uniqueness',
                            label: 'Name must be unique',
                            pattern: newValue => uniquenessValidator(fields, newValue)
                          }
                        ]}
                      />
                    ) : (
                      getKeyTextTemplate(fields.value[index].data.key)
                    )}
                  </div>
                  <div className="form-table__cell form-table__cell_1">
                    <FormInput
                      className="input_edit"
                      placeholder={valueLabel}
                      density="normal"
                      name={`${rowPath}.data.value`}
                      type={valueType}
                      required={isValueRequired}
                      validationRules={valueValidationRules}
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
                  <div className="form-table__cell form-table__cell_1">
                    {getKeyTextTemplate(fields.value[index].data.key)}
                  </div>
                  <div className="form-table__cell form-table__cell_1">
                    <Tooltip
                      template={
                        <TextTooltipTemplate
                          text={valueType === 'password' ? null : fields.value[index].data.value}
                        />
                      }
                    >
                      {valueType === 'password' ? '*****' : fields.value[index].data.value}
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
              )
            })}

            <FormActionButton
              ref={bottomScrollRef}
              disabled={disabled}
              hidden={editingItem?.ui?.isNew}
              fields={fields}
              id={actionButtonId}
              label={addNewItemLabel}
              onClick={(...addRowArgs) =>
                addNewRow(...addRowArgs, {
                  data: {
                    key: defaultKey || '',
                    value: ''
                  }
                })
              }
              fieldsPath={fieldsPath}
            />
          </>
        )}
      </FieldArray>
    </div>
  )
}

FormKeyValueTable.propTypes = {
  actionButtonId: PropTypes.string,
  addNewItemLabel: PropTypes.string,
  className: PropTypes.string,
  defaultKey: PropTypes.string,
  disabled: PropTypes.bool,
  exitEditModeTriggerItem: PropTypes.any,
  fieldsPath: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired,
  isKeyEditable: PropTypes.bool,
  isKeyRequired: PropTypes.bool,
  isValueRequired: PropTypes.bool,
  keyHeader: PropTypes.string,
  keyLabel: PropTypes.string,
  keyOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  ),
  keyValidationRules: INPUT_VALIDATION_RULES,
  onExitEditModeCallback: PropTypes.func,
  valueHeader: PropTypes.string,
  valueLabel: PropTypes.string,
  valueType: PropTypes.string,
  valueValidationRules: INPUT_VALIDATION_RULES
}

export default FormKeyValueTable
