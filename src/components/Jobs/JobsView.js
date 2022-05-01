import React from 'react'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import Content from '../../layout/Content/Content'
import Workflow from '../Workflow/Workflow'
import Details from '../Details/Details'
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'
import Loader from '../../common/Loader/Loader'
import JobsPanel from '../JobsPanel/JobsPanel'
import YamlModal from '../../common/YamlModal/YamlModal'

import { PANEL_EDIT_MODE } from '../../constants'
import { TERTIARY_BUTTON } from 'igz-controls/constants'
import { getJobIdentifier } from '../../utils/getUniqueIdentifier'

const JobsView = ({
  actionsMenu,
  confirmData,
  convertedYaml,
  editableItem,
  fetchCurrentJob,
  functionsStore,
  getCloseDetailsLink,
  jobRuns,
  jobs,
  handleActionsMenuClick,
  handleCancel,
  handleSelectJob,
  handleSuccessRerunJob,
  itemIsSelected,
  jobsStore,
  onEditJob,
  pageData,
  params,
  refreshJobs,
  removeNewJob,
  selectedFunction,
  selectedJob,
  setEditableItem,
  setWorkflowsViewMode,
  toggleConvertedYaml,
  workflow,
  workflowJobsIds,
  workflowsStore,
  workflowsViewMode
}) => {
  return (
    <div className="content-wrapper">
      <Content
        content={params.jobName ? jobRuns : jobs}
        getCloseDetailsLink={getCloseDetailsLink}
        getIdentifier={getJobIdentifier}
        handleActionsMenuClick={handleActionsMenuClick}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectJob}
        loading={jobsStore.loading || workflowsStore.workflows.loading}
        pageData={pageData}
        refresh={refreshJobs}
        selectedItem={selectedJob}
        tableTop={
          params.jobName
            ? {
                link: `/projects/${params.projectName}/jobs/${params.pageTab}`,
                text: params.jobName
              }
            : null
        }
      >
        {params.workflowId ? (
          <Workflow
            actionsMenu={actionsMenu}
            content={jobs}
            handleCancel={handleCancel}
            handleSelectItem={handleSelectJob}
            itemIsSelected={itemIsSelected}
            pageData={pageData}
            refresh={refreshJobs}
            refreshJobs={refreshJobs}
            selectedFunction={selectedFunction}
            selectedJob={selectedJob}
            setWorkflowsViewMode={setWorkflowsViewMode}
            workflow={workflow}
            workflowJobsIds={workflowJobsIds}
            workflowsViewMode={workflowsViewMode}
          />
        ) : !isEmpty(selectedJob) ? (
          <Details
            actionsMenu={actionsMenu}
            detailsMenu={pageData.details.menu}
            getCloseDetailsLink={getCloseDetailsLink}
            handleCancel={handleCancel}
            handleRefresh={fetchCurrentJob}
            isDetailsScreen
            pageData={pageData}
            selectedItem={selectedJob}
          />
        ) : null}
      </Content>
      {confirmData && (
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: 'Cancel',
            variant: TERTIARY_BUTTON
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: () => confirmData.confirmHandler(confirmData.item),
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmType
          }}
          header={confirmData.header}
          message={confirmData.message}
        />
      )}
      {(jobsStore.loading ||
        workflowsStore.workflows.loading ||
        workflowsStore.activeWorkflow.loading ||
        functionsStore.loading) && <Loader />}
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
    </div>
  )
}

JobsView.defaultProps = {
  confirmData: null,
  editableItem: null
}

JobsView.propTypes = {
  actionsMenu: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
  confirmData: PropTypes.object,
  convertedYaml: PropTypes.string.isRequired,
  editableItem: PropTypes.object,
  fetchCurrentJob: PropTypes.func.isRequired,
  functionsStore: PropTypes.object.isRequired,
  jobRuns: PropTypes.arrayOf(PropTypes.object).isRequired,
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleActionsMenuClick: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSelectJob: PropTypes.func.isRequired,
  handleSuccessRerunJob: PropTypes.func.isRequired,
  itemIsSelected: PropTypes.bool.isRequired,
  jobsStore: PropTypes.object.isRequired,
  onEditJob: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  removeNewJob: PropTypes.func.isRequired,
  selectedFunction: PropTypes.object.isRequired,
  selectedJob: PropTypes.object.isRequired,
  setEditableItem: PropTypes.func.isRequired,
  setWorkflowsViewMode: PropTypes.func.isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired,
  workflow: PropTypes.object.isRequired,
  workflowJobsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  workflowsStore: PropTypes.object.isRequired,
  workflowsViewMode: PropTypes.string.isRequired
}

export default JobsView
