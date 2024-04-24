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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { isEmpty, isNil } from 'lodash'
import classNames from 'classnames'

import Combobox from '../../common/Combobox/Combobox'
import { Tooltip, TextTooltipTemplate, RoundedIcon } from 'igz-controls/components'

import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'
import targetPath from '../../utils/parseTargetPath'
import { getParsedResource } from '../../utils/resources'
import { pathTips, pathPlaceholders } from '../../utils/panelPathScheme'

import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark.svg'
import { ReactComponent as Close } from 'igz-controls/images/close.svg'

import './urlPath.scss'

import {
  generateComboboxMatchesList,
  getArtifact,
  getArtifacts,
  getProjectsNames,
  URL
} from './UrlPath.utils'

const UrlPath = ({
  comboboxSelectList,
  defaultPath,
  disabled,
  handleUrlInputOnChange,
  handleUrlOnApply,
  handleUrlOnBlur,
  handleUrlOnDiscard,
  handleUrlOnEditModeChange,
  handleUrlOnFocus,
  handleUrlSelectOnChange,
  invalid,
  previewClassName,
  withActionButtons
}) => {
  const [urlData, setUrlData] = useState({
    artifact: '',
    artifactReference: '',
    path: '',
    pathType: '',
    placeholder: '',
    project: '',
    projectItemType: ''
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
  const [editMode, setEditMode] = useState({
    isActive: isEmpty(defaultPath.path),
    savedUrlData: {
      artifact: '',
      artifactReference: '',
      path: '',
      pathType: '',
      placeholder: '',
      project: '',
      projectItemType: ''
    }
  })

  const dispatch = useDispatch()
  const { projectName: project } = useParams()

  useEffect(() => {
    if (
      defaultPath?.path.length > 0 &&
      urlData?.path.length === 0 &&
      inputDefaultValue.length === 0 &&
      !editMode.isActive
    ) {
      const { schema, path } = targetPath(defaultPath.path)
      const selectDefaultValues =
        comboboxSelectList.find(option => option.id === `${schema}://`) ?? comboboxSelectList[0]

      setUrlData(state => ({ ...state, pathType: selectDefaultValues.id, path }))
      setInputDefaultValue(path)
    }
  }, [
    comboboxSelectList,
    defaultPath.path,
    inputDefaultValue,
    invalid,
    urlData.path,
    editMode.isActive
  ])

  const handleGetProjectNames = useCallback(() => {
    getProjectsNames(dispatch, setProjects, project)
  }, [dispatch, project])

  const handleGetArtifacts = useCallback(() => {
    getArtifacts(dispatch, urlData.project, urlData.projectItemType, setArtifacts)
  }, [dispatch, urlData.project, urlData.projectItemType])

  const handleGetArtifact = useCallback(() => {
    getArtifact(dispatch, urlData.project, urlData.artifact, setArtifactsReferences)
  }, [dispatch, urlData.artifact, urlData.project])

  useEffect(() => {
    if (
      urlData.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME &&
      urlProjectItemTypeEntered &&
      projects.length === 0
    ) {
      handleGetProjectNames()
    }
  }, [handleGetProjectNames, projects.length, urlData.pathType, urlProjectItemTypeEntered])

  useEffect(() => {
    if (urlProjectItemTypeEntered && urlProjectPathEntered && artifacts.length === 0) {
      handleGetArtifacts()
    }
  }, [artifacts.length, handleGetArtifacts, urlProjectItemTypeEntered, urlProjectPathEntered])

  useEffect(() => {
    if (
      urlProjectItemTypeEntered &&
      urlProjectPathEntered &&
      urlArtifactPathEntered &&
      artifactsReferences.length === 0
    ) {
      handleGetArtifact()
    }
  }, [
    artifactsReferences.length,
    handleGetArtifact,
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

  useEffect(() => {
    withActionButtons && handleUrlOnEditModeChange(editMode.isActive)
  }, [editMode.isActive, withActionButtons, handleUrlOnEditModeChange])

  useEffect(() => {
    if (withActionButtons && invalid) {
      setEditMode(prevState => ({
        ...prevState,
        isActive: true
      }))
    }
  }, [invalid, withActionButtons, setEditMode])

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

    handleUrlSelectOnChange(path)
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
        path: path,
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
    handleUrlInputOnChange(path)
  }

  const handleApplyClick = () => {
    const isUrlValid = handleUrlOnApply({
      selectValue: urlData.pathType,
      inputValue: urlData.path,
      urlData
    })

    if (isUrlValid || isNil(isUrlValid)) {
      setEditMode(prevState => ({
        ...prevState,
        isActive: false
      }))
    }
  }

  const handleDiscardClick = () => {
    setUrlData(editMode.savedUrlData)
    setEditMode(prevState => ({
      ...prevState,
      isActive: false
    }))
    handleUrlOnDiscard()
  }

  const handleEditClick = () => {
    setEditMode({
      isActive: true,
      savedUrlData: urlData
    })
  }

  return !editMode.isActive && withActionButtons ? (
    <div className={classNames('url-path url-path-preview', previewClassName)}>
      <Tooltip
        className={classNames('url-path-preview__text', disabled && 'url-path-preview__disabled')}
        template={<TextTooltipTemplate text={`${`${urlData.pathType}${urlData.path}` || URL}`} />}
      >
        <span>{`${urlData.pathType}${urlData.path}`}</span>
        {(isEmpty(urlData.pathType) || isEmpty(urlData.path)) && (
          <span>
            {URL}
            {<span className="url-path-preview__required">*</span>}
          </span>
        )}
      </Tooltip>
      {!disabled && (
        <div className="url-path-preview__actions">
          <RoundedIcon onClick={handleEditClick} tooltipText="Edit">
            <Edit />
          </RoundedIcon>
        </div>
      )}
    </div>
  ) : (
    <div className="url-path">
      <Combobox
        comboboxClassName="url"
        disabled={disabled}
        hideSearchInput={!urlProjectItemTypeEntered}
        inputDefaultValue={
          urlData.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME && !urlData.path
            ? urlData.projectItemType
            : urlData.path
        }
        inputOnChange={handleUrlPathChange}
        inputPlaceholder={urlData.placeholder}
        invalid={invalid}
        invalidText={generatedPathTips}
        matches={urlData.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME ? comboboxMatches : []}
        maxSuggestedMatches={3}
        onBlur={
          withActionButtons
            ? null
            : (selectValue, inputValue) => handleUrlOnBlur({ selectValue, inputValue, urlData })
        }
        onFocus={handleUrlOnFocus}
        required
        requiredText="This field is required"
        selectDefaultValue={comboboxSelectList.find(option => option.id === urlData.pathType)}
        selectDropdownList={comboboxSelectList}
        selectOnChange={handleUrlPathTypeChange}
        selectPlaceholder={URL}
      />
      {withActionButtons && (
        <div className="url-path-actions">
          <RoundedIcon onClick={handleApplyClick} tooltipText="Apply" disabled={invalid}>
            <Checkmark className="url-path-actions__apply-btn" />
          </RoundedIcon>
          <RoundedIcon
            onClick={handleDiscardClick}
            tooltipText="Discard changes"
            disabled={isEmpty(editMode.savedUrlData.pathType)}
          >
            <Close />
          </RoundedIcon>
        </div>
      )}
    </div>
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
  handleUrlInputOnChange: () => {},
  handleUrlOnApply: () => {},
  handleUrlOnBlur: () => {},
  handleUrlOnDiscard: () => {},
  handleUrlOnEditModeChange: () => {},
  handleUrlOnFocus: () => {},
  handleUrlSelectOnChange: () => {},
  invalid: false,
  previewClassName: '',
  withActionButtons: false
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
  handleUrlInputOnChange: PropTypes.func,
  handleUrlOnApply: PropTypes.func,
  handleUrlOnBlur: PropTypes.func,
  handleUrlOnDiscard: PropTypes.func,
  handleUrlOnEditModeChange: PropTypes.func,
  handleUrlOnFocus: PropTypes.func,
  handleUrlSelectOnChange: PropTypes.func,
  invalid: PropTypes.bool,
  previewClassName: PropTypes.string,
  withActionButtons: PropTypes.bool
}

export default UrlPath
