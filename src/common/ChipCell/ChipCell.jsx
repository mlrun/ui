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
import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import ChipCellView from './ChipCellView'

import { CHIP_OPTIONS } from '../../types'
import { CLICK, TAB, TAB_SHIFT } from 'igz-controls/constants'
import { cutChips } from '../../utils/cutChips'
import { useChipCell } from 'igz-controls/hooks'

const ChipCell = ({
  addChip = () => {},
  chipOptions = {
    background: 'purple',
    boldValue: false,
    borderRadius: 'primary',
    borderColor: 'transparent',
    density: 'dense',
    font: 'purple'
  },
  className,
  delimiter = null,
  editChip = () => {},
  elements = [],
  isEditMode = false,
  onClick = () => {},
  removeChip = () => {},
  shortChips = false,
  setValidation = null,
  visibleChipsMaxLength = null
}) => {
  const {
    chipsCellRef,
    chipsWrapperRef,
    handleShowElements,
    hiddenChipsCounterRef,
    hiddenChipsPopUpRef,
    setChipsSizes,
    setShowHiddenChips,
    showChips,
    showHiddenChips,
    visibleChipsCount
  } = useChipCell(isEditMode, visibleChipsMaxLength)
  const [editConfig, setEditConfig] = useState({
    chipIndex: null,
    isEdit: false,
    isKeyFocused: true,
    isValueFocused: false,
    isNewChip: false
  })

  let chips = useMemo(() => {
    return (isEditMode && !visibleChipsMaxLength) || visibleChipsMaxLength === 'all'
      ? {
          visibleChips: elements.map(chip => ({
            value: chip,
            delimiter
          }))
        }
      : cutChips(
          elements,
          visibleChipsMaxLength ? visibleChipsMaxLength : visibleChipsCount,
          delimiter
        )
  }, [delimiter, elements, isEditMode, visibleChipsCount, visibleChipsMaxLength])

  const handleAddNewChip = useCallback(
    (event, chip) => {
      event.preventDefault()

      if (!editConfig.isEdit && !editConfig.chipIndex) {
        addChip(chip, elements)
      }

      if (showHiddenChips) {
        setShowHiddenChips(false)
      }

      setEditConfig({
        chipIndex: elements.length,
        isEdit: true,
        isKeyFocused: true,
        isValueFocused: false,
        isNewChip: true
      })
    },
    [
      editConfig.isEdit,
      editConfig.chipIndex,
      showHiddenChips,
      elements,
      addChip,
      setShowHiddenChips
    ]
  )

  const handleRemoveChip = useCallback(
    (event, chipIndex) => {
      event.stopPropagation()

      const newChips = elements.filter((value, index) => index !== chipIndex)

      removeChip(newChips)
    },
    [elements, removeChip]
  )

  const handleEditChip = useCallback(
    (event, chip, nameEvent) => {
      event.preventDefault()
      const isChipNotEmpty = !!(chip.key && chip.value && chip.key?.trim() && chip.value?.trim())

      if (isChipNotEmpty) {
        const newChips = [...elements]
        newChips[editConfig.chipIndex] = `${chip.key}: ${chip.value}`

        editChip(newChips)
      }

      if (nameEvent === CLICK) {
        if (editConfig.isNewChip && !isChipNotEmpty) {
          handleRemoveChip(event, editConfig.chipIndex)
        }

        setEditConfig({
          chipIndex: null,
          isEdit: false,
          isKeyFocused: true,
          isValueFocused: false,
          isNewChip: false
        })
      } else if (nameEvent === TAB) {
        if (editConfig.isNewChip && !isChipNotEmpty) {
          handleRemoveChip(event, editConfig.chipIndex)
        }

        setEditConfig(prevState => {
          const isNextChipIndexExists = prevState.chipIndex + 1 > elements.length - 1

          return {
            chipIndex: isNextChipIndexExists ? null : prevState.chipIndex + 1,
            isEdit: !isNextChipIndexExists,
            isKeyFocused: true,
            isValueFocused: false,
            isNewChip: false
          }
        })
      } else if (nameEvent === TAB_SHIFT) {
        if (editConfig.isNewChip && !isChipNotEmpty) {
          handleRemoveChip(event, editConfig.chipIndex)
        }

        setEditConfig(prevState => {
          const isPrevChipIndexExists = prevState.chipIndex - 1 < 0

          return {
            chipIndex: isPrevChipIndexExists ? null : prevState.chipIndex - 1,
            isEdit: !isPrevChipIndexExists,
            isKeyFocused: isPrevChipIndexExists,
            isValueFocused: !isPrevChipIndexExists,
            isNewChip: false
          }
        })
      }
    },
    [elements, editConfig.chipIndex, editConfig.isNewChip, editChip, handleRemoveChip]
  )

  const handleIsEdit = useCallback(
    (event, index) => {
      if (isEditMode) {
        event.stopPropagation()

        setEditConfig({
          chipIndex: index,
          isEdit: true,
          isKeyFocused: true,
          isValueFocused: false
        })
      }

      onClick && onClick()
    },
    [isEditMode, onClick]
  )

  return (
    <ChipCellView
      chips={chips}
      chipOptions={chipOptions}
      className={className}
      editConfig={editConfig}
      handleAddNewChip={handleAddNewChip}
      handleEditChip={handleEditChip}
      handleIsEdit={handleIsEdit}
      handleRemoveChip={handleRemoveChip}
      handleShowElements={handleShowElements}
      isEditMode={isEditMode}
      ref={{ chipsCellRef, chipsWrapperRef, hiddenChipsCounterRef, hiddenChipsPopUpRef }}
      setChipsSizes={setChipsSizes}
      setEditConfig={setEditConfig}
      setValidation={setValidation}
      shortChips={shortChips}
      showChips={showChips}
      showHiddenChips={showHiddenChips}
    />
  )
}

ChipCell.propTypes = {
  addChip: PropTypes.func,
  chipOptions: CHIP_OPTIONS,
  className: PropTypes.string,
  delimiter: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  editChip: PropTypes.func,
  elements: PropTypes.arrayOf(PropTypes.string),
  isEditMode: PropTypes.bool,
  onClick: PropTypes.func,
  removeChip: PropTypes.func,
  setValidation: PropTypes.func,
  shortChips: PropTypes.bool,
  visibleChipsMaxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default React.memo(ChipCell)
