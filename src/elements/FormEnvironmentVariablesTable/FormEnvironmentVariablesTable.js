import React from 'react'
import { FieldArray } from 'react-final-form-arrays'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import { FormActionButton } from 'igz-controls/elements'
import FormEnvironmentVariablesRow from './FormEnvironmentVariablesRow/FormEnvironmentVariablesRow'

import { useFormTable } from 'igz-controls/hooks/useFormTable.hook'

const FormEnvironmentVariablesTable = ({ className, disabled, fieldsPath, formState }) => {
  const tableClassNames = classnames('form-table', className)
  const {
    addNewRow,
    applyChanges,
    bottomScrollRef,
    deleteRow,
    discardOrDelete,
    editingItem,
    enterEditMode
  } = useFormTable(formState)

  const uniquenessValidator = (fields, newValue) => {
    return !fields.value.some(({ data: { key } }, index) => {
      return newValue.trim() === key && index !== editingItem.ui.index
    })
  }

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

FormEnvironmentVariablesTable.defaultProps = {
  disabled: false,
  className: ''
}

FormEnvironmentVariablesTable.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fieldsPath: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired
}

export default FormEnvironmentVariablesTable
