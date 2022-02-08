import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isNil } from 'lodash'

import ProjectSettingsGeneralView from './ProjectSettingsGeneralView'

import {
  ARTIFACT_PATH,
  SOURCE_URL
} from '../../components/ProjectSettings/projectSettings.util'
import projectsApi from '../../api/projects-api'
import projectsAction from '../../actions/projects'
import notificationActions from '../../actions/notification'
import { initialEditProjectData } from './projectSettingsGeneral.utils'
import { STATUS_CODE_FORBIDDEN } from '../../constants'

import './projectSettingsGeneral.scss'

const ProjectSettingsGeneral = ({
  fetchProject,
  frontendSpec,
  match,
  projectStore,
  removeProjectData,
  setNotification,
  setProjectParams,
  setProjectSettings
}) => {
  const [editProjectData, setEditProjectData] = useState(initialEditProjectData)

  const [validation, setValidation] = useState({
    isSourceValid: true,
    isPathValid: true
  })

  useEffect(() => {
    fetchProject(match.params.projectName)
    return () => {
      removeProjectData()
      setEditProjectData(prev => ({ ...prev, ...initialEditProjectData }))
    }
  }, [
    removeProjectData,
    match.params.pageTab,
    match.params.projectName,
    fetchProject
  ])

  const generalParams = useMemo(
    () =>
      projectStore.project.data?.spec.params
        ? Object.entries(projectStore.project.data?.spec.params).map(
            ([key, value]) => ({
              key,
              value
            })
          )
        : [],
    [projectStore.project.data]
  )

  const sendProjectSettingsData = useCallback(
    data => {
      projectsApi
        .editProject(match.params.projectName, { ...data })
        .catch(error => {
          setNotification({
            status: error.response?.status || 400,
            id: Math.random(),
            message:
              error.response?.status === STATUS_CODE_FORBIDDEN
                ? 'Missing Edit permission for the project.'
                : 'Failed to edit project data.',
            retry: () => sendProjectSettingsData(data)
          })
        })
        .finally(() => {
          setEditProjectData(prev => ({ ...prev, ...initialEditProjectData }))
        })
    },

    [match.params.projectName, setNotification]
  )

  const setNewProjectParams = useCallback(
    params => {
      const data = {
        ...projectStore.project.data,
        spec: {
          ...projectStore.project.data.spec,
          params
        }
      }

      setProjectParams(params)
      sendProjectSettingsData(data)
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
      setEditProjectData(prevState => ({
        ...prevState,
        [fieldName]: {
          ...prevState[fieldName],
          value: editProjectData[fieldName].isEdit
            ? value
            : prevState[fieldName].value
        }
      }))
    },
    [editProjectData]
  )

  const handleOnBlur = fieldName => {
    if (
      (fieldName === ARTIFACT_PATH && !validation.isPathValid) ||
      (fieldName === SOURCE_URL && !validation.isSourceValid)
    ) {
      setEditProjectData(prevState => ({
        ...prevState,
        [fieldName]: {
          ...prevState[fieldName],
          isEdit: false
        }
      }))
      return
    }

    if (
      isNil(editProjectData[fieldName].value) ||
      editProjectData[fieldName].value ===
        projectStore.project.data.spec[fieldName]
    ) {
      setEditProjectData(prevState => ({
        ...prevState,
        [fieldName]: {
          ...prevState[fieldName],
          isEdit: false
        }
      }))
      return
    }

    const data = {
      ...projectStore.project.data,
      spec: {
        ...projectStore.project.data.spec,
        [fieldName]: editProjectData[fieldName].value.trim()
      }
    }

    setProjectSettings({
      artifact_path: data.spec.artifact_path,
      description: data.spec.description,
      goals: data.spec.goals,
      source: data.spec.source
    })

    sendProjectSettingsData(data)
  }

  return (
    <ProjectSettingsGeneralView
      artifactPath={projectStore.project.data?.spec.artifact_path ?? ''}
      defaultArtifactPath={frontendSpec.default_artifact_path}
      description={projectStore.project.data?.spec.description ?? ''}
      editProjectData={editProjectData}
      error={projectStore.project?.error}
      generalParams={generalParams}
      goals={projectStore.project.data?.spec.goals ?? ''}
      handleAddNewParameter={handleAddNewParameter}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEditParameter}
      handleEditProject={handleEditProject}
      handleOnBlur={handleOnBlur}
      handleOnChange={handleOnChange}
      loading={projectStore.project?.loading}
      setValidation={setValidation}
      source={projectStore.project.data?.spec.source ?? ''}
      validation={validation}
    />
  )
}

ProjectSettingsGeneral.propTypes = {
  match: PropTypes.object.isRequired
}

export default connect(
  ({ appStore, projectStore }) => ({
    projectStore,
    frontendSpec: appStore.frontendSpec
  }),
  { ...projectsAction, setNotification: notificationActions.setNotification }
)(ProjectSettingsGeneral)
