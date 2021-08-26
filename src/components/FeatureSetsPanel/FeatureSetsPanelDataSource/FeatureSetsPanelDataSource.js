import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { isNil } from 'lodash'
import PropTypes from 'prop-types'

import FeatureSetsPanelDataSourceView from './FeatureSetsPanelDataSourceView'

import featureStoreActions from '../../../actions/featureStore'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../../constants'
import artifactsAction from '../../../actions/artifacts'
import { getParsedResource } from '../../../utils/resources'
import {
  END_TIME,
  generateComboboxMatchesList,
  handleEndTimeOnBlur,
  handleStartTimeOnBlur,
  handleTimestampColumnOnBlur,
  isUrlInputValid,
  projectItemsPathTypes,
  START_TIME,
  TIME_FIELD
} from './featureSetsPanelDataSource.util'
import projectsAction from '../../../actions/projects'
import {
  generateArtifactsList,
  generateArtifactsReferencesList,
  generateProjectsList,
  pathPlaceholders
} from '../../../utils/panelPathScheme'

const FeatureSetsPanelDataSource = ({
  featureStore,
  fetchArtifact,
  fetchArtifacts,
  fetchProjects,
  project,
  setNewFeatureSetDataSourceEndTime,
  setNewFeatureSetDataSourceKind,
  setNewFeatureSetDataSourceParseDates,
  setNewFeatureSetDataSourceStartTime,
  setNewFeatureSetDataSourceTimestampColumn,
  setNewFeatureSetDataSourceUrl,
  setNewFeatureSetSchedule,
  setValidation,
  validation
}) => {
  const [data, setData] = useState({
    attributes: [],
    timeField: '',
    startTime: '',
    endTime: '',
    kind: 'csv',
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
  const [urlProjectItemTypeEntered, setUrlProjectItemTypeEntered] = useState(
    false
  )
  const [urlProjectPathEntered, setUrlProjectPathEntered] = useState(false)
  const [urlArtifactPathEntered, setUrlArtifactPathEntered] = useState(false)
  const [
    urlArtifactReferencePathEntered,
    setUrlArtifactReferencePathEntered
  ] = useState(false)

  useEffect(() => {
    if (
      data.url.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME &&
      urlProjectItemTypeEntered &&
      projects.length === 0
    ) {
      fetchProjects().then(projects => {
        setProjects(generateProjectsList(projects, project))
      })
    }
  }, [
    data.url.pathType,
    fetchProjects,
    project,
    projects.length,
    urlProjectItemTypeEntered
  ])

  useEffect(() => {
    if (
      urlProjectItemTypeEntered &&
      urlProjectPathEntered &&
      artifacts.length === 0
    ) {
      fetchArtifacts(data.url.project).then(artifacts => {
        if (artifacts?.length > 0) {
          setArtifacts(generateArtifactsList(artifacts))
        }
      })
    }
  }, [
    artifacts.length,
    data.url.project,
    fetchArtifacts,
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
      fetchArtifact(data.url.project, data.url.artifact).then(artifacts => {
        if (artifacts.length > 0 && artifacts[0].data) {
          setArtifactsReferences(
            generateArtifactsReferencesList(artifacts[0].data)
          )
        }
      })
    }
  }, [
    artifactsReferences.length,
    data.url.artifact,
    data.url.project,
    fetchArtifact,
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
        placeholder: pathPlaceholders[path.replace(/:\/\/.*$/g, '://')] || '',
        path: '',
        pathType: path.replace(/:\/\/.*$/g, '://'),
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

      setUrlProjectItemTypeEntered(
        projectItemsPathTypes.some(type => type.id === pathItems[0]) &&
          typeof pathItems[1] === 'string'
      )
      setUrlProjectPathEntered(typeof pathItems[2] === 'string')
      setUrlArtifactPathEntered(
        artifacts.some(artifactItem => artifactItem.id === artifact)
      )
      setUrlArtifactReferencePathEntered(
        artifactsReferences.some(
          projectItemRef => projectItemRef.id === artifactReference
        )
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
          ? data.url.fullPath.replace(/:\/\/.*$/g, '')
          : data.url.path

      if (kind === 'csv') {
        setValidation(prevState => ({
          ...prevState,
          isTimeFieldValid: true,
          isStartTimeValid: true,
          isEndTimeValid: true,
          isUrlValid:
            url.length > 0
              ? isUrlInputValid(data.url.pathType, url, kind)
              : true
        }))
        setNewFeatureSetDataSourceTimestampColumn('')
        setNewFeatureSetDataSourceStartTime('')
        setNewFeatureSetDataSourceEndTime('')
      } else if (kind === 'parquet') {
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
        endTime: '',
        startTime: '',
        timeField: '',
        parseDates: ''
      }))
    },
    [
      data.url.fullPath,
      data.url.path,
      data.url.pathType,
      setNewFeatureSetDataSourceEndTime,
      setNewFeatureSetDataSourceKind,
      setNewFeatureSetDataSourceParseDates,
      setNewFeatureSetDataSourceStartTime,
      setNewFeatureSetDataSourceTimestampColumn,
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
      setData(state => ({
        ...state,
        url: {
          ...state.url,
          fullPath: `${selectValue}${inputValue}`
        }
      }))
    }
  }

  const handleFilterParametersOnBlur = (event, type) => {
    if (type === TIME_FIELD) {
      handleTimestampColumnOnBlur(
        event.target.value,
        featureStore.newFeatureSet.spec.source.time_field,
        type,
        setData,
        setValidation,
        setNewFeatureSetDataSourceTimestampColumn
      )
    } else if (type === START_TIME) {
      handleStartTimeOnBlur(
        data,
        event.target.value,
        featureStore.newFeatureSet.spec.source.start_time,
        type,
        setValidation,
        setData,
        setNewFeatureSetDataSourceStartTime
      )
    } else if (type === END_TIME) {
      handleEndTimeOnBlur(
        data,
        event.target.value,
        featureStore.newFeatureSet.spec.source.end_time,
        type,
        setData,
        setValidation,
        setNewFeatureSetDataSourceEndTime
      )
    }

    if (
      data.endTime.length === 0 &&
      data.startTime.length === 0 &&
      data.timeField.length === 0
    ) {
      setValidation(prevState => ({
        ...prevState,
        isTimeFieldValid: true,
        isStartTimeValid: true,
        isEndTimeValid: true
      }))
    } else if (data.timeField.length > 0 && data.startTime.length > 0) {
      setValidation(prevState => ({
        ...prevState,
        isEndTimeValid: true
      }))
    } else if (data.timeField.length > 0 && data.endTime.length > 0) {
      setValidation(prevState => ({
        ...prevState,
        isStartTimeValid: true
      }))
    }
  }

  return (
    <FeatureSetsPanelDataSourceView
      comboboxMatches={
        data.url.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
          ? comboboxMatches
          : []
      }
      data={data}
      featureStore={featureStore}
      handleFilterParametersOnBlur={handleFilterParametersOnBlur}
      handleKindOnChange={handleKindOnChange}
      handleUrlOnBlur={handleUrlOnBlur}
      handleUrlPathTypeChange={handleUrlPathTypeChange}
      handleUrlPathChange={handleUrlPathChange}
      setData={setData}
      setNewFeatureSetDataSourceParseDates={
        setNewFeatureSetDataSourceParseDates
      }
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
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(
  (featureStore, projectStore) => ({ ...featureStore, ...projectStore }),
  {
    ...featureStoreActions,
    ...artifactsAction,
    ...projectsAction
  }
)(FeatureSetsPanelDataSource)
