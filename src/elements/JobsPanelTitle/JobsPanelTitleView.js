import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleEdit from '../JobsPanelTitleEdit/JobsPanelTitleEdit'

import { ReactComponent as BackArrow } from '../../images/back-arrow.svg'
import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'

const JobsPanelTitleView = ({
  closePanel,
  currentFunction,
  handleEditJobTitle,
  isEdit,
  match,
  methodOptions,
  openScheduleJob,
  setCurrentFunction,
  setIsEdit,
  setOpenScheduleJob,
  versionOptions
}) => {
  return (
    <div className="job-panel__title">
      <div
        className={`job-panel__title-wrapper ${isEdit &&
          'job-panel__title-wrapper_edit'} ${!openScheduleJob &&
          !isEdit &&
          'job-panel__title-wrapper_hover'}`}
      >
        {openScheduleJob && (
          <div className="job-schedule-container">
            <BackArrow onClick={() => setOpenScheduleJob(false)} />
            <span className="job-schedule__title">Schedule Job</span>
          </div>
        )}
        {!isEdit ? (
          <>
            <div className="job-panel__wrapper">
              <div className="job-panel__name">{currentFunction.name}</div>
              {!openScheduleJob && (
                <>
                  <span className="job-panel__version">
                    Version: {currentFunction.version === 'latest' && '$'}
                    {currentFunction.version}
                  </span>
                  {currentFunction.method && (
                    <span className="job-panel__method">
                      Method: {currentFunction.method}
                    </span>
                  )}
                </>
              )}
            </div>
            {openScheduleJob !== true && (
              <div className="job-panel__button">
                <Edit
                  className="job-panel__icon"
                  onClick={() => {
                    setIsEdit(true)
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <JobsPanelTitleEdit
            currentFunction={currentFunction}
            handleEditJobTitle={handleEditJobTitle}
            match={match}
            methodOptions={methodOptions}
            setCurrentFunction={setCurrentFunction}
            versionOptions={versionOptions}
          />
        )}
      </div>
      <button
        onClick={() => closePanel({})}
        className="job-panel__close-button"
      >
        <Close />
      </button>
    </div>
  )
}

JobsPanelTitleView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  currentFunction: PropTypes.shape({}).isRequired,
  handleEditJobTitle: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  methodOptions: PropTypes.array.isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setCurrentFunction: PropTypes.func.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleView
