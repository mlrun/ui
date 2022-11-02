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
import React from 'react'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TableTop from '../../../elements/TableTop/TableTop'
import FilterMenu from '../../FilterMenu/FilterMenu'
import NoData from '../../../common/NoData/NoData'
import Details from '../../Details/Details'
import Table from '../../Table/Table'
import YamlModal from '../../../common/YamlModal/YamlModal'
import JobsPanel from '../../JobsPanel/JobsPanel'

import { JOBS_PAGE, MONITOR_JOBS_TAB, PANEL_EDIT_MODE } from '../../../constants'
import { getCloseDetailsLink } from '../../../utils/getCloseDetailsLink'
import { getNoDataMessage } from '../../../layout/Content/content.util'
import { useLocation, useParams } from 'react-router-dom'
import { ACTIONS_MENU } from '../../../types'
import { TERTIARY_BUTTON } from 'igz-controls/constants'
import JobsTableRow from '../../../elements/JobsTableRow/JobsTableRow'

const MonitorJobsView = ({
  actionsMenu,
  appStore,
  convertedYaml,
  editableItem,
  fetchCurrentJob,
  filters,
  filtersStore,
  handleMonitoring,
  handleSelectJob,
  handleSuccessRerunJob,
  jobRuns,
  jobs,
  jobsStore,
  pageData,
  refreshJobs,
  removeNewJob,
  selectedJob,
  setEditableItem,
  setSelectedJob,
  tableContent,
  toggleConvertedYaml
}) => {
  const params = useParams()
  const location = useLocation()

  const filterMenuClassNames = classnames(
    'content__action-bar',
    params.jobId && 'content__action-bar_hidden'
  )

  return (
    <>
      {params.jobName && (
        <TableTop
          link={`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
          text={params.jobName}
        />
      )}
      <div className={filterMenuClassNames}>
        <FilterMenu
          actionButton={{
            label: 'Resource monitoring',
            tooltip: !appStore.frontendSpec.jobs_dashboard_url ? 'Grafana service unavailable' : '',
            variant: TERTIARY_BUTTON,
            disabled: !appStore.frontendSpec.jobs_dashboard_url,
            onClick: () => handleMonitoring()
          }}
          filters={filters}
          onChange={refreshJobs}
          page={JOBS_PAGE}
          withoutExpandButton
        />
      </div>

      {jobsStore.loading ? null : (params.jobName && jobRuns.length === 0) ||
        (jobs.length === 0 && !params.jobName) ? (
        <NoData message={getNoDataMessage(filtersStore, filters, JOBS_PAGE, MONITOR_JOBS_TAB)} />
      ) : (
        isEmpty(selectedJob) && (
          <Table
            actionsMenu={actionsMenu}
            content={params.jobName ? jobRuns : jobs}
            handleCancel={() => setSelectedJob({})}
            handleSelectItem={handleSelectJob}
            pageData={pageData}
            retryRequest={refreshJobs}
            selectedItem={selectedJob}
            tab={MONITOR_JOBS_TAB}
            tableHeaders={tableContent[0]?.content ?? []}
          >
            {tableContent.map((tableItem, index) => (
              <JobsTableRow
                actionsMenu={actionsMenu}
                handleSelectJob={handleSelectJob}
                key={index}
                rowItem={tableItem}
                selectedJob={selectedJob}
              />
            ))}
          </Table>
        )
      )}
      {!isEmpty(selectedJob) && (
        <Details
          actionsMenu={actionsMenu}
          detailsMenu={pageData.details.menu}
          getCloseDetailsLink={() => getCloseDetailsLink(location, params.jobName)}
          handleCancel={() => setSelectedJob({})}
          handleRefresh={fetchCurrentJob}
          isDetailsScreen
          pageData={pageData}
          selectedItem={selectedJob}
          tab={MONITOR_JOBS_TAB}
        />
      )}
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
      )}
      {editableItem && (
        <JobsPanel
          closePanel={() => {
            setEditableItem(null)
            removeNewJob()
          }}
          defaultData={editableItem?.rerun_object}
          mode={PANEL_EDIT_MODE}
          onSuccessRun={tab => {
            if (editableItem) {
              handleSuccessRerunJob(tab)
            }
          }}
          project={params.projectName}
        />
      )}
    </>
  )
}

MonitorJobsView.defaultProps = {
  editableItem: null
}

MonitorJobsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  appStore: PropTypes.object.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  editableItem: PropTypes.object,
  fetchCurrentJob: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, type: PropTypes.string.isRequired })
  ).isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleMonitoring: PropTypes.func.isRequired,
  handleSelectJob: PropTypes.func.isRequired,
  handleSuccessRerunJob: PropTypes.func.isRequired,
  jobRuns: PropTypes.arrayOf(PropTypes.object).isRequired,
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  jobsStore: PropTypes.object.isRequired,
  pageData: PropTypes.object.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  removeNewJob: PropTypes.func.isRequired,
  selectedJob: PropTypes.object.isRequired,
  setEditableItem: PropTypes.func.isRequired,
  setSelectedJob: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired
}

export default MonitorJobsView
