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
import React, { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import arrayMutators from 'final-form-arrays'
import { Form } from 'react-final-form'
import { connect, useDispatch } from 'react-redux'
import { createForm } from 'final-form'
import { cloneDeep, isBoolean } from 'lodash'
import { useParams } from 'react-router-dom'

import {
  FormKeyValueTable,
  FormCheckBox,
  FormChipCell,
  FormInput,
  FormTextarea
} from 'igz-controls/components'
import ChangeOwnerPopUp from '../ChangeOwnerPopUp/ChangeOwnerPopUp'
import Loader from '../../common/Loader/Loader'
import FormOnChange from '../../common/FormOnChange/FormOnChange'

import projectsAction from '../../actions/projects'
import projectsApi from '../../api/projects-api'
import {
  ARTIFACT_PATH,
  DEFAULT_IMAGE,
  DESCRIPTION,
  GOALS,
  LABELS,
  LOAD_SOURCE_ON_RUN,
  NODE_SELECTORS,
  PARAMS,
  SOURCE_URL
} from '../../constants'
import {
  areFormValuesChanged,
  generateObjectFromKeyValue,
  parseObjectToKeyValue,
  setFieldState
} from 'igz-controls/utils/form.util'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { KEY_CODES } from '../../constants'
import { getChipOptions } from '../../utils/getChipOptions'
import { getErrorMsg } from 'igz-controls/utils/common.util'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { parseChipsData, convertChipsData } from '../../utils/convertChipsData'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'

import './projectSettingsGeneral.scss'

const ProjectSettingsGeneral = ({
  changeOwnerCallback,
  fetchProject,
  frontendSpec,
  membersState,
  projectStore,
  projectMembershipIsEnabled,
  projectOwnerIsShown,
  removeProjectData
}) => {
  const [lastEditedProjectValues, setLastEditedProjectValues] = useState({})
  const formRef = React.useRef(
    createForm({
      initialValues: {},
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )
  const formStateRef = useRef(null)
  const params = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    fetchProject(params.projectName)
      .then(projectResponse => {
        setTimeout(() => {
          const newInitial = {
            [SOURCE_URL]: projectResponse.spec[SOURCE_URL],
            [ARTIFACT_PATH]: projectResponse.spec[ARTIFACT_PATH],
            [LOAD_SOURCE_ON_RUN]: projectResponse.spec[LOAD_SOURCE_ON_RUN],
            [DEFAULT_IMAGE]: projectResponse.spec[DEFAULT_IMAGE],
            [DESCRIPTION]: projectResponse.spec[DESCRIPTION],
            [GOALS]: projectResponse.spec[GOALS],
            [PARAMS]: parseObjectToKeyValue(projectResponse.spec[PARAMS]),
            [NODE_SELECTORS]: parseObjectToKeyValue(projectResponse.spec[NODE_SELECTORS]),
            [LABELS]: parseChipsData(projectResponse.metadata[LABELS])
          }

          setLastEditedProjectValues(newInitial)
          formStateRef.current.form.restart(newInitial)
        }, 10)
      })
      .catch(error => {
        const customErrorMsg =
          error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
            ? 'Permission denied'
            : getErrorMsg(error, 'Failed to fetch project data')

        showErrorNotification(dispatch, error, '', customErrorMsg)
      })

    return () => {
      removeProjectData()
    }
  }, [removeProjectData, params.pageTab, params.projectName, fetchProject, dispatch])

  const sendProjectSettingsData = useCallback(
    projectData => {
      projectsApi
        .editProject(params.projectName, projectData)
        .then(() => {
          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: 'Data was edited successfully'
            })
          )
        })
        .catch(error => {
          const customErrorMsg =
            error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
              ? 'Missing edit permission for the project'
              : getErrorMsg(error, 'Failed to edit project data')

          showErrorNotification(dispatch, error, '', customErrorMsg, () =>
            sendProjectSettingsData(projectData)
          )
        })
    },

    [dispatch, params.projectName]
  )

  const updateProjectData = useCallback(() => {
    setTimeout(() => {
      const formStateLocal = formStateRef.current

      if (
        areFormValuesChanged(lastEditedProjectValues, formStateLocal.values) &&
        formStateLocal.valid
      ) {
        let newProjectData = cloneDeep(projectStore.project.data)

        newProjectData = {
          ...newProjectData,
          spec: {
            ...newProjectData.spec,
            [SOURCE_URL]: formStateLocal.values[SOURCE_URL] ?? '',
            [ARTIFACT_PATH]: formStateLocal.values[ARTIFACT_PATH] ?? '',
            [LOAD_SOURCE_ON_RUN]: formStateLocal.values[LOAD_SOURCE_ON_RUN],
            [DEFAULT_IMAGE]: formStateLocal.values[DEFAULT_IMAGE] ?? '',
            [DESCRIPTION]: formStateLocal.values[DESCRIPTION] ?? '',
            [GOALS]: formStateLocal.values[GOALS] ?? '',
            [NODE_SELECTORS]: generateObjectFromKeyValue(formStateLocal.values[NODE_SELECTORS]),
            [PARAMS]: generateObjectFromKeyValue(formStateLocal.values[PARAMS])
          },
          metadata: {
            ...newProjectData.metadata,
            [LABELS]: convertChipsData(formStateLocal.values[LABELS])
          }
        }

        setLastEditedProjectValues(formStateLocal.values)
        sendProjectSettingsData(newProjectData)
      }
    })
  }, [lastEditedProjectValues, projectStore.project.data, sendProjectSettingsData])

  const handleOnKeyDown = useCallback(event => {
    if (event.keyCode === KEY_CODES.ENTER) {
      event.preventDefault()
      event.target.blur()
    }
  }, [])

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => {
        formStateRef.current = formState

        return (
          <div className="settings__card">
            {projectStore.project.loading ? (
              <Loader />
            ) : projectStore.project.error ? (
              <div>
                <h1>{projectStore.project.error.message}</h1>
              </div>
            ) : (
              <div className="settings__card-content">
                <div className="settings__card-content-col">
                  <div className="settings__source">
                    <FormInput
                      className="source-url"
                      name={SOURCE_URL}
                      label="Source URL"
                      tip="Source URL is the Git Repo that is associated with the project. When the user pulls the project it will use the source URL to pull from"
                      link={{ show: true }}
                      onBlur={updateProjectData}
                      onKeyDown={handleOnKeyDown}
                    />
                    <FormCheckBox
                      className="pull-at-runtime"
                      label="Pull at runtime"
                      name={LOAD_SOURCE_ON_RUN}
                    />
                    <FormOnChange handler={(curr, prev) => {
                      if (isBoolean(prev)) {
                        updateProjectData()
                      }
                    }} name={LOAD_SOURCE_ON_RUN} />
                  </div>
                  <div className="settings__artifact-path">
                    <FormInput
                      name={ARTIFACT_PATH}
                      label="Artifact path"
                      onBlur={updateProjectData}
                      onKeyDown={handleOnKeyDown}
                      placeholder={frontendSpec.default_artifact_path ?? ''}
                    />
                    <span className="settings__artifact-path-link">
                      Enter the default path for saving the artifacts within your
                      projectStore.project.
                      <a
                        className="link"
                        href="https://docs.mlrun.org/en/latest/store/artifacts.html"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Read more
                      </a>
                    </span>
                  </div>
                  <div className="settings__default-image">
                    <FormInput
                      name={DEFAULT_IMAGE}
                      label="Default image"
                      onBlur={updateProjectData}
                      onKeyDown={handleOnKeyDown}
                    />
                  </div>
                  <div className="settings__description" data-testid="project-description">
                    <FormTextarea
                      maxLength={255}
                      name={DESCRIPTION}
                      label="Project description"
                      onBlur={updateProjectData}
                    />
                  </div>
                  <div className="settings__goals" data-testid="project-goals">
                    <FormTextarea
                      name={GOALS}
                      label="Project goals"
                      rows="5"
                      onBlur={updateProjectData}
                    />
                  </div>
                  <div className="settings__labels">
                    <FormChipCell
                      chipOptions={getChipOptions('metrics')}
                      formState={formState}
                      initialValues={formState.initialValues}
                      isEditable
                      label="Labels"
                      name={LABELS}
                      shortChips
                      onExitEditModeCallback={updateProjectData}
                      visibleChipsMaxLength="all"
                      validationRules={{
                        key: getValidationRules('project.labels.key'),
                        value: getValidationRules('project.labels.value')
                      }}
                    />
                  </div>
                  <div>
                    <p className="settings__card-title">Node Selectors</p>
                    <FormKeyValueTable
                      addNewItemLabel="Add node selector"
                      keyValidationRules={getValidationRules('nodeSelectors.key')}
                      valueValidationRules={getValidationRules('nodeSelectors.value')}
                      onExitEditModeCallback={updateProjectData}
                      fieldsPath={NODE_SELECTORS}
                      formState={formState}
                    />
                  </div>
                </div>
                <div className="settings__card-content-col">
                  <div className="settings__owner">
                    <div className="settings__owner-row">
                      <div className="row-value">
                        <span className="row-label">Owner:</span>
                        <span className="row-name">
                          {membersState.projectInfo?.owner?.username ||
                            projectStore.project.data?.spec?.owner}
                        </span>
                      </div>
                    </div>
                    {projectMembershipIsEnabled && projectOwnerIsShown && (
                      <ChangeOwnerPopUp
                        changeOwnerCallback={changeOwnerCallback}
                        projectId={membersState.projectInfo.id}
                      />
                    )}
                  </div>
                  <div>
                    <p className="settings__card-title">Parameters</p>
                    <p className="settings__card-subtitle">
                      The parameters enable users to pass key/value to the project context that can
                      later be used for running jobs & pipelines
                    </p>
                    <FormKeyValueTable
                      addNewItemLabel="Add parameter"
                      keyValidationRules={getValidationRules('project.params.key')}
                      valueValidationRules={getValidationRules('project.params.value')}
                      onExitEditModeCallback={updateProjectData}
                      fieldsPath={PARAMS}
                      formState={formState}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      }}
    </Form>
  )
}

ProjectSettingsGeneral.propTypes = {
  changeOwnerCallback: PropTypes.func.isRequired
}

export default connect(
  ({ appStore, projectStore }) => ({
    projectStore,
    frontendSpec: appStore.frontendSpec
  }),
  { ...projectsAction }
)(ProjectSettingsGeneral)
