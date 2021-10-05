import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import notificationAction from '../../actions/notification'

import projectApi from '../../api/projects-api'
import projectsAction from '../../actions/projects'
import ProjectSettingsSecretsView from './ProjectSettingsSecretsView'

const ProjectSettingsSecrets = ({
  fetchProjectSecrets,
  match,
  projectStore,
  removeProjectData,
  setNotification,
  setProjectSecrets
}) => {
  const [isCreateNewSecretDialogOpen, setCreateNewSecretDialogOpen] = useState(
    false
  )
  const [editableSecret, setEditableSecret] = useState('')

  const handleEditClick = secret => {
    setEditableSecret(secret)
    setCreateNewSecretDialogOpen(true)
  }

  const fetchSecrets = useCallback(() => {
    fetchProjectSecrets(match.params.projectName)
  }, [fetchProjectSecrets, match.params.projectName])

  useEffect(() => {
    fetchSecrets()

    return () => {
      removeProjectData()
    }
  }, [fetchSecrets, removeProjectData, match.params.projectName])

  const handleSecretDelete = (secret, index) => {
    const filteredArray = projectStore.project.secrets?.data[
      'secret_keys'
    ].filter((element, elementIndex) => elementIndex !== index)

    setProjectSecrets(filteredArray)

    projectApi
      .deleteSecret(match.params.projectName, secret)
      .then(() => {
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Secret deleted successfully'
        })
      })
      .catch(err => {
        setNotification({
          status: 400,
          id: Math.random(),
          message: err.message
        })
      })
  }

  return (
    <ProjectSettingsSecretsView
      editableSecret={editableSecret}
      error={projectStore.project.secrets?.error}
      handleEditClick={handleEditClick}
      handleSecretDelete={handleSecretDelete}
      isCreateNewSecretDialogOpen={isCreateNewSecretDialogOpen}
      loading={projectStore.project.secrets?.loading}
      match={match}
      secrets={projectStore.project.secrets?.data ?? {}}
      setCreateNewSecretDialogOpen={setCreateNewSecretDialogOpen}
      setEditableSecret={setEditableSecret}
      setNotification={setNotification}
      setProjectSecrets={setProjectSecrets}
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
