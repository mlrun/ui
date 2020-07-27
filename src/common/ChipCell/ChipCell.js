import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'

import { cutChips } from '../../utils/cutChips'
import { sizeChips } from './SizeChips'
import { panelActions } from '../../components/JobsPanel/panelReducer'

import './chipCell.scss'
import ChipCellView from './ChipCellView'

const ChipCell = ({ className, dispatch, elements, isEditMode }) => {
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
    return isEditMode
      ? {
          visibleChips: elements.map(chip => ({
            value: chip
          }))
        }
      : sizeContainer <= 1000
      ? sizeChips[sizeContainer](elements)
      : cutChips(elements, 8)
  }, [elements, isEditMode, sizeContainer])

  const handleShowElements = useCallback(() => {
    if (!isEditMode) {
      setShow(!show)
    }
  }, [show, isEditMode])

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

  const addChip = useCallback(
    chip => {
      if (!editConfig.isEdit && !editConfig.chipIndex) {
        dispatch({
          type: panelActions.SET_JOB_LABEL,
          payload: [...elements, chip]
        })
      }

      setEditConfig({
        chipIndex: elements.length,
        isEdit: true,
        isKeyFocused: true,
        isValueFocused: false,
        isNewChip: true
      })
    },
    [dispatch, elements, editConfig]
  )

  const removeChip = useCallback(
    chipIndex => {
      const newChip = elements.filter((value, index) => index !== chipIndex)

      dispatch({
        type: panelActions.REMOVE_JOB_LABEL,
        payload: newChip
      })
    },
    [elements, dispatch]
  )

  const editChip = useCallback(
    (chip, nameEvent) => {
      const isChipNotEmpty = !!(chip.key && chip.value)

      if (isChipNotEmpty) {
        const newChips = [...elements]
        newChips[editConfig.chipIndex] = `${chip.key}: ${chip.value}`

        dispatch({
          type: panelActions.EDIT_JOB_LABEL,
          payload: newChips
        })
      }

      if (nameEvent === 'Click') {
        if (editConfig.isNewChip && !isChipNotEmpty) {
          removeChip(editConfig.chipIndex)
        }

        setEditConfig({
          chipIndex: null,
          isEdit: false,
          isKeyFocused: true,
          isValueFocused: false,
          isNewChip: false
        })
      } else if (nameEvent === 'Tab') {
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
    [editConfig, elements, dispatch, removeChip]
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
      addChip={addChip}
      chips={chips}
      className={className}
      editChip={editChip}
      editConfig={editConfig}
      elements={elements}
      handleIsEdit={handleIsEdit}
      handleShowElements={handleShowElements}
      isEditMode={isEditMode}
      ref={chipRef}
      removeChip={removeChip}
      setEditConfig={setEditConfig}
      show={show}
    />
  )
}

ChipCell.defaultProps = {
  elements: []
}

ChipCell.propTypes = {
  className: PropTypes.string.isRequired,
  elements: PropTypes.arrayOf(PropTypes.string),
  isEditMode: PropTypes.bool,
  dispatch: PropTypes.func
}

export default React.memo(ChipCell)
