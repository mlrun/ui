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

import { TableCell, ActionsMenu } from 'igz-controls/components'

import { ACTIONS_MENU } from 'igz-controls/types'

const ApplicationTableRow = ({ actionsMenu, hideActionsMenu = false, rowItem }) => {
  const rowClassNames = classnames('table-row', 'table-body-row', 'parent-row')

  return (
    <tr className={rowClassNames}>
      <>
        {rowItem.content.map((value, index) => {
          return (
            !value.hidden && (
              <TableCell
                cellData={value}
                firstCell={index === 0}
                item={rowItem.data}
                key={value.id}
                link={value.getLink?.()}
                onClick={value.handleClick}
              />
            )
          )
        })}
        {!hideActionsMenu && (
          <td className="table-body__cell table-cell-icon">
            <ActionsMenu dataItem={rowItem.data} withQuickActions menu={actionsMenu} />
          </td>
        )}
      </>
    </tr>
  )
}

ApplicationTableRow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  hideActionsMenu: PropTypes.bool,
  rowItem: PropTypes.object.isRequired
}

export default React.memo(ApplicationTableRow)
