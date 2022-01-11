import React from 'react'
import classnames from 'classnames'

import ChipCell from '../../common/ChipCell/ChipCell'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { detailsInfoActions } from '../../components/DetailsInfo/detailsInfoReducer'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

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
    editableFieldType &&
      editableFieldType !== 'chips' &&
      'details-item_disabled'
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
      const initialChips = Object.keys(item.value).map(
        key => `${key}: ${item.value[key]}`
      )

      setEditMode()
      setChanges(initialChips, chips)
    } else {
      item.handleDelete(chips, currentField)
    }
  }

  const handleClick = () => {
    if (!isFieldInEditMode) {
      const chips = Object.keys(item.value).map(
        key => `${key}: ${item.value[key]}`
      )

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
          <Tooltip template={<TextTooltipTemplate text="Apply" />}>
            <Checkmark
              className="details-item__apply-btn"
              onClick={handleFinishEdit}
            />
          </Tooltip>
        </div>
      )}
    </div>
  )
}

export default DetailsInfoItemChip
