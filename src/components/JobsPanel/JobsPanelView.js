import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'
import JobsPanelParameters from '../JobsPanelParameters/JobsPanelParameters'
import JobsPanelDataInputs from '../JobsPanelDataInputs/JobsPanelDataInputs'
import JobsPanelResources from '../JobsPanelResources/JobsPanelResources'
import ScheduleJob from '../ScheduleJob/ScheduleJob'

import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Run } from '../../images/run.svg'

import { ReactComponent as BackArrow } from '../../images/back-arrow.svg'

const JobsPanelView = ({
  close,
  cpuUnit,
  func,
  handleRunJob,
  jobsStore,
  limits,
  match,
  memoryUnit,
  openScheduleJob,
  requests,
  setCpuUnit,
  setInputPath,
  setLimits,
  setMemoryUnit,
  setNewJobHyperParameters,
  setNewJobInputs,
  setNewJobParameters,
  setNewJobVolumeMounts,
  setNewJobVolumes,
  setOpenScheduleJob,
  setOutputPath,
  setRequests
}) => (
  <div className="job-panel-container">
    <div className="job-panel">
      <div className="job-panel__title">
        <div className="job-panel__title_wrapper">
          {openScheduleJob && (
            <div className="job-schedule-container">
              <BackArrow onClick={() => setOpenScheduleJob(false)} />
              <span className="job-schedule__title">Schedule Job</span>
            </div>
          )}
          <div className="job-panel__name">{func?.metadata?.name}</div>
        </div>
        <button onClick={() => close({})} className="job-panel__close-button">
          <Close />
        </button>
      </div>
      {!openScheduleJob ? (
        <div className="job_panel__body">
          <Accordion icon={<Arrow />} iconClassName="job-panel__expand-icon">
            <JobsPanelParameters
              hyperparams={jobsStore.newJob.task.spec.hyperparams}
              match={match}
              parameters={jobsStore.newJob.task.spec.parameters}
              setNewJobHyperParameters={setNewJobHyperParameters}
              setNewJobParameters={setNewJobParameters}
            />
          </Accordion>
          <Accordion icon={<Arrow />} iconClassName="job-panel__expand-icon">
            <JobsPanelDataInputs
              inputs={jobsStore.newJob.task.spec.inputs}
              match={match}
              setInputPath={setInputPath}
              setNewJobInputs={setNewJobInputs}
              setNewJobVolumeMounts={setNewJobVolumeMounts}
              setNewJobVolumes={setNewJobVolumes}
              setOutputPath={setOutputPath}
              volumeMounts={jobsStore.newJob.function.spec.volumeMounts}
              volumes={jobsStore.newJob.function.spec.volumes}
            />
          </Accordion>
          <Accordion icon={<Arrow />} iconClassName="job-panel__expand-icon">
            <JobsPanelResources
              cpuUnit={cpuUnit}
              limits={limits}
              match={match}
              memoryUnit={memoryUnit}
              requests={requests}
              setCpuUnit={setCpuUnit}
              setLimits={setLimits}
              setMemoryUnit={setMemoryUnit}
              setRequests={setRequests}
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
        <ScheduleJob match={match} />
      )}
    </div>
  </div>
)

JobsPanelView.propTypes = {
  close: PropTypes.func.isRequired,
  cpuUnit: PropTypes.string.isRequired,
  func: PropTypes.shape({}).isRequired,
  handleRunJob: PropTypes.func.isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  limits: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  memoryUnit: PropTypes.string.isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  requests: PropTypes.shape({}).isRequired,
  setCpuUnit: PropTypes.func.isRequired,
  setInputPath: PropTypes.func.isRequired,
  setLimits: PropTypes.func.isRequired,
  setMemoryUnit: PropTypes.func.isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired,
  setNewJobInputs: PropTypes.func.isRequired,
  setNewJobParameters: PropTypes.func.isRequired,
  setNewJobVolumeMounts: PropTypes.func.isRequired,
  setNewJobVolumes: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired,
  setOutputPath: PropTypes.func.isRequired,
  setRequests: PropTypes.func.isRequired
}

export default JobsPanelView
