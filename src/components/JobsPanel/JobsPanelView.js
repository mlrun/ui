import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'
import JobsPanelDataInputs from '../JobsPanelDataInputs/JobsPanelDataInputs'
import JobsPanelParameters from '../JobsPanelParameters/JobsPanelParameters'
import JobsPanelResources from '../JobsPanelResources/JobsPanelResources'
import JobsPanelTitle from '../../elements/JobsPanelTitle/JobsPanelTitle'
import ScheduleJob from '../ScheduleJob/ScheduleJob'

import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Run } from '../../images/run.svg'

const JobsPanelView = ({
  closePanel,
  functionData,
  handleRunJob,
  jobsStore,
  match,
  openScheduleJob,
  panelDispatch,
  panelState,
  setNewJobHyperParameters,
  setNewJobInputs,
  setNewJobParameters,
  setNewJobVolumeMounts,
  setNewJobVolumes,
  setOpenScheduleJob,
  tableData
}) => {
  return (
    <div className="job-panel-container">
      <div className="job-panel">
        <JobsPanelTitle
          closePanel={closePanel}
          currentFunctionInfo={panelState.currentFunctionInfo}
          editMode={panelState.editMode}
          functionData={functionData}
          match={match}
          openScheduleJob={openScheduleJob}
          panelDispatch={panelDispatch}
          setOpenScheduleJob={setOpenScheduleJob}
        />
        {!openScheduleJob ? (
          <div className="job_panel__body">
            <Accordion
              icon={<Arrow />}
              iconClassName="job-panel__expand-icon"
              openByDefault
            >
              <JobsPanelParameters
                hyperparams={jobsStore.newJob.task.spec.hyperparams}
                match={match}
                panelDispatch={panelDispatch}
                parameters={jobsStore.newJob.task.spec.parameters}
                setNewJobHyperParameters={setNewJobHyperParameters}
                setNewJobParameters={setNewJobParameters}
                tableData={Object.values(tableData.parameters)}
              />
            </Accordion>
            <Accordion
              icon={<Arrow />}
              iconClassName="job-panel__expand-icon"
              openByDefault
            >
              <JobsPanelDataInputs
                functionDefaultValues={tableData}
                inputs={jobsStore.newJob.task.spec.inputs}
                match={match}
                panelDispatch={panelDispatch}
                setNewJobInputs={setNewJobInputs}
                setNewJobVolumeMounts={setNewJobVolumeMounts}
                setNewJobVolumes={setNewJobVolumes}
                volumeMounts={jobsStore.newJob.function.spec.volumeMounts}
                volumes={jobsStore.newJob.function.spec.volumes}
              />
            </Accordion>
            <Accordion
              icon={<Arrow />}
              iconClassName="job-panel__expand-icon"
              openByDefault
            >
              <JobsPanelResources
                match={match}
                panelDispatch={panelDispatch}
                panelState={panelState}
              />
            </Accordion>
            <div className="job-panel__buttons-container">
              <button
                className="btn btn__schedule-for-later"
                onClick={() => setOpenScheduleJob(true)}
              >
                Schedule for later
              </button>
              <button className="btn btn_primary" onClick={handleRunJob}>
                <Run className="btn__icon" />
                Run now
              </button>
            </div>
          </div>
        ) : (
          <ScheduleJob setOpenScheduleJob={setOpenScheduleJob} match={match} />
        )}
      </div>
    </div>
  )
}

JobsPanelView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  functionData: PropTypes.shape({}).isRequired,
  handleRunJob: PropTypes.func.isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired,
  setNewJobInputs: PropTypes.func.isRequired,
  setNewJobParameters: PropTypes.func.isRequired,
  setNewJobVolumeMounts: PropTypes.func.isRequired,
  setNewJobVolumes: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelView
