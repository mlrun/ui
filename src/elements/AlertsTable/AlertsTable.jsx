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
import { isEmpty } from 'lodash'

import AlertsTableRow from '../../elements/AlertsTableRow/AlertsTableRow'
import NoData from '../../common/NoData/NoData'
import Table from '../../components/Table/Table'
import { Loader } from 'igz-controls/components'

import { ALERTS_PAGE, ALERTS_PAGE_PATH, MONITOR_ALERTS_PAGE } from '../../constants'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { getCloseDetailsLink } from '../../utils/link-helper.util'

import './alertsTable.scss'

const AlertsTable = ({
  alertsFiltersConfig,
  alertsStore,
  isAlertsPage = true,
  filters,
  filtersStore,
  handleCancel,
  isCrossProjects,
  pageData,
  requestErrorMessage,
  selectedAlert,
  skipTableWrapper = false,
  tableContent,
  toggleRow
}) => {
  return (
    <>
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
            selectedItem={isAlertsPage ? selectedAlert : {}}
            skipTableWrapper={skipTableWrapper}
            tableClassName="alerts-table"
            handleCancel={handleCancel}
            hideActionsMenu
            tableHeaders={
              tableContent[0]?.content ?? [
                {
                  headerId: 'alertName',
                  headerLabel: 'Alert name',
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
                  isRowSelected={isRowSelected}
                  filters={filters}
                  rowItem={tableItem}
                  selectedItem={selectedAlert}
                  toggleRow={toggleRow}
                />
              )
            })}
          </Table>
        </>
      )}
    </>
  )
}

AlertsTable.propTypes = {
  alertsFiltersConfig: PropTypes.object.isRequired,
  alertsStore: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleCancel: PropTypes.func,
  isAlertsPage: PropTypes.bool,
  isCrossProjects: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedAlert: PropTypes.object.isRequired,
  skipTableWrapper: PropTypes.bool,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleRow: PropTypes.func
}
export default AlertsTable
