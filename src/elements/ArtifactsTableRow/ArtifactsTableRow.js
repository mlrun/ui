import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import Loader from '../../common/Loader/Loader'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'

import {
  ACTION_CELL_ID,
  DETAILS_OVERVIEW_TAB,
  FEATURES_TAB,
  MODEL_ENDPOINTS_TAB
} from '../../constants'

const ArtifactsTableRow = ({
  actionsMenu,
  content,
  handleExpandRow,
  handleSelectItem,
  index,
  mainRowItemsCount,
  match,
  rowItem,
  pageData,
  selectedItem,
  tableContent
}) => {
  const parent = useRef()
  const rowClassNames = classnames(
    'table-body__row',
    'parent-row',
    ((selectedItem?.db_key && selectedItem?.db_key === rowItem.key.value) ||
      (selectedItem?.name &&
        selectedItem.name === rowItem.key.value &&
        selectedItem.tag === rowItem.version.value) ||
      (selectedItem?.metadata &&
        selectedItem?.metadata?.uid === content[index]?.metadata?.uid)) &&
      !parent.current?.classList.value.includes('parent-row-expanded') &&
      'row_active',
    parent.current?.classList.value.includes('parent-row-expanded') &&
      'parent-row-expanded'
  )
  const mainRowData = Object.values(rowItem ?? {})

  const findCurrentItem = artifact => {
    if (match.params.pageTab === FEATURES_TAB) {
      return content.find(
        item =>
          `${item.name}-${item.metadata?.name}` ===
          `${artifact.key?.value}-${artifact.feature_set?.value}`
      )
    } else {
      if (pageData.selectedRowData?.[artifact.key.value]?.content) {
        return pageData.selectedRowData?.[artifact.key.value]?.content.find(
          contentItem => {
            const key = contentItem.db_key ? 'db_key' : 'name'

            return artifact.version.value
              ? contentItem[key] === artifact.key.value &&
                  contentItem.tag === artifact.version.value
              : contentItem.uid
              ? contentItem.uid === artifact.uid.value
              : contentItem[key] === artifact.key.value
          }
        )
      }

      return content.find(contentItem => {
        const key = contentItem.db_key ? 'db_key' : 'name'

        return (
          contentItem[key] === artifact.key.value &&
          contentItem.tag === artifact.version?.value
        )
      })
    }
  }

  return (
    <div className={rowClassNames} ref={parent}>
      {parent.current?.classList.contains('parent-row-expanded') ? (
        <div className="row_grouped-by">
          <div className="table-body__row">
            {mainRowData.map((data, index) => {
              return index < mainRowItemsCount ? (
                <TableCell
                  key={data.value || index}
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
            const currentItem = findCurrentItem(artifact)
            const subRowClassNames = classnames(
              'table-body__row',
              ((selectedItem?.db_key &&
                selectedItem?.db_key === currentItem?.db_key &&
                (selectedItem?.tag === currentItem?.tag ||
                  (selectedItem.uid &&
                    selectedItem?.uid === currentItem?.uid))) ||
                (selectedItem?.uid &&
                  selectedItem?.uid === currentItem?.uid &&
                  selectedItem?.tag === currentItem?.tag)) &&
                'row_active'
            )

            return (
              <div className={subRowClassNames} key={index}>
                {pageData.selectedRowData &&
                (pageData.selectedRowData[artifact.key?.value]?.loading ||
                  pageData.selectedRowData[
                    `${artifact.key?.value}-${artifact.feature_set?.value}`
                  ]?.loading) ? (
                  <Loader key={index} />
                ) : pageData.selectedRowData &&
                  (pageData.selectedRowData[artifact.key?.value]?.error ||
                    pageData.selectedRowData[
                      `${artifact.key.value}-${artifact.feature_set?.value}`
                    ]?.error) ? (
                  <ErrorMessage
                    message={
                      pageData.selectedRowData[artifact.key?.value]?.error
                        ?.message ||
                      pageData.selectedRowData[
                        `${artifact.key.value}-${artifact.feature_set?.value}`
                      ]?.error.message
                    }
                  />
                ) : (
                  <>
                    {Object.values(artifact).map((value, i) => {
                      return (
                        !value.hidden && (
                          <TableCell
                            data={
                              value.expandedCellContent
                                ? value.expandedCellContent
                                : value
                            }
                            item={currentItem}
                            link={value.getLink?.(
                              match.params.tab ?? DETAILS_OVERVIEW_TAB
                            )}
                            match={match}
                            key={value.value + i ?? Date.now()}
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
                          dataItem={currentItem}
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
          {Object.values(rowItem ?? {}).map((value, i) => {
            return (
              content[index] &&
              !value.hidden && (
                <TableCell
                  expandLink={
                    Array.isArray(tableContent) &&
                    match.params.pageTab !== MODEL_ENDPOINTS_TAB
                  }
                  handleExpandRow={handleExpandRow}
                  data={value}
                  item={findCurrentItem(rowItem)}
                  key={Math.random() + i}
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
              <ActionsMenu dataItem={content[index]} menu={actionsMenu} />
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
  index: PropTypes.number.isRequired,
  mainRowItemsCount: PropTypes.number,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.shape({}))
}

export default React.memo(ArtifactsTableRow)
