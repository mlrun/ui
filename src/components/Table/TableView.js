import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import JobsTableRow from '../../elements/JobsTableRow/JobsTableRow'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Details from '../Details/Details'
import FunctionsTableRow from '../../elements/FunctionsTableRow/FunctionsTableRow'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import NoData from '../../common/NoData/NoData'

import { JOBS_PAGE, ARTIFACTS_PAGE, FUNCTIONS_PAGE } from '../../constants'

import { ReactComponent as Yaml } from '../../images/yaml.svg'

const TableView = ({
  content,
  groupFilter,
  groupLatestItem,
  groupedByName,
  groupedByWorkflow,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  match,
  pageData,
  selectedItem,
  tableContent,
  toggleConvertToYaml,
  workflows
}) => {
  const actionsMenu = [
    {
      label: 'View YAML',
      icon: <Yaml />,
      onClick: toggleConvertToYaml
    }
  ]
  return (
    <div className="table">
      <div
        className={`table__content ${!isEmpty(selectedItem) && 'table_opened'}`}
      >
        <div className="table-head">
          {pageData.tableHeaders.map((item, index) => (
            <div
              className={`table-head__item ${item.class}`}
              key={item.header + index}
            >
              <Tooltip template={<TextTooltipTemplate text={item.header} />}>
                {item.header}
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="table-body">
          {!groupFilter ||
          (isEmpty(groupedByName) && isEmpty(groupedByWorkflow)) ||
          (groupFilter === 'none' && isEmpty(groupLatestItem)) ? (
            tableContent.map((rowItem, i) => {
              switch (pageData.page) {
                case ARTIFACTS_PAGE:
                  return (
                    <ArtifactsTableRow
                      actionsMenu={actionsMenu}
                      content={content}
                      handleSelectItem={handleSelectItem}
                      index={i}
                      key={i}
                      match={match}
                      rowItem={rowItem}
                      selectedItem={selectedItem}
                    />
                  )
                case FUNCTIONS_PAGE:
                  return (
                    <FunctionsTableRow
                      actionsMenu={actionsMenu}
                      key={i}
                      content={content}
                      match={match}
                      rowItem={rowItem}
                      index={i}
                      selectedItem={selectedItem}
                      handleSelectItem={handleSelectItem}
                    />
                  )
                case JOBS_PAGE:
                  return (
                    <JobsTableRow
                      actionsMenu={actionsMenu}
                      key={i}
                      content={content}
                      handleSelectItem={handleSelectItem}
                      index={i}
                      match={match}
                      rowItem={rowItem}
                      selectedItem={selectedItem}
                    />
                  )
                default:
                  return null
              }
            })
          ) : groupLatestItem.find(latestItem => !isEmpty(latestItem)) ? (
            tableContent.map((group, i) => {
              if (pageData.page === FUNCTIONS_PAGE) {
                return (
                  <FunctionsTableRow
                    actionsMenu={actionsMenu}
                    key={i}
                    content={content}
                    handleExpandRow={handleExpandRow}
                    handleSelectItem={handleSelectItem}
                    index={i}
                    match={match}
                    rowItem={groupLatestItem[i]}
                    selectedItem={selectedItem}
                    tableContent={group}
                  />
                )
              } else {
                return (
                  <JobsTableRow
                    actionsMenu={actionsMenu}
                    key={i}
                    content={content}
                    handleExpandRow={handleExpandRow}
                    handleSelectItem={handleSelectItem}
                    index={i}
                    isGroupedByWorkflow={!isEmpty(groupedByWorkflow)}
                    match={match}
                    rowItem={groupLatestItem[i]}
                    selectedItem={selectedItem}
                    tableContent={group}
                    workflows={workflows}
                  />
                )
              }
            })
          ) : (
            <NoData />
          )}
        </div>
      </div>
      {!isEmpty(selectedItem) && (
        <Details
          actionsMenu={actionsMenu}
          detailsMenu={pageData.detailsMenu}
          handleCancel={handleCancel}
          handleSelectItem={handleSelectItem}
          selectedItem={selectedItem}
          match={match}
          page={pageData.page}
        />
      )}
    </div>
  )
}

TableView.defaultProps = {
  groupLatestJob: {}
}

TableView.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({})))
  ]).isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired
}

export default TableView
