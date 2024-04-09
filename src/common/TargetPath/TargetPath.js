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
import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { get, isNil } from 'lodash'
import PropTypes from 'prop-types'

import { FormCombobox } from 'igz-controls/components'
import FormOnChange from '../FormOnChange/FormOnChange'

import {
  generateComboboxMatchesList,
  getArtifact,
  getArtifacts,
  getFeatureVector,
  getFeatureVectors,
  getProjectsNames,
  getTargetPathInvalidText,
  getTargetPathOptions,
  handleStoreInputPathChange,
  isPathInputInvalid,
  pathPlaceholders,
  targetPathInitialState
} from './targetPath.util'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'

const TargetPath = ({
  density,
  formState,
  formStateFieldInfo,
  hiddenSelectOptionsIds,
  inputDefaultValue,
  label,
  name,
  params,
  required,
  selectDefaultValue,
  selectPlaceholder,
  setFieldState
}) => {
  const [dataInputState, setDataInputState] = useState(targetPathInitialState)
  const dispatch = useDispatch()

  const handleOnChange = (selectValue, inputValue) => {
    if (isNil(inputValue)) {
      setFieldState(get(formState.values, name), { modified: false })
    }

    if (selectValue === MLRUN_STORAGE_INPUT_PATH_SCHEME && !isNil(inputValue)) {
      handleStoreInputPathChange(dataInputState, setDataInputState, inputValue)
    }
  }

  const validatePath = allValues => {
    if (get(allValues, formStateFieldInfo)) {
      const { pathType, value } = get(allValues, formStateFieldInfo)

      return isPathInputInvalid(pathType, value)
    }
  }

  const handleGetProjectsNames = useCallback(() => {
    getProjectsNames(dispatch, setDataInputState, params.projectName)
  }, [dispatch, params.projectName])

  const handleGetArtifacts = useCallback(() => {
    getArtifacts(dispatch, dataInputState.project, dataInputState.storePathType, setDataInputState)
  }, [dataInputState.project, dataInputState.storePathType, dispatch])

  const handleGetFeatureVectors = useCallback(() => {
    getFeatureVectors(dispatch, dataInputState.project, setDataInputState)
  }, [dataInputState.project, dispatch])

  const handleGetArtifact = useCallback(() => {
    getArtifact(dispatch, dataInputState.project, dataInputState.projectItem, setDataInputState)
  }, [dataInputState.project, dataInputState.projectItem, dispatch])

  const handleGetFeatureVector = useCallback(() => {
    getFeatureVector(
      dispatch,
      dataInputState.project,
      dataInputState.projectItem,
      setDataInputState
    )
  }, [dataInputState.project, dataInputState.projectItem, dispatch])

  useEffect(() => {
    if (dataInputState.inputStorePathTypeEntered && dataInputState.projects.length === 0) {
      handleGetProjectsNames()
    }
  }, [
    dataInputState.inputStorePathTypeEntered,
    dataInputState.projects.length,
    dispatch,
    handleGetProjectsNames
  ])

  useEffect(() => {
    if (
      get(formState.values, `${formStateFieldInfo}.pathType`) === MLRUN_STORAGE_INPUT_PATH_SCHEME
    ) {
      setDataInputState(prev => ({
        ...prev,
        comboboxMatches: generateComboboxMatchesList(
          dataInputState.artifacts,
          dataInputState.artifactsReferences,
          dataInputState.featureVectors,
          dataInputState.featureVectorsReferences,
          dataInputState.inputProjectItemPathEntered,
          dataInputState.inputProjectItemReferencePathEntered,
          dataInputState.inputProjectPathEntered,
          dataInputState.inputStorePathTypeEntered,
          dataInputState.project,
          dataInputState.projectItem,
          dataInputState.projectItemReference,
          dataInputState.projects,
          dataInputState.storePathType
        )
      }))
    }
  }, [
    dataInputState.artifacts,
    dataInputState.artifactsReferences,
    dataInputState.featureVectors,
    dataInputState.featureVectorsReferences,
    dataInputState.inputProjectItemPathEntered,
    dataInputState.inputProjectItemReferencePathEntered,
    dataInputState.inputProjectPathEntered,
    dataInputState.inputStorePathTypeEntered,
    dataInputState.project,
    dataInputState.projectItem,
    dataInputState.projectItemReference,
    dataInputState.projects,
    dataInputState.storePathType,
    formState.values,
    formStateFieldInfo,
    setDataInputState
  ])

  useEffect(() => {
    if (
      dataInputState.inputProjectPathEntered &&
      dataInputState.storePathType &&
      dataInputState.project
    ) {
      if (
        dataInputState.storePathType !== 'feature-vectors' &&
        dataInputState.artifacts.length === 0
      ) {
        handleGetArtifacts()
      } else if (
        dataInputState.storePathType === 'feature-vectors' &&
        dataInputState.featureVectors.length === 0
      ) {
        handleGetFeatureVectors()
      }
    }
  }, [
    dataInputState.artifacts.length,
    dataInputState.featureVectors.length,
    dataInputState.inputProjectPathEntered,
    dataInputState.project,
    dataInputState.storePathType,
    handleGetArtifacts,
    handleGetFeatureVectors
  ])

  useEffect(() => {
    const storePathType = dataInputState.storePathType

    if (
      dataInputState.inputProjectItemPathEntered &&
      storePathType &&
      dataInputState.project &&
      dataInputState.projectItem
    ) {
      if (storePathType !== 'feature-vectors' && dataInputState.artifactsReferences.length === 0) {
        handleGetArtifact()
      } else if (
        storePathType === 'feature-vectors' &&
        dataInputState.featureVectorsReferences.length === 0
      ) {
        handleGetFeatureVector()
      }
    }
  }, [
    dataInputState.artifactsReferences.length,
    dataInputState.featureVectorsReferences.length,
    dataInputState.inputProjectItemPathEntered,
    dataInputState.project,
    dataInputState.projectItem,
    dataInputState.storePathType,
    handleGetArtifact,
    handleGetFeatureVector
  ])

  const handlePathChange = useCallback(
    value => {
      if (value.length !== 0) {
        formState.form.change(`${formStateFieldInfo}.value`, value.replace(/[^:/]*:[/]{2,3}/, ''))
        formState.form.change(`${formStateFieldInfo}.pathType`, value.match(/^\w*:[/]{2,3}/)[0])
      }
    },
    [formState.form, formStateFieldInfo]
  )

  return (
    <>
      <FormCombobox
        density={density}
        hideSearchInput={!dataInputState.inputStorePathTypeEntered}
        inputDefaultValue={inputDefaultValue}
        inputPlaceholder={
          pathPlaceholders[get(formState.values, `${formStateFieldInfo}.pathType`)] ?? ''
        }
        invalidText={getTargetPathInvalidText(dataInputState, formState, formStateFieldInfo)}
        label={label}
        maxSuggestedMatches={
          get(formState.values, `${formStateFieldInfo}.pathType`) ===
          MLRUN_STORAGE_INPUT_PATH_SCHEME
            ? 3
            : 2
        }
        name={name}
        onChange={(selectValue, inputValue) => handleOnChange(selectValue, inputValue)}
        required={required}
        selectDefaultValue={getTargetPathOptions(hiddenSelectOptionsIds).find(
          option => option.id === selectDefaultValue
        )}
        selectOptions={getTargetPathOptions(hiddenSelectOptionsIds)}
        selectPlaceholder={selectPlaceholder}
        suggestionList={
          get(formState.values, `${formStateFieldInfo}.pathType`) ===
          MLRUN_STORAGE_INPUT_PATH_SCHEME
            ? dataInputState.comboboxMatches
            : []
        }
        validator={(fieldValue, allValues) => validatePath(allValues)}
      />
      <FormOnChange handler={handlePathChange} name={name} />
      <FormOnChange
        handler={(value, prevValue) => {
          if (prevValue === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
            setDataInputState(targetPathInitialState)
          }
        }}
        name={`${formStateFieldInfo}.pathType`}
      />
    </>
  )
}

TargetPath.defaultProps = {
  density: 'normal',
  hiddenSelectOptionsIds: [],
  inputDefaultValue: '',
  label: '',
  required: false,
  selectDefaultValue: '',
  selectPlaceholder: ''
}

TargetPath.propTypes = {
  density: PropTypes.oneOf(['dense', 'normal', 'medium', 'chunky']),
  formState: PropTypes.object.isRequired,
  formStateFieldInfo: PropTypes.string.isRequired,
  hiddenSelectOptionsIds: PropTypes.arrayOf(PropTypes.string),
  inputDefaultValue: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  params: PropTypes.shape({}).isRequired,
  required: PropTypes.bool,
  selectDefaultValue: PropTypes.string,
  selectPlaceholder: PropTypes.string,
  setFieldState: PropTypes.func.isRequired
}

export default TargetPath
