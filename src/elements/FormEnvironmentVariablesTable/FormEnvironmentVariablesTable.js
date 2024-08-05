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
import { FieldArray } from 'react-final-form-arrays'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import { FormActionButton } from 'igz-controls/elements'
import FormEnvironmentVariablesRow from './FormEnvironmentVariablesRow/FormEnvironmentVariablesRow'

import { useFormTable } from 'igz-controls/hooks'

const FormEnvironmentVariablesTable = ({
  className = 'env-var-table',
  disabled = false,
  exitEditModeTriggerItem = null,
  fieldsPath,
  formState
}) => {
  const tableClassNames = classnames('form-table', className)
  const {
    addNewRow,
    applyChanges,
    bottomScrollRef,
    deleteRow,
    discardOrDelete,
    editingItem,
    enterEditMode,
    isCurrentRowEditing
  } = useFormTable(formState, exitEditModeTriggerItem)

  const uniquenessValidator = (fields, newValue) => {
    return !fields.value.some(({ data: { key } }, index) => {
      return newValue.trim() === key && index !== editingItem.ui.index
    })
  }

  return (
    <div className={tableClassNames} data-testid={fieldsPath}>
      <div className="form-table__row form-table__header-row no-hover">
        <div className="form-table__cell form-table__cell_2">
          <Tooltip template={<TextTooltipTemplate text="Name" />}>Name</Tooltip>
        </div>
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Type" />}>Type</Tooltip>
        </div>
        <div className="form-table__cell form-table__cell_3">
          <Tooltip template={<TextTooltipTemplate text="Value" />}>Value</Tooltip>
        </div>
        <div className="form-table__cell form-table__actions-cell" />
      </div>
      <FieldArray name={fieldsPath}>
        {({ fields }) => {
          return (
            <>
              {fields.map((rowPath, index) => {
                return (
                  <FormEnvironmentVariablesRow
                    applyChanges={applyChanges}
                    deleteRow={deleteRow}
                    disabled={disabled}
                    discardOrDelete={discardOrDelete}
                    editingItem={editingItem}
                    enterEditMode={enterEditMode}
                    fields={fields}
                    fieldsPath={fieldsPath}
                    index={index}
                    isCurrentRowEditing={isCurrentRowEditing}
                    key={rowPath}
                    rowPath={rowPath}
                    setFieldValue={formState.form.change}
                    uniquenessValidator={uniquenessValidator}
                  />
                )
              })}
              <FormActionButton
                disabled={disabled}
                hidden={editingItem?.ui?.isNew}
                ref={bottomScrollRef}
                fields={fields}
                fieldsPath={fieldsPath}
                label="Add environment variable"
                onClick={(...addRowArgs) =>
                  addNewRow(...addRowArgs, {
                    data: {
                      key: '',
                      type: 'value',
                      value: ''
                    }
                  })
                }
              />
            </>
          )
        }}
      </FieldArray>
    </div>
  )
}

FormEnvironmentVariablesTable.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  exitEditModeTriggerItem: PropTypes.any,
  fieldsPath: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired
}

export default FormEnvironmentVariablesTable
