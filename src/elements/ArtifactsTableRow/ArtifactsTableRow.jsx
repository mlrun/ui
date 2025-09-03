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
import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

import { ActionsMenu, TableCell } from 'igz-controls/components'

import { ACTIONS_MENU } from 'igz-controls/types'
import { DETAILS_OVERVIEW_TAB, MODEL_ENDPOINTS_TAB } from '../../constants'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'

const ArtifactsTableRow = ({
  actionsMenu,
  handleSelectItem = () => {},
  hideActionsMenu = false,
  mainRowItemsCount = 1,
  rowItem,
  selectedItem,
  tab = ''
}) => {
  const parent = useRef()
  const params = useParams()

  const rowClassNames = classnames(
    'table-row',
    'table-body-row',
    'parent-row',
    (selectedItem?.db_key || selectedItem?.spec?.model_name) &&
      getArtifactIdentifier(selectedItem, true) === rowItem.data.ui.identifierUnique &&
      'table-row_active'
  )

  return (
    <tr className={rowClassNames} ref={parent}>
      <>
        {rowItem.content.map((value, index) => {
          const cellClassNames = classnames(
            !isEmpty(selectedItem) && index >= mainRowItemsCount && 'table-body__cell_hidden'
          )

          return (
            !value.hidden && (
              <TableCell
                className={cellClassNames}
                cellData={value}
                firstCell={index === 0 && params.pageTab !== MODEL_ENDPOINTS_TAB}
                item={rowItem.data}
                key={value.id}
                link={value.getLink?.(params.tab ?? DETAILS_OVERVIEW_TAB)}
                onClick={value.handleClick}
                selectItem={handleSelectItem}
                selectedItem={selectedItem}
              />
            )
          )
        })}
        {!hideActionsMenu && (
          <td className="table-body__cell table-cell-icon">
            <ActionsMenu
              dataItem={rowItem.data}
              withQuickActions={tab !== MODEL_ENDPOINTS_TAB}
              menu={actionsMenu}
            />
          </td>
        )}
      </>
    </tr>
  )
}

ArtifactsTableRow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  handleSelectItem: PropTypes.func,
  hideActionsMenu: PropTypes.bool,
  mainRowItemsCount: PropTypes.number,
  rowItem: PropTypes.object.isRequired,
  selectedItem: PropTypes.object.isRequired,
  tab: PropTypes.string
}

export default React.memo(ArtifactsTableRow)
