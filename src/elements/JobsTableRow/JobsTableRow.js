import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { map, isEmpty } from 'lodash'
import classnames from 'classnames'

import TableCell from '../TableCell/TableCell'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import { DETAILS_OVERVIEW_TAB, MONITOR_TAB } from '../../constants'

const JobsTableRow = ({
  actionsMenu,
  content,
  handleExpandRow,
  handleSelectItem,
  isGroupedByWorkflow,
  match,
  rowItem,
  selectedItem,
  tableContent,
  workflows
}) => {
  const parent = useRef()

  const rowClassNames = classnames(
    'table-body__row',
    'parent-row',
    rowItem.name?.value === selectedItem.name &&
      rowItem.uid?.value === selectedItem.uid &&
      !parent.current?.classList.value.includes('parent-row-expanded') &&
      'row_active',
    parent.current?.classList.value.includes('parent-row-expanded') &&
      'parent-row-expanded'
  )

  const currentItem = isGroupedByWorkflow
    ? workflows.find(workflow => workflow.id === rowItem.uid.value)
    : content.find(contentItemObj =>
        match.params.pageTab === MONITOR_TAB
          ? contentItemObj.uid === rowItem.uid?.value
          : contentItemObj.name === rowItem.name.value
      )
  const filteredActions = actionsMenu(currentItem).filter(
    action => !action.hiddenRules?.status.includes(currentItem.state)
  )

  return (
    <div className={rowClassNames} ref={parent}>
      {parent.current?.classList.contains('parent-row-expanded') ? (
        <div className="row_grouped-by">
          {isGroupedByWorkflow ? (
            <div className="table-body__row">
              {map(rowItem, (rowItemData, rowItemKey) => {
                return (
                  <TableCell
                    data={rowItemData}
                    expandLink={rowItemKey === 'name'}
                    firstRow={rowItemKey === 'name'}
                    handleExpandRow={handleExpandRow}
                    item={rowItem}
                    key={rowItemKey}
                    selectItem={handleSelectItem}
                    selectedItem={selectedItem}
                  />
                )
              })}
            </div>
          ) : (
            <div className="table-body__row">
              <TableCell
                data={rowItem.name}
                expandLink
                firstRow
                handleExpandRow={handleExpandRow}
                item={rowItem}
                selectItem={handleSelectItem}
                selectedItem={selectedItem}
              />
            </div>
          )}
          <>
            {tableContent.map((job, index) => {
              const groupCurrentItem =
                content.length > 0 &&
                content.find(item => item.uid === job.uid.value)

              const groupFilteredActionsMenu = actionsMenu(
                groupCurrentItem
              ).filter(
                action =>
                  !action.hiddenRules?.status.includes(groupCurrentItem.state)
              )

              return (
                <div
                  className={
                    RegExp(job.uid.value.replace('...', ''), 'gi').test(
                      selectedItem.uid
                    )
                      ? 'table-body__row row_active'
                      : 'table-body__row'
                  }
                  key={index}
                >
                  {Object.values(job).map((cellContentObj, index) => {
                    return (
                      <TableCell
                        data={
                          index === 0 && !isGroupedByWorkflow
                            ? { class: 'jobs_medium' }
                            : cellContentObj
                        }
                        item={groupCurrentItem}
                        link={cellContentObj.getLink?.(
                          match.params.tab ?? DETAILS_OVERVIEW_TAB
                        )}
                        key={`${cellContentObj.value}${index}`}
                        selectItem={handleSelectItem}
                        selectedItem={selectedItem}
                      />
                    )
                  })}
                  <div className="table-body__cell action_cell">
                    <TableActionsMenu
                      item={groupCurrentItem}
                      menu={groupFilteredActionsMenu}
                    />
                  </div>
                </div>
              )
            })}
          </>
        </div>
      ) : (
        <>
          {Object.values(rowItem).map((rowItemProp, index) => {
            return (
              <TableCell
                data={rowItemProp}
                expandLink={!isEmpty(tableContent)}
                handleExpandRow={handleExpandRow}
                isGroupedByWorkflow={isGroupedByWorkflow}
                item={currentItem}
                key={`${new Date().getTime()}${index}`}
                link={
                  rowItemProp.getLink
                    ? rowItemProp.getLink?.(
                        match.params.tab ?? DETAILS_OVERVIEW_TAB
                      )
                    : ''
                }
                selectItem={handleSelectItem}
                selectedItem={selectedItem}
              />
            )
          })}
          <div className="table-body__cell action_cell">
            <TableActionsMenu item={currentItem} menu={filteredActions} />
          </div>
        </>
      )}
    </div>
  )
}

JobsTableRow.defaultProps = {
  handleExpandRow: () => {},
  isGroupedByWorkflow: false,
  tableContent: [],
  workflows: []
}

JobsTableRow.propTypes = {
  actionsMenu: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.func
  ]).isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  isGroupedByWorkflow: PropTypes.bool,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.shape({})),
  workflows: PropTypes.arrayOf(PropTypes.shape({}))
}

export default JobsTableRow
