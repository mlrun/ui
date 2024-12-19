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
import PropTypes from 'prop-types'

import ActionBar from '../ActionBar/ActionBar'
import AlertsFilters from './AlertsFilters'
import AlertsTableRow from '../../elements/AlertsTableRow/AlertsTableRow'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import Pagination from '../../common/Pagination/Pagination'
import Table from '../Table/Table'

import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { getCloseDetailsAlertLink } from '../../utils/link-helper.util'
import { ALERTS_FILTERS, ALERTS_PAGE } from '../../constants'

const AlertsView = ({
  actionsMenu,
  alertsFiltersConfig,
  alertsStore,
  filters,
  filtersStore,
  handleCancel,
  handleRefreshAlerts,
  handleRefreshWithFilters,
  isCrossProjects,
  pageData,
  paginationConfigAlertsRef,
  requestErrorMessage,
  selectedAlert,
  setSearchParams,
  tableContent
}) => {
  return (
    <>
      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
        </div>
        <div className="content">
          <div className="table-container">
            <div className="content__action-bar-wrapper">
              <ActionBar
                autoRefreshIsStopped={true}
                filterMenuName={ALERTS_FILTERS}
                filtersConfig={alertsFiltersConfig}
                filters={filters}
                handleRefresh={handleRefreshAlerts}
                page={ALERTS_PAGE}
                setSearchParams={setSearchParams}
                withRefreshButton
                withoutExpandButton
              >
                <AlertsFilters isCrossProjects={isCrossProjects} />
              </ActionBar>
            </div>
            {alertsStore.loading ? (
              <Loader />
            ) : tableContent.length === 0 ? (
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
                <Table
                  actionsMenu={actionsMenu}
                  getCloseDetailsLink={() => getCloseDetailsAlertLink()} //TODO: the getCloseDetailsLink will be updated with ML-8368
                  pageData={pageData}
                  retryRequest={handleRefreshWithFilters}
                  selectedItem={selectedAlert}
                  tableClassName="alerts-table"
                  handleCancel={handleCancel}
                  hideActionsMenu
                  tableHeaders={tableContent[0]?.content ?? []}
                  withActionMenu={false}
                >
                  {tableContent.map((tableItem, index) => (
                    <AlertsTableRow
                      key={index}
                      hideActionsMenu
                      handleSelectItem={() => {}}
                      rowIndex={index}
                      rowItem={tableItem}
                      actionsMenu={[]}
                      selectedItem={selectedAlert}
                    />
                  ))}
                </Table>
                <Pagination
                  page={pageData.page}
                  paginationConfig={paginationConfigAlertsRef.current}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

AlertsView.propTypes = {
  actionsMenu: PropTypes.array.isRequired,
  alertsFiltersConfig: PropTypes.object.isRequired,
  alertsStore: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleRefreshAlerts: PropTypes.func.isRequired,
  handleRefreshWithFilters: PropTypes.func.isRequired,
  isCrossProjects: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  paginationConfigAlertsRef: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedAlert: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired
}
export default AlertsView
