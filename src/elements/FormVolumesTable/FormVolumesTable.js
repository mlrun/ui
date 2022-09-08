import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FieldArray } from 'react-final-form-arrays'

import FormVolumesRow from './FormVolumesRow/FormVolumesRow'
import { FormActionButton } from 'igz-controls/elements'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { useFormTable } from 'igz-controls/hooks/useFormTable.hook'
import { V3IO_VOLUME_TYPE } from '../../constants'

const FormVolumesTable = ({ disabled, fieldsPath, formState }) => {
  const tableClassNames = classnames('form-table', 'form-col-1', disabled && 'disabled')
  const { editingItem, addNewRow, applyChanges, deleteRow, discardOrDelete, enterEditMode } =
    useFormTable(formState)

  return (
    <div className={tableClassNames}>
      <div className="form-table__row form-table__header-row no-hover">
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Type" />}>Type</Tooltip>
        </div>
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Volume Name" />}>Volume Name</Tooltip>
        </div>
        <div className="form-table__cell form-table__cell_1">
          <Tooltip template={<TextTooltipTemplate text="Path" />}>Path</Tooltip>
        </div>
        <div className="form-table__cell form-table__actions-cell" />
      </div>
      <FieldArray name={fieldsPath}>
        {({ fields }) => {
          return (
            <>
              {fields.map((rowPath, index) => {
                return (
                  <FormVolumesRow
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
                  />
                )
              })}
              {!editingItem?.ui?.isNew && (
                <FormActionButton
                  disabled={disabled}
                  fields={fields}
                  fieldsPath={fieldsPath}
                  label="Add custom parameter"
                  onClick={(...addRowArgs) =>
                    addNewRow(...addRowArgs, {
                      data: {
                        type: V3IO_VOLUME_TYPE,
                        name: '',
                        mountPath: '',
                        container: '',
                        accessKey: '',
                        subPath: ''
                      },
                      isDefault: false,
                      canBeModified: true
                    })
                  }
                />
              )}
            </>
          )
        }}
      </FieldArray>
    </div>
  )
}

FormVolumesTable.defaultProps = {
  disabled: false
}

FormVolumesTable.propTypes = {
  disabled: PropTypes.bool,
  fieldsPath: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired
}

export default FormVolumesTable
