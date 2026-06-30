/*
Copyright 2022 Iguazio Systems Ltd.
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
import React, { forwardRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tooltip from '../../Tooltip/Tooltip'
import TextTooltipTemplate from '../../TooltipTemplate/TextTooltipTemplate'

import { CHIP_OPTIONS } from '../../../types'
import { useHiddenChipsBlock } from '../../../hooks'

let HiddenChipsBlock = (
  { chipClassNames, chipOptions, chips, handleShowElements, textOverflowEllipsis = false },
  { hiddenChipsCounterRef, hiddenChipsPopUpRef }
) => {
  const { hiddenChipsBlockClassNames } = useHiddenChipsBlock(
    hiddenChipsCounterRef,
    hiddenChipsPopUpRef
  )

  const chipLabelClassNames = classnames('chip__label', textOverflowEllipsis && 'data-ellipsis')
  const chipValueClassNames = classnames(
    'chip__value',
    textOverflowEllipsis && 'data-ellipsis',
    chipOptions.boldValue && 'chip-value_bold'
  )

  const generateChipData = chip => {
    return chip.isKeyOnly
      ? chip.key
      : `${chip.key}${chip.delimiter ? chip.delimiter : ':'} ${chip.value}`
  }

  useEffect(() => {
    if (chips.length === 0) {
      handleShowElements()
    }
  })

  return createPortal(
    <div
      ref={hiddenChipsPopUpRef}
      className={hiddenChipsBlockClassNames}
      onClick={event => event.stopPropagation()}
    >
      <div className="chip-block-hidden__scrollable-container">
        {chips?.map(element => {
          return (
            <Tooltip
              key={element.id}
              template={
                <TextTooltipTemplate
                  text={
                    element.delimiter ? (
                      <span className="chip__content">
                        {element.key}
                        {!element.isKeyOnly && (
                          <>
                            <span className="chip__delimiter">{element.delimiter}</span>
                            {element.value}
                          </>
                        )}
                      </span>
                    ) : (
                      generateChipData(element)
                    )
                  }
                />
              }
            >
              <div className={chipClassNames}>
                {element.key && <div className={chipLabelClassNames}>{element.key}</div>}
                {element.value && (
                  <>
                    <div className="chip__delimiter">{element.delimiter ?? ':'}</div>
                    <div className={chipValueClassNames}>{element.value}</div>
                  </>
                )}
              </div>
            </Tooltip>
          )
        })}
      </div>
    </div>,
    document.getElementById('overlay_container')
  )
}

HiddenChipsBlock = forwardRef(HiddenChipsBlock)

HiddenChipsBlock.displayName = 'HiddenChipsBlock'

HiddenChipsBlock.propTypes = {
  chipClassNames: PropTypes.string.isRequired,
  chipOptions: CHIP_OPTIONS.isRequired,
  chips: PropTypes.array.isRequired,
  handleShowElements: PropTypes.func.isRequired,
  textOverflowEllipsis: PropTypes.bool
}

export default HiddenChipsBlock
