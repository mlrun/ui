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
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FieldArray } from 'react-final-form-arrays'
import { isEmpty } from 'lodash'

import FormChip from './FormChip/FormChip'
import HiddenChipsBlock from './HiddenChipsBlock/HiddenChipsBlock'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../Tooltip/Tooltip'

import { CHIP_OPTIONS, VISIBLE_CHIPS_MAX_LENGTH } from '../../types'
import { isEveryObjectValueEmpty } from '../../utils/common.util'
import { uniquenessError } from './formChipCell.util'

import Add from '../../images/add.svg?react'

let FormChipCellView = (
  {
    chipOptions = {
      background: 'purple',
      boldValue: false,
      borderRadius: 'primary',
      borderColor: 'transparent',
      density: 'dense',
      font: 'purple'
    },
    chipSizeIsRecalculated,
    setChipSizeIsRecalculated,
    children,
    chips,
    editConfig,
    handleAddNewChip,
    handleEditChip,
    handleRemoveChip,
    handleShowElements,
    handleToEditMode,
    isDeletable = false,
    isEditable = false,
    name,
    setChipsSizes,
    setEditConfig,
    shortChips = false,
    showChips,
    showHiddenChips,
    validateFields,
    validationRules = {},
    visibleChipsMaxLength = null
  },
  { chipsCellRef, chipsWrapperRef, hiddenChipsCounterRef, hiddenChipsPopUpRef }
) => {
  const buttonAddClassNames = classnames(
    'button-add',
    chipOptions.background && `button-add-background_${chipOptions.background}`,
    chipOptions.borderColor && `button-add-border_${chipOptions.borderColor}`,
    chipOptions.font && `button-add-font_${chipOptions.font}`,
    chipOptions.density && `button-add-density_${chipOptions.density}`
  )
  const wrapperClassNames = classnames(
    'chips-wrapper',
    isEditable && 'fixed-max-width',
    chips.visibleChips?.length > 0 && !chipSizeIsRecalculated && 'chip_invisible',
    visibleChipsMaxLength === 'all' && 'chips-wrapper_all-visible'
  )
  const chipClassNames = classnames(
    'chip',
    'chip__content',
    isEditable && 'data-ellipsis',
    shortChips && 'chip_short',
    chips.hiddenChips && 'chip_hidden',
    chipOptions.density && `chip-density_${chipOptions.density}`,
    chipOptions.borderRadius && `chip-border_${chipOptions.borderRadius}`,
    chipOptions.background && `chip-background_${chipOptions.background}`,
    chipOptions.borderColor && `chip-border_${chipOptions.borderColor}`,
    chipOptions.font && `chip-font_${chipOptions.font}`,
    isEditable && 'editable',
    (showChips || isEditable) && 'chip_visible'
  )

  return (
    <FieldArray name={name} validate={validateFields}>
      {({ fields, meta }) => {
        let newValidationRules = { ...validationRules }

        if (
          !isEmpty(validationRules) &&
          validationRules.key.every(rule => rule.name !== uniquenessError.name)
        ) {
          newValidationRules = {
            ...validationRules,
            key: [...validationRules.key, uniquenessError]
          }
        }

        return (
          (isEditable || !isEveryObjectValueEmpty(fields)) && (
            <div className="chips-cell" ref={chipsCellRef}>
              <div className={wrapperClassNames} ref={chipsWrapperRef}>
                {fields.map((contentItem, index) => {
                  const chipData = fields.value[index]

                  return (
                    index < chips.visibleChips?.length && (
                      <div className="chip-block" key={chipData.id}>
                        <Tooltip
                          hidden={editConfig.isEdit && !chipData.tooltip}
                          key={chipData.id}
                          template={
                            <TextTooltipTemplate
                              text={
                                chipData.tooltip || (
                                  <span className="chip__content">
                                    <span className="chip__content-item">{chipData.key}</span>
                                    {!chipData.isKeyOnly && (
                                      <>
                                        <span className="chip__delimiter">
                                          {chipData.delimiter ? chipData.delimiter : ':'}
                                        </span>
                                        <span className="chip__content-item">{chipData.value}</span>
                                      </>
                                    )}
                                  </span>
                                )
                              }
                            />
                          }
                        >
                          <FormChip
                            chip={chipData}
                            chipSizeIsRecalculated={chipSizeIsRecalculated}
                            setChipSizeIsRecalculated={setChipSizeIsRecalculated}
                            chipIndex={index}
                            chipOptions={chipOptions}
                            editConfig={editConfig}
                            handleEditChip={(event, nameEvent, isOutsideClick) =>
                              handleEditChip(event, fields, nameEvent, isOutsideClick)
                            }
                            handleRemoveChip={(event, index) =>
                              handleRemoveChip(event, fields, index)
                            }
                            handleToEditMode={handleToEditMode}
                            isDeletable={isDeletable}
                            isEditable={isEditable}
                            keyName={`${contentItem}.key`}
                            meta={meta}
                            ref={chipsCellRef}
                            setChipsSizes={setChipsSizes}
                            setEditConfig={setEditConfig}
                            validationRules={newValidationRules}
                            valueName={`${contentItem}.value`}
                          />
                        </Tooltip>
                      </div>
                    )
                  )
                })}

                <div className="chip-block">
                  {chips.hiddenChips.length > 0 && showHiddenChips && (
                    <HiddenChipsBlock
                      chipClassNames={chipClassNames}
                      chipOptions={chipOptions}
                      chips={chips.hiddenChips}
                      handleShowElements={handleShowElements}
                      ref={{ hiddenChipsCounterRef, hiddenChipsPopUpRef }}
                      textOverflowEllipsis
                    />
                  )}
                  {chips.hiddenChipsNumber && (
                    <span
                      ref={hiddenChipsCounterRef}
                      className={`${chipClassNames} chips_button`}
                      onClick={handleShowElements}
                    >
                      {chips.hiddenChipsNumber}
                    </span>
                  )}
                </div>

                {isEditable && (
                  <button
                    data-testid={`${name}-add-chip`}
                    className={buttonAddClassNames}
                    onClick={e => handleAddNewChip(e, fields)}
                  >
                    <Add />
                  </button>
                )}
                {children}
              </div>
            </div>
          )
        )
      }}
    </FieldArray>
  )
}

FormChipCellView = forwardRef(FormChipCellView)

FormChipCellView.displayName = 'FormChipCellView'

FormChipCellView.propTypes = {
  chipOptions: CHIP_OPTIONS,
  chipSizeIsRecalculated: PropTypes.bool.isRequired,
  setChipSizeIsRecalculated: PropTypes.func.isRequired,
  children: PropTypes.node,
  chips: PropTypes.object.isRequired,
  editConfig: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  handleAddNewChip: PropTypes.func.isRequired,
  handleEditChip: PropTypes.func.isRequired,
  handleRemoveChip: PropTypes.func.isRequired,
  handleShowElements: PropTypes.func.isRequired,
  handleToEditMode: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool,
  isEditable: PropTypes.bool,
  name: PropTypes.string.isRequired,
  setChipsSizes: PropTypes.func.isRequired,
  setEditConfig: PropTypes.func.isRequired,
  shortChips: PropTypes.bool,
  showChips: PropTypes.bool.isRequired,
  showHiddenChips: PropTypes.bool.isRequired,
  validateFields: PropTypes.func.isRequired,
  validationRules: PropTypes.object,
  visibleChipsMaxLength: VISIBLE_CHIPS_MAX_LENGTH
}

export default FormChipCellView
