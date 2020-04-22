import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'
import JobsPanelParameters from '../JobsPanelParameters/JobsPanelParameters'
import JobsPanelDataInputs from '../JobsPanelDataInputs/JobsPanelDataInputs'
import JobsPanelResources from '../JobsPanelResources/JobsPanelResources'

import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Run } from '../../images/run.svg'

const JobsPanelView = ({
  close,
  cpuUnit,
  edit,
  func,
  handlerEdit,
  handleRunJob,
  jobsStore,
  limits,
  match,
  memoryUnit,
  requests,
  setCpuUnit,
  setInputPath,
  setLimits,
  setMemoryUnit,
  setNewJobHyperParameters,
  setNewJobInputs,
  setNewJobParameters,
  setNewJobVolumes,
  setNewJobVolumeMounts,
  setOutputPath,
  setRequests
}) => (
  <div className="job-panel-container">
    <div className="job-panel">
      <div className="job-panel__title">
        <div className="job-panel__name">{func?.metadata?.name}</div>
        <button onClick={() => close({})} className="job-panel__close-button">
          <Close />
        </button>
      </div>
      <div className="job_panel__body">
        <Accordion icon={<Arrow />} iconClassName="accordion__icon">
          <JobsPanelParameters
            edit={edit}
            hyperparams={jobsStore.newJob.task.spec.hyperparams}
            match={match}
            parameters={jobsStore.newJob.task.spec.parameters}
            setNewJobParameters={setNewJobParameters}
            setNewJobHyperParameters={setNewJobHyperParameters}
          />
        </Accordion>
        <Accordion icon={<Arrow />} iconClassName="accordion__icon">
          <JobsPanelDataInputs
            edit={edit}
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
        <Accordion icon={<Arrow />} iconClassName="accordion__icon">
          <JobsPanelResources
            cpuUnit={cpuUnit}
            edit={edit}
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
          {!edit && (
            <button className="btn btn__edit" onClick={handlerEdit}>
              Edit
            </button>
          )}
          {edit && (
            <>
              <button className="btn btn__schedule">Schedule for later</button>
              <button className="btn btn__run" onClick={handleRunJob}>
                <Run className="btn__icon" />
                Run now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)

JobsPanelView.propTypes = {
  close: PropTypes.func.isRequired,
  cpuUnit: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  func: PropTypes.shape({}).isRequired,
  handlerEdit: PropTypes.func.isRequired,
  handleRunJob: PropTypes.func.isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  limits: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  memoryUnit: PropTypes.string.isRequired,
  requests: PropTypes.shape({}).isRequired,
  setCpuUnit: PropTypes.func.isRequired,
  setInputPath: PropTypes.func.isRequired,
  setLimits: PropTypes.func.isRequired,
  setMemoryUnit: PropTypes.func.isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired,
  setNewJobInputs: PropTypes.func.isRequired,
  setNewJobParameters: PropTypes.func.isRequired,
  setNewJobVolumes: PropTypes.func.isRequired,
  setNewJobVolumeMounts: PropTypes.func.isRequired,
  setOutputPath: PropTypes.func.isRequired,
  setRequests: PropTypes.func.isRequired
}

export default JobsPanelView
