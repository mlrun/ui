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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { throttle } from 'lodash'

import {
  getScssVariableValue,
  getTransitionEndEventName,
  isEveryObjectValueEmpty
} from '../utils/common.util'
import { getFirstScrollableParent } from '../utils/getFirstScrollableParent.util'

export const useChipCell = (isEditMode, visibleChipsMaxLength, withInitialParentWidth) => {
  const [showHiddenChips, setShowHiddenChips] = useState(false)
  const [chipsSizes, setChipsSizes] = useState({})
  const [showChips, setShowChips] = useState(false)
  const [chipCellInitialWidth, setChipCellInitialWidth] = useState(0)
  const [visibleChipsCount, setVisibleChipsCount] = useState(8)

  const chipBlockMarginRight = useMemo(
    () => parseInt(getScssVariableValue('--chipBlockMarginRight')),
    []
  )
  const transitionEndEventName = useMemo(() => getTransitionEndEventName(), [])

  const chipsCellRef = useRef()
  const chipsWrapperRef = useRef()
  const hiddenChipsCounterRef = useRef()
  const hiddenChipsPopUpRef = useRef()

  const handleShowElements = useCallback(
    event => {
      if (!isEditMode || (isEditMode && visibleChipsMaxLength)) {
        if (hiddenChipsCounterRef.current?.contains(event.target) && !showHiddenChips) {
          setShowHiddenChips(true)
        } else {
          setShowHiddenChips(false)
        }
      }

      event && hiddenChipsCounterRef.current?.contains(event.target) && event.stopPropagation()
    },
    [isEditMode, showHiddenChips, visibleChipsMaxLength]
  )

  useEffect(() => {
    if (showHiddenChips) {
      window.addEventListener('click', handleShowElements, true)
    }

    return () => window.removeEventListener('click', handleShowElements, true)
  }, [showHiddenChips, handleShowElements])

  useEffect(() => {
    if (chipsCellRef.current?.getBoundingClientRect().width) {
      setChipCellInitialWidth(state => {
        if (!state) {
          return chipsCellRef.current?.getBoundingClientRect().width
        }
      })
    }
  }, [])

  const handleScroll = useCallback(
    event => {
      if (event.target.parentElement !== hiddenChipsPopUpRef?.current) {
        setShowHiddenChips(false)
      }
    },
    [hiddenChipsPopUpRef]
  )

  useEffect(() => {
    if (showHiddenChips) {
      window.addEventListener('scroll', handleScroll, true)
    }

    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [handleScroll, showHiddenChips])

  const resizeChipCell = useCallback(() => {
    if (hiddenChipsPopUpRef?.current) {
      const scrollableParent = getFirstScrollableParent(hiddenChipsCounterRef.current.offsetParent)
      const scrollableParentRect = scrollableParent.getBoundingClientRect()
      const hiddenChipsCounterRect = hiddenChipsCounterRef.current?.getBoundingClientRect()

      // Check if the hiddenChipsCounterRect is outside the boundaries of the scrollableParentRect or the window
      if (
        hiddenChipsCounterRect.left < scrollableParentRect.left ||
        hiddenChipsCounterRect.top < scrollableParentRect.top ||
        hiddenChipsCounterRect.right > scrollableParentRect.right ||
        hiddenChipsCounterRect.bottom > scrollableParentRect.bottom ||
        hiddenChipsCounterRect.right > window.innerWidth ||
        hiddenChipsCounterRect.bottom > window.innerHeight
      ) {
        setShowHiddenChips(false)
      }
    }

    if (!isEditMode && !isEveryObjectValueEmpty(chipsSizes)) {
      const parentSize = withInitialParentWidth
        ? chipCellInitialWidth
        : chipsCellRef.current?.getBoundingClientRect().width
      const hiddenChipsCounterWidth =
        (hiddenChipsCounterRef.current?.getBoundingClientRect().width ?? 0) + chipBlockMarginRight

      let chipsLengthSum = 0
      let chipIndex = 0
      const chipsSizesList = Object.values(chipsSizes)

      chipsSizesList.every((chipSize, index) => {
        const chipSizeWithMargin = chipSize + chipBlockMarginRight
        const isLastChip = index === chipsSizesList.length - 1
        const newChipsLengthSum = chipsLengthSum + chipSizeWithMargin
        const wouldExceedWithCounter = newChipsLengthSum + hiddenChipsCounterWidth > parentSize
        const wouldExceedWithoutCounter = newChipsLengthSum > parentSize

        // If we've exceeded the limit
        if (wouldExceedWithCounter) {
          // Special case: last chip might fit without the counter
          if (isLastChip && !wouldExceedWithoutCounter) {
            chipsLengthSum = newChipsLengthSum
            chipIndex = chipsSizesList.length
            return true
          }

          // Stop here - this chip doesn't fit
          chipIndex = index
          return false
        }

        // Chip fits, add it
        chipsLengthSum = newChipsLengthSum

        if (isLastChip) {
          chipIndex = chipsSizesList.length
        }

        return true
      })

      setVisibleChipsCount(chipIndex)
      setShowChips(true)
    }
  }, [chipBlockMarginRight, chipCellInitialWidth, chipsSizes, isEditMode, withInitialParentWidth])

  useEffect(() => {
    resizeChipCell()
  }, [resizeChipCell])

  useEffect(() => {
    const resizeChipCellDebounced = throttle(resizeChipCell, 500)

    if (!isEditMode) {
      window.addEventListener('resize', resizeChipCellDebounced)
      window.addEventListener(transitionEndEventName, resizeChipCellDebounced)

      return () => {
        window.removeEventListener('resize', resizeChipCellDebounced)
        window.removeEventListener(transitionEndEventName, resizeChipCellDebounced)
      }
    }
  }, [resizeChipCell, isEditMode, transitionEndEventName])

  return {
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
  }
}
