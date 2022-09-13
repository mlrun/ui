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
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import projectApi from '../../api/projects-api'
import projectsAction from '../../actions/projects'
import ProjectSettingsSecretsView from './ProjectSettingsSecretsView'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
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
      if (error.response?.status === FORBIDDEN_ERROR_STATUS_CODE) {
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
