import React, { useEffect, useMemo, useState } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { OnChange } from 'react-final-form-listeners'
import { pick } from 'lodash'

import { FormInput, FormSelect, TextTooltipTemplate, Tip, Tooltip } from 'igz-controls/components'
import { FormRowActions } from 'igz-controls/elements'

import { environmentVariablesTypeOptions } from '../formEnvironmentVariablesTable.util'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { FORM_TABLE_EDITING_ITEM } from 'igz-controls/types'
import { ENV_VARIABLE_TYPE_SECRET } from '../../../constants'

import './formEnvironmentVariablesRow.scss'

const FormEnvironmentVariablesRow = ({
  applyChanges,
  deleteRow,
  disabled,
  discardOrDelete,
  editingItem,
  enterEditMode,
  fields,
  fieldsPath,
  index,
  setFieldValue,
  rowPath,
  uniquenessValidator
}) => {
  const [fieldData, setFieldData] = useState(fields.value[index])

  const tableRowClassNames = classnames(
    'form-table__row',
    fieldsPath === editingItem?.ui?.fieldsPath && editingItem?.ui?.index === index && 'active'
  )

  const valueColumn = useMemo(
    () =>
      fieldData.data.type === ENV_VARIABLE_TYPE_SECRET
        ? fieldData.data.secretName && fieldData.data.secretKey
          ? `${fieldData.data.secretName}:${fieldData.data.secretKey}`
          : fieldData.data.secretName
        : fieldData.data.value,
    [fieldData.data.secretKey, fieldData.data.secretName, fieldData.data.type, fieldData.data.value]
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
              name={`${rowPath}.data.key`}
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
            <FormSelect
              density="dense"
              name={`${rowPath}.data.type`}
              options={environmentVariablesTypeOptions}
              required
            />
          </div>
          <div className="form-table__cell form-table__cell_1">
            {fieldData.data.type === 'value' && (
              <FormInput
                density="dense"
                name={`${rowPath}.data.value`}
                placeholder="Value"
                required
              />
            )}
            {fieldData.data.type === 'secret' && (
              <>
                <FormInput
                  className="secret-name"
                  density="dense"
                  name={`${rowPath}.data.secretName`}
                  placeholder="Secret Name"
                  required
                  validationRules={getValidationRules('environmentVariables.secretName')}
                />
                <FormInput
                  density="dense"
                  name={`${rowPath}.data.secretKey`}
                  placeholder="Secret Key"
                  validationRules={getValidationRules('environmentVariables.secretKey')}
                />
              </>
            )}
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
          onClick={event => enterEditMode(event, fields, fieldsPath, index)}
        >
          <div className={classnames('form-table__cell', 'form-table__cell_1')}>
            <Tooltip template={<TextTooltipTemplate text={fieldData.data.key} />}>
              {fieldData.data.key}
            </Tooltip>
            {fields.value[index].doc && <Tip text={fields.value[index].doc} />}
          </div>
          <div className={classnames('form-table__cell', 'form-table__cell_1')}>
            <Tooltip template={<TextTooltipTemplate text={fieldData.data.type} />}>
              {fieldData.data.type}
            </Tooltip>
          </div>
          <div className={classnames('form-table__cell', 'form-table__cell_1')}>
            <Tooltip template={<TextTooltipTemplate text={valueColumn} />}>{valueColumn}</Tooltip>
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
      <OnChange name={`${rowPath}.data.type`}>
        {() => {
          if (editingItem) {
              const fieldNewData = pick(fields.value[index].data, ['key', 'type'])

            setFieldValue(`${rowPath}.data`, fieldNewData)
          }
        }}
      </OnChange>
    </>
  )
}

FormEnvironmentVariablesRow.defaultProps = {
  disabled: false,
  editingItem: null
}

FormEnvironmentVariablesRow.propTypes = {
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
  setFieldValue: PropTypes.func.isRequired,
  uniquenessValidator: PropTypes.func.isRequired
}

export default FormEnvironmentVariablesRow
