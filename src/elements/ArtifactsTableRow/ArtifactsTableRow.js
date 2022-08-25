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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import Loader from '../../common/Loader/Loader'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'

import { ACTION_CELL_ID, DETAILS_OVERVIEW_TAB, MODEL_ENDPOINTS_TAB } from '../../constants'
import { ACTIONS_MENU } from '../../types'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'

const ArtifactsTableRow = ({
  actionsMenu,
  content,
  handleExpandRow,
  handleSelectItem,
  mainRowItemsCount,
  rowItem,
  pageData,
  selectedItem,
  tableContent
}) => {
  const [currentItem, setCurrentItem] = useState(null)
  const parent = useRef()
  const params = useParams()
  const rowClassNames = classnames(
    'table-body__row',
    'parent-row',
    (selectedItem.db_key || selectedItem?.spec?.model) &&
      getArtifactIdentifier(selectedItem, true) === rowItem.key?.identifierUnique &&
      !parent.current?.classList.value.includes('parent-row-expanded') &&
      'row_active',
    parent.current?.classList.value.includes('parent-row-expanded') && 'parent-row-expanded'
  )
  const mainRowData = Object.values(rowItem ?? {})

  const findCurrentItem = useCallback(
    artifact => {
      const currentContent = pageData.selectedRowData?.[artifact.key?.value]?.content || content

      return (
        currentContent.find(
          contentItem => getArtifactIdentifier(contentItem, true) === artifact.key?.identifierUnique
        ) ?? {}
      )
    },
    [content, pageData.selectedRowData]
  )

  useEffect(() => {
    setCurrentItem(findCurrentItem(rowItem))
  }, [findCurrentItem, rowItem])

  return (
    <div className={rowClassNames} ref={parent}>
      {parent.current?.classList.contains('parent-row-expanded') ? (
        <div className="row_grouped-by">
          <div className="table-body__row">
            {mainRowData.map((data, index) => {
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
          {pageData.selectedRowData[rowItem.key?.identifier].loading ? (
            <div className="table-body__row">
              <Loader />
            </div>
          ) : pageData.selectedRowData[rowItem.key?.identifier].error ? (
            <ErrorMessage
              message={pageData.selectedRowData[rowItem.key?.identifier]?.error?.message}
            />
          ) : (
            tableContent.map((artifact, index) => {
              const subRowCurrentItem = findCurrentItem(artifact)
              const subRowClassNames = classnames(
                'table-body__row',
                getArtifactIdentifier(subRowCurrentItem, true) ===
                  getArtifactIdentifier(selectedItem, true) && 'row_active'
              )

              return (
                <div className={subRowClassNames} key={index}>
                  {
                    <>
                      {Object.values(artifact).map(value => {
                        return (
                          !value.hidden && (
                            <TableCell
                              data={value.expandedCellContent ? value.expandedCellContent : value}
                              item={subRowCurrentItem}
                              link={value.getLink?.(params.tab ?? DETAILS_OVERVIEW_TAB)}
                              key={value.id}
                              selectItem={handleSelectItem}
                              selectedItem={selectedItem}
                            />
                          )
                        )
                      })}
                      {!pageData.tableHeaders.find(header => header.id === ACTION_CELL_ID)
                        ?.hidden && (
                        <div className="table-body__cell action_cell">
                          <ActionsMenu dataItem={subRowCurrentItem} menu={actionsMenu} />
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
          {mainRowData.map((value, index) => {
            return (
              currentItem &&
              !value.hidden && (
                <TableCell
                  data={value}
                  handleExpandRow={handleExpandRow}
                  firstCell={index === 0 && params.pageTab !== MODEL_ENDPOINTS_TAB}
                  item={currentItem}
                  key={value.id}
                  link={value.getLink?.(params.tab ?? DETAILS_OVERVIEW_TAB)}
                  selectedItem={selectedItem}
                  selectItem={handleSelectItem}
                  showExpandButton={
                    index === 0 &&
                    Array.isArray(tableContent) &&
                    params.pageTab !== MODEL_ENDPOINTS_TAB
                  }
                />
              )
            )
          })}
          {!pageData.tableHeaders.find(header => header.id === ACTION_CELL_ID)?.hidden && (
            <div className="table-body__cell action_cell">
              <ActionsMenu dataItem={currentItem} menu={actionsMenu} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

ArtifactsTableRow.defaultProps = {
  handleExpandRow: null,
  tableContent: null,
  mainRowItemsCount: 1
}

ArtifactsTableRow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  mainRowItemsCount: PropTypes.number,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.shape({}))
}

export default React.memo(ArtifactsTableRow)
