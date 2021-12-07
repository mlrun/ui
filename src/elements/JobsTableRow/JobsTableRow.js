import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, map } from 'lodash'
import classnames from 'classnames'

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'

import { getJobIdentifier } from '../../utils/getUniqueIdentifier'
import { DETAILS_OVERVIEW_TAB, MONITOR_WORKFLOWS_TAB } from '../../constants'
import { ACTIONS_MENU } from '../../types'

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
    getJobIdentifier(selectedItem, true) === rowItem.name?.identifierUnique &&
      !parent.current?.classList.value.includes('parent-row-expanded') &&
      'row_active',
    parent.current?.classList.value.includes('parent-row-expanded') &&
      'parent-row-expanded'
  )

  const currentItem = isGroupedByWorkflow
    ? workflows.find(workflow => workflow.id === rowItem.uid.value)
    : content.find(
        contentItem =>
          getJobIdentifier(contentItem, true) === rowItem.name?.identifierUnique
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
                    key={rowItemData.id}
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
                content.find(
                  contentItem =>
                    getJobIdentifier(contentItem, true) ===
                    job.name?.identifierUnique
                )

              const groupFilteredActionsMenu = actionsMenu(groupCurrentItem)

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
                      !cellContentObj.hidden && (
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
                          key={cellContentObj.id}
                          selectItem={handleSelectItem}
                          selectedItem={selectedItem}
                        />
                      )
                    )
                  })}
                  <div className="table-body__cell action_cell">
                    <ActionsMenu
                      menu={groupFilteredActionsMenu}
                      dataItem={groupCurrentItem}
                    />
                  </div>
                </div>
              )
            })}
          </>
        </div>
      ) : (
        <>
          {Object.values(rowItem).map(rowItemProp => {
            return (
              !rowItemProp.hidden && (
                <TableCell
                  data={rowItemProp}
                  expandLink={
                    !isEmpty(tableContent) &&
                    (match.params.pageTab !== MONITOR_WORKFLOWS_TAB ||
                      (match.params.pageTab === MONITOR_WORKFLOWS_TAB &&
                        match.params.workflowId))
                  }
                  handleExpandRow={handleExpandRow}
                  item={currentItem}
                  key={rowItemProp.id}
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
            )
          })}
          <div className="table-body__cell action_cell">
            <ActionsMenu dataItem={currentItem} menu={actionsMenu} />
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
  actionsMenu: ACTIONS_MENU.isRequired,
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
