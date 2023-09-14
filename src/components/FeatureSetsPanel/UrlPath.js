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
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { isNil } from 'lodash'

import Combobox from '../../common/Combobox/Combobox'

import { ARTIFACT_OTHER_TYPE, DATASET_TYPE, MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'
import targetPath from '../../utils/parseTargetPath'
import { getParsedResource } from '../../utils/resources'
import {
  generateArtifactsList,
  generateArtifactsReferencesList,
  generateProjectsList,
  pathTips,
  pathPlaceholders
} from '../../utils/panelPathScheme'

import { generateComboboxMatchesList } from './UrlPath.utils'

import { fetchArtifact, fetchArtifacts } from '../../reducers/artifactsReducer'
import projectsAction from '../../actions/projects'

const UrlPath = ({
  comboboxSelectList,
  defaultPath,
  disabled,
  handleUrlOnBlur,
  handleUrlOnFocus,
  handleUrlSelectOnChange,
  invalid
}) => {
  const [urlData, setUrlData] = useState({
    pathType: '',
    projectItemType: '',
    project: '',
    artifact: '',
    placeholder: '',
    path: '',
    artifactReference: ''
  })
  const [comboboxMatches, setComboboxMatches] = useState([])
  const [projects, setProjects] = useState([])
  const [artifacts, setArtifacts] = useState([])
  const [artifactsReferences, setArtifactsReferences] = useState([])
  const [urlProjectItemTypeEntered, setUrlProjectItemTypeEntered] = useState(false)
  const [urlProjectPathEntered, setUrlProjectPathEntered] = useState(false)
  const [urlArtifactPathEntered, setUrlArtifactPathEntered] = useState(false)
  const [urlArtifactReferencePathEntered, setUrlArtifactReferencePathEntered] = useState(false)
  const [inputDefaultValue, setInputDefaultValue] = useState('')

  const dispatch = useDispatch()
  const { projectName: project } = useParams()

  useEffect(() => {
    if (
      defaultPath?.path.length > 0 &&
      urlData?.path.length === 0 &&
      inputDefaultValue.length === 0
    ) {
      const { schema, path } = targetPath(defaultPath.path)
      const selectDefaultValues = comboboxSelectList.find(option => option.id === `${schema}://`)

      setUrlData(state => ({ ...state, pathType: selectDefaultValues.id, path }))
      setInputDefaultValue(path)
    }
  }, [comboboxSelectList, defaultPath.path, inputDefaultValue, invalid, urlData.path])

  useEffect(() => {
    if (
      urlData.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME &&
      urlProjectItemTypeEntered &&
      projects.length === 0
    ) {
      dispatch(projectsAction.fetchProjectsNames()).then(projects => {
        setProjects(generateProjectsList(projects, project))
      })
    }
  }, [dispatch, urlData.pathType, project, projects.length, urlProjectItemTypeEntered])

  useEffect(() => {
    if (urlProjectItemTypeEntered && urlProjectPathEntered && artifacts.length === 0) {
      dispatch(
        fetchArtifacts({
          project: urlData.project,
          filters: null,
          config: {
            params: {
              category: urlData.projectItemType === 'artifacts' ? ARTIFACT_OTHER_TYPE : DATASET_TYPE
            }
          }
        })
      )
        .unwrap()
        .then(artifacts => {
          if (artifacts?.length > 0) {
            setArtifacts(generateArtifactsList(artifacts))
          }
        })
    }
  }, [
    artifacts.length,
    urlData.project,
    urlData.projectItemType,
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
      dispatch(fetchArtifact({ project: urlData.project, artifact: urlData.artifact }))
        .unwrap()
        .then(artifacts => {
          if (artifacts.length > 0 && artifacts[0].data) {
            setArtifactsReferences(generateArtifactsReferencesList(artifacts[0].data))
          }
        })
    }
  }, [
    artifactsReferences.length,
    urlData.artifact,
    urlData.project,
    dispatch,
    urlArtifactPathEntered,
    urlProjectItemTypeEntered,
    urlProjectPathEntered
  ])

  useEffect(() => {
    if (urlData.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
      setComboboxMatches(
        generateComboboxMatchesList(
          urlData,
          artifacts,
          projects,
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
    urlData,
    project,
    projects,
    urlArtifactPathEntered,
    urlArtifactReferencePathEntered,
    urlProjectItemTypeEntered,
    urlProjectPathEntered
  ])

  const generatedPathTips = useMemo(() => {
    const pathTipsList = pathTips(urlData.projectItemType)
    return pathTipsList[urlData.pathType]
      ? `Field must be in "${pathTipsList[urlData.pathType]}" format`
      : 'The field is invalid'
  }, [urlData.pathType, urlData.projectItemType])

  const handleUrlPathTypeChange = path => {
    setUrlData(state => ({
      ...state,
      placeholder: pathPlaceholders[path] || '',
      path: '',
      pathType: path,
      project: '',
      artifact: '',
      artifactReference: '',
      projectItemType: 'artifacts'
    }))

    setUrlProjectItemTypeEntered(false)
    setUrlProjectPathEntered(false)
    setUrlArtifactPathEntered(false)
    setUrlArtifactReferencePathEntered(false)

    handleUrlSelectOnChange && handleUrlSelectOnChange()
  }

  const handleUrlPathChange = path => {
    if (urlData.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME) {
      const pathItems = path.split('/')
      const [artifact, artifactReference] = getParsedResource(pathItems[2])

      if (isNil(pathItems[2]) && artifacts.length > 0) {
        setArtifacts([])
      }

      if (!artifactReference && artifactsReferences.length > 0) {
        setArtifactsReferences([])
      }

      setUrlData(state => ({
        ...state,
        projectItemType: pathItems[0],
        project: pathItems[1] ?? '',
        artifact: artifact ?? '',
        artifactReference: artifactReference ?? ''
      }))

      setUrlProjectItemTypeEntered(typeof pathItems[1] === 'string')
      setUrlProjectPathEntered(typeof pathItems[2] === 'string')
      setUrlArtifactPathEntered(artifacts.some(artifactItem => artifactItem.id === artifact))
      setUrlArtifactReferencePathEntered(
        artifactsReferences.some(projectItemRef => projectItemRef.id === artifactReference)
      )
    } else {
      setUrlData(state => ({
        ...state,
        path
      }))
    }
  }

  return (
    <Combobox
      comboboxClassName="url"
      disabled={disabled}
      hideSearchInput={!urlProjectItemTypeEntered}
      inputDefaultValue={
        urlData.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
          ? urlData.projectItemType
          : urlData.path
      }
      inputOnChange={handleUrlPathChange}
      inputPlaceholder={urlData.placeholder}
      invalid={invalid}
      invalidText={generatedPathTips}
      matches={urlData.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME ? comboboxMatches : []}
      maxSuggestedMatches={3}
      onBlur={(selectValue, inputValue) => handleUrlOnBlur({ selectValue, inputValue, urlData })}
      onFocus={handleUrlOnFocus}
      required
      requiredText="This field is required"
      selectDefaultValue={comboboxSelectList.find(option => option.id === urlData.pathType)}
      selectDropdownList={comboboxSelectList}
      selectOnChange={handleUrlPathTypeChange}
      selectPlaceholder="URL"
    />
  )
}

UrlPath.defaultProps = {
  defaultPath: {
    kind: '',
    name: '',
    partitioned: '',
    path: ''
  },
  disabled: false,
  handleUrlSelectOnChange: null,
  invalid: false
}

UrlPath.propTypes = {
  comboboxSelectList: PropTypes.array.isRequired,
  defaultPath: PropTypes.shape({
    kind: PropTypes.string,
    name: PropTypes.string,
    partitioned: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    path: PropTypes.string
  }),
  disabled: PropTypes.bool,
  handleUrlOnBlur: PropTypes.func.isRequired,
  handleUrlOnFocus: PropTypes.func.isRequired,
  handleUrlSelectOnChange: PropTypes.func,
  invalid: PropTypes.bool
}

export default UrlPath
