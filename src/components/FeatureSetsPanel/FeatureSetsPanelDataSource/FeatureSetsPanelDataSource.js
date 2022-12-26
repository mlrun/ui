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
import React, { useCallback, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { isNil } from 'lodash'
import PropTypes from 'prop-types'

import FeatureSetsPanelDataSourceView from './FeatureSetsPanelDataSourceView'

import featureStoreActions from '../../../actions/featureStore'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../../constants'
import { getParsedResource } from '../../../utils/resources'
import {
  CSV,
  generateComboboxMatchesList,
  isUrlInputValid,
  PARQUET
} from './featureSetsPanelDataSource.util'
import projectsAction from '../../../actions/projects'
import {
  generateArtifactsList,
  generateArtifactsReferencesList,
  generateProjectsList,
  pathPlaceholders
} from '../../../utils/panelPathScheme'
import { fetchArtifact, fetchArtifacts } from '../../../reducers/artifactsReducer'

const FeatureSetsPanelDataSource = ({
  featureStore,
  fetchProjectsNames,
  project,
  setDisableButtons,
  setNewFeatureSetDataSourceKind,
  setNewFeatureSetDataSourceParseDates,
  setNewFeatureSetDataSourceUrl,
  setNewFeatureSetSchedule,
  setValidation,
  validation
}) => {
  const [data, setData] = useState({
    attributes: [],
    kind: CSV,
    parseDates: '',
    url: {
      pathType: '',
      projectItemType: '',
      project: '',
      artifact: '',
      placeholder: '',
      path: '',
      artifactReference: '',
      fullPath: ''
    },
    schedule: ''
  })
  const [showSchedule, setShowSchedule] = useState(false)
  const [comboboxMatches, setComboboxMatches] = useState([])
  const [projects, setProjects] = useState([])
  const [artifacts, setArtifacts] = useState([])
  const [artifactsReferences, setArtifactsReferences] = useState([])
  const [urlProjectItemTypeEntered, setUrlProjectItemTypeEntered] = useState(false)
  const [urlProjectPathEntered, setUrlProjectPathEntered] = useState(false)
  const [urlArtifactPathEntered, setUrlArtifactPathEntered] = useState(false)
  const [urlArtifactReferencePathEntered, setUrlArtifactReferencePathEntered] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (
      data.url.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME &&
      urlProjectItemTypeEntered &&
      projects.length === 0
    ) {
      fetchProjectsNames().then(projects => {
        setProjects(generateProjectsList(projects, project))
      })
    }
  }, [data.url.pathType, fetchProjectsNames, project, projects.length, urlProjectItemTypeEntered])

  useEffect(() => {
    if (urlProjectItemTypeEntered && urlProjectPathEntered && artifacts.length === 0) {
      dispatch(fetchArtifacts({ project: data.url.project }))
        .unwrap()
        .then(artifacts => {
          if (artifacts?.length > 0) {
            setArtifacts(generateArtifactsList(artifacts))
          }
        })
    }
  }, [
    artifacts.length,
    data.url.project,
    dispatch,
    urlProjectItemTypeEntered,
    urlProjectPathEntered
  ])

  useEffect(() => {
    if (
      urlProjectItemTypeEntered &&
      urlProjectPathEntered &&
      urlArtifactPathEntered &&
      artifactsReferences.length === 0
    ) {
      dispatch(fetchArtifact({ project: data.url.project, artifact: data.url.artifact }))
        .unwrap()
        .then(artifacts => {
          if (artifacts.length > 0 && artifacts[0].data) {
            setArtifactsReferences(generateArtifactsReferencesList(artifacts[0].data))
          }
        })
    }
  }, [
    artifactsReferences.length,
    data.url.artifact,
    data.url.project,
    dispatch,
    urlArtifactPathEntered,
    urlProjectItemTypeEntered,
    urlProjectPathEntered
  ])

  useEffect(() => {
    if (data.url.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
      setComboboxMatches(
        generateComboboxMatchesList(
          data.url,
          artifacts,
          projects,
          project,
          urlProjectPathEntered,
          urlArtifactPathEntered,
          urlArtifactReferencePathEntered,
          artifactsReferences,
          urlProjectItemTypeEntered
        )
      )
    }
  }, [
    artifacts,
    artifactsReferences,
    data.url,
    project,
    projects,
    urlArtifactPathEntered,
    urlArtifactReferencePathEntered,
    urlProjectItemTypeEntered,
    urlProjectPathEntered
  ])

  const handleUrlPathTypeChange = path => {
    setData(state => ({
      ...state,
      url: {
        ...state.url,
        placeholder: pathPlaceholders[path] || '',
        path: '',
        pathType: path,
        project: '',
        artifact: '',
        artifactReference: '',
        projectItemType: 'artifacts'
      }
    }))
    setValidation(state => ({
      ...state,
      isUrlValid: true
    }))
    setUrlProjectItemTypeEntered(false)
    setUrlProjectPathEntered(false)
    setUrlArtifactPathEntered(false)
    setUrlArtifactReferencePathEntered(false)
    setNewFeatureSetDataSourceUrl('')
  }

  const handleUrlPathChange = path => {
    if (data.url.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
      const pathItems = path.split('/')
      const [artifact, artifactReference] = getParsedResource(pathItems[2])

      if (isNil(pathItems[2]) && artifacts.length > 0) {
        setArtifacts([])
      }

      if (!artifactReference && artifactsReferences.length > 0) {
        setArtifactsReferences([])
      }

      setData(state => ({
        ...state,
        url: {
          ...state.url,
          projectItemType: pathItems[0],
          project: pathItems[1] ?? '',
          artifact: artifact ?? '',
          artifactReference: artifactReference ?? ''
        }
      }))
      setUrlProjectItemTypeEntered(typeof pathItems[1] === 'string')
      setUrlProjectPathEntered(typeof pathItems[2] === 'string')
      setUrlArtifactPathEntered(artifacts.some(artifactItem => artifactItem.id === artifact))
      setUrlArtifactReferencePathEntered(
        artifactsReferences.some(projectItemRef => projectItemRef.id === artifactReference)
      )
    } else {
      setData(state => ({
        ...state,
        url: {
          ...state.url,
          path
        }
      }))
    }
  }

  const handleKindOnChange = useCallback(
    kind => {
      const url =
        data.url.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
          ? data.url.fullPath.replace(/.*:\/\//g, '')
          : data.url.path

      if (kind === CSV) {
        setValidation(prevState => ({
          ...prevState,
          isUrlValid: url.length > 0 ? isUrlInputValid(data.url.pathType, url, kind) : true
        }))
      } else if (kind === PARQUET) {
        setNewFeatureSetDataSourceParseDates('')
        setValidation(state => ({
          ...state,
          isUrlValid: true
        }))
      }

      setNewFeatureSetDataSourceKind(kind)
      setData(state => ({
        ...state,
        kind,
        parseDates: ''
      }))
    },
    [
      data.url.fullPath,
      data.url.path,
      data.url.pathType,
      setNewFeatureSetDataSourceKind,
      setNewFeatureSetDataSourceParseDates,
      setValidation
    ]
  )

  const handleUrlOnBlur = (selectValue, inputValue) => {
    if (!isUrlInputValid(selectValue, inputValue, data.kind)) {
      setValidation(prevState => ({
        ...prevState,
        isUrlValid: false
      }))
    } else {
      if (!validation.isUrlValid) {
        setValidation(prevState => ({
          ...prevState,
          isUrlValid: true
        }))
      }

      setNewFeatureSetDataSourceUrl(`${selectValue}${inputValue}`)
    }

    setData(state => ({
      ...state,
      url: {
        ...state.url,
        fullPath: `${selectValue}${inputValue}`
      }
    }))
    setDisableButtons(state => ({
      ...state,
      isUrlEditModeClosed: true
    }))
  }

  const handleUrlOnFocus = () => {
    setDisableButtons(state => ({
      ...state,
      isUrlEditModeClosed: false
    }))
  }

  return (
    <FeatureSetsPanelDataSourceView
      comboboxMatches={data.url.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME ? comboboxMatches : []}
      data={data}
      featureStore={featureStore}
      handleKindOnChange={handleKindOnChange}
      handleUrlOnBlur={handleUrlOnBlur}
      handleUrlOnFocus={handleUrlOnFocus}
      handleUrlPathTypeChange={handleUrlPathTypeChange}
      handleUrlPathChange={handleUrlPathChange}
      setData={setData}
      setNewFeatureSetDataSourceParseDates={setNewFeatureSetDataSourceParseDates}
      setShowSchedule={setShowSchedule}
      setValidation={setValidation}
      showSchedule={showSchedule}
      setNewFeatureSetSchedule={setNewFeatureSetSchedule}
      urlProjectItemTypeEntered={urlProjectItemTypeEntered}
      validation={validation}
    />
  )
}

FeatureSetsPanelDataSource.propTypes = {
  project: PropTypes.string.isRequired,
  setDisableButtons: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect((featureStore, projectStore) => ({ ...featureStore, ...projectStore }), {
  ...featureStoreActions,
  ...projectsAction
})(FeatureSetsPanelDataSource)
