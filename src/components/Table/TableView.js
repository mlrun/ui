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

import {
  ARTIFACTS_PAGE,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODELS_PAGE
} from '../../constants'

import { ReactComponent as Yaml } from '../../images/yaml.svg'

const TableView = ({
  applyDetailsChanges,
  cancelRequest,
  content,
  groupFilter,
  groupLatestItem,
  groupedByName,
  groupedByWorkflow,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  isTablePanelOpen,
  mainRowItemsCount,
  match,
  pageData,
  retryRequest,
  selectedItem,
  tableContent,
  tableHeadRef,
  tablePanelRef,
  toggleConvertToYaml,
  workflows
}) => {
  const viewYamlAction = {
    label: 'View YAML',
    icon: <Yaml />,
    onClick: toggleConvertToYaml
  }
  const actionsMenu =
    typeof pageData.actionsMenu === 'function'
      ? item => [viewYamlAction, ...(pageData.actionsMenu(item) ?? [])]
      : [viewYamlAction, ...(pageData.actionsMenu ?? [])]

  return (
    <div className="table">
      <div className="table__content">
        <div className="table-head" ref={tableHeadRef}>
          {pageData.tableHeaders.map(
            (item, index) =>
              !item.hidden && (
                <div
                  className={`table-head__item ${item.class}`}
                  key={`${item.header}${index}`}
                >
                  <Tooltip
                    template={<TextTooltipTemplate text={item.header} />}
                  >
                    {item.header}
                  </Tooltip>
                </div>
              )
          )}
        </div>
        <div className="table-body">
          {!groupFilter ||
          (isEmpty(groupedByName) && isEmpty(groupedByWorkflow)) ||
          (groupFilter === 'none' && isEmpty(groupLatestItem)) ? (
            tableContent.map((rowItem, i) => {
              switch (pageData.page) {
                case ARTIFACTS_PAGE:
                case FILES_PAGE:
                case MODELS_PAGE:
                case FEATURE_STORE_PAGE:
                  return (
                    <ArtifactsTableRow
                      actionsMenu={actionsMenu}
                      content={content}
                      handleSelectItem={handleSelectItem}
                      key={i}
                      match={match}
                      rowItem={rowItem}
                      pageData={pageData}
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
                    match={match}
                    rowItem={groupLatestItem[i]}
                    selectedItem={selectedItem}
                    tableContent={group}
                  />
                )
              } else if (
                pageData.page === FEATURE_STORE_PAGE ||
                pageData.page === FILES_PAGE ||
                pageData.page === MODELS_PAGE
              ) {
                return (
                  <ArtifactsTableRow
                    actionsMenu={actionsMenu}
                    content={content}
                    handleSelectItem={handleSelectItem}
                    handleExpandRow={handleExpandRow}
                    key={i}
                    mainRowItemsCount={mainRowItemsCount}
                    match={match}
                    rowItem={groupLatestItem[i]}
                    pageData={pageData}
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
      {isTablePanelOpen && (
        <div className="table__panel-container" ref={tablePanelRef}>
          <div className="table__panel">{pageData.tablePanel}</div>
        </div>
      )}
      {!isEmpty(selectedItem) && (
        <Details
          actionsMenu={actionsMenu}
          applyDetailsChanges={applyDetailsChanges}
          cancelRequest={cancelRequest}
          detailsMenu={pageData.detailsMenu}
          handleCancel={handleCancel}
          match={match}
          pageData={pageData}
          retryRequest={retryRequest}
          selectedItem={selectedItem}
        />
      )}
    </div>
  )
}

TableView.defaultProps = {
  applyDetailsChanges: () => {},
  groupLatestJob: {}
}

TableView.propTypes = {
  applyDetailsChanges: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  isTablePanelOpen: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({})))
  ]).isRequired,
  tableHeadRef: PropTypes.shape({}),
  tablePanelRef: PropTypes.shape({}),
  toggleConvertToYaml: PropTypes.func.isRequired
}

export default TableView
