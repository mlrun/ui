import React from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import FilterMenu from '../../FilterMenu/FilterMenu'
import NoData from '../../../common/NoData/NoData'
import Workflow from '../../Workflow/Workflow'
import Table from '../../Table/Table'
import JobsTable from '../../../elements/JobTable/JobsTable'
import YamlModal from '../../../common/YamlModal/YamlModal'
import JobsPanel from '../../JobsPanel/JobsPanel'

import {
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PANEL_EDIT_MODE
} from '../../../constants'
import { getNoDataMessage } from '../../../layout/Content/content.util'
import { ACTIONS_MENU } from '../../../types'

const MonitorWorkflowsView = ({
  actionsMenu,
  convertedYaml,
  editableItem,
  filters,
  filtersStore,
  getWorkflows,
  jobs,
  handleCancel,
  handleSelectJob,
  handleSuccessRerunJob,
  itemIsSelected,
  pageData,
  refreshJobs,
  removeNewJob,
  selectedFunction,
  selectedJob,
  setEditableItem,
  setWorkflowsViewMode,
  toggleConvertedYaml,
  workflowsStore,
  workflowsViewMode
}) => {
  const params = useParams()

  return (
    <>
      {!params.workflowId && (
        <div className="content__action-bar">
          <FilterMenu
            filters={filters}
            onChange={getWorkflows}
            page={JOBS_PAGE}
            withoutExpandButton
          />
        </div>
      )}
      {workflowsStore.workflows.loading ? null : !params.workflowId &&
        workflowsStore.workflows.data.length === 0 ? (
        <NoData
          message={getNoDataMessage(filtersStore, filters, MONITOR_WORKFLOWS_TAB, JOBS_PAGE)}
        />
      ) : (
        <>
          {params.workflowId ? (
            <Workflow
              actionsMenu={actionsMenu}
              content={jobs}
              handleCancel={handleCancel}
              handleSelectItem={handleSelectJob}
              itemIsSelected={itemIsSelected}
              pageData={pageData}
              refresh={getWorkflows}
              refreshJobs={refreshJobs}
              selectedFunction={selectedFunction}
              selectedJob={selectedJob}
              setWorkflowsViewMode={setWorkflowsViewMode}
              workflow={workflowsStore.activeWorkflow.data}
              workflowJobsIds={workflowsStore.activeWorkflow.workflowJobsIds}
              workflowsViewMode={workflowsViewMode}
            />
          ) : (
            <Table
              actionsMenu={actionsMenu}
              content={workflowsStore.workflows.data}
              handleCancel={handleCancel}
              handleSelectItem={handleSelectJob}
              pageData={pageData}
              retryRequest={getWorkflows}
              selectedItem={selectedJob}
              tab={MONITOR_JOBS_TAB}
            >
              <JobsTable
                actionsMenu={actionsMenu}
                content={workflowsStore.workflows.data}
                handleSelectJob={handleSelectJob}
                selectedJob={selectedJob}
                tab={MONITOR_WORKFLOWS_TAB}
              />
            </Table>
          )}
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
          handleRunNewJob={{}}
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

MonitorWorkflowsView.defaultProps = {
  editableItem: null
}

MonitorWorkflowsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  editableItem: PropTypes.object,
  filters: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, type: PropTypes.string.isRequired })
  ).isRequired,
  filtersStore: PropTypes.object.isRequired,
  getWorkflows: PropTypes.func.isRequired,
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSelectJob: PropTypes.func.isRequired,
  handleSuccessRerunJob: PropTypes.func.isRequired,
  itemIsSelected: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  removeNewJob: PropTypes.func.isRequired,
  selectedFunction: PropTypes.object.isRequired,
  selectedJob: PropTypes.object.isRequired,
  setEditableItem: PropTypes.func.isRequired,
  setWorkflowsViewMode: PropTypes.func.isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired,
  workflowsStore: PropTypes.object.isRequired,
  workflowsViewMode: PropTypes.string.isRequired
}

export default MonitorWorkflowsView
