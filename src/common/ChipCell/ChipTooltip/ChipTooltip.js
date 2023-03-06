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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { getChipLabelAndValue } from '../../../utils/getChipLabelAndValue'
import { CHIP } from '../../../types'

const ChipTooltip = ({ children, chip, editConfig }) => {
  const { chipLabel, chipValue } = useMemo(() => getChipLabelAndValue(chip), [chip])

  return (
    <Tooltip
      hidden={editConfig.isEdit || /^\+ [\d]+/g.test(chip.value)}
      template={
        <TextTooltipTemplate
          text={
            chip.delimiter ? (
              <span className="chip__content">
                {chipLabel}
                <span className="chip__delimiter">{chip.delimiter}</span>
                {chipValue}
              </span>
            ) : (
              chip.value
            )
          }
        />
      }
    >
      {children}
    </Tooltip>
  )
}

ChipTooltip.defaultProps = {
  editConfig: {}
}

ChipTooltip.propTypes = {
  chip: CHIP,
  editConfig: PropTypes.object
}

export default ChipTooltip
