import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import ConsumerGroupShardLagTableRow from '../../elements/ConsumerGroupShardLagTableRow/ConsumerGroupShardLagTableRow'
import ConsumerGroupTableRow from '../../elements/ConsumerGroupTableRow/ConsumerGroupTableRow'
import Details from '../Details/Details'
import FeatureStoreTableRow from '../../elements/FeatureStoreTableRow/FeatureStoreTableRow'
import FunctionsTableRow from '../../elements/FunctionsTableRow/FunctionsTableRow'
import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import {
  ARTIFACTS_PAGE,
  CONSUMER_GROUPS_PAGE,
  CONSUMER_GROUP_PAGE,
  DATASETS_PAGE,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  GROUP_BY_NONE,
  MODELS_PAGE,
  REAL_TIME_PIPELINES_TAB
} from '../../constants'
import { ACTIONS_MENU } from '../../types'

const TableView = ({
  actionsMenu,
  applyDetailsChanges,
  children,
  content,
  getCloseDetailsLink,
  groupFilter,
  groupLatestItem,
  groupedContent,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  isTablePanelOpen,
  mainRowItemsCount,
  pageData,
  params,
  retryRequest,
  selectedItem,
  tableContent,
  tableContentRef,
  tableHeadRef,
  tablePanelRef
}) => {
  return (
    <div className="table">
      <div className="table__content" ref={tableContentRef}>
        {pageData.tableHeaders && (
          <>
            <div className="table-head" ref={tableHeadRef}>
              {pageData.tableHeaders?.map(
                (item, index) =>
                  !item.hidden && (
                    <div
                      className={`table-head__item ${item.class}`}
                      key={`${item.header}${index}`}
                    >
                      <Tooltip template={<TextTooltipTemplate text={item.header} />}>
                        {item.header}
                      </Tooltip>
                    </div>
                  )
              )}
            </div>
            <div className="table-body">
              {!groupFilter ||
              isEmpty(groupedContent) ||
              (groupFilter === GROUP_BY_NONE && isEmpty(groupLatestItem)) ? (
                tableContent.map((rowItem, i) => {
                  switch (pageData.page) {
                    case CONSUMER_GROUPS_PAGE:
                      return <ConsumerGroupTableRow key={i} content={content} rowItem={rowItem} />
                    case CONSUMER_GROUP_PAGE:
                      return (
                        <ConsumerGroupShardLagTableRow
                          key={i}
                          content={content}
                          rowItem={rowItem}
                        />
                      )
                    case ARTIFACTS_PAGE:
                    case DATASETS_PAGE:
                    case FILES_PAGE:
                    case MODELS_PAGE:
                      return (
                        <ArtifactsTableRow
                          actionsMenu={actionsMenu}
                          content={content}
                          handleSelectItem={handleSelectItem}
                          key={i}
                          rowItem={rowItem}
                          pageData={pageData}
                          selectedItem={selectedItem}
                        />
                      )
                    case FEATURE_STORE_PAGE:
                      return (
                        <FeatureStoreTableRow
                          actionsMenu={actionsMenu}
                          content={content}
                          handleSelectItem={handleSelectItem}
                          key={i}
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
                          rowItem={rowItem}
                          selectedItem={selectedItem}
                          handleSelectItem={handleSelectItem}
                        />
                      )
                    default:
                      return null
                  }
                })
              ) : groupLatestItem.find(latestItem => !isEmpty(latestItem)) ? (
                tableContent.map((group, i) => {
                  switch (pageData.page) {
                    case ARTIFACTS_PAGE:
                    case DATASETS_PAGE:
                    case FILES_PAGE:
                    case MODELS_PAGE:
                      return params.pageTab === REAL_TIME_PIPELINES_TAB ? (
                        <FunctionsTableRow
                          actionsMenu={actionsMenu}
                          key={i}
                          content={content}
                          handleExpandRow={handleExpandRow}
                          handleSelectItem={handleSelectItem}
                          rowItem={groupLatestItem[i]}
                          selectedItem={selectedItem}
                          tableContent={group}
                        />
                      ) : (
                        <ArtifactsTableRow
                          actionsMenu={actionsMenu}
                          content={content}
                          handleSelectItem={handleSelectItem}
                          handleExpandRow={handleExpandRow}
                          key={i}
                          mainRowItemsCount={mainRowItemsCount}
                          rowItem={groupLatestItem[i]}
                          pageData={pageData}
                          selectedItem={selectedItem}
                          tableContent={group}
                        />
                      )
                    case FUNCTIONS_PAGE:
                      return (
                        <FunctionsTableRow
                          actionsMenu={actionsMenu}
                          key={i}
                          content={content}
                          handleExpandRow={handleExpandRow}
                          handleSelectItem={handleSelectItem}
                          rowItem={groupLatestItem[i]}
                          selectedItem={selectedItem}
                          tableContent={group}
                        />
                      )
                    default:
                      return (
                        <FeatureStoreTableRow
                          actionsMenu={actionsMenu}
                          content={content}
                          handleSelectItem={handleSelectItem}
                          handleExpandRow={handleExpandRow}
                          key={i}
                          mainRowItemsCount={mainRowItemsCount}
                          rowItem={groupLatestItem[i]}
                          pageData={pageData}
                          selectedItem={selectedItem}
                          tableContent={group}
                        />
                      )
                  }
                })
              ) : (
                <NoData />
              )}
            </div>
          </>
        )}
        {children}
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
          getCloseDetailsLink={getCloseDetailsLink}
          detailsMenu={pageData.details.menu}
          handleCancel={handleCancel}
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
  getCloseDetailsLink: null,
  groupLatestJob: {}
}

TableView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  getCloseDetailsLink: PropTypes.func,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  isTablePanelOpen: PropTypes.bool.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  params: PropTypes.shape({}).isRequired,
  retryRequest: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({})))
  ]).isRequired,
  tableHeadRef: PropTypes.shape({}),
  tablePanelRef: PropTypes.shape({})
}

export default TableView
