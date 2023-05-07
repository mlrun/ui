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

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import { getFunctionIdentifier } from '../../utils/getUniqueIdentifier'
import { ACTIONS_MENU } from '../../types'
import { DETAILS_OVERVIEW_TAB } from '../../constants'

const FunctionsTableRow = ({
  actionsMenu,
  handleExpandRow,
  handleSelectItem,
  mainRowItemsCount,
  rowItem,
  selectedItem,
  selectedRowData
}) => {
  const parent = useRef()
  const params = useParams()
  const rowClassNames = classnames(
    'table-row',
    'parent-row',
    getFunctionIdentifier(selectedItem, true) === rowItem.data?.ui?.identifierUnique &&
      !parent.current?.classList.value.includes('parent-row-expanded') &&
      'row_active',
    parent.current?.classList.value.includes('parent-row-expanded') && 'parent-row-expanded'
  )

  return (
    <tr className={rowClassNames} ref={parent}>
      {parent.current?.classList.contains('parent-row-expanded') ? (
        <>
          <td
            className={`table-body__cell
              ${parent.current?.classList.contains('parent-row-expanded') && 'row_grouped-by'}`}
          >
            <table cellPadding="0" cellSpacing="0" className="table">
              <tbody className="table-body">
                <tr className="table-row">
                  {rowItem.content.map((data, index) => {
                    const cellClassName = classnames(
                      index >= mainRowItemsCount && 'table-body__cell_hidden'
                    )

                    return (
                      !data.hidden && (
                        <TableCell
                          className={cellClassName}
                          data={data}
                          firstCell
                          handleExpandRow={handleExpandRow}
                          item={rowItem}
                          key={data.id}
                          selectItem={handleSelectItem}
                          selectedItem={selectedItem}
                          showExpandButton
                        />
                      )
                    )
                  })}
                  <td className="table-body__cell table-cell-icon" />
                </tr>
              </tbody>
            </table>
          </td>

          {selectedRowData[rowItem.data.ui.identifier]?.content.map((func, index) => {
            const subRowClassNames = classnames(
              'table-row',
              selectedItem.name &&
                getFunctionIdentifier(selectedItem, true) === func.data.ui.identifierUnique &&
                'row_active'
            )

            return (
              <td className="table-body__cell" key={index}>
                <table cellPadding="0" cellSpacing="0" className="table">
                  <tbody className="table-body">
                    <tr className={subRowClassNames}>
                      {func.content.map((value, index) => {
                        const cellClassNames = classnames(
                          !isEmpty(selectedItem) &&
                            index >= mainRowItemsCount &&
                            'table-body__cell_hidden'
                        )

                        return (
                          !value.hidden && (
                            <TableCell
                              className={cellClassNames}
                              data={value.expandedCellContent ? value.expandedCellContent : value}
                              item={func.data}
                              link={value.getLink?.(
                                func.data.hash,
                                params.tab ?? DETAILS_OVERVIEW_TAB
                              )}
                              key={value.id}
                              selectItem={handleSelectItem}
                              selectedItem={selectedItem}
                            />
                          )
                        )
                      })}
                      <td className="table-body__cell table-cell-icon">
                        <ActionsMenu dataItem={func.data} menu={actionsMenu} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            )
          })}
        </>
      ) : (
        <>
          {rowItem.content.map((value, index) => {
            return (
              !value.hidden && (
                <TableCell
                  data={value}
                  firstCell={index === 0}
                  handleExpandRow={handleExpandRow}
                  item={rowItem.data}
                  key={value.id}
                  link={value.getLink?.(rowItem.data.hash, params.tab ?? DETAILS_OVERVIEW_TAB)}
                  selectedItem={selectedItem}
                  selectItem={handleSelectItem}
                  showExpandButton={value.showExpandButton}
                />
              )
            )
          })}
          <td className="table-body__cell table-cell-icon">
            <ActionsMenu dataItem={rowItem.data} menu={actionsMenu} />
          </td>
        </>
      )}
    </tr>
  )
}

FunctionsTableRow.defaultProps = {
  mainRowItemsCount: 1
}

FunctionsTableRow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  mainRowItemsCount: PropTypes.number,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  selectedRowData: PropTypes.object.isRequired
}

export default FunctionsTableRow
