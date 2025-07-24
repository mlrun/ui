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
import classNames from 'classnames'
import { isEmpty } from 'lodash'

import ContentMenu from '../../../elements/ContentMenu/ContentMenu'
import NoData from '../../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

const ArgumentsTab = ({
  handleTabChange,
  selectedArgument = {},
  selectedItem,
  selectedTab,
  tabs
}) => {
  return (
    <div className="arguments-tab">
      <div className="arguments-tab__header">
        <ContentMenu activeTab={selectedTab} fontSize="sm" onClick={handleTabChange} tabs={tabs} />
      </div>
      {Object.values(selectedItem.prompt_legend ?? {}).map(legend => {
        const rowClassNames = classNames(
          'arguments-tab__row',
          selectedArgument.field + selectedArgument.description ===
            legend.field + legend.description && 'arguments-tab__row_selected'
        )

        return (
          <div className={rowClassNames} key={legend.field + legend.description}>
            <div className="arguments-tab__row-key">
              <Tooltip template={<TextTooltipTemplate text={legend.field} />}>
                {legend.field}
              </Tooltip>
            </div>
            <div className="arguments-tab__row-value">{legend.description}</div>
          </div>
        )
      })}
      {isEmpty(selectedItem.prompt_legend) && <NoData />}
    </div>
  )
}

ArgumentsTab.propTypes = {
  handleTabChange: PropTypes.func.isRequired,
  selectedArgument: PropTypes.object,
  selectedItem: PropTypes.object.isRequired,
  selectedTab: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired
}

export default ArgumentsTab
