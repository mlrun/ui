import React from 'react'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import TableTop from '../../../elements/TableTop/TableTop'
import FilterMenu from '../../FilterMenu/FilterMenu'
import NoData from '../../../common/NoData/NoData'
import Details from '../../Details/Details'
import Table from '../../Table/Table'
import JobsTable from '../../../elements/JobTable/JobsTable'
import YamlModal from '../../../common/YamlModal/YamlModal'
import JobsPanel from '../../JobsPanel/JobsPanel'

import { JOBS_PAGE, MONITOR_JOBS_TAB, PANEL_EDIT_MODE, TERTIARY_BUTTON } from '../../../constants'
import { getCloseDetailsLink } from '../../../utils/getCloseDetailsLink'
import { getNoDataMessage } from '../../../layout/Content/content.util'
import { useLocation, useParams } from 'react-router-dom'
import { ACTIONS_MENU } from '../../../types'

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
  toggleConvertedYaml
}) => {
  const params = useParams()
  const location = useLocation()

  return (
    <>
      {params.jobName && (
        <TableTop
          link={`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
          text={params.jobName}
        />
      )}
      <div className="content__action-bar">
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
        <NoData message={getNoDataMessage(filtersStore, filters, MONITOR_JOBS_TAB, JOBS_PAGE)} />
      ) : !isEmpty(selectedJob) ? (
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
      ) : (
        <>
          <Table
            actionsMenu={actionsMenu}
            content={params.jobName ? jobRuns : jobs}
            handleCancel={() => setSelectedJob({})}
            handleSelectItem={handleSelectJob}
            pageData={pageData}
            retryRequest={refreshJobs}
            selectedItem={selectedJob}
            tab={MONITOR_JOBS_TAB}
          >
            <JobsTable
              actionsMenu={actionsMenu}
              content={params.jobName ? jobRuns : jobs}
              handleSelectJob={handleSelectJob}
              selectedJob={selectedJob}
              tab={MONITOR_JOBS_TAB}
            />
          </Table>
        </>
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
          defaultData={editableItem.scheduled_object || editableItem.rerun_object}
          mode={PANEL_EDIT_MODE}
          onSuccessRun={tab => {
            if (editableItem) {
              handleSuccessRerunJob(tab)
            }
          }}
          project={params.projectName}
          withSaveChanges={Boolean(editableItem.scheduled_object)}
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
  toggleConvertedYaml: PropTypes.func.isRequired
}

export default MonitorJobsView
