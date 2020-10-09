import React, { useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

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
import artifactsAction from '../../actions/artifacts'

const JobsPanelDataInputs = ({
  fetchArtifacts,
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
    }
  }, [
    inputsState.newInput.path.pathType,
    inputsState.newInput.path.project.length,
    inputsState.projects.length,
    match.params.projectName,
    projectStore.projects
  ])

  useEffect(() => {
    if (
      inputsState.artifacts.length === 0 &&
      inputsState.newInputProjectPathEntered
    ) {
      fetchArtifacts({ project: inputsState.newInput.path.project }).then(
        artifacts => {
          const artifactsList = artifacts
            .map(artifact => ({
              label: artifact.link_iteration
                ? artifact.link_iteration.db_key
                : artifact.key ?? '',
              id: artifact.link_iteration
                ? artifact.link_iteration.db_key
                : artifact.key ?? ''
            }))
            .filter(artifact => artifact.label !== '')

          inputsDispatch({
            type: inputsActions.SET_ARTIFACTS,
            payload: artifactsList
          })
        }
      )
    }
  }, [
    fetchArtifacts,
    inputsState.artifacts.length,
    inputsState.newInput.path.project,
    inputsState.newInputProjectPathEntered
  ])

  useEffect(() => {
    if (inputsState.newInput.path.pathType !== S3_INPUT_PATH_TYPE) {
      let matches = []

      if (inputsState.newInputProjectPathEntered) {
        matches = inputsState.artifacts.filter(artifact =>
          artifact.id.startsWith(inputsState.newInput.path.artifact)
        )
      } else if (
        inputsState.newInput.path.project.length > 0 &&
        inputsState.newInput.path.project !== match.params.projectName
      ) {
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
    inputsState.projects,
    match.params.projectName
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
      setNewJobInputs,
      inputsActions.SET_PATH_PLACEHOLDER
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
      inputsState.pathPlaceholder,
      inputsState.newInputDefaultPathProject,
      match.params.projectName
    )
  }

  const handlePathChange = path => {
    handleInputPathChange(inputsDispatch, inputsState, path)
  }

  return (
    <JobsPanelDataInputsView
      comboboxMatchesList={
        inputsState.newInput.path.pathType === S3_INPUT_PATH_TYPE ||
        inputsState.newInputArtifactPathEntered
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

export default connect(projectStore => projectStore, { ...artifactsAction })(
  JobsPanelDataInputs
)
