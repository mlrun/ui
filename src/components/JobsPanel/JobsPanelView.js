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
import Button from '../../common/Button/Button'

import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Run } from '../../images/run.svg'

const JobsPanelView = ({
  closePanel,
  defaultData,
  functionData,
  handleEditJob,
  handleRunJob,
  jobsStore,
  loading,
  match,
  openScheduleJob,
  panelDispatch,
  panelState,
  removeJobError,
  setNewJobEnvironmentVariables,
  setNewJobInputs,
  setNewJobSecretSources,
  setOpenScheduleJob,
  setValidation,
  validation,
  withSaveChanges
}) => {
  return (
    <div className="new-item-side-panel-container">
      <div className="job-panel new-item-side-panel">
        {loading && <Loader />}
        <JobsPanelTitle
          closePanel={closePanel}
          editModeEnabled={!defaultData}
          functionData={functionData}
          isNameValid={validation.isNameValid}
          match={match}
          openScheduleJob={openScheduleJob}
          panelState={panelState}
          panelDispatch={panelDispatch}
          setNameValid={setValidation}
          setOpenScheduleJob={setOpenScheduleJob}
        />
        {!openScheduleJob ? (
          <div className="new-item-side-panel__body">
            <Accordion
              accordionClassName="new-item-side-panel__accordion"
              icon={<Arrow />}
              iconClassName="new-item-side-panel__expand-icon"
              openByDefault
            >
              <JobsPanelDataInputs
                inputs={jobsStore.newJob.task.spec.inputs}
                isArtifactPathValid={validation.isArtifactPathValid}
                match={match}
                panelDispatch={panelDispatch}
                panelState={panelState}
                setArtifactPathValid={setValidation}
                setNewJobInputs={setNewJobInputs}
              />
            </Accordion>
            <Accordion
              accordionClassName="new-item-side-panel__accordion"
              icon={<Arrow />}
              iconClassName="new-item-side-panel__expand-icon"
              openByDefault
            >
              <JobsPanelParameters
                panelDispatch={panelDispatch}
                panelState={panelState}
              />
            </Accordion>
            <Accordion
              accordionClassName="new-item-side-panel__accordion"
              icon={<Arrow />}
              iconClassName="new-item-side-panel__expand-icon"
            >
              <JobsPanelResources
                panelDispatch={panelDispatch}
                panelState={panelState}
              />
            </Accordion>
            <Accordion
              accordionClassName="new-item-side-panel__accordion"
              icon={<Arrow />}
              iconClassName="new-item-side-panel__expand-icon"
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
            <div className="new-item-side-panel__buttons-container">
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
                variant="tertiary"
                label="Schedule for later"
                className="pop-up-dialog__btn_cancel"
                onClick={() =>
                  validation.isNameValid &&
                  validation.isArtifactPathValid &&
                  setOpenScheduleJob(true)
                }
              />
              {withSaveChanges ? (
                <Button
                  variant="secondary"
                  label="Save"
                  onClick={event => handleEditJob(event, defaultData.schedule)}
                />
              ) : (
                <Button
                  variant="secondary"
                  label={
                    <>
                      <Run /> <span> Run now </span>
                    </>
                  }
                  onClick={() =>
                    validation.isNameValid &&
                    validation.isArtifactPathValid &&
                    handleRunJob()
                  }
                />
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
  setNewJobInputs: PropTypes.func.isRequired,
  setNewJobSecretSources: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired,
  withSaveChanges: PropTypes.bool.isRequired
}

export default JobsPanelView
