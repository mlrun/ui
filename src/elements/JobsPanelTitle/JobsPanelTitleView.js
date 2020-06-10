import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import JobsPanelTitleEdit from '../JobsPanelTitleEdit/JobsPanelTitleEdit'

import { ReactComponent as BackArrow } from '../../images/back-arrow.svg'
import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'

import { panelActions } from '../../components/JobsPanel/panelReducer'

const JobsPanelTitleView = ({
  closePanel,
  currentFunctionInfo,
  editMode,
  match,
  methodOptions,
  openScheduleJob,
  panelDispatch,
  setOpenScheduleJob,
  versionOptions
}) => {
  const jobPanelClassName = classNames({
    'job-panel__title-wrapper': true,
    'job-panel__title-wrapper_edit': editMode,
    'job-panel__title-wrapper_hover': !openScheduleJob && !editMode
  })

  return (
    <div className="job-panel__title">
      <div className={jobPanelClassName}>
        {openScheduleJob && (
          <div className="job-schedule-container">
            <BackArrow onClick={() => setOpenScheduleJob(false)} />
            <span className="job-schedule__title">Schedule Job</span>
          </div>
        )}
        {!editMode ? (
          <>
            <div className="job-panel__wrapper">
              <div className="job-panel__name">{currentFunctionInfo.name}</div>
              {!openScheduleJob && (
                <>
                  <span className="job-panel__version">
                    Version: {currentFunctionInfo.version === 'latest' && '$'}
                    {currentFunctionInfo.version}
                  </span>
                  {currentFunctionInfo.method && (
                    <span className="job-panel__method">
                      Method: {currentFunctionInfo.method}
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
                    panelDispatch({
                      type: panelActions.SET_EDIT_MODE,
                      payload: true
                    })
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <JobsPanelTitleEdit
            currentFunctionInfo={currentFunctionInfo}
            match={match}
            methodOptions={methodOptions}
            panelDispatch={panelDispatch}
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
  currentFunctionInfo: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  methodOptions: PropTypes.array.isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleView
