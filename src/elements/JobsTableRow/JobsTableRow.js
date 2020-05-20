import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'

import TableCell from '../TableCell/TableCell'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import jobsData from '../../components/JobsPage/jobsData'

const JobsTableRow = ({
  actionsMenu,
  content,
  handleExpandRow,
  handleSelectItem,
  index,
  isGroupedByWorkflow,
  match,
  rowItem,
  selectedItem,
  tableContent,
  workflows
}) => {
  const parent = useRef()

  return (
    <div
      className={`table-body__row ${
        rowItem.uid?.value === selectedItem.uid &&
        !parent.current?.classList.value.includes('parent-row-expanded')
          ? 'parent-row active'
          : parent.current?.classList.value.includes('parent-row-expanded')
          ? 'parent-row parent-row-expanded'
          : 'parent-row'
      } ${isGroupedByWorkflow && 'isGroupedByWorkflow'}`}
      ref={parent}
    >
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
              return (
                <div
                  className={
                    RegExp(job.uid.value.replace('...', ''), 'gi').test(
                      selectedItem.uid
                    )
                      ? 'table-body__row active'
                      : 'table-body__row'
                  }
                  key={index}
                >
                  {Object.values(job).map((value, i) => {
                    const currentItem =
                      content.length > 0 &&
                      content.find(
                        contentItemObj => contentItemObj.uid === job.uid.value
                      )

                    return (
                      <TableCell
                        data={
                          i === 0 && !isGroupedByWorkflow
                            ? job.startTime
                            : value
                        }
                        item={currentItem}
                        link={
                          i === 0 &&
                          `/projects/${match.params.projectName}/jobs/${
                            currentItem.uid
                          }${
                            match.params.tab
                              ? `/${match.params.tab}`
                              : `/${jobsData.detailsMenu[0]}`
                          }`
                        }
                        key={value.value + i}
                        selectItem={handleSelectItem}
                        selectedItem={selectedItem}
                      />
                    )
                  })}
                  <div className="table-body__cell action_cell">
                    <TableActionsMenu
                      item={content[index]}
                      menu={actionsMenu}
                    />
                  </div>
                </div>
              )
            })}
          </>
        </div>
      ) : (
        <>
          {map(rowItem, (rowItemProp, rowItemKey) => {
            const currentItem = isGroupedByWorkflow
              ? workflows.find(workflow => workflow.id === rowItem.uid.value)
              : content.find(
                  contentItemObj => contentItemObj.uid === rowItem.uid.value
                )

            return (
              <TableCell
                data={rowItemProp}
                expandLink={Array.isArray(tableContent)}
                handleExpandRow={handleExpandRow}
                isGroupedByWorkflow={isGroupedByWorkflow}
                item={currentItem}
                key={new Date().getTime() + rowItemKey}
                link={
                  rowItemKey === 'name' &&
                  `/projects/${match.params.projectName}/jobs/${
                    content?.find(item => item.uid === rowItem.uid.value)?.uid
                  }${
                    match.params.tab
                      ? `/${match.params.tab}`
                      : `/${jobsData.detailsMenu[0]}`
                  }`
                }
                selectItem={handleSelectItem}
                selectedItem={selectedItem}
              />
            )
          })}
          <div className="table-body__cell action_cell">
            <TableActionsMenu item={content[index]} menu={actionsMenu} />
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
  actionsMenu: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func.isRequired,
  isGroupedByWorkflow: PropTypes.bool,
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.shape({})),
  workflows: PropTypes.arrayOf(PropTypes.shape({}))
}

export default JobsTableRow
