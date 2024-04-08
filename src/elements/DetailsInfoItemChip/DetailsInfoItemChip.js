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
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { RoundedIcon, FormChipCell } from 'igz-controls/components'
import FormOnChange from '../../common/FormOnChange/FormOnChange'

import { getValidationRules } from 'igz-controls/utils/validation.util'
import { detailsInfoActions } from '../../components/DetailsInfo/detailsInfoReducer'

import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark2.svg'

const DetailsInfoItemChip = ({
  chipsData,
  currentField,
  detailsInfoDispatch,
  detailsInfoState,
  editableFieldType,
  handleFinishEdit,
  isFieldInEditMode,
  item,
  formState
}) => {
  const chipFieldClassName = classnames(
    'details-item__data',
    'details-item__data-chips',
    editableFieldType && editableFieldType !== 'chips' && 'details-item_disabled'
  )

  const setEditMode = () => {
    if (!detailsInfoState.editMode.field && !formState.pristine) {
      detailsInfoDispatch({
        type: detailsInfoActions.SET_EDIT_MODE,
        payload: {
          field: currentField,
          fieldType: item?.editModeType
        }
      })
    } else if (formState.pristine) {
      handleFinishEdit(item.fieldData.name)
    }
  }

  return (
    <div className={chipFieldClassName}>
      <FormChipCell
        chipOptions={chipsData.chipOptions}
        formState={formState}
        initialValues={formState.initialValues}
        isEditable
        name={item.fieldData.name}
        shortChips
        visibleChipsMaxLength="all"
        validationRules={{
          key: getValidationRules('common.tag'),
          value: getValidationRules('common.tag')
        }}
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
  detailsInfoState: PropTypes.object.isRequired,
  editableFieldType: PropTypes.string.isRequired,
  handleFinishEdit: PropTypes.func.isRequired,
  isFieldInEditMode: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired
}

export default DetailsInfoItemChip
