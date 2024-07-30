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
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Chip from '../Chip/Chip'
import HiddenChipsBlock from './HiddenChipsBlock/HiddenChipsBlock'
import ChipTooltip from './ChipTooltip/ChipTooltip'

import { ReactComponent as Add } from 'igz-controls/images/add.svg'

import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { CHIP_OPTIONS, CHIPS } from '../../types'

import './chipCell.scss'

const ChipCellView = React.forwardRef(
  (
    {
      chips = {},
      chipOptions,
      className = '',
      editConfig = {},
      handleAddNewChip = () => {},
      handleEditChip,
      handleIsEdit = () => {},
      handleRemoveChip,
      handleShowElements = () => {},
      isEditMode = false,
      setChipsSizes = () => {},
      setEditConfig = () => {},
      setValidation = null,
      shortChips,
      showChips = false,
      showHiddenChips
    },
    { chipsCellRef, chipsWrapperRef, hiddenChipsCounterRef, hiddenChipsPopUpRef }
  ) => {
    const buttonAddClassNames = classnames(
      'button-add',
      className,
      chipOptions.background && `button-add-background_${chipOptions.background}`,
      chipOptions.borderColor && `button-add-border_${chipOptions.borderColor}`,
      chipOptions.font && `button-add-font_${chipOptions.font}`,
      chipOptions.density && `button-add-density_${chipOptions.density}`
    )
    const wrapperClassNames = classnames('chips-wrapper', isEditMode && 'fixed-max-width')

    return (
      (isEditMode || !isEveryObjectValueEmpty(chips)) && (
        <div className="chips-cell" ref={chipsCellRef}>
          <div className={wrapperClassNames} ref={chipsWrapperRef}>
            {chips.visibleChips.map((chip, index) => {
              return (
                <div className="chip-block" key={`${chip.value}${index}`}>
                  <ChipTooltip chip={chip} editConfig={editConfig} key={chip.value}>
                    <Chip
                      chip={chip}
                      chipIndex={index}
                      chipOptions={chipOptions}
                      className={className}
                      editConfig={editConfig}
                      handleEditChip={handleEditChip}
                      handleIsEdit={handleIsEdit}
                      handleRemoveChip={handleRemoveChip}
                      isEditMode={isEditMode}
                      onClick={handleShowElements}
                      ref={{ chipsCellRef, hiddenChipsCounterRef }}
                      setChipsSizes={setChipsSizes}
                      setEditConfig={setEditConfig}
                      setValidation={setValidation}
                      shortChip={shortChips}
                      showChips={showChips}
                      textOverflowEllipsis
                    />
                  </ChipTooltip>
                  {chips.visibleChips.length - 1 === index && showHiddenChips && (
                    <HiddenChipsBlock
                      chipOptions={chipOptions}
                      className={className}
                      chips={chips.hiddenChips}
                      chipIndex={index}
                      editConfig={editConfig}
                      handleEditChip={handleEditChip}
                      handleIsEdit={handleIsEdit}
                      handleRemoveChip={handleRemoveChip}
                      handleShowElements={handleShowElements}
                      isEditMode={isEditMode}
                      setEditConfig={setEditConfig}
                      setChipsSizes={setChipsSizes}
                      ref={{ hiddenChipsCounterRef, hiddenChipsPopUpRef }}
                    />
                  )}
                </div>
              )
            })}
            {isEditMode && (
              <button className={buttonAddClassNames} onClick={e => handleAddNewChip(e, ':')}>
                <Add />
              </button>
            )}
          </div>
        </div>
      )
    )
  }
)

ChipCellView.propTypes = {
  chips: PropTypes.shape({ visibleChips: CHIPS, hiddenChips: CHIPS }),
  chipOptions: CHIP_OPTIONS.isRequired,
  className: PropTypes.string,
  editConfig: PropTypes.shape({}),
  handleAddNewChip: PropTypes.func,
  handleEditChip: PropTypes.func,
  handleIsEdit: PropTypes.func,
  handleRemoveChip: PropTypes.func,
  handleShowElements: PropTypes.func,
  isEditMode: PropTypes.bool,
  setChipsSizes: PropTypes.func,
  setEditConfig: PropTypes.func,
  setValidation: PropTypes.func,
  shortChips: PropTypes.bool,
  showChips: PropTypes.bool.isRequired,
  showHiddenChips: PropTypes.bool.isRequired
}

export default ChipCellView
