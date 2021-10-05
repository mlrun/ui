import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProjectSettingsGeneralView from './ProjectSettingsGeneralView'

import {
  ARTIFACT_PATH,
  SOURCE_URL
} from '../../components/ProjectSettings/projectSettings.util'
import { KEY_CODES } from '../../constants'
import projectsApi from '../../api/projects-api'
import projectsAction from '../../actions/projects'

import './projectSettingsGeneral.scss'

const ProjectSettingsGeneral = ({
  fetchProject,
  match,
  projectStore,
  removeProjectData,
  setProjectParams,
  setProjectSettings
}) => {
  const [editProject, setEditProject] = useState({
    source: {
      value: null,
      isEdit: false
    },
    artifact_path: {
      value: null,
      isEdit: false
    }
  })

  const inputRef = React.createRef()

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

  const closeEditMode = useCallback(() => {
    setEditProject(prevState => ({
      source: {
        value: prevState.source.value ?? projectStore.project.data.spec.source,
        isEdit: false
      },
      artifact_path: {
        value:
          prevState.artifact_path.value ??
          projectStore.project.data.spec.artifact_path,
        isEdit: false
      }
    }))
  }, [projectStore.project])

  const setNewProjectParams = useCallback(
    params => {
      const projectData = {
        source:
          editProject.source.value ?? projectStore.project.data.spec.source,
        artifact_path:
          editProject.artifact_path.value ??
          projectStore.project.data.spec.artifact_path,
        params: params
      }
      const data = {
        ...projectStore.project.data,
        spec: {
          ...projectStore.project.data.spec,
          source: projectData.source,
          artifact_path: projectData.artifact_path,
          params: projectData.params
        }
      }

      setProjectParams(params)
      projectsApi.editProject(match.params.projectName, { ...data })
    },
    [
      editProject.artifact_path.value,
      editProject.source.value,
      match.params.projectName,
      projectStore.project.data,
      setProjectParams
    ]
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

  const handleEditProject = useCallback(inputName => {
    setEditProject(prevState => ({
      ...prevState,
      source: {
        ...prevState.source,
        isEdit: inputName === SOURCE_URL
      },
      artifact_path: {
        ...prevState.artifact_path,
        isEdit: inputName === ARTIFACT_PATH
      }
    }))
  }, [])

  const handleOnChangeSettings = useCallback(
    value => {
      setEditProject(prevState => ({
        ...prevState,
        source: {
          ...prevState.source,
          value: editProject.source.isEdit ? value : prevState.source.value
        },
        artifact_path: {
          ...prevState.artifact_path,
          value: editProject.artifact_path.isEdit
            ? value
            : prevState.artifact_path.value
        }
      }))
    },
    [editProject]
  )

  const handleSetProjectData = useCallback(() => {
    const projectData = {
      source: editProject.source.value ?? projectStore.project.data.spec.source,
      artifact_path:
        editProject.artifact_path.value ??
        projectStore.project.data.spec.artifact_path,
      params: projectStore.project.data.spec.params
    }
    const data = {
      ...projectStore.project.data,
      spec: {
        ...projectStore.project.data.spec,
        source: projectData.source,
        artifact_path: projectData.artifact_path,
        params: projectData.params
      }
    }

    setProjectSettings({
      source: projectData.source,
      artifact_path: projectData.artifact_path
    })
    closeEditMode()
    projectsApi.editProject(match.params.projectName, { ...data }).catch(() => {
      setEditProject({
        source: {
          value: projectStore.project.data.metadata.name,
          isEdit: false
        },
        artifact_path: {
          value: projectStore.project.data.spec.artifact_path,
          isEdit: false
        }
      })
    })
  }, [
    closeEditMode,
    editProject.artifact_path.value,
    editProject.source.value,
    match.params.projectName,
    projectStore.project.data,
    setProjectSettings
  ])

  const handleOnKeyDown = useCallback(
    event => {
      if (event.keyCode === KEY_CODES.ENTER) {
        handleSetProjectData()
      }
    },
    [handleSetProjectData]
  )

  const handleDocumentClick = useCallback(
    event => {
      if (inputRef.current && event.target !== inputRef.current) {
        handleSetProjectData()
      }
    },
    [handleSetProjectData, inputRef]
  )

  useEffect(() => {
    if (editProject.source.isEdit || editProject.artifact_path.isEdit) {
      document.addEventListener('click', handleDocumentClick)
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [editProject, handleDocumentClick])

  return (
    <ProjectSettingsGeneralView
      artifactPath={projectStore.project.data?.spec.artifact_path ?? ''}
      editProject={editProject}
      error={projectStore.project?.error}
      generalParams={generalParams}
      handleAddNewParameter={handleAddNewParameter}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEditParameter}
      handleEditProject={handleEditProject}
      handleOnChangeSettings={handleOnChangeSettings}
      handleOnKeyDown={handleOnKeyDown}
      loading={projectStore.project?.loading}
      ref={inputRef}
      source={projectStore.project.data?.spec.source ?? ''}
    />
  )
}

ProjectSettingsGeneral.propTypes = {
  match: PropTypes.object.isRequired
}

export default connect(
  ({ projectStore }) => ({
    projectStore
  }),
  { ...projectsAction }
)(ProjectSettingsGeneral)
