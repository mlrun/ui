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
import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { FormInput, FormSelect, FormTextarea, FormCombobox } from 'igz-controls/components'

import { getValidationRules } from 'igz-controls/utils/validation.util'
import {
  dataInputInitialState,
  pathTips,
  pathPlaceholders,
  handleStoreInputPathChange,
  comboboxSelectList,
  isPathInputInvalid,
  generateProjectsList,
  generateComboboxMatchesList,
  generateArtifactsList,
  generateArtifactsReferencesList
} from '../../utils/combobox'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'
import { isNil, pick, uniqBy } from 'lodash'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import artifactsAction from '../../actions/artifacts'
import featureStoreActions from '../../actions/featureStore'
import { OnChange } from 'react-final-form-listeners'
import projectAction from '../../actions/projects'
import { getFeatureReference } from '../../utils/resources'

const RegisterArtifactModalForm = ({ formState, showType, messageByKind, setFieldState }) => {
  const [dataInputState, setDataInputState] = useState(dataInputInitialState)
  const params = useParams()
  const dispatch = useDispatch()

  const kindOptions = useMemo(
    () => [
      {
        label: 'General',
        id: 'general'
      },
      {
        label: 'Chart',
        id: 'chart'
      },
      {
        label: 'Plot',
        id: 'plot'
      },
      {
        label: 'Table',
        id: 'table'
      }
    ],
    []
  )

  const handleOnChange = (selectValue, inputValue) => {
    if (isNil(inputValue)) {
      setFieldState('formState.values.target_path.path', { modified: false })
    }

    if (selectValue === MLRUN_STORAGE_INPUT_PATH_SCHEME && !isNil(inputValue)) {
      handleStoreInputPathChange(dataInputState, setDataInputState, inputValue)
    }
  }

  const validatePath = allValues => {
    const { pathType, value } = pick(allValues.target_path.fieldInfo, ['pathType', 'value'])

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
    if (formState.values.target_path.fieldInfo.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
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
    formState.values.target_path.fieldInfo.pathType,
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
    <div className="form">
      <div className="form-row">
        {messageByKind && (
          <div className="form-text">
            <span>{messageByKind}</span>
            <div>
              <p>
                All you need to do is enter the name of the artifact and the URL (e.g.
                s3://my-bucket/path).
              </p>
              <a
                href="https://docs.mlrun.org/en/latest/store/artifacts.html"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Read more
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="form-row">
        <div className="form-col-2">
          <FormInput
            label="Name"
            name="key"
            required
            tip="Artifact names in the same project must be unique"
            validationRules={getValidationRules('artifact.name')}
          />
        </div>
        {showType && (
          <div className="form-col-1">
            <FormSelect label="Type:" name="kind" options={kindOptions} />
          </div>
        )}
      </div>
      <div className="form-row">
        <FormCombobox
          density="dense"
          hideSearchInput={!dataInputState.inputStorePathTypeEntered}
          inputPlaceholder={
            pathPlaceholders[formState.values.target_path.fieldInfo?.pathType] ?? ''
          }
          invalidText={`Field must be in "${
            pathTips(dataInputState.storePathType)[formState.values.target_path.fieldInfo?.pathType]
          }" format`}
          maxSuggestedMatches={
            formState.values.target_path.fieldInfo.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
              ? 3
              : 2
          }
          name="target_path.path"
          onChange={(selectValue, inputValue) => handleOnChange(selectValue, inputValue)}
          required
          selectOptions={comboboxSelectList}
          selectPlaceholder="Path Scheme"
          suggestionList={
            formState.values.target_path.fieldInfo.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
              ? dataInputState.comboboxMatches
              : []
          }
          validator={(fieldValue, allValues) => validatePath(allValues)}
        />
      </div>
      <div className="form-row">
        <FormTextarea label="Description" maxLength={500} name="description" />
      </div>
      <OnChange name="target_path.path">
        {value => {
          if (value.length !== 0) {
            formState.form.change('target_path.fieldInfo.value', value.replace(/.*:[/]{2,3}/g, ''))
            formState.form.change('target_path.fieldInfo.pathType', value.match(/^\w*:[/]{2,3}/)[0])
          }
        }}
      </OnChange>
      <OnChange name="target_path.fieldInfo.pathType">
        {(value, prevValue) => {
          if (prevValue === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
            setDataInputState(dataInputInitialState)
          }
        }}
      </OnChange>
    </div>
  )
}

RegisterArtifactModalForm.defaultProps = {
  showType: true,
  messageByKind: ''
}

RegisterArtifactModalForm.propTypes = {
  showType: PropTypes.bool,
  messageByKind: PropTypes.string
}

export default RegisterArtifactModalForm
