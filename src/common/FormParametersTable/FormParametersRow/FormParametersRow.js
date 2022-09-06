import React, { useEffect, useMemo, useState } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import {
  FormCheckBox,
  FormInput,
  FormSelect,
  TextTooltipTemplate,
  Tip,
  Tooltip
} from 'igz-controls/components'
import { FORM_TABLE_EDITING_ITEM } from 'igz-controls/types'
import FormRowActions from 'igz-controls/elements/FormRowActions/FormRowActions'

import { getParameterTypeOptions, parametersValueTypeOptions } from '../formParametersTable.util'

import './formParametersRow.scss'

const FormParametersTable = ({
  applyChanges,
  deleteRow,
  disabled,
  discardOrDelete,
  editingItem,
  enterEditMode,
  fields,
  fieldsPath,
  index,
  isHyperOptionDisabled,
  rowPath,
  uniquenessValidator
}) => {
  const parameterTypeOptions = useMemo(() => {
    return getParameterTypeOptions(isHyperOptionDisabled)
  }, [isHyperOptionDisabled])
  const [fieldData, setFieldData] = useState(fields.value[index])
  const tableRowClassNames = classnames(
    'form-table__row',
    fieldsPath === editingItem?.ui?.fieldsPath && editingItem?.ui?.index === index && 'active',
    !fieldData.data.isChecked && 'excluded'
  )

  useEffect(() => {
    setFieldData(fields.value[index])
  }, [fields.value, index])

  return (
    <>
      {!fieldData.isHidden && (
        <>
          {editingItem &&
          index === editingItem.ui?.index &&
          fieldsPath === editingItem.ui?.fieldsPath &&
          !disabled ? (
            <div className={tableRowClassNames} key={index}>
              <div className="form-table__cell form-table__cell_1">
                <FormInput
                  density="dense"
                  disabled={fields.value[index].isDefault}
                  name={`${rowPath}.data.name`}
                  placeholder="Name"
                  required
                  validationRules={[
                    {
                      name: 'uniqueness',
                      label: 'Name should be unique',
                      pattern: newValue => uniquenessValidator(fields, fieldsPath, newValue)
                    }
                  ]}
                />
              </div>
              <div className="form-table__cell form-table__cell_1">
                <FormSelect
                  density="dense"
                  disabled={fields.value[index].isDefault}
                  name={`${rowPath}.data.type`}
                  options={parametersValueTypeOptions}
                  required
                />
              </div>
              <div className="form-table__cell form-table__cell_1">
                <FormSelect
                  density="dense"
                  name={`${rowPath}.data.parameterType`}
                  options={parameterTypeOptions}
                  required
                />
              </div>
              <div className="form-table__cell form-table__cell_1">
                <FormInput
                  density="dense"
                  name={`${rowPath}.data.value`}
                  placeholder="Value/S"
                  required
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
              <div
                className={classnames(
                  'form-table__cell',
                  'form-table__cell_1',
                  'form-table__parameter-cell',
                  fields.value[index].isDefault && 'disabled'
                )}
              >
                <FormCheckBox
                  name={`${rowPath}.data.isChecked`}
                  onClick={event => event.stopPropagation()}
                />
                <Tooltip template={<TextTooltipTemplate text={fieldData.data.name} />}>
                  {fieldData.data.name}
                </Tooltip>
                {fields.value[index].doc && <Tip text={fields.value[index].doc} />}
              </div>
              <div
                className={classnames(
                  'form-table__cell',
                  'form-table__cell_1',
                  fields.value[index].isDefault && 'disabled'
                )}
              >
                <Tooltip template={<TextTooltipTemplate text={fieldData.data.type} />}>
                  {fieldData.data.type}
                </Tooltip>
              </div>
              <div className="form-table__cell form-table__cell_1">
                <Tooltip template={<TextTooltipTemplate text={fieldData.data.parameterType} />}>
                  {fieldData.data.parameterType}
                </Tooltip>
              </div>
              <div className="form-table__cell form-table__cell_1">
                <Tooltip template={<TextTooltipTemplate text={String(fieldData.data.value)} />}>
                  {String(fieldData.data.value)}
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
      )}
    </>
  )
}

FormParametersTable.defaultProps = {
  disabled: false,
  editingItem: null
}

FormParametersTable.propTypes = {
  applyChanges: PropTypes.func.isRequired,
  deleteRow: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  discardOrDelete: PropTypes.func.isRequired,
  editingItem: FORM_TABLE_EDITING_ITEM,
  enterEditMode: PropTypes.func.isRequired,
  fields: PropTypes.shape({}).isRequired,
  fieldsPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  rowPath: PropTypes.string.isRequired,
  uniquenessValidator: PropTypes.func.isRequired
}

export default FormParametersTable
