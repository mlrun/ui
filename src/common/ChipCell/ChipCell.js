import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'

import ChipCellView from './ChipCellView'

import { cutChips } from '../../utils/cutChips'
import { sizeChips } from './SizeChips'

import './chipCell.scss'

const ChipCell = ({
  addChip,
  className,
  editChip,
  elements,
  isEditMode,
  removeChip,
  visibleChipsMaxLength
}) => {
  const [sizeContainer, setSizeContainer] = useState(0)
  const [show, setShow] = useState(false)
  const [editConfig, setEditConfig] = useState({
    chipIndex: null,
    isEdit: false,
    isKeyFocused: true,
    isValueFocused: false,
    isNewChip: false
  })
  const chipRef = useRef()

  let chips = useMemo(() => {
    return isEditMode && !visibleChipsMaxLength
      ? {
          visibleChips: elements.map(chip => ({
            value: chip
          }))
        }
      : sizeContainer <= 1000 && !visibleChipsMaxLength
      ? sizeChips[sizeContainer](elements)
      : cutChips(elements, visibleChipsMaxLength ? visibleChipsMaxLength : 8)
  }, [elements, isEditMode, sizeContainer, visibleChipsMaxLength])

  const handleShowElements = useCallback(() => {
    if (!isEditMode || (isEditMode && visibleChipsMaxLength)) {
      setShow(!show)
    }
  }, [isEditMode, show, visibleChipsMaxLength])

  useEffect(() => {
    if (show) {
      window.addEventListener('click', handleShowElements)
      return () => window.removeEventListener('click', handleShowElements)
    }
  }, [show, handleShowElements])

  const handleResize = useCallback(() => {
    if (!isEditMode) {
      if (chipRef.current) {
        const sizeParent =
          parseInt(chipRef.current.parentNode.offsetWidth / 100) * 100

        setSizeContainer(sizeParent)
      }
    }
  }, [isEditMode, chipRef])

  useLayoutEffect(() => {
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

      setEditConfig({
        chipIndex: elements.length,
        isEdit: true,
        isKeyFocused: true,
        isValueFocused: false,
        isNewChip: true
      })
    },
    [elements, editConfig, addChip]
  )

  const handleRemoveChip = useCallback(
    chipIndex => {
      const newChips = elements.filter((value, index) => index !== chipIndex)

      removeChip(newChips)
    },
    [elements, removeChip]
  )

  const handleEditChip = useCallback(
    (chip, nameEvent) => {
      const isChipNotEmpty = !!(chip.key && chip.value)

      if (isChipNotEmpty) {
        const newChips = [...elements]
        newChips[editConfig.chipIndex] = `${chip.key}: ${chip.value}`

        editChip(newChips)
      }

      if (nameEvent === 'Click') {
        if (editConfig.isNewChip && !isChipNotEmpty) {
          handleRemoveChip(editConfig.chipIndex)
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
          handleRemoveChip(editConfig.chipIndex)
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
          handleRemoveChip(editConfig.chipIndex)
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

  const handleIsEdit = useCallback((event, index) => {
    event.stopPropagation()

    setEditConfig({
      chipIndex: index,
      isEdit: true,
      isKeyFocused: true,
      isValueFocused: false
    })
  }, [])

  return (
    <ChipCellView
      addChip={handleAddNewChip}
      chips={chips}
      className={className}
      editChip={handleEditChip}
      editConfig={editConfig}
      elements={elements}
      handleIsEdit={handleIsEdit}
      handleShowElements={handleShowElements}
      isEditMode={isEditMode}
      ref={chipRef}
      removeChip={handleRemoveChip}
      setEditConfig={setEditConfig}
      show={show}
    />
  )
}

ChipCell.defaultProps = {
  addChip: () => {},
  editChip: () => {},
  elements: [],
  isEditMode: false,
  removeChip: () => {},
  visibleChipsMaxLength: null
}

ChipCell.propTypes = {
  addChip: PropTypes.func,
  className: PropTypes.string.isRequired,
  editChip: PropTypes.func,
  elements: PropTypes.arrayOf(PropTypes.string),
  isEditMode: PropTypes.bool,
  removeChip: PropTypes.func,
  visibleChipsMaxLength: PropTypes.number
}

export default React.memo(ChipCell)
