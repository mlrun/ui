import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isNil } from 'lodash'

import ProjectSettingsGeneralView from './ProjectSettingsGeneralView'

import projectsApi from '../../api/projects-api'
import projectsAction from '../../actions/projects'
import notificationActions from '../../actions/notification'
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
  const [editProject, setEditProject] = useState({
    artifact_path: {
      value: '',
      isEdit: false
    },
    description: {
      value: '',
      isEdit: false
    },
    goals: {
      value: '',
      isEdit: false
    },
    source: {
      value: '',
      isEdit: true
    }
  })
  const [validation, setValidation] = useState({
    isSourceValid: true,
    isPathValid: true
  })

  useEffect(() => {
    fetchProject(match.params.projectName)
    return () => {
      removeProjectData()
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
                ? `You are not allowed to edit ${match.params.projectName} project`
                : 'Failed to edit project data',
            retry: () => sendProjectSettingsData(data)
          })
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

  const closeEditMode = useCallback(() => {
    setEditProject(prevState => ({
      artifact_path: {
        value:
          prevState.artifact_path.value.trim() ??
          projectStore.project.data.spec.artifact_path,
        isEdit: false
      },
      description: {
        value:
          prevState.description.value.trim() ??
          projectStore.project.data.spec.description,
        isEdit: false
      },
      source: {
        value:
          prevState.source.value.trim() ??
          projectStore.project.data.spec.source,
        isEdit: false
      }
    }))
  }, [projectStore.project])

  const handleEditProject = useCallback(fieldName => {
    setEditProject(prevState => ({
      ...prevState,
      [fieldName]: {
        ...prevState[fieldName],
        isEdit: true
      }
    }))
  }, [])

  const handleOnChange = useCallback(
    (fieldName, value) => {
      setEditProject(prevState => ({
        ...prevState,
        [fieldName]: {
          ...prevState[fieldName],
          value: editProject[fieldName].isEdit
            ? value
            : prevState[fieldName].value
        }
      }))
    },
    [editProject]
  )

  const handleOnBlur = field => {
    if (
      isNil(editProject[field].value) ||
      editProject[field].value === projectStore.project.data.spec[field]
    ) {
      setEditProject(prevState => ({
        ...prevState,
        [field]: {
          ...prevState[field],
          isEdit: false
        }
      }))
      return
    }

    const data = {
      ...projectStore.project.data,
      spec: {
        ...projectStore.project.data.spec,
        [field]: editProject[field].value.trim()
      }
    }

    setProjectSettings({
      source: data.spec.source,
      artifact_path: data.spec.artifact_path,
      description: data.spec.description
    })

    closeEditMode()

    sendProjectSettingsData(data)
  }

  return (
    <ProjectSettingsGeneralView
      artifactPath={projectStore.project.data?.spec.artifact_path ?? ''}
      defaultArtifactPath={frontendSpec.default_artifact_path}
      description={projectStore.project.data?.spec.description ?? ''}
      editProject={editProject}
      error={projectStore.project?.error}
      generalParams={generalParams}
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
