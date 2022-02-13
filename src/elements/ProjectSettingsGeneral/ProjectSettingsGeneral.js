import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isEqual, isNil } from 'lodash'

import ProjectSettingsGeneralView from './ProjectSettingsGeneralView'

import {
  ARTIFACT_PATH,
  DATA,
  LABELS,
  PARAMS,
  SOURCE_URL
} from '../../components/ProjectSettings/projectSettings.util'
import projectsApi from '../../api/projects-api'
import projectsAction from '../../actions/projects'
import notificationActions from '../../actions/notification'
import { initialEditProjectData } from './projectSettingsGeneral.utils'
import { deleteUnsafeHtml } from '../../utils/string'
import { KEY_CODES, STATUS_CODE_FORBIDDEN } from '../../constants'

import './projectSettingsGeneral.scss'

const ProjectSettingsGeneral = ({
  addProjectLabel,
  editProjectLabels,
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
      setEditProjectData(initialEditProjectData)
    }
  }, [
    removeProjectData,
    match.params.pageTab,
    match.params.projectName,
    fetchProject
  ])

  const projectMembershipIsEnabled = useMemo(
    () => frontendSpec?.feature_flags?.project_membership === 'enabled',
    [frontendSpec]
  )

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
    (type, data, labels) => {
      const editFunc =
        type && type === LABELS ? editProjectLabels : projectsApi.editProject

      editFunc(match.params.projectName, { ...data }, labels)
        .then(() => {
          setNotification({
            status: 200,
            id: Math.random(),
            message: 'Data was edited successfully'
          })
        })
        .catch(error => {
          setNotification({
            status: error.response?.status || 400,
            id: Math.random(),
            message:
              error.response?.status === STATUS_CODE_FORBIDDEN
                ? 'Missing Edit permission for the project.'
                : 'Failed to edit project data.',
            retry: () => sendProjectSettingsData(type, data, labels)
          })
        })
    },

    [editProjectLabels, match.params.projectName, setNotification]
  )

  const handleUpdateProjectLabels = objectLabels => {
    const data = {
      ...projectStore.project.data,
      metadata: {
        ...projectStore.project.data.metadata,
        labels: objectLabels
      }
    }

    if (!isEqual(objectLabels, projectStore.project.data.metadata.labels)) {
      sendProjectSettingsData(LABELS, data, objectLabels)
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
            value: editProjectData[fieldName].isEdit
              ? value
              : prevState[fieldName].value
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
        editProjectData[fieldName].value ===
          projectStore.project.data.spec[fieldName] ||
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

  return (
    <ProjectSettingsGeneralView
      defaultArtifactPath={frontendSpec.default_artifact_path}
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
      project={projectStore.project}
      projectMembershipIsEnabled={projectMembershipIsEnabled}
      setValidation={setValidation}
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
