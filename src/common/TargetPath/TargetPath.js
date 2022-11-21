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
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { get, isNil, uniqBy } from 'lodash'
import { OnChange } from 'react-final-form-listeners'
import PropTypes from 'prop-types'

import { FormCombobox } from 'igz-controls/components'

import {
  generateArtifactsList,
  generateArtifactsReferencesList,
  generateComboboxMatchesList,
  generateProjectsList,
  getTargetPathOptions,
  handleStoreInputPathChange,
  isPathInputInvalid,
  pathPlaceholders,
  pathTips,
  targetPathInitialState
} from './targetPath.util'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'
import projectAction from '../../actions/projects'
import artifactsAction from '../../actions/artifacts'
import featureStoreActions from '../../actions/featureStore'
import { getFeatureReference } from '../../utils/resources'

const TargetPath = ({
  density,
  formState,
  formStateFieldInfo,
  hiddenSelectOptionsIds,
  inputDefaultValue,
  label,
  name,
  required,
  selectDefaultValue,
  selectPlaceholder,
  setFieldState
}) => {
  const [dataInputState, setDataInputState] = useState(targetPathInitialState)
  const params = useParams()
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
    const { pathType, value } = get(allValues, formStateFieldInfo)
    return isPathInputInvalid(pathType, value)
  }

  useEffect(() => {
    if (dataInputState.inputStorePathTypeEntered && dataInputState.projects.length === 0) {
      dispatch(projectAction.fetchProjectsNames()).then(result => {
        setDataInputState(prev => ({
          ...prev,
          projects: generateProjectsList(result, params.projectName)
        }))
      })
    }
  }, [
    dataInputState.inputStorePathTypeEntered,
    dataInputState.projects.length,
    dispatch,
    params.projectName,
    setDataInputState
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
          dataInputState.storePathType,
          dispatch
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
    dispatch,
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
      if (dataInputState.storePathType === 'artifacts' && dataInputState.artifacts.length === 0) {
        dispatch(artifactsAction.fetchArtifacts(dataInputState.project)).then(artifacts => {
          setDataInputState(prev => ({
            ...prev,
            artifacts: generateArtifactsList(artifacts)
          }))
        })
      } else if (
        dataInputState.storePathType === 'feature-vectors' &&
        dataInputState.featureVectors.length === 0
      ) {
        dispatch(featureStoreActions.fetchFeatureVectors(dataInputState.project)).then(
          featureVectors => {
            const featureVectorsList = uniqBy(featureVectors, 'metadata.name')
              .map(featureVector => ({
                label: featureVector.metadata.name,
                id: featureVector.metadata.name
              }))
              .sort((prevFeatureVector, nextFeatureVector) =>
                prevFeatureVector.id.localeCompare(nextFeatureVector.id)
              )

            setDataInputState(prev => ({
              ...prev,
              featureVectors: featureVectorsList
            }))
          }
        )
      }
    }
  }, [
    dataInputState.artifacts.length,
    dataInputState.featureVectors.length,
    dataInputState.inputProjectPathEntered,
    dataInputState.project,
    dataInputState.storePathType,
    dispatch,
    setDataInputState
  ])

  useEffect(() => {
    const storePathType = dataInputState.storePathType
    const projectName = dataInputState.project
    const projectItem = dataInputState.projectItem

    if (dataInputState.inputProjectItemPathEntered && storePathType && projectName && projectItem) {
      if (storePathType === 'artifacts' && dataInputState.artifactsReferences.length === 0) {
        dispatch(artifactsAction.fetchArtifact(projectName, projectItem)).then(artifacts => {
          if (artifacts.length > 0 && artifacts[0].data) {
            setDataInputState(prev => ({
              ...prev,
              artifactsReferences: generateArtifactsReferencesList(artifacts[0].data)
            }))
          }
        })
      } else if (
        storePathType === 'feature-vectors' &&
        dataInputState.featureVectorsReferences.length === 0
      ) {
        dispatch(featureStoreActions.fetchFeatureVector(projectName, projectItem)).then(
          featureVectors => {
            const featureVectorsReferencesList = featureVectors
              .map(featureVector => {
                let featureVectorReference = getFeatureReference(featureVector.metadata)

                return {
                  label: featureVectorReference,
                  id: featureVectorReference,
                  customDelimiter: featureVectorReference[0]
                }
              })
              .filter(featureVector => featureVector.label !== '')
              .sort((prevRef, nextRef) => prevRef.id.localeCompare(nextRef.id))

            setDataInputState(prev => ({
              ...prev,
              featureVectorsReferences: featureVectorsReferencesList
            }))
          }
        )
      }
    }
  }, [
    dataInputState.artifactsReferences.length,
    dataInputState.featureVectorsReferences.length,
    dataInputState.inputProjectItemPathEntered,
    dataInputState.project,
    dataInputState.projectItem,
    dataInputState.storePathType,
    dispatch,
    setDataInputState
  ])

  return (
    <>
      <FormCombobox
        density={density}
        hideSearchInput={!dataInputState.inputStorePathTypeEntered}
        inputDefaultValue={inputDefaultValue}
        inputPlaceholder={
          pathPlaceholders[get(formState.values, `${formStateFieldInfo}.pathType`)] ?? ''
        }
        invalidText={`Field must be in "${
          pathTips(dataInputState.storePathType)[
            get(formState.values, `${formStateFieldInfo}.pathType`)
          ]
        }" format`}
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
      <OnChange name={name}>
        {value => {
          if (value.length !== 0) {
            formState.form.change(`${formStateFieldInfo}.value`, value.replace(/.*:[/]{2,3}/g, ''))
            formState.form.change(`${formStateFieldInfo}.pathType`, value.match(/^\w*:[/]{2,3}/)[0])
          }
        }}
      </OnChange>
      <OnChange name={`${formStateFieldInfo}.pathType`}>
        {(value, prevValue) => {
          if (prevValue === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
            setDataInputState(targetPathInitialState)
          }
        }}
      </OnChange>
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
  required: PropTypes.bool,
  selectDefaultValue: PropTypes.string,
  selectPlaceholder: PropTypes.string,
  setFieldState: PropTypes.func.isRequired
}

export default TargetPath
