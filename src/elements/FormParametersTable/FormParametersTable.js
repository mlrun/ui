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
import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FieldArray } from 'react-final-form-arrays'
import { get, isEmpty } from 'lodash'

import FormParametersRow from './FormParametersRow/FormParametersRow'
import { FormActionButton } from 'igz-controls/elements'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { useFormTable } from 'igz-controls/hooks'
import { PARAMETERS_FROM_FILE_VALUE, PARAMETERS_FROM_UI_VALUE } from '../../constants'

const FormParametersTable = ({
  disabled = false,
  exitEditModeTriggerItem = null,
  fieldsPath,
  formState,
  hasKwargs = false,
  parametersFromPath = '',
  withHyperparameters = false
}) => {
  const withRequiredParametersRef = useRef(true)
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
    getTableArrayErrors,
    isCurrentRowEditing
  } = useFormTable(formState, exitEditModeTriggerItem)

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

  const validateParameters = (value, allValues) => {
    let parametersAreFromFile = false

    if (parametersFromPath) {
      parametersAreFromFile =
        get(allValues, parametersFromPath, PARAMETERS_FROM_UI_VALUE) === PARAMETERS_FROM_FILE_VALUE
    }

    withRequiredParametersRef.current = !parametersAreFromFile

    const tableErrors = value?.reduce((errorData, parameter, index) => {
      if (
        !parametersAreFromFile &&
        parameter.isRequired &&
        !parameter.isHidden &&
        parameter.data?.value === ''
      ) {
        errorData[index] = [
          {
            name: 'required',
            label: `'${parameter.data.name}' parameter is required`
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
        {withHyperparameters && (
          <div className="form-table__cell form-table__cell_hyper">
            <Tooltip template={<TextTooltipTemplate text="Hyper" />}>Hyper</Tooltip>
          </div>
        )}
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
      <FieldArray name={predefinedPath} validate={validateParameters}>
        {({ fields }) => {
          return fields.map((rowPath, index) => {
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
                getTableArrayErrors={getTableArrayErrors}
                hasKwargs={hasKwargs}
                index={index}
                isCurrentRowEditing={isCurrentRowEditing}
                key={rowPath}
                rowPath={rowPath}
                uniquenessValidator={uniquenessValidator}
                withHyperparameters={withHyperparameters}
                withRequiredParameters={withRequiredParametersRef.current}
              />
            )
          })
        }}
      </FieldArray>
      <FieldArray name={customPath}>
        {({ fields }) => {
          return (
            <>
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
                    getTableArrayErrors={getTableArrayErrors}
                    hasKwargs={hasKwargs}
                    index={index}
                    isCurrentRowEditing={isCurrentRowEditing}
                    key={rowPath}
                    rowPath={rowPath}
                    uniquenessValidator={uniquenessValidator}
                    withHyperparameters={withHyperparameters}
                    withRequiredParameters={withRequiredParametersRef.current}
                  />
                )
              })}
              {hasKwargs && (
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
                        isChecked: true,
                        isHyper: false
                      },
                      doc: '',
                      isDefault: false,
                      isPredefined: false
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

FormParametersTable.propTypes = {
  disabled: PropTypes.bool,
  exitEditModeTriggerItem: PropTypes.any,
  fieldsPath: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired,
  hasKwargs: PropTypes.bool,
  parametersFromPath: PropTypes.string,
  withHyperparameters: PropTypes.bool
}

export default FormParametersTable
