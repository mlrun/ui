import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Accordion from '../../common/Accordion/Accordion'
import JobsPanelDataInputs from '../JobsPanelDataInputs/JobsPanelDataInputs'
import JobsPanelParameters from '../JobsPanelParameters/JobsPanelParameters'
import JobsPanelResources from '../JobsPanelResources/JobsPanelResources'
import JobsPanelTitle from '../../elements/JobsPanelTitle/JobsPanelTitle'
import ScheduleJob from '../ScheduleJob/ScheduleJob'
import JobsPanelAdvanced from '../JobsPanelAdvanced/JobsPanelAdvanced'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import Loader from '../../common/Loader/Loader'

import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Run } from '../../images/run.svg'

const JobsPanelView = ({
  closePanel,
  defaultData,
  functionData,
  handleEditJob,
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
  const scheduleForLaterClassNames = classnames(
    'btn_default',
    'btn_small',
    'btn__schedule-for-later',
    !isTitleValid() && 'disabled'
  )
  const runNowClassNames = classnames(
    'btn_primary',
    'btn_small',
    !isTitleValid() && 'disabled'
  )

  return (
    <div className="job-panel-container">
      <div className="job-panel">
        {loading && <Loader />}
        <JobsPanelTitle
          closePanel={closePanel}
          editModeEnabled={!defaultData}
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
              <button
                className={scheduleForLaterClassNames}
                onClick={() => isTitleValid() && setOpenScheduleJob(true)}
              >
                Schedule for later
              </button>
              {defaultData ? (
                <button
                  className={runNowClassNames}
                  onClick={event => handleEditJob(event, defaultData.schedule)}
                >
                  Save
                </button>
              ) : (
                <button
                  className={runNowClassNames}
                  onClick={() => isTitleValid() && handleRunJob()}
                >
                  <Run className="schedule-run-icon" />
                  Run now
                </button>
              )}
            </div>
          </div>
        ) : (
          <ScheduleJob
            defaultCron={defaultData?.schedule}
            handleEditJob={handleEditJob}
            handleRunJob={handleRunJob}
            match={match}
            setOpenScheduleJob={setOpenScheduleJob}
          />
        )}
      </div>
    </div>
  )
}

JobsPanelView.defaultProps = {
  defaultData: null
}

JobsPanelView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  defaultData: PropTypes.shape({}),
  functionData: PropTypes.shape({}).isRequired,
  handleEditJob: PropTypes.func.isRequired,
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
