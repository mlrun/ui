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
import React, { useRef, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Chip from '../../common/Chip/Chip'
import ChipTooltip from '../../common/ChipCell/ChipTooltip/ChipTooltip'

import { getFirstScrollableParent } from '../../utils/getFirstScrollableParent'
import localStorageService from '../../utils/localStorageService'
import { CHIP_OPTIONS, CHIPS } from '../../types'
import { NAVBAR_WIDTH_OPENED } from '../../constants'

import './hiddenChipsBlock.scss'

const HiddenChipsBlock = React.forwardRef(
  (
    {
      chipIndex,
      chips,
      chipOptions,
      className,
      editConfig,
      handleEditChip,
      handleIsEdit,
      handleRemoveChip,
      handleShowElements,
      isEditMode,
      setEditConfig
    },
    hiddenChipCounterRef
  ) => {
    const [isTop, setIsTop] = useState(false)
    const [isRight, setIsRight] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const isNavbarPinned = localStorageService.getStorageValue('mlrunUi.navbarStatic', true)

    const hiddenRef = useRef()

    const offset = 28

    const hiddenChipsBlockClassNames = classnames(
      'chip-block-hidden',
      isTop ? 'chip-block-hidden_top' : 'chip-block-hidden_bottom',
      isRight ? 'chip-block-hidden_right' : 'chip-block-hidden_left',
      isVisible && 'chip-block-hidden_visible'
    )

    const handleResize = useCallback(() => {
      if (hiddenRef?.current && hiddenChipCounterRef?.current) {
        const scrollableParent = getFirstScrollableParent(hiddenRef.current.offsetParent)
        const { height, top } = hiddenRef.current.getBoundingClientRect()
        const { left } = hiddenChipCounterRef.current.getBoundingClientRect()
        const hiddenChipBlockWidth = hiddenRef.current.offsetWidth

        if (
          hiddenRef.current.offsetParent.getBoundingClientRect().top -
            hiddenRef.current.offsetParent.clientHeight -
            height -
            offset <
            0 ||
          scrollableParent.getBoundingClientRect().top > top
        ) {
          setIsTop(true)
        }

        setIsRight(
          isNavbarPinned
            ? left - NAVBAR_WIDTH_OPENED <= hiddenChipBlockWidth
            : left <= hiddenChipBlockWidth
        )
        setIsVisible(true)
      }
    }, [hiddenRef, hiddenChipCounterRef, isNavbarPinned])

    useEffect(() => {
      if (hiddenRef?.current && hiddenChipCounterRef?.current) {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
      }
    }, [handleResize, hiddenRef, hiddenChipCounterRef])

    useEffect(() => {
      handleResize()
    }, [handleResize])

    useEffect(() => {
      if (chips.length === 0) {
        handleShowElements()
      }
    })

    return (
      <div ref={hiddenRef} className={hiddenChipsBlockClassNames}>
        {chips?.map((element, index) => {
          return (
            <ChipTooltip chip={element} key={element.value}>
              <Chip
                chip={element}
                chipIndex={index + chipIndex}
                chipOptions={chipOptions}
                className={className}
                editConfig={editConfig}
                handleEditChip={handleEditChip}
                handleIsEdit={handleIsEdit}
                handleRemoveChip={handleRemoveChip}
                hiddenChips
                isEditMode={isEditMode}
                ref={hiddenRef}
                setEditConfig={setEditConfig}
                showChips={true}
                textOverflowEllipsis
              />
            </ChipTooltip>
          )
        })}
      </div>
    )
  }
)

HiddenChipsBlock.defaultProps = {
  chips: [],
  chipIndex: 0,
  editChip: () => {},
  editConfig: {},
  handleIsEdit: () => {},
  isEditMode: false,
  removeChip: () => {},
  setEditConfig: () => {}
}

HiddenChipsBlock.propTypes = {
  className: PropTypes.string,
  chips: CHIPS,
  chipOptions: CHIP_OPTIONS.isRequired,
  chipIndex: PropTypes.number,
  editConfig: PropTypes.shape({}),
  handleEditChip: PropTypes.func,
  handleIsEdit: PropTypes.func,
  handleRemoveChip: PropTypes.func,
  handleShowElements: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  setEditConfig: PropTypes.func
}

export default HiddenChipsBlock
