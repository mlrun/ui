import React, { useReducer, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { uniqBy } from 'lodash'

import JobsPanelDataInputsView from './JobsPanelDataInputsView'

import {
  initialState,
  inputsActions,
  jobsPanelDataInputsReducer
} from './jobsPanelDataInputsReducer'
import { panelActions } from '../JobsPanel/panelReducer'
import {
  generateComboboxMatchesList,
  handleAddItem,
  handleDelete,
  handleEdit,
  handleInputPathChange,
  handleInputPathTypeChange
} from './jobsPanelDataInputs.util'
import artifactsAction from '../../actions/artifacts'
import featureStoreActions from '../../actions/featureStore'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'
import { getFeatureReference, getParsedResource } from '../../utils/resources'
import {
  generateArtifactsList,
  generateArtifactsReferencesList,
  generateProjectsList
} from '../../utils/panelPathScheme'

const JobsPanelDataInputs = ({
  fetchArtifact,
  fetchArtifacts,
  fetchFeatureVector,
  fetchFeatureVectors,
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

  const getInputValue = useCallback(
    inputItem => {
      const inputItems = ['storePathType', 'project', 'projectItem']

      let value =
        inputsState.newInput.path?.[inputItem] ||
        inputsState.selectedDataInput.data.path.value.split('/')[
          inputItems.indexOf(inputItem)
        ]

      if (inputItem === 'projectItem') {
        value = getParsedResource(value)[0]
      }

      return value
    },
    [inputsState.newInput.path, inputsState.selectedDataInput.data.path.value]
  )

  useEffect(() => {
    if (
      inputsState.inputStorePathTypeEntered &&
      (inputsState.projects.length === 0 ||
        inputsState.newInput.path.project.length === 0 ||
        (!isEveryObjectValueEmpty(inputsState.selectedDataInput) &&
          inputsState.selectedDataInput.data.path.value.split('/')[1]
            ?.length === 0))
    ) {
      inputsDispatch({
        type: inputsActions.SET_PROJECTS,
        payload: generateProjectsList(
          projectStore.projects,
          match.params.projectName
        )
      })
    }
  }, [
    inputsState.inputStorePathTypeEntered,
    inputsState.newInput.path.project.length,
    inputsState.projects.length,
    inputsState.selectedDataInput,
    match.params.projectName,
    projectStore.projects
  ])

  useEffect(() => {
    const storePathType = getInputValue('storePathType')
    const projectName = getInputValue('project')

    if (inputsState.inputProjectPathEntered && storePathType && projectName) {
      if (storePathType === 'artifacts' && inputsState.artifacts.length === 0) {
        fetchArtifacts(projectName).then(artifacts => {
          inputsDispatch({
            type: inputsActions.SET_ARTIFACTS,
            payload: generateArtifactsList(artifacts)
          })
        })
      } else if (
        storePathType === 'feature-vectors' &&
        inputsState.featureVectors.length === 0
      ) {
        fetchFeatureVectors(projectName).then(featureVectors => {
          const featureVectorsList = uniqBy(featureVectors, 'metadata.name')
            .map(featureVector => ({
              label: featureVector.metadata.name,
              id: featureVector.metadata.name
            }))
            .sort((prevFeatureVector, nextFeatureVector) =>
              prevFeatureVector.id.localeCompare(nextFeatureVector.id)
            )

          inputsDispatch({
            type: inputsActions.SET_FEATURE_VECTORS,
            payload: featureVectorsList
          })
        })
      }
    }
  }, [
    fetchArtifacts,
    fetchFeatureVectors,
    getInputValue,
    inputsState.artifacts.length,
    inputsState.featureVectors.length,
    inputsState.inputProjectPathEntered
  ])

  useEffect(() => {
    const storePathType = getInputValue('storePathType')
    const projectName = getInputValue('project')
    const projectItem = getInputValue('projectItem')

    if (
      inputsState.inputProjectItemPathEntered &&
      storePathType &&
      projectName &&
      projectItem
    ) {
      if (
        storePathType === 'artifacts' &&
        inputsState.artifactsReferences.length === 0
      ) {
        fetchArtifact(projectName, projectItem).then(artifacts => {
          if (artifacts.length > 0 && artifacts[0].data) {
            inputsDispatch({
              type: inputsActions.SET_ARTIFACTS_REFERENCES,
              payload: generateArtifactsReferencesList(artifacts[0].data)
            })
          }
        })
      } else if (
        storePathType === 'feature-vectors' &&
        inputsState.featureVectorsReferences.length === 0
      ) {
        fetchFeatureVector(projectName, projectItem).then(featureVectors => {
          const featureVectorsReferencesList = featureVectors
            .map(featureVector => {
              let featureVectorReference = getFeatureReference(
                featureVector.metadata
              )

              return {
                label: featureVectorReference,
                id: featureVectorReference,
                customDelimiter: featureVectorReference[0]
              }
            })
            .filter(featureVector => featureVector.label !== '')
            .sort((prevRef, nextRef) => prevRef.id.localeCompare(nextRef.id))

          inputsDispatch({
            type: inputsActions.SET_FEATURE_VECTORS_REFERENCES,
            payload: featureVectorsReferencesList
          })
        })
      }
    }
  }, [
    fetchArtifact,
    fetchArtifacts,
    fetchFeatureVector,
    fetchFeatureVectors,
    getInputValue,
    inputsState.artifactsReferences.length,
    inputsState.featureVectorsReferences.length,
    inputsState.inputProjectItemPathEntered,
    inputsState.newInput.path,
    inputsState.selectedDataInput.data.path.value
  ])

  useEffect(() => {
    if (
      inputsState.newInput.path.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME ||
      inputsState.selectedDataInput.data.path.pathType ===
        MLRUN_STORAGE_INPUT_PATH_SCHEME
    ) {
      inputsDispatch({
        type: inputsActions.SET_COMBOBOX_MATCHES,
        payload: generateComboboxMatchesList(
          inputsState.artifacts,
          inputsState.artifactsReferences,
          inputsState.featureVectors,
          inputsState.featureVectorsReferences,
          inputsState.inputStorePathTypeEntered,
          inputsState.inputProjectPathEntered,
          inputsState.inputProjectItemPathEntered,
          inputsState.inputProjectItemReferencePathEntered,
          inputsState.newInput,
          inputsState.projects,
          match.params.projectName,
          inputsState.selectedDataInput.data.path
        )
      })
    }
  }, [
    inputsState.artifacts,
    inputsState.artifactsReferences,
    inputsState.featureVectors,
    inputsState.featureVectorsReferences,
    inputsState.inputProjectItemPathEntered,
    inputsState.inputProjectItemReferencePathEntered,
    inputsState.inputProjectPathEntered,
    inputsState.inputStorePathTypeEntered,
    inputsState.newInput,
    inputsState.projects,
    inputsState.selectedDataInput.data.path,
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
      inputsActions.SET_PATH_PLACEHOLDER,
      inputsState.newInputUrlPath,
      inputsActions.SET_NEW_INPUT_URL_PATH
    )
  }

  const handleEditItems = () => {
    handleEdit(
      inputs,
      panelState.tableData.dataInputs,
      inputsDispatch,
      panelDispatch,
      inputsActions.REMOVE_SELECTED_INPUT,
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
        inputsState.newInput.path.pathType ===
          MLRUN_STORAGE_INPUT_PATH_SCHEME ||
        inputsState.selectedDataInput.data.path.pathType ===
          MLRUN_STORAGE_INPUT_PATH_SCHEME
          ? inputsState.comboboxMatches
          : []
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

export default connect(projectStore => projectStore, {
  ...artifactsAction,
  ...featureStoreActions
})(JobsPanelDataInputs)
