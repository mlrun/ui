import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import ChipCellView from './ChipCellView'

import { cutChips } from '../../utils/cutChips'
import { CHIP_OPTIONS } from '../../types'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

const ChipCell = ({
  addChip,
  chipOptions,
  className,
  delimiter,
  editChip,
  elements,
  isEditMode,
  onClick,
  removeChip,
  shortChips,
  visibleChipsMaxLength
}) => {
  const [chipsSizes, setChipsSizes] = useState({})
  const [showHiddenChips, setShowHiddenChips] = useState(false)
  const [editConfig, setEditConfig] = useState({
    chipIndex: null,
    isEdit: false,
    isKeyFocused: true,
    isValueFocused: false,
    isNewChip: false
  })
  const [showChips, setShowChips] = useState(false)
  const [visibleChipsCount, setVisibleChipsCount] = useState(8)
  const chipsCellRef = useRef()
  const chipsWrapperRef = React.createRef()

  let chips = useMemo(() => {
    return (isEditMode && !visibleChipsMaxLength) ||
      visibleChipsMaxLength === 'all'
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
  }, [
    delimiter,
    elements,
    isEditMode,
    visibleChipsCount,
    visibleChipsMaxLength
  ])

  const handleShowElements = useCallback(() => {
    if (!isEditMode || (isEditMode && visibleChipsMaxLength)) {
      setShowHiddenChips(state => !state)
    }
  }, [isEditMode, visibleChipsMaxLength])

  useEffect(() => {
    if (showHiddenChips) {
      window.addEventListener('click', handleShowElements)
      return () => window.removeEventListener('click', handleShowElements)
    }
  }, [showHiddenChips, handleShowElements])

  const handleResize = useCallback(() => {
    if (!isEditMode && !isEveryObjectValueEmpty(chipsSizes)) {
      const parentSize = chipsCellRef.current.getBoundingClientRect().width
      let maxLength = 0
      let chipIndex = 0
      const padding = 65

      Object.values(chipsSizes).every((chipSize, index) => {
        if (
          maxLength + chipSize > parentSize ||
          (Object.values(chipsSizes).length > 1 &&
            maxLength + chipSize + padding > parentSize)
        ) {
          chipIndex = index

          return false
        } else {
          maxLength += chipSize

          if (index === Object.values(chipsSizes).length - 1) {
            chipIndex = 8
          }

          return true
        }
      })

      setVisibleChipsCount(chipIndex)
      setShowChips(true)
    }
  }, [chipsSizes, isEditMode])

  useEffect(() => {
    handleResize()
  }, [handleResize])

  useEffect(() => {
    if (!isEditMode) {
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [handleResize, isEditMode])

  const handleAddNewChip = useCallback(
    chip => {
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
      addChip
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
      const isChipNotEmpty = !!(chip.key && chip.value)

      if (isChipNotEmpty) {
        const newChips = [...elements]
        newChips[editConfig.chipIndex] = `${chip.key}: ${chip.value}`

        editChip(newChips)
      }

      if (nameEvent === 'Click') {
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
      } else if (nameEvent === 'Tab') {
        if (editConfig.isNewChip && !isChipNotEmpty) {
          handleRemoveChip(event, editConfig.chipIndex)
        }

        setEditConfig(prevState => {
          const isNextChipIndexExists =
            prevState.chipIndex + 1 > elements.length - 1

          return {
            chipIndex: isNextChipIndexExists ? null : prevState.chipIndex + 1,
            isEdit: !isNextChipIndexExists,
            isKeyFocused: true,
            isValueFocused: false,
            isNewChip: false
          }
        })
      } else if (nameEvent === 'Tab+Shift') {
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
    [
      elements,
      editConfig.chipIndex,
      editConfig.isNewChip,
      editChip,
      handleRemoveChip
    ]
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
      ref={{ chipsCellRef, chipsWrapperRef }}
      setChipsSizes={setChipsSizes}
      setEditConfig={setEditConfig}
      shortChips={shortChips}
      showChips={showChips}
      showHiddenChips={showHiddenChips}
    />
  )
}

ChipCell.defaultProps = {
  addChip: () => {},
  chipOptions: {
    background: 'purple',
    boldValue: false,
    borderRadius: 'primary',
    borderColor: 'transparent',
    density: 'dense',
    font: 'purple'
  },
  delimiter: null,
  editChip: () => {},
  elements: [],
  isEditMode: false,
  onClick: () => {},
  removeChip: () => {},
  shortChips: false,
  visibleChipsMaxLength: null
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
  shortChips: PropTypes.bool,
  visibleChipsMaxLength: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

export default React.memo(ChipCell)
