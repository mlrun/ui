import React from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import FilterMenu from '../../FilterMenu/FilterMenu'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import JobsTable from '../../../elements/JobTable/JobsTable'
import JobsPanel from '../../JobsPanel/JobsPanel'
import YamlModal from '../../../common/YamlModal/YamlModal'

import { JOBS_PAGE, PANEL_EDIT_MODE, SCHEDULE_TAB } from '../../../constants'
import { getNoDataMessage } from '../../../layout/Content/content.util'
import { ACTIONS_MENU } from '../../../types'

const ScheduledJobsView = ({
  actionsMenu,
  convertedYaml,
  editableItem,
  filters,
  filtersStore,
  handleSuccessRerunJob,
  jobs,
  jobsStore,
  onEditJob,
  pageData,
  refreshJobs,
  removeNewJob,
  setEditableItem,
  toggleConvertedYaml
}) => {
  const params = useParams()

  return (
    <>
      <div className="content__action-bar">
        <FilterMenu filters={filters} onChange={refreshJobs} page={JOBS_PAGE} withoutExpandButton />
      </div>
      {jobsStore.loading ? null : jobs.length === 0 ? (
        <NoData message={getNoDataMessage(filtersStore, filters, SCHEDULE_TAB, JOBS_PAGE)} />
      ) : (
        <>
          <Table
            actionsMenu={actionsMenu}
            content={jobs}
            pageData={pageData}
            retryRequest={refreshJobs}
            tab={SCHEDULE_TAB}
          >
            <JobsTable actionsMenu={actionsMenu} content={jobs} tab={SCHEDULE_TAB} />
          </Table>
        </>
      )}
      {editableItem && (
        <JobsPanel
          closePanel={() => {
            setEditableItem(null)
            removeNewJob()
          }}
          defaultData={editableItem.scheduled_object || editableItem.rerun_object}
          handleRunNewJob={{}}
          mode={PANEL_EDIT_MODE}
          onEditJob={onEditJob}
          onSuccessRun={tab => {
            if (editableItem) {
              handleSuccessRerunJob(tab)
            }
          }}
          project={params.projectName}
          withSaveChanges={Boolean(editableItem.scheduled_object)}
        />
      )}
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
      )}
    </>
  )
}

ScheduledJobsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  editableItem: PropTypes.object,
  filters: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, type: PropTypes.string.isRequired })
  ).isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleSuccessRerunJob: PropTypes.func.isRequired,
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  jobsStore: PropTypes.object.isRequired,
  onEditJob: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  removeNewJob: PropTypes.func.isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired
}

export default ScheduledJobsView
