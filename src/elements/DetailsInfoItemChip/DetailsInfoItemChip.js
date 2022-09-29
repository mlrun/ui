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
import classnames from 'classnames'

import ChipCell from '../../common/ChipCell/ChipCell'
import { RoundedIcon } from 'igz-controls/components'

import { detailsInfoActions } from '../../components/DetailsInfo/detailsInfoReducer'

import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark2.svg'

const DetailsInfoItemChip = ({
  changesData,
  chipOptions,
  chipsClassName,
  chipsData,
  currentField,
  detailsInfoDispatch,
  editableFieldType,
  handleFinishEdit,
  isFieldInEditMode,
  item,
  setChangesData
}) => {
  const chipFieldClassName = classnames(
    'details-item__data',
    'details-item__data-chips',
    editableFieldType && editableFieldType !== 'chips' && 'details-item_disabled'
  )

  const setEditMode = () => {
    detailsInfoDispatch({
      type: detailsInfoActions.SET_EDIT_MODE,
      payload: {
        field: currentField,
        fieldType: item?.editModeType
      }
    })
  }

  const setChanges = (initialValue, currentValue) => {
    setChangesData({
      ...changesData,
      [currentField]: {
        initialFieldValue: initialValue,
        currentFieldValue: currentValue,
        previousFieldValue: initialValue
      }
    })
  }

  const handleAddChip = (chip, chips) => {
    if (!isFieldInEditMode) {
      setEditMode()
      setChanges(chips, [...chips, chip])
    } else {
      item.onAdd(chip, chips, currentField)
    }
  }

  const handleEditChip = chips => {
    item.onChange(chips, currentField)
  }

  const handleRemoveChip = chips => {
    if (!isFieldInEditMode) {
      const initialChips = Object.keys(item.value).map(key => `${key}: ${item.value[key]}`)

      setEditMode()
      setChanges(initialChips, chips)
    } else {
      item.handleDelete(chips, currentField)
    }
  }

  const handleClick = () => {
    if (!isFieldInEditMode) {
      const chips = Object.keys(item.value).map(key => `${key}: ${item.value[key]}`)

      setEditMode()
      setChanges(chips, chips)
    }
  }

  return (
    <div className={chipFieldClassName}>
      <ChipCell
        addChip={handleAddChip}
        chipOptions={chipOptions}
        className={`details-item__${chipsClassName}`}
        delimiter={chipsData.delimiter}
        editChip={handleEditChip}
        elements={chipsData.chips}
        isEditMode
        onClick={handleClick}
        removeChip={handleRemoveChip}
      />
      {isFieldInEditMode && (
        <div className="details-item__apply-btn-wrapper">
          <RoundedIcon
            className="details-item__apply-btn"
            onClick={handleFinishEdit}
            tooltipText="Apply"
          >
            <Checkmark />
          </RoundedIcon>
        </div>
      )}
    </div>
  )
}

export default DetailsInfoItemChip
