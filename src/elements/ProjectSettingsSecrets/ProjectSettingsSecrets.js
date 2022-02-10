import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import notificationAction from '../../actions/notification'

import projectApi from '../../api/projects-api'
import projectsAction from '../../actions/projects'
import ProjectSettingsSecretsView from './ProjectSettingsSecretsView'

import {
  ADD_PROJECT_SECRET,
  DELETE_PROJECT_SECRET,
  EDIT_PROJECT_SECRET
} from './ProjectSettingsSecrets.utils'

const ProjectSettingsSecrets = ({
  fetchProjectSecrets,
  match,
  projectStore,
  removeProjectData,
  setNotification,
  setProjectSecrets
}) => {
  const { projectName } = match.params

  const fetchSecrets = useCallback(() => {
    fetchProjectSecrets(projectName)
  }, [fetchProjectSecrets, projectName])

  useEffect(() => {
    fetchSecrets()

    return () => {
      removeProjectData()
    }
  }, [fetchSecrets, removeProjectData, projectName])

  const generalSecrets = useMemo(
    () =>
      projectStore.project.secrets?.data['secret_keys']
        ? projectStore.project.secrets.data['secret_keys'].map(secret => ({
            key: secret,
            value: ''
          }))
        : [],
    [projectStore.project.secrets.data]
  )

  const handleProjectSecret = useCallback(
    (type, data) => {
      const secretFun =
        type === ADD_PROJECT_SECRET || type === EDIT_PROJECT_SECRET
          ? projectApi.setProjectSecret
          : projectApi.deleteSecret

      secretFun(projectName, data)
        .then(() => {
          setNotification({
            status: 200,
            id: Math.random(),
            message: `Secret ${type}${
              type === DELETE_PROJECT_SECRET ? 'd' : 'ed'
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
    [projectName, setNotification]
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
        ...projectStore.project.secrets?.data['secret_keys'],
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
      loading={projectStore.project.secrets?.loading}
      secrets={generalSecrets}
    />
  )
}

ProjectSettingsSecrets.propTypes = {
  match: PropTypes.object.isRequired
}

export default connect(
  ({ projectStore }) => ({
    projectStore
  }),
  { ...notificationAction, ...projectsAction }
)(ProjectSettingsSecrets)
