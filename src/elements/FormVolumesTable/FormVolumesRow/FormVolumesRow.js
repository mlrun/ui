import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { OnChange } from 'react-final-form-listeners'
import { isEmpty, pick } from 'lodash'

import { FormSelect, FormInput, TextTooltipTemplate, Tooltip } from 'igz-controls/components'
import { FormRowActions } from 'igz-controls/elements'

import { FORM_TABLE_EDITING_ITEM } from 'igz-controls/types'
import { generateVolumeInputsData } from '../formVolumesTable.util'

import './formVolumeRow.scss'

const FormVolumesRow = ({
  applyChanges,
  deleteRow,
  disabled,
  discardOrDelete,
  editingItem,
  enterEditMode,
  fields,
  fieldsPath,
  index,
  rowPath,
  setFieldValue
}) => {
  const [fieldData, setFieldData] = useState(fields.value[index])
  const [fieldRowData, setFieldRowData] = useState([])
  const tableRowClassNames = classnames(
    'form-table__row',
    'form-table__volume-row',
    fieldsPath === editingItem?.ui?.fieldsPath && editingItem?.ui?.index === index && 'active'
  )

  useEffect(() => {
    setFieldData(fields.value[index])
    setFieldRowData(generateVolumeInputsData(fields.value[index], fields, editingItem))
  }, [editingItem, fields, index])

  const generateVolumeInput = inputData => {
    switch (inputData.type) {
      case 'input':
        return (
          <FormInput
            density="dense"
            disabled={inputData.inputDisabled}
            label={inputData.label}
            tip={inputData.tip}
            name={`${rowPath}.${inputData.fieldPath}`}
            placeholder={inputData.placeholder}
            required={inputData.required}
            validationRules={inputData.validationRules ?? []}
          />
        )
      case 'select':
        return (
          <FormSelect
            density="dense"
            disabled={inputData.inputDisabled}
            label={inputData.label}
            name={`${rowPath}.${inputData.fieldPath}`}
            options={inputData.options}
            required={inputData.required}
          />
        )
      default:
        return ''
    }
  }

  return (
    <>
      {!fieldData.isHidden && (
        <>
          {editingItem &&
          index === editingItem.ui?.index &&
          fieldsPath === editingItem.ui?.fieldsPath &&
          !isEmpty(fieldRowData) &&
          !disabled ? (
            <div className={tableRowClassNames} key={index}>
              <div className="form-table__row_multiline">
                {fieldRowData.map(inputData => {
                  return (
                    !inputData.inputHidden && (
                      <div
                        key={inputData.fieldPath}
                        className="form-table__cell form-table__volume-cell"
                      >
                        {generateVolumeInput(inputData)}
                      </div>
                    )
                  )
                })}
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
              {fieldRowData.map(inputData => {
                return (
                  !inputData.textHidden && (
                    <div key={inputData.fieldPath} className="form-table__cell form-table__cell_1">
                      <Tooltip template={<TextTooltipTemplate text={inputData.value} />}>
                        {inputData.value}
                      </Tooltip>
                    </div>
                  )
                )
              })}
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
      <OnChange name={`${rowPath}.data.type`}>
        {value => {
          if (editingItem) {
            const fieldNewData = pick(fields.value[index].data, ['name', 'type', 'mountPath'])

            setFieldValue(`${rowPath}.data`, fieldNewData)
          }
        }}
      </OnChange>
    </>
  )
}

FormVolumesRow.defaultProps = {
  disabled: false,
  editingItem: null
}

FormVolumesRow.propTypes = {
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
  setFieldValue: PropTypes.func.isRequired
}

export default FormVolumesRow
