import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import Loader from '../../common/Loader/Loader'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'

import {
  ACTION_CELL_ID,
  DETAILS_OVERVIEW_TAB,
  MODEL_ENDPOINTS_TAB
} from '../../constants'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'

const ArtifactsTableRow = ({
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
  const rowClassNames = classnames(
    'table-body__row',
    'parent-row',
    (selectedItem.db_key || selectedItem?.spec?.model) &&
      getArtifactIdentifier(selectedItem, true) ===
        rowItem.key.identifierUnique &&
      !parent.current?.classList.value.includes('parent-row-expanded') &&
      'row_active',
    parent.current?.classList.value.includes('parent-row-expanded') &&
      'parent-row-expanded'
  )
  const mainRowData = Object.values(rowItem ?? {})

  const findCurrentItem = useCallback(
    artifact => {
      const currentContent =
        pageData.selectedRowData?.[artifact.key.value]?.content || content

      return (
        currentContent.find(
          contentItem =>
            getArtifactIdentifier(contentItem, true) ===
            artifact.key.identifierUnique
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
          {tableContent.map((artifact, index) => {
            const subRowCurrentItem = findCurrentItem(artifact)
            const subRowClassNames = classnames(
              'table-body__row',
              getArtifactIdentifier(subRowCurrentItem, true) ===
                getArtifactIdentifier(selectedItem, true) && 'row_active'
            )

            return (
              <div className={subRowClassNames} key={index}>
                {pageData.selectedRowData &&
                pageData.selectedRowData[artifact.key?.value]?.loading ? (
                  <Loader key={index} />
                ) : pageData.selectedRowData &&
                  pageData.selectedRowData[artifact.key?.value]?.error ? (
                  <ErrorMessage
                    message={
                      pageData.selectedRowData[artifact.key?.value]?.error
                        ?.message
                    }
                  />
                ) : (
                  <>
                    {Object.values(artifact).map(value => {
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
                  expandLink={
                    Array.isArray(tableContent) &&
                    match.params.pageTab !== MODEL_ENDPOINTS_TAB
                  }
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

ArtifactsTableRow.defaultProps = {
  handleExpandRow: null,
  tableContent: null,
  mainRowItemsCount: 1
}

ArtifactsTableRow.propTypes = {
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

export default React.memo(ArtifactsTableRow)
