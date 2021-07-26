import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { isNil } from 'lodash'
import PropTypes from 'prop-types'

import FeatureSetsPanelDataSourceView from './FeatureSetsPanelDataSourceView'

import featureStoreActions from '../../../actions/featureStore'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../../constants'
import artifactsAction from '../../../actions/artifacts'
import { getParsedResource } from '../../../utils/resources'
import {
  generateComboboxMatchesList,
  isUrlInputValid,
  projectItemsPathTypes
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
  isUrlValid,
  project,
  projectStore,
  setNewFeatureSetDataSourceAttributes,
  setNewFeatureSetDataSourceKey,
  setNewFeatureSetDataSourceKind,
  setNewFeatureSetDataSourceTime,
  setNewFeatureSetDataSourceUrl,
  setNewFeatureSetSchedule,
  setUrlValid
}) => {
  const [data, setData] = useState({
    kind: 'csv',
    url: {
      pathType: '',
      projectItemType: '',
      project: '',
      artifact: '',
      placeholder: '',
      path: '',
      artifactReference: ''
    },
    attributes: [],
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
      let projectsList = []

      if (projectStore.projects.length === 0) {
        fetchProjects().then(projects => {
          projectsList = projects
        })
      } else {
        projectsList = projectStore.projects
      }

      setProjects(generateProjectsList(projectsList, project))
    }
  }, [
    data.url.pathType,
    fetchProjects,
    project,
    projectStore.projects,
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
        if (artifacts.length > 0) {
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
        Boolean(projectItemsPathTypes.find(type => type.id === pathItems[0])) &&
          typeof pathItems[1] === 'string'
      )
      setUrlProjectPathEntered(typeof pathItems[2] === 'string')
      setUrlArtifactPathEntered(
        Boolean(artifacts.find(artifactItem => artifactItem.id === artifact))
      )
      setUrlArtifactReferencePathEntered(
        Boolean(
          artifactsReferences.find(
            projectItemRef => projectItemRef.id === artifactReference
          )
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

  const handleAddNewItem = attribute => {
    setNewFeatureSetDataSourceAttributes({
      ...featureStore.newFeatureSet.spec.source.attributes,
      [attribute.key]: attribute.value
    })
    setData(state => ({
      ...state,
      attributes: [...state.attributes, attribute]
    }))
  }

  const handleDeleteAttribute = (index, attribute) => {
    const storeAttributes = {
      ...featureStore.newFeatureSet.spec.source.attributes
    }

    delete storeAttributes[attribute.key]
    setNewFeatureSetDataSourceAttributes(storeAttributes)
    setData(state => ({
      ...state,
      attributes: state.attributes.filter(attr => attr.key !== attribute.key)
    }))
  }

  const handleEditAttribute = attribute => {
    const storeAttributes = {
      ...featureStore.newFeatureSet.spec.source.attributes
    }

    if (attribute.newKey) {
      delete storeAttributes[attribute.key]
      storeAttributes[attribute.newKey] = attribute.value
    } else {
      storeAttributes[attribute.key] = attribute.value
    }

    setNewFeatureSetDataSourceAttributes(storeAttributes)
    setData(state => ({
      ...state,
      attributes: state.attributes.map(attr => {
        if (attr.key === attribute.key) {
          attr.key = attribute.newKey ?? attribute.key
          attr.value = attribute.value
        }

        return attr
      })
    }))
  }

  const handleKindOnChange = kind => {
    setNewFeatureSetDataSourceKind(kind)
    setNewFeatureSetDataSourceAttributes(
      kind === 'parquet'
        ? {
            time_field: '',
            start_time: '',
            end_time: ''
          }
        : {}
    )
    setData(state => ({
      ...state,
      kind,
      attributes:
        kind === 'parquet'
          ? [
              {
                key: 'time_field',
                value: ''
              },
              {
                key: 'start_time',
                value: ''
              },
              {
                key: 'end_time',
                value: ''
              }
            ]
          : []
    }))
  }

  const handleUrlOnBlur = (selectValue, inputValue) => {
    if (!isUrlInputValid(selectValue, inputValue)) {
      setUrlValid(false)
    } else {
      const url =
        data.url.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
          ? `${data.url.pathType}${data.url.projectItemType}/${data.url.project}/${data.url.artifact}/${data.url.artifactReference}`
          : `${data.url.pathType}${data.url.path}`

      if (!isUrlValid) {
        setUrlValid(true)
      }

      setNewFeatureSetDataSourceUrl(url)
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
      handleAddNewItem={handleAddNewItem}
      handleDeleteAttribute={handleDeleteAttribute}
      handleEditAttribute={handleEditAttribute}
      handleKindOnChange={handleKindOnChange}
      handleUrlOnBlur={handleUrlOnBlur}
      handleUrlPathTypeChange={handleUrlPathTypeChange}
      handleUrlPathChange={handleUrlPathChange}
      isUrlValid={isUrlValid}
      setData={setData}
      setNewFeatureSetDataSourceAttributes={
        setNewFeatureSetDataSourceAttributes
      }
      setNewFeatureSetDataSourceKey={setNewFeatureSetDataSourceKey}
      setNewFeatureSetDataSourceKind={setNewFeatureSetDataSourceKind}
      setNewFeatureSetDataSourceTime={setNewFeatureSetDataSourceTime}
      setShowSchedule={setShowSchedule}
      showSchedule={showSchedule}
      setNewFeatureSetSchedule={setNewFeatureSetSchedule}
      urlProjectItemTypeEntered={urlProjectItemTypeEntered}
    />
  )
}

FeatureSetsPanelDataSource.propTypes = {
  isUrlValid: PropTypes.bool.isRequired,
  project: PropTypes.string.isRequired,
  setUrlValid: PropTypes.func.isRequired
}

export default connect(
  (featureStore, projectStore) => ({ ...featureStore, ...projectStore }),
  {
    ...featureStoreActions,
    ...artifactsAction,
    ...projectsAction
  }
)(FeatureSetsPanelDataSource)
