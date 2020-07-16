import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'
import JobsPanelDataInputs from '../JobsPanelDataInputs/JobsPanelDataInputs'
import JobsPanelParameters from '../JobsPanelParameters/JobsPanelParameters'
import JobsPanelResources from '../JobsPanelResources/JobsPanelResources'
import JobsPanelTitle from '../../elements/JobsPanelTitle/JobsPanelTitle'
import ScheduleJob from '../ScheduleJob/ScheduleJob'
import JobsPanelAdvanced from '../JobsPanelAdvanced/JobsPanelAdvanced'

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
  setNewJobEnvironmentVariables,
  setNewJobHyperParameters,
  setNewJobInputs,
  setNewJobParameters,
  setNewJobSecretSources,
  setNewJobVolumeMounts,
  setNewJobVolumes,
  setOpenScheduleJob,
  setTuningStrategy,
  setUrl
}) => {
  return (
    <div className="job-panel-container">
      <div className="job-panel">
        <JobsPanelTitle
          closePanel={closePanel}
          functionData={functionData}
          match={match}
          openScheduleJob={openScheduleJob}
          panelState={panelState}
          panelDispatch={panelDispatch}
          setOpenScheduleJob={setOpenScheduleJob}
        />
        {!openScheduleJob ? (
          <div className="job_panel__body">
            <Accordion
              accordionClassName="job-panel__accordion"
              icon={<Arrow />}
              iconClassName="job-panel__expand-icon"
              openByDefault
            >
              <JobsPanelDataInputs
                inputs={jobsStore.newJob.task.spec.inputs}
                match={match}
                panelDispatch={panelDispatch}
                panelState={panelState}
                setNewJobInputs={setNewJobInputs}
              />
            </Accordion>
            <Accordion
              accordionClassName="job-panel__accordion"
              icon={<Arrow />}
              iconClassName="job-panel__expand-icon"
              openByDefault
            >
              <JobsPanelParameters
                jobsStoreNewJobTaskSpec={jobsStore.newJob.task.spec}
                match={match}
                panelDispatch={panelDispatch}
                panelState={panelState}
                setNewJobHyperParameters={setNewJobHyperParameters}
                setNewJobParameters={setNewJobParameters}
                setTuningStrategy={setTuningStrategy}
                setUrl={setUrl}
              />
            </Accordion>
            <Accordion
              accordionClassName="job-panel__accordion"
              icon={<Arrow />}
              iconClassName="job-panel__expand-icon"
              openByDefault
            >
              <JobsPanelAdvanced
                environmentVariables={jobsStore.newJob.function.spec.env}
                match={match}
                panelDispatch={panelDispatch}
                panelState={panelState}
                secretSources={jobsStore.newJob.task.spec.secret_sources}
                setNewJobEnvironmentVariables={setNewJobEnvironmentVariables}
                setNewJobSecretSources={setNewJobSecretSources}
              />
            </Accordion>
            <Accordion
              accordionClassName="job-panel__accordion"
              icon={<Arrow />}
              iconClassName="job-panel__expand-icon"
              openByDefault
            >
              <JobsPanelResources
                match={match}
                panelDispatch={panelDispatch}
                panelState={panelState}
                setNewJobVolumeMounts={setNewJobVolumeMounts}
                setNewJobVolumes={setNewJobVolumes}
                volumeMounts={jobsStore.newJob.function.spec.volumeMounts}
                volumes={jobsStore.newJob.function.spec.volumes}
              />
            </Accordion>
            <div className="job-panel__buttons-container">
              <button
                className="btn_default btn_small btn__schedule-for-later"
                onClick={() => setOpenScheduleJob(true)}
              >
                Schedule for later
              </button>
              <button className="btn_primary btn_small" onClick={handleRunJob}>
                <Run className="schedule-run-icon" />
                Run now
              </button>
            </div>
          </div>
        ) : (
          <ScheduleJob
            handleRunJob={handleRunJob}
            match={match}
            setOpenScheduleJob={setOpenScheduleJob}
          />
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
  openScheduleJob: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired,
  setNewJobInputs: PropTypes.func.isRequired,
  setNewJobParameters: PropTypes.func.isRequired,
  setNewJobSecretSources: PropTypes.func.isRequired,
  setNewJobVolumeMounts: PropTypes.func.isRequired,
  setNewJobVolumes: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired,
  setTuningStrategy: PropTypes.func.isRequired,
  setUrl: PropTypes.func.isRequired
}

export default JobsPanelView
