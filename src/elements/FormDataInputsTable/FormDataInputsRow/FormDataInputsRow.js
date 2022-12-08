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
import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { FormInput, TextTooltipTemplate, Tip, Tooltip } from 'igz-controls/components'
import FormRowActions from 'igz-controls/elements/FormRowActions/FormRowActions'
import TargetPath from '../../../common/TargetPath/TargetPath'

import { DATA_INPUT_STATE } from '../../../types'
import { FORM_TABLE_EDITING_ITEM } from 'igz-controls/types'
import {
  handleStoreInputPathChange,
  targetPathInitialState
} from '../../../common/TargetPath/targetPath.util'

const FormDataInputsRow = ({
  applyChanges,
  dataInputState,
  deleteRow,
  disabled,
  discardOrDelete,
  editingItem,
  enterEditMode,
  fields,
  fieldsPath,
  formState,
  index,
  rowPath,
  setDataInputState,
  setFieldState,
  uniquenessValidator
}) => {
  const [fieldData, setFieldData] = useState(fields.value[index])
  const tableRowClassNames = classnames(
    'form-table__row',
    fieldsPath === editingItem?.ui?.fieldsPath && editingItem?.ui?.index === index && 'active'
  )

  useEffect(() => {
    setFieldData(fields.value[index])
  }, [fields.value, index])

  return (
    <>
      {editingItem &&
      index === editingItem.ui?.index &&
      fieldsPath === editingItem.ui?.fieldsPath &&
      !disabled ? (
        <div className={tableRowClassNames} key={index}>
          <div className="form-table__cell form-table__cell_1">
            <FormInput
              density="dense"
              name={`${rowPath}.data.name`}
              placeholder="Name"
              required
              validationRules={[
                {
                  name: 'uniqueness',
                  label: 'Name should be unique',
                  pattern: newValue => uniquenessValidator(fields, newValue)
                }
              ]}
            />
          </div>
          <div className="form-table__cell form-table__cell_1">
            <TargetPath
              formState={formState}
              formStateFieldInfo={`${rowPath}.data.fieldInfo`}
              inputDefaultValue={editingItem.data.fieldInfo?.value}
              name={`${rowPath}.data.path`}
              required
              selectDefaultValue={editingItem.data.path && editingItem.data.fieldInfo?.pathType}
              selectPlaceholder="Path Scheme"
              setFieldState={setFieldState}
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
          onClick={event => {
            setDataInputState(targetPathInitialState)
            handleStoreInputPathChange(
              dataInputState,
              setDataInputState,
              fields.value[index].data.fieldInfo.value
            )
            enterEditMode(event, fields, fieldsPath, index)
          }}
        >
          <div
            className={classnames(
              'form-table__cell',
              'form-table__cell_1',
              'form-table__name-cell'
            )}
          >
            <Tooltip template={<TextTooltipTemplate text={fieldData.data.name} />}>
              {fieldData.data.name}
            </Tooltip>
            {fields.value[index].doc && <Tip text={fields.value[index].doc} />}
          </div>
          <div className={classnames('form-table__cell', 'form-table__cell_1')}>
            <Tooltip template={<TextTooltipTemplate text={fieldData.data.path} />}>
              {fieldData.data.path}
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
  )
}

FormDataInputsRow.defaultProps = {
  disabled: false,
  editingItem: null
}

FormDataInputsRow.propTypes = {
  applyChanges: PropTypes.func.isRequired,
  dataInputState: DATA_INPUT_STATE.isRequired,
  deleteRow: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  discardOrDelete: PropTypes.func.isRequired,
  editingItem: FORM_TABLE_EDITING_ITEM,
  enterEditMode: PropTypes.func.isRequired,
  fields: PropTypes.shape({}).isRequired,
  fieldsPath: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  rowPath: PropTypes.string.isRequired,
  setDataInputState: PropTypes.func.isRequired,
  setFieldState: PropTypes.func.isRequired,
  uniquenessValidator: PropTypes.func.isRequired
}

export default FormDataInputsRow
