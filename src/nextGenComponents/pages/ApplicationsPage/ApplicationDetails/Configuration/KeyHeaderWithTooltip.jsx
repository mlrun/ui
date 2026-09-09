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
import { Tooltip, TooltipContent, TooltipTrigger } from 'igz-controls/nextGenComponents'
import { HelpCircle } from 'lucide-react'

import { TOOLTIP_COLLISION_PADDING, TOOLTIP_DELAY_MS } from './applicationConfiguration.constants'

const KeyHeaderWithTooltip = ({ tooltipText }) => (
  <div className="flex items-center gap-1">
    <span>Key</span>
    <Tooltip delayDuration={TOOLTIP_DELAY_MS}>
      <TooltipTrigger asChild>
        <HelpCircle
          className="w-3 h-3 text-igz-secondary cursor-default"
          aria-label="Help"
          data-testid="key-column-help-icon"
        />
      </TooltipTrigger>
      <TooltipContent
        side="top"
        collisionPadding={TOOLTIP_COLLISION_PADDING}
        className="max-w-md whitespace-normal"
      >
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  </div>
)

KeyHeaderWithTooltip.propTypes = {
  tooltipText: PropTypes.string.isRequired
}

export default KeyHeaderWithTooltip
