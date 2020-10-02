import React, { useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { chain } from 'lodash'

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
  handleEdit,
  handleInputPathChange,
  handleInputPathTypeChange,
  S3_INPUT_PATH_TYPE
} from './jobsPanelDataInputs.util'

const JobsPanelDataInputs = ({
  inputs,
  match,
  panelDispatch,
  panelState,
  projectStore,
  setNewJobInputs
}) => {
  const [inputsState, inputsDispatch] = useReducer(
    jobsPanelDataInputsReducer,
    initialState
  )

  useEffect(() => {
    if (inputsState.newInput.path.pathType !== S3_INPUT_PATH_TYPE) {
      if (
        inputsState.projects.length === 0 ||
        inputsState.newInput.path.project.length === 0
      ) {
        const projectsList = projectStore.projects.map(project => ({
          label:
            project.name === match.params.projectName
              ? 'Current project'
              : project.name,
          id: project.name
        }))

        inputsDispatch({
          type: inputsActions.SET_PROJECTS,
          payload: projectsList
        })
      }

      if (
        inputsState.artifacts.length === 0 ||
        inputsState.newInput.path.artifact.length === 0
      ) {
        const artifactsList = chain(projectStore.projects)
          .map(project =>
            project?.artifacts
              ? project?.artifacts.map(artifact => ({
                  label: artifact.db_key,
                  id: artifact.db_key
                }))
              : []
          )
          .flatten()
          .value()

        inputsDispatch({
          type: inputsActions.SET_ARTIFACTS,
          payload: artifactsList
        })
      }
    }
  }, [
    inputsState.artifacts.length,
    inputsState.newInput.path,
    inputsState.projects.length,
    match.params.projectName,
    projectStore.projects
  ])

  useEffect(() => {
    if (inputsState.newInput.path.pathType !== S3_INPUT_PATH_TYPE) {
      let matches = []

      if (inputsState.newInputProjectPathEntered) {
        matches = inputsState.artifacts.filter(artifact =>
          artifact.id.startsWith(inputsState.newInput.path.artifact)
        )
      } else if (inputsState.newInput.path.project.length > 0) {
        matches = inputsState.projects.filter(project => {
          return project.id.startsWith(inputsState.newInput.path.project)
        })
      } else {
        matches = [...inputsState.projects]
      }

      inputsDispatch({
        type: inputsActions.SET_COMBOBOX_MATCHES,
        payload: matches
      })
    }
  }, [
    inputsState.artifacts,
    inputsState.newInput.path,
    inputsState.newInputProjectPathEntered,
    inputsState.projects
  ])

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

  const handlePathTypeChange = path => {
    handleInputPathTypeChange(
      inputsDispatch,
      inputsState.newInput,
      path.replace(/:\/\/.*$/g, '://'),
      inputsState.pathPlaceholder
    )
  }

  const handlePathChange = path => {
    handleInputPathChange(inputsDispatch, inputsState, path)
  }

  return (
    <JobsPanelDataInputsView
      comboboxMatchesList={
        inputsState.newInput.path.pathType === S3_INPUT_PATH_TYPE
          ? []
          : inputsState.comboboxMatches
      }
      handleAddNewItem={handleAddNewItem}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      handlePathChange={handlePathChange}
      handlePathTypeChange={handlePathTypeChange}
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

export default connect(projectStore => projectStore)(JobsPanelDataInputs)
