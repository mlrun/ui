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
import { useCallback, useEffect, useMemo, useState } from 'react'
import classnames from 'classnames'

import { getTransitionEndEventName } from '../utils/common.util'

export const useHiddenChipsBlock = (hiddenChipsCounterRef, hiddenChipsPopUpRef) => {
  const [isTop, setIsTop] = useState(false)
  const [isLeft, setIsLeft] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const transitionEndEventName = useMemo(() => getTransitionEndEventName(), [])

  const hiddenChipsBlockClassNames = classnames(
    'chip-block-hidden',
    isTop ? 'chip-block-hidden_top' : 'chip-block-hidden_bottom',
    isLeft ? 'chip-block-hidden_left' : 'chip-block-hidden_right',
    isVisible && 'chip-block-hidden_visible'
  )

  const resizePopUp = useCallback(() => {
    if (hiddenChipsPopUpRef?.current && hiddenChipsCounterRef?.current) {
      const offset = 10
      const offsetMargin = 20
      const elementRect = hiddenChipsCounterRef.current.getBoundingClientRect()

      // Calculate the distance from the right edge of the window to the element's right edge
      const elementRectRight = Math.floor(window.innerWidth - elementRect.left - elementRect.width)

      // Calculate the distance from the bottom edge of the window to the element's bottom edge
      const elementRectBottom = Math.floor(
        window.innerHeight - elementRect.top - elementRect.height
      )
      let isLeftPosition = false
      let isTopPosition = false
      hiddenChipsPopUpRef.current.style.maxWidth = '100%'
      hiddenChipsPopUpRef.current.style.maxHeight = '100%'

      // Determine if the left position is preferred based on the element's position and available width
      if (elementRect.left > hiddenChipsPopUpRef.current.clientWidth) {
        isLeftPosition = true
      } else if (elementRectRight > hiddenChipsPopUpRef.current.clientWidth) {
        isLeftPosition = false
      } else {
        // Compare elementRect.left and elementRectRight to choose the larger value as the max width
        isLeftPosition = elementRect.left > elementRectRight
        const popUpMaxWidth = Math.max(elementRect.left, elementRectRight)
        hiddenChipsPopUpRef.current.style.maxWidth = `${popUpMaxWidth}px`
      }

      hiddenChipsPopUpRef.current.style.right = isLeftPosition ? `${elementRectRight}px` : 'unset'
      hiddenChipsPopUpRef.current.style.left = isLeftPosition ? 'unset' : `${elementRect.left}px`

      // Determine if the top position is preferred based on the element's position and available height
      if (elementRect.top > hiddenChipsPopUpRef.current.clientHeight + offset + offsetMargin) {
        isTopPosition = true
      } else if (
        elementRectBottom >
        hiddenChipsPopUpRef.current.clientHeight + offset + offsetMargin
      ) {
        isTopPosition = false
      } else {
        // Compare elementRect.top and elementRectBottom to choose the larger value as the max height
        isTopPosition = elementRect.top > elementRectBottom + offset
        const popUpMaxHeight = Math.max(elementRect.top, elementRectBottom) - offset - offsetMargin
        hiddenChipsPopUpRef.current.style.maxHeight = `${popUpMaxHeight}px`
      }

      hiddenChipsPopUpRef.current.style.bottom = isTopPosition
        ? `${elementRectBottom + elementRect.height + offset}px`
        : 'unset'
      hiddenChipsPopUpRef.current.style.top = isTopPosition
        ? 'unset'
        : `${elementRect.bottom + offset}px`

      setIsTop(isTopPosition)
      setIsLeft(isLeftPosition)
      setIsVisible(true)
    }
  }, [hiddenChipsCounterRef, hiddenChipsPopUpRef])

  useEffect(() => {
    if (hiddenChipsPopUpRef?.current && hiddenChipsCounterRef?.current) {
      window.addEventListener('resize', resizePopUp)
      window.addEventListener(transitionEndEventName, resizePopUp)

      return () => {
        window.removeEventListener('resize', resizePopUp)
        window.removeEventListener(transitionEndEventName, resizePopUp)
      }
    }
  }, [hiddenChipsPopUpRef, hiddenChipsCounterRef, resizePopUp, transitionEndEventName])

  useEffect(() => {
    resizePopUp()
  }, [resizePopUp])

  return {
    hiddenChipsBlockClassNames
  }
}
