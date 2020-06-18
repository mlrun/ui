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
  secrets,
  setNewJobEnvironmentVariables,
  setNewJobSecrets
}) => {
  const [advancedState, advancedDispatch] = useReducer(
    jobsPanelAdvancedReducer,
    initialState
  )

  const handleAddNewItem = isEnv => {
    handleAddItem(
      advancedDispatch,
      isEnv
        ? panelState.tableData.environmentVariables
        : panelState.tableData.secrets,
      isEnv,
      isEnv ? advancedState.newEnvironmentVariable : advancedState.newSecret,
      isEnv ? environmentVariables : secrets,
      panelDispatch,
      isEnv
        ? panelState.previousPanelData.tableData.environmentVariables
        : panelState.previousPanelData.tableData.secrets,
      isEnv
        ? advancedActions.REMOVE_NEW_ENVIRONMENT_VARIABLE_DATA
        : advancedActions.REMOVE_NEW_SECRET_DATA,
      isEnv
        ? advancedActions.SET_ADD_NEW_ENVIRONMENT_VARIABLE
        : advancedActions.SET_ADD_NEW_SECRET,
      isEnv
        ? panelActions.SET_TABLE_DATA_ENVIRONMENT_VARIABLES
        : panelActions.SET_TABLE_DATA_SECRETS,
      panelActions.SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES,
      isEnv ? setNewJobEnvironmentVariables : setNewJobSecrets
    )
  }

  const handleEditItems = isEnv => {
    if (isEnv) {
      handleEdit(
        environmentVariables,
        panelState.tableData.environmentVariables,
        advancedDispatch,
        isEnv,
        panelDispatch,
        advancedActions.SET_SELECTED_ENVIRONMENT_VARIABLE,
        advancedState.selectedEnvironmentVariable.data,
        setNewJobEnvironmentVariables,
        panelActions.SET_TABLE_DATA_ENVIRONMENT_VARIABLES,
        panelActions.SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES
      )
    } else {
      handleEdit(
        secrets,
        panelState.tableData.secrets,
        advancedDispatch,
        isEnv,
        panelDispatch,
        advancedActions.SET_SELECTED_ENVIRONMENT_VARIABLE,
        advancedState.selectedSecret.data,
        setNewJobSecrets,
        panelActions.SET_TABLE_DATA_SECRETS,
        panelActions.SET_PREVIOUS_PANEL_DATA_SECRETS
      )
    }
  }

  const handleDeleteItems = (isEnv, item) => {
    if (isEnv) {
      handleDelete(
        environmentVariables,
        panelState.tableData.environmentVariables,
        isEnv,
        panelDispatch,
        panelState.previousPanelData.tableData.environmentVariables,
        item,
        setNewJobEnvironmentVariables,
        panelActions.SET_TABLE_DATA_ENVIRONMENT_VARIABLES,
        panelActions.SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES
      )
    } else {
      handleDelete(
        secrets,
        panelState.tableData.secrets,
        isEnv,
        panelDispatch,
        panelState.previousPanelData.tableData.secrets,
        item,
        setNewJobSecrets,
        panelActions.SET_TABLE_DATA_SECRETS,
        panelActions.SET_PREVIOUS_PANEL_DATA_SECRETS
      )
    }
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
