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

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import FormActionButton from 'igz-controls/elements/FormActionButton/FormActionButton'
import FormDataInputsRow from './FormDataInputsRow/FormDataInputsRow'

import { useFormTable } from 'igz-controls/hooks/useFormTable.hook'
import { targetPathInitialState } from '../../common/TargetPath/targetPath.util'

const FormDataInputsTable = ({ className, disabled, fieldsPath, formState }) => {
  const [dataInputState, setDataInputState] = useState(targetPathInitialState)
  const tableClassNames = classnames('form-table', className)
  const {
    editingItem,
    addNewRow,
    applyChanges,
    deleteRow,
    discardOrDelete,
    enterEditMode,
    bottomScrollRef
  } = useFormTable(formState)

  const uniquenessValidator = (fields, newValue) => {
    return !fields.value.some(({ data: { name } }, index) => {
      return newValue.trim() === name && index !== editingItem.ui.index
    })
  }

  return (
    <div className={tableClassNames}>
      <div className="form-table__row form-table__header-row no-hover">
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Name" />}>Input name</Tooltip>
        </div>
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Value" />}>Path</Tooltip>
        </div>
        <div className="form-table__cell form-table__actions-cell" />
      </div>
      <FieldArray name={fieldsPath}>
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
                    index={index}
                    key={rowPath}
                    rowPath={rowPath}
                    setDataInputState={setDataInputState}
                    setFieldState={formState.form.mutators.setFieldState}
                    uniquenessValidator={uniquenessValidator}
                  />
                )
              })}
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
                      }
                    },
                    doc: ''
                  })
                }}
              />
            </>
          )
        }}
      </FieldArray>
    </div>
  )
}

FormDataInputsTable.defaultProps = {
  disabled: false,
  className: ''
}

FormDataInputsTable.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fieldsPath: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired
}

export default FormDataInputsTable
