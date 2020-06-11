import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import { panelActions } from '../../components/JobsPanel/panelReducer'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  closePanel,
  functionData,
  match,
  openScheduleJob,
  panelDispatch,
  panelState,
  setOpenScheduleJob
}) => {
  const handleFinishEdit = () => {
    panelDispatch({
      type: panelActions.SET_EDIT_MODE,
      payload: false
    })

    if (
      panelState.currentFunctionInfo.method !==
      panelState.previousPanelData.titleInfo.method
    ) {
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA,
        payload: {
          tableData: panelState.tableData,
          titleInfo: {
            method: panelState.currentFunctionInfo.method,
            version: panelState.currentFunctionInfo.version
          }
        }
      })
    }
  }

  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      currentFunctionInfo={panelState.currentFunctionInfo}
      editMode={panelState.editMode}
      handleFinishEdit={handleFinishEdit}
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
  functionData: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelTitle
