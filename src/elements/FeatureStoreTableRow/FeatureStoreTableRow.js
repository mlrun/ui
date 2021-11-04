import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import Loader from '../../common/Loader/Loader'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'

import { getIdentifierMethod } from '../../utils/getUniqueIdentifier'

import { ACTION_CELL_ID, DETAILS_OVERVIEW_TAB } from '../../constants'

const FeatureStoreTableRow = ({
  actionsMenu,
  content,
  handleExpandRow,
  handleSelectItem,
  mainRowItemsCount,
  match,
  rowItem,
  pageData,
  selectedItem,
  tableContent
}) => {
  const [currentItem, setCurrentItem] = useState(null)
  const parent = useRef()
  const getIdentifier = useMemo(
    () => getIdentifierMethod(match.params.pageTab),
    [match.params.pageTab]
  )
  const rowClassNames = classnames(
    'table-body__row',
    'parent-row',
    selectedItem.name &&
      getIdentifier(selectedItem, true) === rowItem.key?.identifierUnique &&
      !parent.current?.classList.value.includes('parent-row-expanded') &&
      'row_active',
    parent.current?.classList.value.includes('parent-row-expanded') &&
      'parent-row-expanded'
  )
  const mainRowData = Object.values(rowItem ?? {})

  const findCurrentItem = useCallback(
    feature => {
      const currentContent =
        pageData.selectedRowData?.[feature.key.identifier]?.content || content

      return (
        currentContent.find(contentItem => {
          return (
            getIdentifier(contentItem, true) === feature.key.identifierUnique
          )
        }) ?? {}
      )
    },
    [content, getIdentifier, pageData.selectedRowData]
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
                  key={data.id}
                  handleExpandRow={handleExpandRow}
                  data={data}
                  item={rowItem}
                  selectItem={handleSelectItem}
                  selectedItem={selectedItem}
                  expandLink={index === 0}
                  firstRow={index === 0}
                  link={
                    data.rowExpanded?.getLink
                      ? data.rowExpanded.getLink(
                          match.params.tab ?? DETAILS_OVERVIEW_TAB
                        )
                      : ''
                  }
                />
              ) : null
            })}
          </div>
          {tableContent.map((tableContentItem, index) => {
            const subRowCurrentItem = findCurrentItem(tableContentItem)
            const subRowClassNames = classnames(
              'table-body__row',
              selectedItem.name &&
                getIdentifier(selectedItem, true) ===
                  getIdentifier(subRowCurrentItem, true) &&
                'row_active'
            )

            return (
              <div className={subRowClassNames} key={index}>
                {pageData.selectedRowData &&
                pageData.selectedRowData[tableContentItem.key?.identifier]
                  ?.loading ? (
                  <Loader key={index} />
                ) : pageData.selectedRowData &&
                  pageData.selectedRowData[tableContentItem.key?.identifier]
                    ?.error ? (
                  <ErrorMessage
                    message={
                      pageData.selectedRowData[tableContentItem.key?.identifier]
                        ?.error?.message
                    }
                  />
                ) : (
                  <>
                    {Object.values(tableContentItem).map(value => {
                      return (
                        !value.hidden && (
                          <TableCell
                            data={
                              value.expandedCellContent
                                ? value.expandedCellContent
                                : value
                            }
                            item={subRowCurrentItem}
                            link={value.getLink?.(
                              match.params.tab ?? DETAILS_OVERVIEW_TAB
                            )}
                            match={match}
                            key={value.id}
                            selectItem={handleSelectItem}
                            selectedItem={selectedItem}
                          />
                        )
                      )
                    })}
                    {!pageData.tableHeaders.find(
                      header => header.id === ACTION_CELL_ID
                    )?.hidden && (
                      <div className="table-body__cell action_cell">
                        <ActionsMenu
                          dataItem={subRowCurrentItem}
                          menu={actionsMenu}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <>
          {mainRowData.map(value => {
            return (
              currentItem &&
              !value.hidden && (
                <TableCell
                  expandLink={Array.isArray(tableContent)}
                  handleExpandRow={handleExpandRow}
                  data={value}
                  item={currentItem}
                  key={value.id}
                  link={value.getLink?.(
                    match.params.tab ?? DETAILS_OVERVIEW_TAB
                  )}
                  match={match}
                  selectedItem={selectedItem}
                  selectItem={handleSelectItem}
                />
              )
            )
          })}
          {!pageData.tableHeaders.find(header => header.id === ACTION_CELL_ID)
            ?.hidden && (
            <div className="table-body__cell action_cell">
              <ActionsMenu dataItem={currentItem} menu={actionsMenu} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

FeatureStoreTableRow.defaultProps = {
  handleExpandRow: null,
  tableContent: null,
  mainRowItemsCount: 1
}

FeatureStoreTableRow.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  mainRowItemsCount: PropTypes.number,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.shape({}))
}

export default React.memo(FeatureStoreTableRow)
