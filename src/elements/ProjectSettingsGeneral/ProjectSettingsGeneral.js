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
import { initialEditProjectData } from './projectSettingsGeneral.utils'

import './projectSettingsGeneral.scss'

const ProjectSettingsGeneral = ({
  fetchProject,
  frontendSpec,
  match,
  projectStore,
  removeProjectData,
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
      setEditProjectData(initialEditProjectData)
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
          editProjectData.source.value ?? projectStore.project.data.spec.source,
        artifact_path:
          editProjectData.artifact_path.value ??
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
      editProjectData.artifact_path.value,
      editProjectData.source.value,
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
    setEditProjectData(prevState => ({
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

  const handleArtifactPathChange = useCallback(
    debounce((value, isValid) => {
      if (isValid && value !== projectStore.project.data.spec.artifact_path) {
        const data = {
          ...projectStore.project.data,
          spec: {
            ...projectStore.project.data.spec,
            source: !isNil(editProjectData.source.value)
              ? editProjectData.source.value
              : projectStore.project.data.spec.source,
            artifact_path: value.trim(),
            params: projectStore.project.data.spec.params
          }
        }

        sendProjectSettingsData(data)
      }
    }, 250),
    [
      editProjectData.artifact_path.value,
      match.params.projectName,
      projectStore.project.data,
      setProjectSettings,
      validation.isPathValid
    ]
  )

  const sendProjectSettingsData = data => {
    setEditProjectData(prevState => ({
      ...prevState,
      artifact_path: {
        ...prevState.artifact_path,
        value: data.spec.artifact_path
      }
    }))
    setProjectSettings({
      source: data.spec.source,
      artifact_path: data.spec.artifact_path
    })
    projectsApi.editProject(match.params.projectName, { ...data }).catch(() => {
      setEditProjectData({
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

  const handleSourceChange = value => {
    setEditProjectData(prevState => ({
      ...prevState,
      source: {
        ...prevState.source,
        value
      }
    }))
  }

  const handleOnBlur = tab => {
    if (tab === SOURCE_URL) {
      if (
        !isNil(editProjectData.source.value) &&
        validation.isSourceValid &&
        editProjectData.source.value !== projectStore.project.data.spec.source
      ) {
        const data = {
          ...projectStore.project.data,
          spec: {
            ...projectStore.project.data.spec,
            source: !isNil(editProjectData.source.value)
              ? editProjectData.source.value
              : projectStore.project.data.spec.source
          }
        }

        sendProjectSettingsData(data)
        setEditProjectData(prevState => ({
          ...prevState,
          source: {
            ...prevState.source,
            isEdit: false
          }
        }))
      } else {
        setEditProjectData(prevState => ({
          ...prevState,
          source: {
            value: projectStore.project.data.spec.source,
            isEdit: false
          }
        }))
        setValidation(prevState => ({
          ...prevState,
          isSourceValid: true
        }))
      }
    } else {
      setEditProjectData(prevState => ({
        ...prevState,
        artifact_path: {
          ...prevState.artifact_path,
          isEdit: false
        }
      }))
    }
  }

  return (
    <ProjectSettingsGeneralView
      artifactPath={projectStore.project.data?.spec.artifact_path ?? ''}
      defaultArtifactPath={frontendSpec.default_artifact_path}
      editProjectData={editProjectData}
      error={projectStore.project?.error}
      generalParams={generalParams}
      handleAddNewParameter={handleAddNewParameter}
      handleArtifactPathChange={handleArtifactPathChange}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEditParameter}
      handleEditProject={handleEditProject}
      handleOnBlur={handleOnBlur}
      handleSourceChange={handleSourceChange}
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
  { ...projectsAction }
)(ProjectSettingsGeneral)
