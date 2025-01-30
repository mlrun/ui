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
import detailsActions from '../../actions/details'

import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark2.svg'

const DetailsInfoItemChip = ({
  chipsData,
  currentField,
  detailsInfoDispatch,
  detailsStore,
  editableFieldType,
  formState,
  handleFinishEdit,
  isEditable = true,
  isArtifactPage,
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

  const setEditMode = useCallback(() => {
    if (!formState.form.getFieldState(item.fieldData.name).pristine && !isFieldInEditMode) {
      detailsInfoDispatch({
        type: detailsInfoActions.SET_EDIT_MODE,
        payload: {
          field: currentField,
          fieldType: item?.editModeType
        }
      })
      dispatch(detailsActions.setEditMode(true))
    } else if (formState.form.getFieldState(item.fieldData.name).pristine && !isFieldInEditMode) {
      handleFinishEdit(item.fieldData.name)
    }
  }, [
    currentField,
    detailsInfoDispatch,
    dispatch,
    formState.form,
    handleFinishEdit,
    isFieldInEditMode,
    item?.editModeType,
    item.fieldData.name
  ])

  useEffect(() => {
    if (
      !isEmpty(formState.values[item.fieldData.name]) &&
      !formState.form.getFieldState(item.fieldData.name).pristine &&
      !isEqual(
        formState.values[item.fieldData.name],
        detailsStore.changes.data?.[item.fieldData.name]?.currentFieldValue
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
      dispatch(detailsActions.setEditMode(true))
    } else if (
      !isEmpty(formState.initialValues[item.fieldData.name]) &&
      isEmpty(formState.values[item.fieldData.name]) &&
      !detailsStore.changes.data?.[item.fieldData.name] &&
      !isFieldInEditMode
    ) {
      detailsInfoDispatch({
        type: detailsInfoActions.SET_EDIT_MODE,
        payload: {
          field: currentField,
          fieldType: item?.editModeType
        }
      })
      dispatch(detailsActions.setEditMode(true))
    }
  }, [
    currentField,
    detailsInfoDispatch,
    detailsStore.changes.data,
    dispatch,
    formState.form,
    formState.initialValues,
    formState.values,
    isFieldInEditMode,
    item?.editModeType,
    item.fieldData.name,
    setEditMode
  ])

  const validationRules = useMemo(() => {
    if (isArtifactPage) {
      return {
        key: getValidationRules(
          'artifact.labels.key',
          getInternalLabelsValidationRule(frontendSpec.internal_labels)
        ),
        value: getValidationRules('artifact.labels.value')
      }
    } else {
      return {
        key: getValidationRules(
          'common.tag',
          getInternalLabelsValidationRule(frontendSpec.internal_labels)
        ),
        value: getValidationRules('common.tag')
      }
    }
  }, [frontendSpec.internal_labels, isArtifactPage])

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
      <FormOnChange name={item.fieldData.name} handler={setEditMode} />
      {isFieldInEditMode && (
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
      )}
    </div>
  )
}

DetailsInfoItemChip.propTypes = {
  chipsData: PropTypes.object.isRequired,
  currentField: PropTypes.string.isRequired,
  detailsInfoDispatch: PropTypes.func.isRequired,
  editableFieldType: PropTypes.string.isRequired,
  handleFinishEdit: PropTypes.func.isRequired,
  isFieldInEditMode: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired
}

export default DetailsInfoItemChip
