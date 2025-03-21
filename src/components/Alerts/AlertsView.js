/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import ActionBar from '../ActionBar/ActionBar'
import AlertsFilters from './AlertsFilters'
import AlertsTableRow from '../../elements/AlertsTableRow/AlertsTableRow'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import Pagination from '../../common/Pagination/Pagination'
import Table from '../Table/Table'

import {
  ALERTS_DISPLAY_LIMIT,
  ALERTS_FILTERS,
  ALERTS_PAGE,
  ALERTS_PAGE_PATH,
  MONITOR_ALERTS_PAGE
} from '../../constants'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { getCloseDetailsLink } from '../../utils/link-helper.util'

import { ReactComponent as ExclamationMarkIcon } from 'igz-controls/images/info-fill.svg'

import './alerts.scss'

const AlertsView = ({
  alertsFiltersConfig,
  alertsStore,
  entityId,
  isAlertsPage = true,
  filters,
  filtersStore,
  handleCancel,
  handleRefreshAlerts,
  handleRefreshWithFilters,
  isCrossProjects,
  navigate,
  navigateToPerProjectAlertsPage,
  pageData,
  paginationConfigAlertsRef,
  projectName = '',
  requestErrorMessage,
  selectedAlert,
  setSearchParams,
  selectedRowData,
  tableContent,
  toggleRow
}) => {
  const content = classNames('content', !isAlertsPage && 'alerts-table__content')

  return (
    <>
      <div className="content-wrapper">
        {isAlertsPage && (
          <div className="content__header">
            <Breadcrumbs />
          </div>
        )}
        <div className={content}>
          <div className="table-container alerts-container">
            <div className="content__action-bar-wrapper">
              {!isAlertsPage && tableContent.length >= ALERTS_DISPLAY_LIMIT && (
                <div className="alerts-container__content-info">
                  <ExclamationMarkIcon />
                  <div>Only 100 alerts are displayed. View all in</div>
                  <span
                    className="link"
                    onClick={() => navigateToPerProjectAlertsPage(navigate, projectName, entityId)}
                  >
                    alerts screen
                  </span>
                  .
                </div>
              )}
              {isAlertsPage && (
                <ActionBar
                  autoRefreshIsStopped={true}
                  closeParamName={isCrossProjects ? MONITOR_ALERTS_PAGE : ALERTS_PAGE_PATH}
                  filterMenuName={ALERTS_FILTERS}
                  filters={filters}
                  filtersConfig={isAlertsPage ? alertsFiltersConfig : {}}
                  handleRefresh={handleRefreshAlerts}
                  setSearchParams={setSearchParams}
                  withRefreshButton
                  withoutExpandButton
                >
                  <AlertsFilters isAlertsPage={isAlertsPage} isCrossProjects={isCrossProjects} />
                </ActionBar>
              )}
            </div>
            {alertsStore.loading ? (
              <Loader />
            ) : tableContent.length === 0 && isEmpty(selectedAlert) ? (
              <NoData
                message={getNoDataMessage(
                  filters,
                  alertsFiltersConfig,
                  requestErrorMessage,
                  ALERTS_PAGE,
                  null,
                  filtersStore
                )}
              />
            ) : (
              <>
                {alertsStore.alertLoading && <Loader />}
                <Table
                  actionsMenu={[]}
                  getCloseDetailsLink={() =>
                    getCloseDetailsLink(isCrossProjects ? MONITOR_ALERTS_PAGE : ALERTS_PAGE_PATH)
                  }
                  pageData={pageData}
                  retryRequest={handleRefreshWithFilters}
                  selectedItem={isAlertsPage ? selectedAlert : {}}
                  tableClassName="alerts-table"
                  handleCancel={handleCancel}
                  hideActionsMenu
                  tableHeaders={
                    tableContent[0]?.content ?? [
                      {
                        headerId: 'alertName',
                        headerLabel: 'Alert Name',
                        className: 'table-cell-name'
                      }
                    ]
                  }
                  withActionMenu={false}
                >
                  {tableContent.map((tableItem, index) => {
                    const isRowSelected = tableItem?.data?.id === selectedAlert?.id && !isAlertsPage
                    const selectedRowClassName = `${isRowSelected ? 'alert-row__cell--expanded-selected-cell' : ''} `
                    return (
                      <AlertsTableRow
                        className={selectedRowClassName}
                        key={index}
                        hideActionsMenu
                        handleSelectItem={() => {}}
                        filters={filters}
                        isRowSelected={isRowSelected}
                        rowIndex={index}
                        rowItem={tableItem}
                        actionsMenu={[]}
                        toggleRow={toggleRow}
                        selectedItem={selectedAlert}
                        selectedRowData={selectedRowData}
                      />
                    )
                  })}
                </Table>
                {isAlertsPage && (
                  <Pagination
                    closeParamName={isCrossProjects ? MONITOR_ALERTS_PAGE : ALERTS_PAGE_PATH}
                    page={pageData.page}
                    paginationConfig={paginationConfigAlertsRef.current}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

AlertsView.propTypes = {
  alertsFiltersConfig: PropTypes.object.isRequired,
  alertsStore: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleCancel: PropTypes.func,
  handleRefreshAlerts: PropTypes.func.isRequired,
  handleRefreshWithFilters: PropTypes.func.isRequired,
  isAlertsPage: PropTypes.bool,
  isCrossProjects: PropTypes.bool.isRequired,
  navigate: PropTypes.func,
  navigateToPerProjectAlertsPage: PropTypes.func,
  pageData: PropTypes.object.isRequired,
  paginationConfigAlertsRef: PropTypes.object.isRequired,
  projectName: PropTypes.string,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedAlert: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleRow: PropTypes.func
}
export default AlertsView
