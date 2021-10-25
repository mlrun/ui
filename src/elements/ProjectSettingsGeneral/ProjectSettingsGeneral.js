import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { debounce, isNil } from 'lodash'

import ProjectSettingsGeneralView from './ProjectSettingsGeneralView'

import {
  ARTIFACT_PATH,
  SOURCE_URL
} from '../../components/ProjectSettings/projectSettings.util'
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

  const handleEditProject = useCallback(type => {
    setEditProject(prevState => ({
      ...prevState,
      source: {
        ...prevState.source,
        isEdit: type === SOURCE_URL
      },
      artifact_path: {
        ...prevState.artifact_path,
        isEdit: type === ARTIFACT_PATH
      }
    }))
  }, [])

  const handleOnChangeSettings = useCallback(
    debounce((value, isValid, inputName) => {
      const isSourceUrl = inputName === SOURCE_URL
      const isValueValid =
        isValid &&
        value !==
          projectStore.project.data.spec[
            isSourceUrl ? 'source' : 'artifact_path'
          ]

      if (isValueValid) {
        const projectData = {
          source: isSourceUrl
            ? value
            : !isNil(editProject.source.value)
            ? editProject.source.value
            : projectStore.project.data.spec.source,
          artifact_path: !isSourceUrl
            ? value
            : !isNil(editProject.artifact_path.value)
            ? editProject.artifact_path.value
            : projectStore.project.data.spec.artifact_path,
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

        setEditProject(prevState => ({
          source: {
            ...prevState.source,
            value: projectData.source
          },
          artifact_path: {
            ...prevState.artifact_path,
            value: projectData.artifact_path
          }
        }))

        setProjectSettings({
          source: projectData.source,
          artifact_path: projectData.artifact_path
        })
        projectsApi
          .editProject(match.params.projectName, { ...data })
          .catch(() => {
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
      }
    }, 250),
    [
      editProject.artifact_path.value,
      editProject.source.value,
      match.params.projectName,
      projectStore.project.data,
      setProjectSettings,
      validation.isPathValid,
      validation.isSourceValid
    ]
  )

  const handleOnBlur = () => {
    setEditProject(prevState => ({
      source: {
        ...prevState.source,
        isEdit: false
      },
      artifact_path: {
        ...prevState.artifact_path,
        isEdit: false
      }
    }))

    if (!validation.isSourceValid) {
      setValidation(state => ({
        ...state,
        isSourceValid: true
      }))
    }
  }

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
      handleOnBlur={handleOnBlur}
      handleOnChangeSettings={handleOnChangeSettings}
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
  ({ projectStore }) => ({
    projectStore
  }),
  { ...projectsAction }
)(ProjectSettingsGeneral)
