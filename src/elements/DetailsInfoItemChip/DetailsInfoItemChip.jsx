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
import React, { useCallback, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isEqual } from 'lodash'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

import { RoundedIcon, FormChipCell, FormOnChange } from 'igz-controls/components'

import {
  getValidationRules,
  getInternalLabelsValidationRule
} from 'igz-controls/utils/validation.util'
import { detailsInfoActions } from '../../components/DetailsInfo/detailsInfoReducer'
import { setEditMode } from 'igz-controls/reducers/commonDetailsReducer'

import Close from 'igz-controls/images/close.svg?react'
import Checkmark from 'igz-controls/images/checkmark2.svg?react'

const DetailsInfoItemChip = ({
  chipsData,
  commonDetailsStore,
  currentField,
  detailsInfoDispatch,
  editableFieldType,
  formState,
  handleFinishEdit,
  isEditable = true,
  isFieldInEditMode,
  item
}) => {
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const dispatch = useDispatch()
  const chipFieldClassName = classnames(
    'details-item__data',
    'details-item__data-chips',
    editableFieldType && editableFieldType !== 'chips' && 'details-item_disabled'
  )

  const handleSetEditMode = useCallback(() => {
    if (
      !formState.form.getFieldState(item.fieldData.name).pristine &&
      !isFieldInEditMode &&
      !isEqual(
        formState.values[item.fieldData.name],
        commonDetailsStore.changes.data?.[item.fieldData.name]?.currentFieldValue
      )
    ) {
      detailsInfoDispatch({
        type: detailsInfoActions.SET_EDIT_MODE,
        payload: {
          field: currentField,
          fieldType: item?.editModeType
        }
      })
      dispatch(setEditMode(true))
    } else if (formState.form.getFieldState(item.fieldData.name).pristine && !isFieldInEditMode) {
      handleFinishEdit(item.fieldData.name)
    }
  }, [
    commonDetailsStore.changes.data,
    currentField,
    detailsInfoDispatch,
    dispatch,
    formState.form,
    formState.values,
    handleFinishEdit,
    isFieldInEditMode,
    item.editModeType,
    item.fieldData.name
  ])

  useEffect(() => {
    if (
      !isEmpty(formState.values[item.fieldData.name]) &&
      !formState.form.getFieldState(item.fieldData.name).pristine &&
      !isEqual(
        formState.values[item.fieldData.name],
        commonDetailsStore.changes.data?.[item.fieldData.name]?.currentFieldValue
      ) &&
      !isFieldInEditMode
    ) {
      detailsInfoDispatch({
        type: detailsInfoActions.SET_EDIT_MODE,
        payload: {
          field: currentField,
          fieldType: item?.editModeType
        }
      })
      dispatch(setEditMode(true))
    } else if (
      !isEmpty(formState.initialValues[item.fieldData.name]) &&
      isEmpty(formState.values[item.fieldData.name]) &&
      !commonDetailsStore.changes.data?.[item.fieldData.name] &&
      !isFieldInEditMode
    ) {
      detailsInfoDispatch({
        type: detailsInfoActions.SET_EDIT_MODE,
        payload: {
          field: currentField,
          fieldType: item?.editModeType
        }
      })
      dispatch(setEditMode(true))
    }
  }, [
    currentField,
    detailsInfoDispatch,
    commonDetailsStore.changes.data,
    dispatch,
    formState.form,
    formState.initialValues,
    formState.values,
    isFieldInEditMode,
    item?.editModeType,
    item.fieldData.name
  ])

  const validationRules = useMemo(() => {
    if (chipsData.validationRules) {
      return chipsData.validationRules
    } else {
      return {
        key: getValidationRules(
          'common.tag',
          getInternalLabelsValidationRule(frontendSpec.internal_labels)
        ),
        value: getValidationRules('common.tag')
      }
    }
  }, [frontendSpec.internal_labels, chipsData.validationRules])

  const discardChanges = () => {
    formState.form.change(
      item.fieldData.name,
      commonDetailsStore.changes.data[item.fieldData.name]?.currentFieldValue ??
        formState.initialValues[item.fieldData.name]
    )
    dispatch(setEditMode(false))
    detailsInfoDispatch({
      type: detailsInfoActions.RESET_EDIT_MODE
    })
  }

  return (
    <div className={chipFieldClassName}>
      <FormChipCell
        chipOptions={chipsData.chipOptions}
        formState={formState}
        initialValues={formState.initialValues}
        isEditable={isEditable}
        name={item.fieldData.name}
        shortChips
        visibleChipsMaxLength="all"
        validationRules={validationRules}
      />
      <FormOnChange name={item.fieldData.name} handler={handleSetEditMode} />
      {isFieldInEditMode && (
        <div className="details-item__buttons-block">
          <div className="details-item__apply-btn-wrapper">
            <RoundedIcon
              className="details-item__apply-btn"
              disabled={!formState.valid}
              onClick={() => handleFinishEdit(item.fieldData.name)}
              tooltipText="Apply"
            >
              <Checkmark />
            </RoundedIcon>
          </div>
          <RoundedIcon onClick={discardChanges} tooltipText="Discard">
            <Close />
          </RoundedIcon>
        </div>
      )}
    </div>
  )
}

DetailsInfoItemChip.propTypes = {
  chipsData: PropTypes.object.isRequired,
  commonDetailsStore: PropTypes.object.isRequired,
  currentField: PropTypes.string.isRequired,
  detailsInfoDispatch: PropTypes.func.isRequired,
  editableFieldType: PropTypes.string.isRequired,
  formState: PropTypes.object.isRequired,
  handleFinishEdit: PropTypes.func.isRequired,
  isEditable: PropTypes.bool,
  isFieldInEditMode: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired
}

export default DetailsInfoItemChip
