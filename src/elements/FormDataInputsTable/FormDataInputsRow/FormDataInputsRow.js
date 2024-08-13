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

import { FormInput, TextTooltipTemplate, Tip, Tooltip, FormCheckBox } from 'igz-controls/components'
import { FormRowActions } from 'igz-controls/elements'
import TargetPath from '../../../common/TargetPath/TargetPath'

import { DATA_INPUT_STATE } from '../../../types'
import { FORM_TABLE_EDITING_ITEM } from 'igz-controls/types'
import {
  handleStoreInputPathChange,
  targetPathInitialState
} from '../../../common/TargetPath/targetPath.util'
import {
  AZURE_STORAGE_INPUT_PATH_SCHEME,
  DBFS_STORAGE_INPUT_PATH_SCHEME,
  GOOGLE_STORAGE_INPUT_PATH_SCHEME,
  HTTP_STORAGE_INPUT_PATH_SCHEME,
  HTTPS_STORAGE_INPUT_PATH_SCHEME,
  MODEL_PATH_DATA_INPUT,
  S3_INPUT_PATH_SCHEME,
  V3IO_INPUT_PATH_SCHEME
} from '../../../constants'

const FormDataInputsRow = ({
  applyChanges,
  dataInputState,
  deleteRow,
  disabled = false,
  discardOrDelete,
  editingItem = null,
  enterEditMode,
  fields,
  fieldsPath,
  formState,
  getTableArrayErrors,
  hasKwargs = false,
  index,
  isCurrentRowEditing,
  params,
  rowPath,
  setDataInputState,
  setFieldState,
  uniquenessValidator
}) => {
  const [fieldData, setFieldData] = useState(fields.value[index])

  useEffect(() => {
    setFieldData(fields.value[index])
  }, [fields.value, index])

  const isRowDisabled = () => {
    return disabled || !fieldData.data?.isChecked
  }

  return (
    <>
      {isCurrentRowEditing(rowPath) && !disabled ? (
        <div className={classnames('form-table__row', 'form-table__row_active')} key={index}>
          <div className="form-table__cell form-table__cell_min">
            {!fieldData.isRequired && (
              <FormCheckBox
                name={`${rowPath}.data.isChecked`}
                onClick={event => event.stopPropagation()}
              />
            )}
          </div>
          <div className="form-table__cell form-table__cell_1">
            <FormInput
              density="normal"
              name={`${rowPath}.data.name`}
              placeholder="Name"
              disabled={fieldData.isPredefined}
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
            <TargetPath
              density="normal"
              formState={formState}
              formStateFieldInfo={`${rowPath}.data.fieldInfo`}
              hiddenSelectOptionsIds={
                fieldData.data.name === MODEL_PATH_DATA_INPUT && fieldData.isPredefined
                  ? [
                      V3IO_INPUT_PATH_SCHEME,
                      S3_INPUT_PATH_SCHEME,
                      HTTP_STORAGE_INPUT_PATH_SCHEME,
                      HTTPS_STORAGE_INPUT_PATH_SCHEME,
                      AZURE_STORAGE_INPUT_PATH_SCHEME,
                      GOOGLE_STORAGE_INPUT_PATH_SCHEME,
                      DBFS_STORAGE_INPUT_PATH_SCHEME
                    ]
                  : []
              }
              inputDefaultValue={editingItem.data.fieldInfo?.value}
              name={`${rowPath}.data.path`}
              params={params}
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
          className={classnames(
            'form-table__row',
            fieldData.isRequired &&
              index in getTableArrayErrors(fieldsPath) &&
              'form-table__row_invalid',
            !fieldData.data?.isChecked && 'form-table__row_excluded'
          )}
          key={index}
          onClick={event => {
            setDataInputState(targetPathInitialState)
            handleStoreInputPathChange(
              dataInputState,
              setDataInputState,
              fields.value[index].data.fieldInfo.value
            )
            !isRowDisabled() && enterEditMode(event, fields, fieldsPath, index)
          }}
        >
          <div className="form-table__cell form-table__cell_min">
            {!fieldData.isRequired && (
              <FormCheckBox
                name={`${rowPath}.data.isChecked`}
                onClick={event => event.stopPropagation()}
              />
            )}
          </div>
          <div
            className={classnames(
              'form-table__cell',
              'form-table__cell_1',
              'form-table__name-cell'
            )}
          >
            <div
              className={classnames(
                'form-table__name',
                fieldData.isRequired && 'form-table__name_with-asterisk'
              )}
            >
              <Tooltip template={<TextTooltipTemplate text={fieldData.data.name} />}>
                {fieldData.data?.name}
              </Tooltip>
            </div>
            {fields.value[index].doc && <Tip text={fields.value[index].doc} />}
          </div>
          <div className={classnames('form-table__cell', 'form-table__cell_1')}>
            <Tooltip template={<TextTooltipTemplate text={fieldData.data.path} />}>
              {fieldData.data.path}
            </Tooltip>
          </div>
          <FormRowActions
            applyChanges={applyChanges}
            deleteButtonIsHidden={fieldData.isRequired || !hasKwargs}
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
  )
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
  getTableArrayErrors: PropTypes.func.isRequired,
  hasKwargs: PropTypes.bool,
  index: PropTypes.number.isRequired,
  isCurrentRowEditing: PropTypes.func.isRequired,
  params: PropTypes.shape({}).isRequired,
  rowPath: PropTypes.string.isRequired,
  setDataInputState: PropTypes.func.isRequired,
  setFieldState: PropTypes.func.isRequired,
  uniquenessValidator: PropTypes.func.isRequired
}

export default FormDataInputsRow
