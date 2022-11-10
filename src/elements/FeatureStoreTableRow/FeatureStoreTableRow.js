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
import { isEmpty } from 'lodash'

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import Loader from '../../common/Loader/Loader'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'

import { getIdentifierMethod } from '../../utils/getUniqueIdentifier'
import { DETAILS_OVERVIEW_TAB } from '../../constants'
import { ACTIONS_MENU } from '../../types'

const FeatureStoreTableRow = ({
  actionsMenu,
  handleExpandRow,
  handleSelectItem,
  hideActionsMenu,
  mainRowItemsCount,
  pageTab,
  rowItem,
  selectedItem,
  selectedRowData
}) => {
  const parent = useRef()
  const params = useParams()

  const getIdentifier = useMemo(() => getIdentifierMethod(pageTab), [pageTab])
  const rowClassNames = classnames(
    'table-body__row',
    'parent-row',
    selectedItem?.name &&
      getIdentifier(selectedItem, true) === rowItem.data.ui.identifierUnique &&
      !parent.current?.classList.value.includes('parent-row-expanded') &&
      'row_active',
    parent.current?.classList.value.includes('parent-row-expanded') && 'parent-row-expanded'
  )

  return (
    <div className={rowClassNames} ref={parent}>
      {parent.current?.classList.contains('parent-row-expanded') ? (
        <div className="row_grouped-by">
          <div className="table-body__row">
            {rowItem.content.map((data, index) => {
              return index < mainRowItemsCount ? (
                <TableCell
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
                  showExpandButton
                />
              ) : null
            })}
          </div>
          {selectedRowData[rowItem.data.ui.identifier].loading ? (
            <div className="table-body__row">
              <Loader />
            </div>
          ) : selectedRowData[rowItem.data.ui.identifier].error ? (
            <ErrorMessage message={selectedRowData[rowItem.data.ui.identifier]?.error?.message} />
          ) : (
            selectedRowData[rowItem.data.ui.identifier].content.map((tableContentItem, index) => {
              const subRowClassNames = classnames(
                'table-body__row',
                selectedItem.name &&
                  getIdentifier(selectedItem, true) === tableContentItem.data.ui.identifierUnique &&
                  'row_active'
              )

              return (
                <div className={subRowClassNames} key={index}>
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
                              data={value.expandedCellContent ? value.expandedCellContent : value}
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
                        <div className="table-body__cell action_cell">
                          <ActionsMenu dataItem={tableContentItem.data} menu={actionsMenu} />
                        </div>
                      )}
                    </>
                  }
                </div>
              )
            })
          )}
        </div>
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
            <div className="table-body__cell action_cell">
              <ActionsMenu dataItem={rowItem.data} menu={actionsMenu} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

FeatureStoreTableRow.defaultProps = {
  handleExpandRow: () => {},
  handleSelectItem: () => {},
  hideActionsMenu: false,
  tableContent: null,
  mainRowItemsCount: 1,
  selectedItem: {}
}

FeatureStoreTableRow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func,
  hideActionsMenu: PropTypes.bool,
  mainRowItemsCount: PropTypes.number,
  pageTab: PropTypes.string.isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}),
  selectedRowData: PropTypes.shape({}).isRequired
}

export default React.memo(FeatureStoreTableRow)
