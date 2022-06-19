import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import JobsPanelAdvanced from '../JobsPanelAdvanced/JobsPanelAdvanced'
import JobsPanelDataInputs from '../JobsPanelDataInputs/JobsPanelDataInputs'
import JobsPanelParameters from '../JobsPanelParameters/JobsPanelParameters'
import JobsPanelResources from '../JobsPanelResources/JobsPanelResources'
import JobsPanelTitle from '../../elements/JobsPanelTitle/JobsPanelTitle'
import Loader from '../../common/Loader/Loader'
import ScheduleJob from '../ScheduleJob/ScheduleJob'
import { Button } from 'igz-controls/components'

import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'

import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import JobsPanelCredentialsAccessKey from '../../elements/JobsPanelCredentialsAccessKey/JobsPanelCredentialsAccessKey'

const JobsPanelView = ({
  checkValidation,
  closePanel,
  defaultData,
  functionData,
  handleEditJob,
  handleRunJob,
  jobsStore,
  loading,
  openScheduleJob,
  panelDispatch,
  panelState,
  removeJobError,
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
              <JobsPanelParameters panelDispatch={panelDispatch} panelState={panelState} />
            </Accordion>
            <Accordion
              accordionClassName="new-item-side-panel__accordion"
              icon={<Arrow />}
              iconClassName="new-item-side-panel__expand-icon"
            >
              <JobsPanelResources
                panelDispatch={panelDispatch}
                panelState={panelState}
                setValidation={setValidation}
                validation={validation}
              />
            </Accordion>
            <Accordion
              accordionClassName="new-item-side-panel__accordion"
              icon={<Arrow />}
              iconClassName="new-item-side-panel__expand-icon"
            >
              <JobsPanelAdvanced
                panelDispatch={panelDispatch}
                panelState={panelState}
                secretSources={jobsStore.newJob.task.spec.secret_sources}
                setNewJobSecretSources={setNewJobSecretSources}
              />
            </Accordion>
            <JobsPanelCredentialsAccessKey
              panelDispatch={panelDispatch}
              panelState={panelState}
              setValidation={setValidation}
              validation={validation}
            />
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
              <div className="job-panel__buttons-wrapper">
                <Button
                  className="pop-up-dialog__btn_cancel"
                  disabled={!checkValidation || panelState.editMode}
                  label="Schedule for later"
                  onClick={() => setOpenScheduleJob(true)}
                  variant={TERTIARY_BUTTON}
                />
                {withSaveChanges ? (
                  <Button
                    label="Save"
                    onClick={event => handleEditJob(event, defaultData.schedule)}
                    variant={SECONDARY_BUTTON}
                  />
                ) : (
                  <Button
                    label={
                      <>
                        <Run /> <span> Run now </span>
                      </>
                    }
                    disabled={!checkValidation || panelState.editMode}
                    onClick={() => handleRunJob()}
                    variant={SECONDARY_BUTTON}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <ScheduleJob
            defaultCron={defaultData?.schedule}
            handleEditJob={handleEditJob}
            handleRunJob={handleRunJob}
            panelDispatch={panelDispatch}
            panelState={panelState}
            setOpenScheduleJob={setOpenScheduleJob}
            setValidation={setValidation}
            validation={validation}
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
  checkValidation: PropTypes.bool.isRequired,
  closePanel: PropTypes.func.isRequired,
  defaultData: PropTypes.shape({}),
  functionData: PropTypes.shape({}).isRequired,
  handleEditJob: PropTypes.func.isRequired,
  handleRunJob: PropTypes.func.isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool.isRequired,
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
