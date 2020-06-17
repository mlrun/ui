import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

import JobsPanelAdvancedView from './JobsPanelAdvancedView'

import {
  initialState,
  advancedActions,
  jobsPanelAdvancedReducer
} from './jobsPanelAdvancedReducer'
import { panelActions } from '../JobsPanel/panelReducer'
import {
  handleAddItem,
  handleDelete,
  handleEdit
} from './jobsPanelAdvanced.util'

const JobsPanelAdvanced = ({
  environmentVariables,
  match,
  panelDispatch,
  panelState,
  setNewJobEnvironmentVariables
}) => {
  const [advancedState, advancedDispatch] = useReducer(
    jobsPanelAdvancedReducer,
    initialState
  )

  const handleAddNewItem = () => {
    handleAddItem(
      panelState.tableData.environmentVariables,
      advancedDispatch,
      advancedState.newEnvironmentVariable,
      environmentVariables,
      panelDispatch,
      panelState.previousPanelData.tableData.environmentVariables,
      advancedActions.REMOVE_NEW_ENVIRONMENT_VARIABLE_DATA,
      advancedActions.SET_ADD_NEW_ENVIRONMENT_VARIABLE,
      panelActions.SET_TABLE_DATA_ENVIRONMENT_VARIABLES,
      panelActions.SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES,
      setNewJobEnvironmentVariables
    )
  }

  const handleEditItems = isEnv => {
    if (isEnv) {
      handleEdit(
        environmentVariables,
        panelState.tableData.environmentVariables,
        advancedDispatch,
        true,
        panelDispatch,
        advancedActions.SET_SELECTED_ENVIRONMENT_VARIABLE,
        advancedState.selectedEnvironmentVariable.data,
        setNewJobEnvironmentVariables,
        panelActions.SET_TABLE_DATA_ENVIRONMENT_VARIABLES,
        panelActions.SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES
      )
    }
  }

  const handleDeleteItems = (isInput, item) => {
    handleDelete(
      environmentVariables,
      panelState.tableData.environmentVariables,
      panelDispatch,
      panelState.previousPanelData.tableData.environmentVariables,
      item,
      setNewJobEnvironmentVariables,
      panelActions.SET_TABLE_DATA_ENVIRONMENT_VARIABLES,
      panelActions.SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES
    )
  }

  return (
    <JobsPanelAdvancedView
      handleAddNewItem={handleAddNewItem}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      advancedState={advancedState}
      advancedDispatch={advancedDispatch}
      match={match}
      panelState={panelState}
    />
  )
}

JobsPanelAdvanced.propTypes = {
  environmentVariables: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setNewJobEnvironmentVariables: PropTypes.func.isRequired
}

export default JobsPanelAdvanced
