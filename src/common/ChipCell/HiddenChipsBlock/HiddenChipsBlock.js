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
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'

import Chip from '../../Chip/Chip'
import ChipTooltip from '../ChipTooltip/ChipTooltip'

import { CHIP_OPTIONS, CHIPS } from '../../../types'
import { useHiddenChipsBlock } from 'igz-controls/hooks'

const HiddenChipsBlock = React.forwardRef(
  (
    {
      chips = [],
      chipIndex = 0,
      chipOptions,
      className,
      editConfig = {},
      handleEditChip,
      handleIsEdit = () => {},
      handleRemoveChip,
      handleShowElements,
      isEditMode = false,
      setEditConfig = () => {}
    },
    { hiddenChipsCounterRef, hiddenChipsPopUpRef }
  ) => {
    const { hiddenChipsBlockClassNames } = useHiddenChipsBlock(
      hiddenChipsCounterRef,
      hiddenChipsPopUpRef
    )

    useEffect(() => {
      if (chips.length === 0) {
        handleShowElements()
      }
    })

    return createPortal(
      <div ref={hiddenChipsPopUpRef} className={hiddenChipsBlockClassNames}>
        <div className="chip-block-hidden__scrollable-container">
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
                  ref={hiddenChipsPopUpRef}
                  setEditConfig={setEditConfig}
                  showChips={true}
                  textOverflowEllipsis
                />
              </ChipTooltip>
            )
          })}
        </div>
      </div>,
      document.getElementById('overlay_container')
    )
  }
)

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
