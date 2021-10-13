import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import { panelActions } from '../../components/JobsPanel/panelReducer'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  closePanel,
  editModeEnabled,
  functionData,
  isNameValid,
  openScheduleJob,
  panelDispatch,
  panelState,
  setNameValid,
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
      panelDispatch({
        type: panelActions.SET_ACCESS_KEY,
        payload: panelState.previousPanelData.access_key
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
      editModeEnabled={editModeEnabled}
      editMode={panelState.editMode}
      editTitle={editTitle}
      handleFinishEdit={handleFinishEdit}
      handleFunctionInfoChange={handleFunctionInfoChange}
      isNameValid={isNameValid}
      methodOptions={functionData.methodOptions}
      openScheduleJob={openScheduleJob}
      panelDispatch={panelDispatch}
      setEditTitle={setEditTitle}
      setNameValid={setNameValid}
      setOpenScheduleJob={setOpenScheduleJob}
      versionOptions={functionData.versionOptions}
    />
  )
}

JobsPanelTitle.defaultProps = {
  editModeEnabled: true
}

JobsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  editModeEnabled: PropTypes.bool,
  functionData: PropTypes.shape({}).isRequired,
  isNameValid: PropTypes.bool.isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setNameValid: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelTitle
