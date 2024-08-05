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
import { map } from 'lodash'
import classnames from 'classnames'

import ActionsMenu from '../../../common/ActionsMenu/ActionsMenu'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ACTIONS_MENU } from '../../../types'

const FeatureSetsPanelTableRow = ({
  actionButton = null,
  actionsMenu = [],
  className = '',
  contentItem
}) => {
  const rowClassNames = classnames('table__row', className)

  return (
    <div className={rowClassNames}>
      {map(contentItem.data, (value, property) => {
        return (
          <div className="table__cell" key={property}>
            <Tooltip template={<TextTooltipTemplate text={value} />}>{value}</Tooltip>
          </div>
        )
      })}
      <div className="table__cell table__cell-actions">
        {actionsMenu.length > 0 ? (
          <ActionsMenu menu={actionsMenu} dataItem={contentItem} />
        ) : (
          actionButton && (
            <Tooltip template={<TextTooltipTemplate text={actionButton.label} />}>
              <button
                className={actionButton.className}
                onClick={() => actionButton.onClick(contentItem)}
              >
                {actionButton.icon}
              </button>
            </Tooltip>
          )
        )}
      </div>
    </div>
  )
}

FeatureSetsPanelTableRow.propTypes = {
  actionButton: PropTypes.shape({
    className: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  actionsMenu: ACTIONS_MENU,
  className: PropTypes.string,
  contentItem: PropTypes.shape({}).isRequired
}

export default FeatureSetsPanelTableRow
