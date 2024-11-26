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
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ActionBar from '../ActionBar/ActionBar'
import ProjectsAlertsFilters from './ProjectsAlertsFilters'

import { ALERTS_FILTERS, ALERTS_PAGE } from '../../constants'

import PropTypes from 'prop-types'

const ProjectAlertsView = ({ alertsFiltersConfig, filters, refreshAlertsCallback }) => {
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
                handleRefresh={refreshAlertsCallback}
                page={ALERTS_PAGE}
                withRefreshButton
                withoutExpandButton
              >
                <ProjectsAlertsFilters />
              </ActionBar>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

ProjectAlertsView.propTypes = {
  alertsFiltersConfig: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  refreshAlertsCallback: PropTypes.func.isRequired
}
export default ProjectAlertsView
