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
  secretSources,
  setNewJobEnvironmentVariables,
  setNewJobSecretSources
}) => {
  const [advancedState, advancedDispatch] = useReducer(
    jobsPanelAdvancedReducer,
    initialState
  )

  const handleAddNewItem = isEnv => {
    if (isEnv) {
      handleAddItem(
        advancedDispatch,
        panelState.tableData.environmentVariables,
        isEnv,
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
    } else {
      handleAddItem(
        advancedDispatch,
        panelState.tableData.secretSources,
        isEnv,
        advancedState.newSecret,
        secretSources,
        panelDispatch,
        panelState.previousPanelData.tableData.secretSources,
        advancedActions.REMOVE_NEW_SECRET_DATA,
        advancedActions.SET_ADD_NEW_SECRET,
        panelActions.SET_TABLE_DATA_SECRET_SOURCES,
        panelActions.SET_PREVIOUS_PANEL_DATA_SECRET_SOURCES,
        setNewJobSecretSources
      )
    }
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
        secretSources,
        panelState.tableData.secretSources,
        advancedDispatch,
        isEnv,
        panelDispatch,
        advancedActions.SET_SELECTED_ENVIRONMENT_VARIABLE,
        advancedState.selectedSecret.data,
        setNewJobSecretSources,
        panelActions.SET_TABLE_DATA_SECRET_SOURCES,
        panelActions.SET_PREVIOUS_PANEL_DATA_SECRET_SOURCES
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
        secretSources,
        panelState.tableData.secretSources,
        isEnv,
        panelDispatch,
        panelState.previousPanelData.tableData.secretSources,
        item,
        setNewJobSecretSources,
        panelActions.SET_TABLE_DATA_SECRET_SOURCES,
        panelActions.SET_PREVIOUS_PANEL_DATA_SECRET_SOURCES
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
  secretSources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setNewJobEnvironmentVariables: PropTypes.func.isRequired,
  setNewJobSecretSources: PropTypes.func.isRequired
}

export default JobsPanelAdvanced
