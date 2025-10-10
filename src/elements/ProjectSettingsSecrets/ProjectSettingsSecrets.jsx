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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import { useDispatch, useSelector } from 'react-redux'
import { createForm } from 'final-form'
import { differenceWith, isEmpty, isEqual } from 'lodash'
import { useParams } from 'react-router-dom'
import arrayMutators from 'final-form-arrays'

import { FormKeyValueTable, Loader } from 'igz-controls/components'

import {
  ADD_PROJECT_SECRET,
  DELETE_PROJECT_SECRET,
  EDIT_PROJECT_SECRET
} from './ProjectSettingsSecrets.utils'
import projectApi from '../../api/projects-api'
import { areFormValuesChanged, setFieldState } from 'igz-controls/utils/form.util'
import { fetchProjectSecrets, removeProjectData } from '../../reducers/projectReducer'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

const ProjectSettingsSecrets = ({ setNotification }) => {
  const [modifyingIsInProgress, setModifyingIsInProgress] = useState(false)
  const [lastEditedFormValues, setLastEditedFormValues] = useState({})
  const [isUserAllowed, setIsUserAllowed] = useState(true)
  const params = useParams()
  const dispatch = useDispatch()
  const projectStore = useSelector(store => store.projectStore)
  const formRef = React.useRef(
    createForm({
      initialValues: {},
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )
  const formStateRef = useRef(null)

  const fetchSecrets = useCallback(() => {
    setIsUserAllowed(true)
    dispatch(fetchProjectSecrets({ project: params.projectName }))
      .unwrap()
      .catch(error => {
        showErrorNotification(dispatch, error, '', '', () => {
          fetchSecrets()
        })
      })
  }, [dispatch, params.projectName])

  useEffect(() => {
    fetchSecrets()

    return () => {
      dispatch(removeProjectData())
    }
  }, [dispatch, fetchSecrets, params.projectName])

  useEffect(() => {
    const formSecrets = projectStore.project.secrets?.data['secret_keys']
      ? projectStore.project.secrets.data['secret_keys'].map(secret => ({
          data: {
            key: secret,
            value: ''
          }
        }))
      : []
    const newInitial = {
      secrets: formSecrets
    }

    setLastEditedFormValues(newInitial)
    formStateRef.current.form.restart(newInitial)
  }, [projectStore.project.secrets.data])

  const modifyProjectSecret = useCallback(
    (modificationType, requestData) => {
      setModifyingIsInProgress(true)
      const updateSecret =
        modificationType === ADD_PROJECT_SECRET || modificationType === EDIT_PROJECT_SECRET
          ? projectApi.setProjectSecret
          : projectApi.deleteSecret

      updateSecret(params.projectName, requestData)
        .then(() => {
          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: `Secret ${
                modificationType === DELETE_PROJECT_SECRET
                  ? 'deleted'
                  : modificationType === EDIT_PROJECT_SECRET
                    ? 'edited'
                    : 'added'
              } successfully`
            })
          )
        })
        .catch(error => {
          showErrorNotification(dispatch, error)
          fetchSecrets()
        })
        .finally(() => setModifyingIsInProgress(false))
    },
    [dispatch, fetchSecrets, params.projectName, setNotification]
  )

  const updateSecretsData = useCallback(() => {
    setTimeout(() => {
      const formStateLocal = formStateRef.current

      if (
        areFormValuesChanged(lastEditedFormValues, formStateLocal.values) &&
        formStateLocal.valid
      ) {
        const modificationType =
          formStateLocal.values.secrets.length > lastEditedFormValues.secrets.length
            ? ADD_PROJECT_SECRET
            : formStateLocal.values.secrets.length === lastEditedFormValues.secrets.length
              ? EDIT_PROJECT_SECRET
              : DELETE_PROJECT_SECRET
        const primarySecretsArray =
          modificationType === DELETE_PROJECT_SECRET
            ? lastEditedFormValues.secrets
            : formStateLocal.values.secrets
        const secondarySecretsArray =
          modificationType === DELETE_PROJECT_SECRET
            ? formStateLocal.values.secrets
            : lastEditedFormValues.secrets
        const differences = differenceWith(primarySecretsArray, secondarySecretsArray, isEqual)

        if (!isEmpty(differences)) {
          const changedData = differences[0].data
          const newSecrets = formStateLocal.values.secrets.map(secretData => ({
            data: { key: secretData.data.key, value: '' }
          }))
          const newFormValues = { secrets: newSecrets }
          const requestData =
            modificationType === DELETE_PROJECT_SECRET
              ? changedData.key
              : { provider: 'kubernetes', secrets: { [changedData.key]: changedData.value } }

          setLastEditedFormValues(newFormValues)
          formStateRef.current.form.restart(newFormValues)
          modifyProjectSecret(modificationType, requestData)
        }
      }
    })
  }, [modifyProjectSecret, lastEditedFormValues])

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => {
        formStateRef.current = formState

        return (
          <div className="settings__card">
            {projectStore.project.secrets?.loading ? (
              <Loader />
            ) : !isUserAllowed ? (
              <div>
                <h1>You don't have access to this project's secrets</h1>
              </div>
            ) : (
              <div className="settings__card-content">
                <div className="settings__card-content-col">
                  <p className="settings__card-subtitle">
                    These secrets are automatically available to all jobs belonging to this project
                    that are not executed locally. See{' '}
                    <a
                      href="https://docs.mlrun.org/en/latest/secrets.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      Secrets
                    </a>
                  </p>
                  <FormKeyValueTable
                    addNewItemLabel="Add secret"
                    isKeyEditable={false}
                    isValuePassword={true}
                    valueType="password"
                    disabled={modifyingIsInProgress}
                    keyValidationRules={getValidationRules('project.secrets.key')}
                    onExitEditModeCallback={updateSecretsData}
                    fieldsPath="secrets"
                    formState={formState}
                  />
                </div>
              </div>
            )}
          </div>
        )
      }}
    </Form>
  )
}

ProjectSettingsSecrets.propTypes = {
  setNotification: PropTypes.func.isRequired
}

export default ProjectSettingsSecrets
