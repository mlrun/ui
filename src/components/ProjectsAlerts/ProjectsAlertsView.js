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
import { useMemo, useState } from 'react'

import Table from '../../components/Table/Table'
import { createAlertRowData } from '../../utils/createAlertsContent'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import PropTypes from 'prop-types'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { ALERTS_FILTERS, ALERTS_PAGE } from '../../constants'

import AlertsTableRow from '../../elements/AlertsTableRow/AlertsTableRow'

const ProjectAlertsView = ({
  actionsMenu,
  alerts,
  alertsFiltersConfig,
  alertsStore,
  handleRefresh,
  filtersStore,
  pageData,
  refreshAlertsCallback,
  requestErrorMessage,
  selectedAlert
}) => {
  const [selectedModelEndpoint] = useState({})

  const tableContent = useMemo(() => {
    return alerts.activations.map(alert => createAlertRowData(alert))
  }, [alerts.activations])

  return (
    <>
      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
        </div>
        <div className="content">
          <div className="table-container">
            {/*<div className="content__action-bar-wrapper">*/}
            {/*  <ActionBar*/}
            {/*    filterMenuName={ALERTS_FILTERS}*/}
            {/*    filtersConfig={alertsFiltersConfig}*/}
            {/*    handleRefresh={refreshAlertsCallback}*/}
            {/*    page={ALERTS_PAGE}*/}
            {/*    withRefreshButton*/}
            {/*    withoutExpandButton*/}
            {/*  >*/}
            {/*    <ProjectsAlertsFilters />*/}
            {/*  </ActionBar>*/}
            {/*</div>*/}
            {alertsStore.loading ? (
              <Loader />
            ) : tableContent.length === 0 ? (
              <NoData
                message={getNoDataMessage(
                  filtersStore,
                  alertsFiltersConfig,
                  requestErrorMessage,
                  ALERTS_PAGE,
                  null,
                  ALERTS_FILTERS
                )}
              />
            ) : (
              <Table
                actionsMenu={actionsMenu}
                pageData={pageData}
                retryRequest={handleRefresh}
                selectedItem={selectedAlert}
                tableClassName="model-endpoints-table"
                hideActionsMenu
                tableHeaders={tableContent[0]?.content ?? []}
              >
                {tableContent.map((tableItem, index) => (
                  <AlertsTableRow
                    key={index}
                    hideActionsMenu
                    handleSelectItem={() => {}}
                    rowIndex={index}
                    rowItem={tableItem}
                    actionsMenu={[]}
                    selectedItem={selectedModelEndpoint}
                  />
                ))}
              </Table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

ProjectAlertsView.propTypes = {
  actionsMenu: PropTypes.func.isRequired,
  alertsStore: PropTypes.object.isRequired,
  pageData: PropTypes.object.isRequired,
  refreshAlertsCallback: PropTypes.func.isRequired,
  selectedAlert: PropTypes.object.isRequired
}
export default ProjectAlertsView
