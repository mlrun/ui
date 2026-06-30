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
import React, { useLayoutEffect, forwardRef } from 'react'
import PropTypes from 'prop-types'

import NewChipForm from '../NewChipForm/NewChipForm'

import { CHIP_OPTIONS } from '../../../types'

import './formChip.scss'

let FormChip = (
  {
    chip,
    chipIndex,
    chipSizeIsRecalculated,
    setChipSizeIsRecalculated,
    chipOptions = {
      background: 'purple',
      boldValue: false,
      borderRadius: 'primary',
      borderColor: 'transparent',
      density: 'dense',
      font: 'purple'
    },
    editConfig,
    handleEditChip,
    handleRemoveChip,
    handleToEditMode,
    isDeletable = false,
    isEditable = false,
    keyName = '',
    meta,
    setChipsSizes,
    setEditConfig,
    validationRules = {},
    valueName = ''
  },
  ref
) => {
  const chipRef = React.useRef()
  useLayoutEffect(() => {
    if (chipRef.current && setChipsSizes && chipSizeIsRecalculated) {
      setChipsSizes(state => ({
        ...state,
        [chipIndex]: chipRef.current?.getBoundingClientRect?.()?.width ?? 50
      }))
    }
  }, [chipIndex, chipSizeIsRecalculated, setChipsSizes])

  return (
    <div onClick={event => handleToEditMode(event, chipIndex, keyName)} ref={chipRef}>
      <NewChipForm
        chip={chip}
        chipIndex={chipIndex}
        chipOptions={chipOptions}
        className="input-label-key"
        editConfig={editConfig}
        handleRemoveChip={handleRemoveChip}
        isDeletable={isDeletable}
        isEditable={isEditable}
        keyName={keyName}
        meta={meta}
        onChange={handleEditChip}
        ref={ref}
        setChipSizeIsRecalculated={setChipSizeIsRecalculated}
        setEditConfig={setEditConfig}
        validationRules={validationRules}
        valueName={valueName}
      />
    </div>
  )
}

FormChip = forwardRef(FormChip)

FormChip.displayName = 'FormChip'

FormChip.propTypes = {
  chip: PropTypes.object.isRequired,
  chipSizeIsRecalculated: PropTypes.bool.isRequired,
  setChipSizeIsRecalculated: PropTypes.func.isRequired,
  chipIndex: PropTypes.number.isRequired,
  chipOptions: CHIP_OPTIONS,
  editConfig: PropTypes.object.isRequired,
  handleEditChip: PropTypes.func.isRequired,
  handleRemoveChip: PropTypes.func.isRequired,
  handleToEditMode: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool,
  isEditable: PropTypes.bool,
  keyName: PropTypes.string,
  meta: PropTypes.object.isRequired,
  setChipsSizes: PropTypes.func.isRequired,
  setEditConfig: PropTypes.func.isRequired,
  validationRules: PropTypes.object,
  valueName: PropTypes.string
}

export default FormChip
