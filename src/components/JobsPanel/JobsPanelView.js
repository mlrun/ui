import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'
import JobsPanelDataInputs from '../JobsPanelDataInputs/JobsPanelDataInputs'
import JobsPanelParameters from '../JobsPanelParameters/JobsPanelParameters'
import JobsPanelResources from '../JobsPanelResources/JobsPanelResources'
import JobsPanelTitle from '../../elements/JobsPanelTitle/JobsPanelTitle'
import ScheduleJob from '../ScheduleJob/ScheduleJob'
import JobsPanelAdvanced from '../JobsPanelAdvanced/JobsPanelAdvanced'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import Loader from '../../common/Loader/Loader'
import { Button } from '../../common/Button/Button.js'

import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Run } from '../../images/run.svg'

const JobsPanelView = ({
  closePanel,
  functionData,
  handleRunJob,
  isTitleValid,
  jobsStore,
  loading,
  match,
  openScheduleJob,
  panelDispatch,
  panelState,
  removeJobError,
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
        {loading && <Loader />}
        <JobsPanelTitle
          closePanel={closePanel}
          functionData={functionData}
          isTitleValid={isTitleValid}
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
                newJobTaskSpecObj={jobsStore.newJob.task.spec}
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
            >
              <JobsPanelResources
                match={match}
                panelDispatch={panelDispatch}
                panelState={panelState}
                setNewJobVolumeMounts={setNewJobVolumeMounts}
                setNewJobVolumes={setNewJobVolumes}
                volumeMounts={jobsStore.newJob.function.spec.volume_mounts}
                volumes={jobsStore.newJob.function.spec.volumes}
              />
            </Accordion>
            <Accordion
              accordionClassName="job-panel__accordion"
              icon={<Arrow />}
              iconClassName="job-panel__expand-icon"
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
            <div className="job-panel__buttons-container">
              {jobsStore.error && (
                <ErrorMessage
                  closeError={() => {
                    if (jobsStore.error) {
                      removeJobError()
                    }
                  }}
                  message={jobsStore.error}
                />
              )}
              <Button
                type="tertiary"
                label="Schedule for later"
                addClass="pop-up-dialog__btn_cancel"
                onClick={() => isTitleValid() && setOpenScheduleJob(true)}
              />
              <Button
                type="secondary"
                label={
                  <>
                    <Run className="schedule-run-icon" /> <span> Run now </span>
                  </>
                }
                onClick={() => isTitleValid() && handleRunJob()}
              />
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
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  removeJobError: PropTypes.func.isRequired,
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
