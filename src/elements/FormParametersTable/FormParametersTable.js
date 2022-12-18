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
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FieldArray } from 'react-final-form-arrays'
import { get } from 'lodash'

import FormParametersRow from './FormParametersRow/FormParametersRow'
import { FormActionButton } from 'igz-controls/elements'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { useFormTable } from 'igz-controls/hooks/useFormTable.hook'
import { PARAMETER_TYPE_SIMPLE } from '../../constants'

const FormParametersTable = ({
  disabled,
  fieldsPath,
  formState,
  isHyperOptionDisabled,
  setIsParametersEditModeEnabled
}) => {
  const predefinedPath = `${fieldsPath}.predefined`
  const customPath = `${fieldsPath}.custom`
  const tableClassNames = classnames('form-table', disabled && 'disabled')
  const {
    addNewRow,
    applyChanges,
    bottomScrollRef,
    deleteRow,
    discardOrDelete,
    editingItem,
    enterEditMode,
    isCurrentRowEditing
  } = useFormTable(formState)

  const uniquenessValidator = (fields, fieldsPath, newValue) => {
    const predefinedItems = get(formState.values, predefinedPath.split('.'), [])
    const customItems = get(formState.values, customPath.split('.'), [])
    const predefinedContainsName = predefinedItems.some(({ data: { name } }, index) => {
      return editingItem && index !== editingItem?.ui.index && newValue.trim() === name
    })
    const customContainsName = customItems.some(({ data: { name } }, index) => {
      return editingItem && index !== editingItem?.ui.index && newValue.trim() === name
    })

    return !predefinedContainsName && !customContainsName
  }

  useEffect(() => {
    setIsParametersEditModeEnabled(Boolean(editingItem))
  }, [editingItem, setIsParametersEditModeEnabled])

  return (
    <div className={tableClassNames}>
      <div className="form-table__row form-table__header-row no-hover">
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Name" />}>Name</Tooltip>
        </div>
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Type" />}>Type</Tooltip>
        </div>
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Simple/Hyper" />}>Simple/Hyper</Tooltip>
        </div>
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Value/s" />}>Value/s</Tooltip>
        </div>
        <div className="form-table__cell form-table__actions-cell" />
      </div>
      <FieldArray name={predefinedPath}>
        {({ fields }) => {
          return (
            <>
              {fields.value?.length > 0 && (
                <div className="form-table__row form-table__sub-header-row no-hover">
                  <div className="form-table__cell">Predefined</div>
                </div>
              )}
              {fields.map((rowPath, index) => {
                return (
                  <FormParametersRow
                    applyChanges={applyChanges}
                    deleteRow={deleteRow}
                    disabled={disabled}
                    discardOrDelete={discardOrDelete}
                    editingItem={editingItem}
                    enterEditMode={enterEditMode}
                    fields={fields}
                    fieldsPath={predefinedPath}
                    formState={formState}
                    index={index}
                    isCurrentRowEditing={isCurrentRowEditing}
                    isHyperOptionDisabled={isHyperOptionDisabled}
                    key={rowPath}
                    rowPath={rowPath}
                    uniquenessValidator={uniquenessValidator}
                  />
                )
              })}
            </>
          )
        }}
      </FieldArray>
      <FieldArray name={customPath}>
        {({ fields }) => {
          return (
            <>
              {fields.value?.length > 0 && (
                <div className="form-table__row form-table__sub-header-row no-hover">
                  <div className="form-table__cell">Custom</div>
                </div>
              )}
              {fields.map((rowPath, index) => {
                return (
                  <FormParametersRow
                    applyChanges={applyChanges}
                    deleteRow={deleteRow}
                    disabled={disabled}
                    discardOrDelete={discardOrDelete}
                    editingItem={editingItem}
                    enterEditMode={enterEditMode}
                    fields={fields}
                    fieldsPath={customPath}
                    formState={formState}
                    index={index}
                    isCurrentRowEditing={isCurrentRowEditing}
                    isHyperOptionDisabled={isHyperOptionDisabled}
                    key={rowPath}
                    rowPath={rowPath}
                    uniquenessValidator={uniquenessValidator}
                  />
                )
              })}
              <FormActionButton
                disabled={disabled}
                ref={bottomScrollRef}
                hidden={editingItem?.ui?.isNew}
                fields={fields}
                fieldsPath={customPath}
                label="Add custom parameter"
                onClick={(...addRowArgs) => {
                  addNewRow(...addRowArgs, {
                    data: {
                      name: '',
                      value: '',
                      type: 'str',
                      parameterType: PARAMETER_TYPE_SIMPLE,
                      isChecked: true
                    },
                    doc: '',
                    isDefault: false
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

FormParametersTable.defaultProps = {
  disabled: false
}

FormParametersTable.propTypes = {
  disabled: PropTypes.bool,
  fieldsPath: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired,
  isHyperOptionDisabled: PropTypes.bool.isRequired,
  setIsParametersEditModeEnabled: PropTypes.func.isRequired
}

export default FormParametersTable
