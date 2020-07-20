import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

import JobsPanelDataInputsView from './JobsPanelDataInputsView'

import {
  initialState,
  inputsActions,
  jobsPanelDataInputsReducer
} from './jobsPanelDataInputsReducer'
import { panelActions } from '../JobsPanel/panelReducer'
import {
  handleAddItem,
  handleDelete,
  handleEdit
} from './jobsPanelDataInputs.util'

const JobsPanelDataInputs = ({
  inputs,
  match,
  panelDispatch,
  panelState,
  setNewJobInputs
}) => {
  const [inputsState, inputsDispatch] = useReducer(
    jobsPanelDataInputsReducer,
    initialState
  )

  const handleAddNewItem = () => {
    handleAddItem(
      panelState.tableData.dataInputs,
      inputsDispatch,
      inputsState.newInput,
      inputs,
      panelDispatch,
      panelState.previousPanelData.tableData.dataInputs,
      inputsActions.REMOVE_NEW_INPUT_DATA,
      inputsActions.SET_ADD_NEW_INPUT,
      panelActions.SET_TABLE_DATA_INPUTS,
      panelActions.SET_PREVIOUS_PANEL_DATA_INPUTS,
      setNewJobInputs
    )
  }

  const handleEditItems = () => {
    handleEdit(
      inputs,
      panelState.tableData.dataInputs,
      inputsDispatch,
      inputsState.selectedDataInput.newDataInputName,
      panelDispatch,
      inputsActions.SET_SELECTED_INPUT,
      inputsState.selectedDataInput.data,
      setNewJobInputs,
      panelActions.SET_TABLE_DATA_INPUTS,
      panelActions.SET_PREVIOUS_PANEL_DATA_INPUTS
    )
  }

  const handleDeleteItems = item => {
    handleDelete(
      inputs,
      panelState.tableData.dataInputs,
      panelDispatch,
      panelState.previousPanelData.tableData.dataInputs,
      item,
      setNewJobInputs,
      panelActions.SET_TABLE_DATA_INPUTS,
      panelActions.SET_PREVIOUS_PANEL_DATA_INPUTS
    )
  }

  return (
    <JobsPanelDataInputsView
      handleAddNewItem={handleAddNewItem}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      inputsState={inputsState}
      inputsDispatch={inputsDispatch}
      match={match}
      panelDispatch={panelDispatch}
      panelState={panelState}
    />
  )
}

JobsPanelDataInputs.propTypes = {
  inputs: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setNewJobInputs: PropTypes.func.isRequired
}

export default JobsPanelDataInputs
