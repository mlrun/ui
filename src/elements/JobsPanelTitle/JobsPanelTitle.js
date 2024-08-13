/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import { panelActions } from '../../components/JobsPanel/panelReducer'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  closePanel,
  editModeEnabled = true,
  functionData,
  openScheduleJob,
  panelDispatch,
  panelState,
  setOpenScheduleJob,
  setValidation,
  validation
}) => {
  const [editTitle, setEditTitle] = useState(false)

  const handleFinishEdit = (event, cancelEdit) => {
    panelDispatch({
      type: panelActions.SET_EDIT_MODE,
      payload: false
    })

    if (
      panelState.currentFunctionInfo.method !== panelState.previousPanelData.titleInfo.method &&
      !cancelEdit
    ) {
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA,
        payload: {
          access_key: panelState.access_key,
          limits: panelState.limits,
          preemption_mode: panelState.preemption_mode,
          priority_class_name: panelState.priority_class_name,
          requests: panelState.requests,
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
          methodDescription: panelState.previousPanelData.titleInfo.methodDescription
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
      panelDispatch({
        type: panelActions.SET_PREEMPTION_MODE,
        payload: panelState.previousPanelData.preemption_mode
      })
      panelDispatch({
        type: panelActions.SET_PRIORITY_CLASS_NAME,
        payload: panelState.previousPanelData.priority_class_name
      })
      panelDispatch({
        type: panelActions.SET_LIMITS,
        payload: panelState.previousPanelData.limits
      })
      panelDispatch({
        type: panelActions.SET_REQUESTS,
        payload: panelState.previousPanelData.requests
      })
    }
  }

  const handleFunctionInfoChange = (value, isMethod) => {
    if (isMethod) {
      if (value === panelState.currentFunctionInfo.method) {
        return
      }

      const methodDescription = functionData.methodOptions.find(func => func.id === value)

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

  const setLabelsValidation = useCallback(
    value => {
      setValidation(state => ({ ...state, isLabelsValid: value }))
    },
    [setValidation]
  )

  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      currentFunctionInfo={panelState.currentFunctionInfo}
      editModeEnabled={editModeEnabled}
      editMode={panelState.editMode}
      editTitle={editTitle}
      handleFinishEdit={handleFinishEdit}
      handleFunctionInfoChange={handleFunctionInfoChange}
      methodOptions={functionData.methodOptions}
      openScheduleJob={openScheduleJob}
      panelDispatch={panelDispatch}
      setEditTitle={setEditTitle}
      setLabelsValidation={setLabelsValidation}
      setOpenScheduleJob={setOpenScheduleJob}
      setValidation={setValidation}
      versionOptions={functionData.versionOptions}
      validation={validation}
    />
  )
}

JobsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  editModeEnabled: PropTypes.bool,
  functionData: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default JobsPanelTitle
