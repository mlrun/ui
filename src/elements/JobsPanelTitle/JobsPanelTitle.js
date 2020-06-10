import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  closePanel,
  editMode,
  functionData,
  match,
  openScheduleJob,
  currentFunctionInfo,
  panelDispatch,
  setOpenScheduleJob
}) => {
  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      currentFunctionInfo={currentFunctionInfo}
      editMode={editMode}
      match={match}
      methodOptions={functionData.methodOptions}
      openScheduleJob={openScheduleJob}
      panelDispatch={panelDispatch}
      setOpenScheduleJob={setOpenScheduleJob}
      versionOptions={functionData.versionOptions}
    />
  )
}

JobsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  currentFunctionInfo: PropTypes.shape({}).isRequired,
  functionData: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired
}

export default JobsPanelTitle
