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
import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import ChipForm from '../ChipForm/ChipForm'

import { ReactComponent as Close } from 'igz-controls/images/close.svg'

import { getChipLabelAndValue } from '../../utils/getChipLabelAndValue'
import { CHIP, CHIP_OPTIONS } from '../../types'

import './chip.scss'

const Chip = React.forwardRef(
  (
    {
      chip,
      chipIndex = null,
      chipOptions,
      className,
      editConfig = {},
      handleEditChip = () => {},
      handleIsEdit = () => {},
      handleRemoveChip = () => {},
      hiddenChips = false,
      isDeleteMode = false,
      isEditMode = false,
      onClick = null,
      setChipsSizes = () => {},
      setEditConfig = () => {},
      setValidation = null,
      shortChip = false,
      showChips,
      textOverflowEllipsis = false
    },
    { chipsCellRef, hiddenChipsCounterRef }
  ) => {
    const [validationRules, setValidationRules] = useState([])
    const frontendSpec = useSelector(store => store.appStore.frontendSpec)
    const chipRef = React.useRef()
    const { chipLabel, chipValue } = getChipLabelAndValue(chip)
    const { background, boldValue, borderColor, density, font, borderRadius } = chipOptions

    const chipClassNames = classnames(
      'chip',
      'chip__content',
      (textOverflowEllipsis || isEditMode) && 'data-ellipsis',
      shortChip && 'chip_short',
      hiddenChips && 'chip_hidden',
      density && `chip-density_${density}`,
      borderRadius && `chip-border_${borderRadius}`,
      background && `chip-background_${background}`,
      borderColor && `chip-border_${borderColor}`,
      font && `chip-font_${font}`,
      isEditMode && 'editable',
      (showChips || isEditMode) && 'chip_visible',
      className
    )
    const chipLabelClassNames = classnames(
      'chip__label',
      (textOverflowEllipsis || isEditMode) && 'data-ellipsis',
      !isEmpty(validationRules) && 'chip__label_invalid'
    )
    const chipValueClassNames = classnames(
      'chip__value',
      (textOverflowEllipsis || isEditMode) && 'data-ellipsis',
      boldValue && 'chip-value_bold'
    )

    const checkValidation = useCallback(
      chipKey => {
        if (frontendSpec.internal_labels.includes(chipKey)) {
          setValidationRules([
            { name: 'internal label', label: 'System-defined labels cannot be modified.' }
          ])

          return setValidation(false)
        }

        setValidationRules([])
        setValidation(true)
      },
      [frontendSpec.internal_labels, setValidation]
    )

    useEffect(() => {
      if (setValidation) {
        checkValidation(chip.value.match(/^(?<key>|.+?):\s?(?<value>|.+?)$/)?.groups?.key)
      }
    }, [checkValidation, chip, setValidation])

    useEffect(() => {
      if (chipRef.current && setChipsSizes) {
        const { marginLeft, marginRight } = getComputedStyle(chipRef.current)

        setChipsSizes(state => ({
          ...state,
          [chipIndex]:
            chipRef.current.getBoundingClientRect().width +
            parseFloat(marginLeft) +
            parseFloat(marginRight)
        }))
      }
    }, [chipIndex, setChipsSizes])

    if (!chip.value.match(/^\+ [\d]+/g)) {
      return isEditMode && chipIndex === editConfig.chipIndex ? (
        <ChipForm
          chipOptions={chipOptions}
          className="input-label-key"
          editConfig={editConfig}
          key={chip.value}
          onChange={handleEditChip}
          ref={chipsCellRef}
          setEditConfig={setEditConfig}
          value={chip.value.match(/^(?<key>|.+?):\s?(?<value>|.+?)$/)?.groups}
          validationRules={validationRules}
          checkValidation={checkValidation}
        />
      ) : (
        <div
          className={chipClassNames}
          ref={chipRef}
          onClick={event => handleIsEdit(event, chipIndex)}
        >
          {chipLabel && <div className={chipLabelClassNames}>{chipLabel}</div>}
          {chipValue && (
            <>
              <div className="chip__delimiter">{chip.delimiter ?? ':'}</div>
              <div className={chipValueClassNames}>{chipValue}</div>
            </>
          )}
          {(isEditMode || isDeleteMode) && (
            <button
              className="item-icon-close"
              onClick={event => handleRemoveChip(event, chipIndex)}
            >
              <Close />
            </button>
          )}
        </div>
      )
    }

    return (
      <span
        className={`${chipClassNames} chips_button`}
        onClick={onClick}
        ref={hiddenChipsCounterRef}
      >
        {chip.value}
      </span>
    )
  }
)

Chip.propTypes = {
  chip: CHIP.isRequired,
  chipIndex: PropTypes.number,
  chipOptions: CHIP_OPTIONS.isRequired,
  className: PropTypes.string,
  editConfig: PropTypes.shape({}),
  handleEditChip: PropTypes.func,
  handleIsEdit: PropTypes.func,
  handleRemoveChip: PropTypes.func,
  hiddenChips: PropTypes.bool,
  isDeleteMode: PropTypes.bool,
  isEditMode: PropTypes.bool,
  onClick: PropTypes.func,
  setChipsSizes: PropTypes.func,
  setEditConfig: PropTypes.func,
  setValidation: PropTypes.func,
  shortChip: PropTypes.bool,
  showChips: PropTypes.bool.isRequired,
  textOverflowEllipsis: PropTypes.bool
}

export default Chip
