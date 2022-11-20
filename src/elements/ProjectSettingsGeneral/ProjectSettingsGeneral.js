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
import { connect } from 'react-redux'
import { isEmpty, isEqual, isNil, omitBy } from 'lodash'
import { useParams } from 'react-router-dom'

import ProjectSettingsGeneralView from './ProjectSettingsGeneralView'

import { ARTIFACT_PATH, DATA, LABELS, PARAMS, SOURCE_URL } from '../../constants'
import projectsApi from '../../api/projects-api'
import projectsAction from '../../actions/projects'
import { initialEditProjectData } from './projectSettingsGeneral.utils'
import { deleteUnsafeHtml } from '../../utils/string'
import { KEY_CODES } from '../../constants'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'

import './projectSettingsGeneral.scss'

const ProjectSettingsGeneral = ({
  addProjectLabel,
  changeOwnerCallback,
  dispatch,
  editProjectLabels,
  fetchProject,
  frontendSpec,
  membersState,
  projectStore,
  projectMembershipIsEnabled,
  projectOwnerIsShown,
  removeProjectData,
  setNotification,
  setProjectLabels,
  setProjectParams,
  setProjectSettings
}) => {
  const [editProjectData, setEditProjectData] = useState(initialEditProjectData)
  const [validation, setValidation] = useState({
    isSourceValid: true,
    isPathValid: true
  })
  const params = useParams()

  const generalParams = useMemo(
    () =>
      projectStore.project.data?.spec.params
        ? Object.entries(projectStore.project.data?.spec.params).map(([key, value]) => ({
            key,
            value
          }))
        : [],
    [projectStore.project.data]
  )

  const sendProjectSettingsData = useCallback(
    (type, data, labels) => {
      const editFunc = type && type === LABELS ? editProjectLabels : projectsApi.editProject

      editFunc(params.projectName, { ...data }, labels)
        .then(() => {
          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: 'Data was edited successfully'
            })
          )
        })
        .catch(error => {
          dispatch(
            setNotification({
              status: error.response?.status || 400,
              id: Math.random(),
              message:
                error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
                  ? 'Missing edit permission for the project.'
                  : 'Failed to edit project data.',
              retry:
                error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
                  ? null
                  : () => sendProjectSettingsData(type, data, labels)
            })
          )
        })
    },

    [editProjectLabels, params.projectName, setNotification]
  )

  const handleUpdateProjectLabels = objectLabels => {
    const data = {
      ...projectStore.project.data,
      metadata: {
        ...projectStore.project.data.metadata,
        labels: objectLabels
      }
    }

    const storeLabels = omitBy(projectStore.project.data.metadata.labels, isEmpty)

    if (!isEqual(objectLabels, storeLabels)) {
      sendProjectSettingsData(LABELS, data, objectLabels)
    } else {
      setProjectLabels(storeLabels)
    }
  }

  const setNewProjectParams = useCallback(
    params => {
      const data = {
        ...projectStore.project.data,
        spec: {
          ...projectStore.project.data.spec,
          params
        }
      }

      if (!isEqual(params, projectStore.project.data.spec.params)) {
        setProjectParams(params)
        sendProjectSettingsData(PARAMS, data)
      }
    },
    [projectStore.project.data, setProjectParams, sendProjectSettingsData]
  )

  const handleAddNewParameter = useCallback(
    parameter => {
      setNewProjectParams({
        ...projectStore.project.data?.spec.params,
        [parameter.key]: parameter.value
      })
    },
    [projectStore.project.data, setNewProjectParams]
  )

  const handleDeleteParameter = useCallback(
    (parameterIndex, parameter) => {
      const paramsArray = {
        ...projectStore.project.data?.spec.params
      }

      delete paramsArray[parameter.newKey || parameter.key]

      setNewProjectParams(paramsArray)
    },
    [projectStore.project.data, setNewProjectParams]
  )

  const handleEditParameter = useCallback(
    parameter => {
      const paramsArray = {
        ...projectStore.project.data?.spec.params
      }

      if (parameter.newKey) {
        delete paramsArray[parameter.key]
      }

      paramsArray[parameter.newKey || parameter.key] = parameter.value
      setNewProjectParams({
        ...paramsArray
      })
    },
    [projectStore.project.data, setNewProjectParams]
  )

  const handleEditProject = useCallback(fieldName => {
    setEditProjectData(prevState => ({
      ...prevState,
      [fieldName]: {
        ...prevState[fieldName],
        isEdit: true
      }
    }))
  }, [])

  const handleOnChange = useCallback(
    (fieldName, value) => {
      if (fieldName && editProjectData[fieldName].isEdit) {
        setEditProjectData(prevState => ({
          ...prevState,
          [fieldName]: {
            ...prevState[fieldName],
            value: editProjectData[fieldName].isEdit ? value : prevState[fieldName].value
          }
        }))
      }
    },
    [editProjectData]
  )

  const handleOnBlur = useCallback(
    fieldName => {
      if (
        isNil(editProjectData[fieldName].value) ||
        editProjectData[fieldName].value === projectStore.project.data.spec[fieldName] ||
        (fieldName === ARTIFACT_PATH && !validation.isPathValid) ||
        (fieldName === SOURCE_URL && !validation.isSourceValid)
      ) {
        return setEditProjectData(prevState => ({
          ...prevState,
          [fieldName]: {
            ...prevState[fieldName],
            isEdit: false
          }
        }))
      }

      const data = {
        ...projectStore.project.data,
        spec: {
          ...projectStore.project.data.spec,
          [fieldName]: deleteUnsafeHtml(editProjectData[fieldName].value.trim())
        }
      }

      setProjectSettings({
        artifact_path: data.spec.artifact_path,
        description: data.spec.description,
        goals: data.spec.goals,
        source: data.spec.source
      })
      setEditProjectData(initialEditProjectData)
      sendProjectSettingsData(DATA, data)
    },
    [
      editProjectData,
      projectStore.project.data,
      sendProjectSettingsData,
      setProjectSettings,
      validation.isPathValid,
      validation.isSourceValid
    ]
  )

  const handleOnKeyDown = useCallback(event => {
    if (event.keyCode === KEY_CODES.ENTER) {
      event.preventDefault()
      event.target.blur()
    }
  }, [])

  useEffect(() => {
    fetchProject(params.projectName)

    return () => {
      removeProjectData()
      setEditProjectData(initialEditProjectData)
    }
  }, [removeProjectData, params.pageTab, params.projectName, fetchProject])

  return (
    <ProjectSettingsGeneralView
      changeOwnerCallback={changeOwnerCallback}
      defaultArtifactPath={frontendSpec.default_artifact_path}
      dispatch={dispatch}
      editProjectData={editProjectData}
      generalParams={generalParams}
      handleAddNewParameter={handleAddNewParameter}
      handleAddProjectLabel={addProjectLabel}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEditParameter}
      handleEditProject={handleEditProject}
      handleOnBlur={handleOnBlur}
      handleOnChange={handleOnChange}
      handleOnKeyDown={handleOnKeyDown}
      handleUpdateProjectLabels={handleUpdateProjectLabels}
      membersState={membersState}
      project={projectStore.project}
      projectMembershipIsEnabled={projectMembershipIsEnabled}
      projectOwnerIsShown={projectOwnerIsShown}
      setNotification={setNotification}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

ProjectSettingsGeneral.propTypes = {
  changeOwnerCallback: PropTypes.func.isRequired
}

export default connect(
  ({ appStore, projectStore }) => ({
    projectStore,
    frontendSpec: appStore.frontendSpec
  }),
  { ...projectsAction }
)(ProjectSettingsGeneral)
