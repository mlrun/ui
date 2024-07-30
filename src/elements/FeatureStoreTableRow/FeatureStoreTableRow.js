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
import React, { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { isEmpty } from 'lodash'

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import Loader from '../../common/Loader/Loader'
import TableCell from '../TableCell/TableCell'

import { ACTIONS_MENU } from '../../types'
import { DETAILS_OVERVIEW_TAB, TABLE_CONTAINER } from '../../constants'
import { generateTableRowTestId } from '../../utils/generateTableRowTestId'
import { getIdentifierMethod } from '../../utils/getUniqueIdentifier'
import { isRowExpanded, PARENT_ROW_EXPANDED_CLASS } from '../../utils/tableRows.util'

const FeatureStoreTableRow = ({
  actionsMenu,
  handleExpandRow = () => {},
  handleSelectItem = () => {},
  hideActionsMenu = false,
  mainRowItemsCount = 1,
  pageTab,
  rowIndex,
  rowItem,
  selectedItem = {},
  selectedRowData
}) => {
  const parent = useRef()
  const params = useParams()
  const rowIsExpanded = useMemo(
    () => isRowExpanded(parent, selectedRowData, rowItem),
    [rowItem, selectedRowData]
  )
  const getIdentifier = useMemo(() => getIdentifierMethod(pageTab), [pageTab])
  const rowClassNames = classnames(
    'table-row',
    'table-body-row',
    'parent-row',
    selectedItem?.name &&
      getIdentifier(selectedItem, true) === rowItem.data.ui.identifierUnique &&
      !rowIsExpanded &&
      'table-row_active',
    rowIsExpanded && PARENT_ROW_EXPANDED_CLASS
  )

  return (
    <tr className={rowClassNames} ref={parent}>
      {rowIsExpanded ? (
        <>
          <td
            data-testid={generateTableRowTestId(rowIndex)}
            className={`table-body__cell
              ${rowIsExpanded && 'row_grouped-by'}`}
          >
            <table cellPadding="0" cellSpacing="0" className="table table-fixed">
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
                          firstCell={index === 0}
                          handleExpandRow={handleExpandRow}
                          item={rowItem}
                          key={data.id}
                          link={
                            data.rowExpanded?.getLink
                              ? data.rowExpanded.getLink(params.tab ?? DETAILS_OVERVIEW_TAB)
                              : ''
                          }
                          selectItem={handleSelectItem}
                          selectedItem={selectedItem}
                          showExpandButton={data.showExpandButton}
                        />
                      )
                    )
                  })}
                  {!hideActionsMenu && <td className="table-body__cell table-cell-icon" />}
                </tr>
              </tbody>
            </table>
          </td>
          {selectedRowData[rowItem.data.ui.identifier]?.loading ? (
            <td className="table-body__cell">
              {createPortal(<Loader />, document.querySelector(`.${TABLE_CONTAINER}`))}
            </td>
          ) : selectedRowData[rowItem.data.ui.identifier]?.error ? (
            <td className="table-body__cell">
              <ErrorMessage message={selectedRowData[rowItem.data.ui.identifier]?.error?.message} />
            </td>
          ) : (
            selectedRowData[rowItem.data.ui.identifier]?.content.map((tableContentItem, index) => {
              const subRowClassNames = classnames(
                'table-row',
                'table-body-row',
                selectedItem.name &&
                  getIdentifier(selectedItem, true) === tableContentItem.data.ui.identifierUnique &&
                  'table-row_active'
              )

              return (
                <td
                  data-testid={generateTableRowTestId(rowIndex, index)}
                  className="table-body__cell"
                  key={index}
                >
                  <table cellPadding="0" cellSpacing="0" className="table table-fixed">
                    <tbody className="table-body">
                      <tr className={subRowClassNames}>
                        {
                          <>
                            {tableContentItem.content.map((value, index) => {
                              const cellClassNames = classnames(
                                !isEmpty(selectedItem) &&
                                  index >= mainRowItemsCount &&
                                  'table-body__cell_hidden'
                              )

                              return (
                                !value.hidden && (
                                  <TableCell
                                    className={cellClassNames}
                                    data={
                                      value.expandedCellContent ? value.expandedCellContent : value
                                    }
                                    item={tableContentItem.data}
                                    link={value.getLink?.(params.tab ?? DETAILS_OVERVIEW_TAB)}
                                    key={value.id}
                                    selectItem={handleSelectItem}
                                    selectedItem={selectedItem}
                                  />
                                )
                              )
                            })}
                            {!hideActionsMenu && (
                              <td className="table-body__cell table-cell-icon">
                                <ActionsMenu dataItem={tableContentItem.data} menu={actionsMenu} />
                              </td>
                            )}
                          </>
                        }
                      </tr>
                    </tbody>
                  </table>
                </td>
              )
            })
          )}
        </>
      ) : (
        <>
          {rowItem.content.map((value, index) => {
            const cellClassNames = classnames(
              !isEmpty(selectedItem) && index >= mainRowItemsCount && 'table-body__cell_hidden'
            )

            return (
              !value.hidden && (
                <TableCell
                  className={cellClassNames}
                  data={value}
                  firstCell={index === 0}
                  handleExpandRow={handleExpandRow}
                  item={rowItem.data}
                  key={value.id}
                  link={value.getLink?.(params.tab ?? DETAILS_OVERVIEW_TAB)}
                  selectedItem={selectedItem}
                  selectItem={handleSelectItem}
                  showExpandButton={value.showExpandButton}
                />
              )
            )
          })}
          {!hideActionsMenu && (
            <td className="table-body__cell table-cell-icon">
              <ActionsMenu dataItem={rowItem.data} menu={actionsMenu} />
            </td>
          )}
        </>
      )}
    </tr>
  )
}

FeatureStoreTableRow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func,
  hideActionsMenu: PropTypes.bool,
  mainRowItemsCount: PropTypes.number,
  pageTab: PropTypes.string.isRequired,
  rowIndex: PropTypes.number.isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}),
  selectedRowData: PropTypes.shape({}).isRequired
}

export default React.memo(FeatureStoreTableRow)
