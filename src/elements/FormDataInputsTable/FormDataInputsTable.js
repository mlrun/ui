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
import React, { useState } from 'react'
import { FieldArray } from 'react-final-form-arrays'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import FormActionButton from 'igz-controls/elements/FormActionButton/FormActionButton'
import FormDataInputsRow from './FormDataInputsRow/FormDataInputsRow'

import { useFormTable } from 'igz-controls/hooks'
import { targetPathInitialState } from '../../common/TargetPath/targetPath.util'

const FormDataInputsTable = ({
  className = '',
  disabled = false,
  exitEditModeTriggerItem = null,
  fieldsPath,
  formState,
  hasKwargs = false,
  params
}) => {
  const [dataInputState, setDataInputState] = useState(targetPathInitialState)
  const tableClassNames = classnames('form-table', className)
  const {
    addNewRow,
    applyChanges,
    bottomScrollRef,
    deleteRow,
    discardOrDelete,
    editingItem,
    enterEditMode,
    getTableArrayErrors,
    isCurrentRowEditing
  } = useFormTable(formState, exitEditModeTriggerItem)

  const uniquenessValidator = (fields, newValue) => {
    return !fields.value.some(({ data: { name } }, index) => {
      return newValue.trim() === name && index !== editingItem.ui.index
    })
  }

  const validateDataInputs = value => {
    const tableErrors = value?.reduce((errorData, dataInput, index) => {
      if (dataInput.isRequired && dataInput.data?.fieldInfo?.value === '') {
        errorData[index] = [
          {
            name: 'required',
            label: `'${dataInput.data.name}' data input is required`
          }
        ]
      }

      return errorData
    }, {})

    return !isEmpty(tableErrors) ? tableErrors : null
  }

  return (
    <div className={tableClassNames} data-testid={fieldsPath}>
      <div className="form-table__row form-table__header-row no-hover">
        <div className="form-table__cell form-table__cell_min"></div>
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Name" />}>Input name</Tooltip>
        </div>
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Value" />}>Path</Tooltip>
        </div>
        <div className="form-table__cell form-table__actions-cell" />
      </div>
      <FieldArray name={fieldsPath} validate={validateDataInputs}>
        {({ fields }) => {
          return (
            <>
              {fields.map((rowPath, index) => {
                return (
                  <FormDataInputsRow
                    applyChanges={applyChanges}
                    dataInputState={dataInputState}
                    deleteRow={deleteRow}
                    disabled={disabled}
                    discardOrDelete={discardOrDelete}
                    editingItem={editingItem}
                    enterEditMode={enterEditMode}
                    fields={fields}
                    fieldsPath={fieldsPath}
                    formState={formState}
                    getTableArrayErrors={getTableArrayErrors}
                    hasKwargs={hasKwargs}
                    index={index}
                    isCurrentRowEditing={isCurrentRowEditing}
                    key={rowPath}
                    params={params}
                    rowPath={rowPath}
                    setDataInputState={setDataInputState}
                    setFieldState={formState.form.mutators.setFieldState}
                    uniquenessValidator={uniquenessValidator}
                  />
                )
              })}
              {hasKwargs && (
                <FormActionButton
                  ref={bottomScrollRef}
                  hidden={editingItem?.ui?.isNew}
                  disabled={disabled}
                  fields={fields}
                  fieldsPath={fieldsPath}
                  label="Add input "
                  onClick={(...addRowArgs) => {
                    setDataInputState(targetPathInitialState)
                    addNewRow(...addRowArgs, {
                      data: {
                        name: '',
                        path: '',
                        fieldInfo: {
                          pathType: '',
                          value: ''
                        },
                        isChecked: true
                      },
                      doc: ''
                    })
                  }}
                />
              )}
            </>
          )
        }}
      </FieldArray>
    </div>
  )
}

FormDataInputsTable.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  exitEditModeTriggerItem: PropTypes.any,
  fieldsPath: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired,
  hasKwargs: PropTypes.bool,
  params: PropTypes.shape({}).isRequired
}

export default FormDataInputsTable
