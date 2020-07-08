import React, { useState } from 'react'
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
  const [editTitle, setEditTitle] = useState(false)

  const handleFinishEdit = (event, cancelEdit) => {
    panelDispatch({
      type: panelActions.SET_EDIT_MODE,
      payload: false
    })

    if (
      panelState.currentFunctionInfo.method !==
        panelState.previousPanelData.titleInfo.method &&
      !cancelEdit
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
    } else {
      panelDispatch({
        type: panelActions.SET_CURRENT_FUNCTION_INFO_METHOD,
        payload: {
          method: panelState.previousPanelData.titleInfo.method,
          methodDescription:
            panelState.previousPanelData.titleInfo.methodDescription
        }
      })
      panelDispatch({
        type: panelActions.SET_TABLE_DATA,
        payload: panelState.previousPanelData.tableData
      })
    }
  }

  const handleFunctionInfoChange = (value, isMethod) => {
    if (isMethod) {
      if (value === panelState.currentFunctionInfo.method) {
        return
      }

      const methodDescription = functionData.methodOptions.find(
        func => func.id === value
      )

      panelDispatch({
        type: panelActions.SET_CURRENT_FUNCTION_INFO_METHOD,
        payload: {
          method: value,
          methodDescription: methodDescription.subLabel
        }
      })
    } else {
      if (value === panelState.currentFunctionInfo.version) {
        return
      }

      panelDispatch({
        type: panelActions.SET_CURRENT_FUNCTION_INFO_VERSION,
        payload: value
      })
    }

    panelDispatch({
      type: panelActions.SET_EDIT_MODE,
      payload: true
    })
  }

  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      currentFunctionInfo={panelState.currentFunctionInfo}
      editMode={panelState.editMode}
      editTitle={editTitle}
      handleFinishEdit={handleFinishEdit}
      handleFunctionInfoChange={handleFunctionInfoChange}
      match={match}
      methodOptions={functionData.methodOptions}
      openScheduleJob={openScheduleJob}
      panelDispatch={panelDispatch}
      setEditTitle={setEditTitle}
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
