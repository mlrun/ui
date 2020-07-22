import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'

import Chip from '../Chip/Chip'
import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import HiddenChipsBlock from '../../elements/HiddenChipsBlock/HiddenChipsBlock'

import { ReactComponent as Add } from '../../images/add.svg'

import { cutChips } from '../../utils/cutChips'
import { sizeChips } from './SizeChips'
import { panelActions } from '../../components/JobsPanel/panelReducer'

import './chipCell.scss'

const ChipCell = ({ className, elements, isEditMode, dispatch }) => {
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
      const isChipEmpty = !!(chip.key && chip.value)

      if (isChipEmpty) {
        const newChips = [...elements]
        newChips[editConfig.chipIndex] = `${chip.key}: ${chip.value}`

        dispatch({
          type: panelActions.EDIT_JOB_LABEL,
          payload: newChips
        })
      }

      if (nameEvent === 'Click') {
        if (editConfig.isNewChip && !isChipEmpty) {
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
          const isChipIndexExists =
            prevState.chipIndex + 1 > elements.length - 1
          return {
            chipIndex: isChipIndexExists ? null : prevState.chipIndex + 1,
            isEdit: isChipIndexExists ? false : true,
            isKeyFocused: true,
            isValueFocused: false,
            isNewChip: false
          }
        })
      } else if (nameEvent === 'Tab+Shift') {
        setEditConfig(prevState => {
          const inChipIndexExists = prevState.chipIndex - 1 < 0
          return {
            chipIndex: inChipIndexExists ? null : prevState.chipIndex - 1,
            isEdit: inChipIndexExists ? false : true,
            isKeyFocused: inChipIndexExists ? true : false,
            isValueFocused: inChipIndexExists ? false : true,
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
    (isEditMode || elements.length !== 0) && (
      <div className="chips-wrapper" ref={chipRef}>
        {chips.visibleChips.map((item, index) => {
          return (
            <div className={'chip-block'} key={`${item.value}${index}`}>
              <Tooltip
                className="tooltip-wrapper"
                key={item.value}
                template={
                  editConfig.isEdit ? (
                    <span />
                  ) : (
                    <TextTooltipTemplate text={item.value} />
                  )
                }
              >
                <Chip
                  chipIndex={index}
                  className={className}
                  editConfig={editConfig}
                  editChip={editChip}
                  isEditMode={isEditMode}
                  handleIsEdit={handleIsEdit}
                  removeChip={removeChip}
                  onClick={handleShowElements}
                  setEditConfig={setEditConfig}
                  value={item.value}
                />
              </Tooltip>
              {chips.visibleChips.length - 1 === index && show && (
                <HiddenChipsBlock
                  className={className}
                  chips={chips.hiddenChips}
                />
              )}
            </div>
          )
        })}
        {isEditMode && (
          <button
            className="job-labels__button-add"
            onClick={() => addChip(':')}
          >
            <Add />
          </button>
        )}
      </div>
    )
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
