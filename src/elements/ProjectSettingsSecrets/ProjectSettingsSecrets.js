import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import projectApi from '../../api/projects-api'
import projectsAction from '../../actions/projects'
import ProjectSettingsSecretsView from './ProjectSettingsSecretsView'
import { STATUS_CODE_FORBIDDEN } from '../../constants'
import {
  ADD_PROJECT_SECRET,
  DELETE_PROJECT_SECRET,
  EDIT_PROJECT_SECRET
} from './ProjectSettingsSecrets.utils'

const ProjectSettingsSecrets = ({
  fetchProjectSecrets,
  projectStore,
  removeProjectData,
  setNotification,
  setProjectSecrets
}) => {
  const [isUserAllowed, setIsUserAllowed] = useState(true)
  const params = useParams()

  const fetchSecrets = useCallback(() => {
    setIsUserAllowed(true)
    fetchProjectSecrets(params.projectName).catch(error => {
      if (error.response?.status === STATUS_CODE_FORBIDDEN) {
        setIsUserAllowed(false)
        setNotification({
          status: error.response?.status || 400,
          id: Math.random(),
          message: 'Permission denied.'
        })
      } else {
        setNotification({
          status: error.response?.status || 400,
          id: Math.random(),
          message: 'Failed to fetch project data.',
          retry: () => fetchSecrets()
        })
      }
    })
  }, [fetchProjectSecrets, params.projectName, setNotification])

  useEffect(() => {
    fetchSecrets()

    return () => {
      removeProjectData()
    }
  }, [fetchSecrets, removeProjectData, params.projectName])

  const generalSecrets = useMemo(
    () =>
      projectStore.project.secrets?.data['secret_keys']
        ? projectStore.project.secrets.data['secret_keys'].map(secret => ({
            key: secret,
            value: '*****'
          }))
        : [],
    [projectStore.project.secrets.data]
  )

  const handleProjectSecret = useCallback(
    (type, data) => {
      const updateSecret =
        type === ADD_PROJECT_SECRET || type === EDIT_PROJECT_SECRET
          ? projectApi.setProjectSecret
          : projectApi.deleteSecret

      updateSecret(params.projectName, data)
        .then(() => {
          setNotification({
            status: 200,
            id: Math.random(),
            message: `Secret ${
              type === DELETE_PROJECT_SECRET
                ? 'deleted'
                : type === EDIT_PROJECT_SECRET
                ? 'edited'
                : 'added'
            } successfully`
          })
        })
        .catch(err => {
          setNotification({
            status: 400,
            id: Math.random(),
            message: err.message
          })
        })
    },
    [params.projectName, setNotification]
  )

  const handleAddNewSecret = useCallback(
    createSecretData => {
      const data = {
        provider: 'kubernetes',
        secrets: {
          [createSecretData.key]: createSecretData.value
        }
      }

      const secretKeys = [
        ...(projectStore.project.secrets.data?.secret_keys ?? []),
        createSecretData.key
      ]

      setProjectSecrets(secretKeys) // redux
      handleProjectSecret(ADD_PROJECT_SECRET, data) // api
    },
    [handleProjectSecret, projectStore.project.secrets.data, setProjectSecrets]
  )

  const handleSecretDelete = (index, secret) => {
    const filteredArray = projectStore.project.secrets?.data[
      'secret_keys'
    ].filter((_, elementIndex) => elementIndex !== index)

    setProjectSecrets(filteredArray)
    handleProjectSecret(DELETE_PROJECT_SECRET, secret.key) // api
  }

  const handleSecretEdit = editedSecretData => {
    const data = {
      provider: 'kubernetes',
      secrets: {
        [editedSecretData.key]: editedSecretData.value
      }
    }

    handleProjectSecret(EDIT_PROJECT_SECRET, data) // api
  }

  return (
    <ProjectSettingsSecretsView
      error={projectStore.project.secrets?.error}
      handleAddNewSecret={handleAddNewSecret}
      handleSecretDelete={handleSecretDelete}
      handleSecretEdit={handleSecretEdit}
      isUserAllowed={isUserAllowed}
      loading={projectStore.project.secrets?.loading}
      secrets={generalSecrets}
    />
  )
}

export default connect(
  ({ projectStore }) => ({
    projectStore
  }),
  { ...projectsAction }
)(ProjectSettingsSecrets)
