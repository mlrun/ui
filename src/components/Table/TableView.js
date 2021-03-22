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
  FEATURES_TAB,
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
  mainRowItemsCount,
  match,
  pageData,
  retryRequest,
  selectedItem,
  selectedRowId,
  setSelectedRowId,
  tableContent,
  toggleConvertToYaml,
  workflows
}) => {
  const actionsMenu = pageData.actionsMenu
    ? [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertToYaml
        },
        ...pageData.actionsMenu
      ]
    : [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertToYaml
        }
      ]

  return (
    <div className="table">
      <div className="table__content">
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
                case FILES_PAGE:
                case MODELS_PAGE:
                case FEATURE_STORE_PAGE:
                  return (
                    <ArtifactsTableRow
                      actionsMenu={actionsMenu}
                      content={content}
                      handleSelectItem={handleSelectItem}
                      index={i}
                      key={i}
                      match={match}
                      rowItem={rowItem}
                      pageData={pageData}
                      selectedItem={selectedItem}
                      selectedRowId={selectedRowId}
                      setSelectedRowId={setSelectedRowId}
                      withCheckbox={match.params.pageTab === FEATURES_TAB}
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
                    index={i}
                    key={i}
                    mainRowItemsCount={mainRowItemsCount}
                    match={match}
                    rowItem={groupLatestItem[i]}
                    pageData={pageData}
                    selectedItem={selectedItem}
                    tableContent={group}
                    selectedRowId={selectedRowId}
                    setSelectedRowId={setSelectedRowId}
                    withCheckbox={match.params.pageTab === FEATURES_TAB}
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
          applyDetailsChanges={applyDetailsChanges}
          cancelRequest={cancelRequest}
          detailsMenu={pageData.detailsMenu}
          handleCancel={handleCancel}
          handleSelectItem={handleSelectItem}
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
  groupLatestJob: {},
  selectedRowId: '',
  setSelectedRowId: () => {},
  withCheckbox: false
}

TableView.propTypes = {
  applyDetailsChanges: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  selectedRowId: PropTypes.string,
  setSelectedRowId: PropTypes.func,
  tableContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({})))
  ]).isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired,
  withCheckbox: PropTypes.bool
}

export default TableView
