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
import { useDispatch, useSelector } from 'react-redux'
import { createForm } from 'final-form'
import { cloneDeep, isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'

import {
  FormKeyValueTable,
  FormCheckBox,
  FormChipCell,
  FormInput,
  FormOnChange,
  FormTextarea,
  Tip,
  Loader
} from 'igz-controls/components'
import ChangeOwnerPopUp from '../ChangeOwnerPopUp/ChangeOwnerPopUp'

import projectsApi from '../../api/projects-api'
import {
  ARTIFACT_PATH,
  DEFAULT_IMAGE,
  DESCRIPTION,
  GOALS,
  KEY_CODES,
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
  setFieldState,
  clearArrayFromEmptyObjectElements
} from 'igz-controls/utils/form.util'
import { getChipOptions } from 'igz-controls/utils/chips.util'
import {
  getValidationRules,
  getInternalLabelsValidationRule
} from 'igz-controls/utils/validation.util'
import { parseChipsData, convertChipsData } from '../../utils/convertChipsData'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { areNodeSelectorsSupported } from './projectSettingsGeneral.utils'
import { fetchProject, removeProjectData } from '../../reducers/projectReducer'

import './projectSettingsGeneral.scss'

/* eslint-disable */
const ProjectSettingsGeneral = ({
  changeOwnerCallback,
  membersState,
  projectMembershipIsEnabled,
  projectOwnerIsShown
}) => {
  const [projectIsInitialized, setProjectIsInitialized] = useState(false)
  const [lastEditedProjectValues, setLastEditedProjectValues] = useState({})
  const internalLabelsValidatedRef = useRef(true)
  const projectStore = useSelector(store => store.projectStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)

  const formRef = useRef(
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
    if (!projectIsInitialized) {
      setProjectIsInitialized(true)

      dispatch(fetchProject({ project: params.projectName }))
        .unwrap()
        .then(response => {
          const newInitial = {
            [SOURCE_URL]: response?.data?.spec?.[SOURCE_URL],
            [ARTIFACT_PATH]: response?.data?.spec?.[ARTIFACT_PATH],
            [LOAD_SOURCE_ON_RUN]: response?.data?.spec?.[LOAD_SOURCE_ON_RUN],
            [DEFAULT_IMAGE]: response?.data?.spec?.[DEFAULT_IMAGE],
            [DESCRIPTION]: response?.data?.spec?.[DESCRIPTION],
            [GOALS]: response?.data?.spec?.[GOALS],
            [PARAMS]: parseObjectToKeyValue(response?.data?.spec?.[PARAMS] || {}),
            [LABELS]: parseChipsData(
              response?.data?.metadata?.[LABELS],
              frontendSpec.internal_labels || []
            )
          }

          if (areNodeSelectorsSupported) {
            newInitial[NODE_SELECTORS] = parseObjectToKeyValue(
              response?.data?.spec?.[NODE_SELECTORS]
            )
          }

          internalLabelsValidatedRef.current = !isEmpty(frontendSpec)
          setLastEditedProjectValues(newInitial)
          formStateRef.current.form.restart(newInitial)
        })
        .catch(error => {
          showErrorNotification(dispatch, error)
        })
    }
  }, [params.pageTab, params.projectName, dispatch, frontendSpec, projectIsInitialized])

  useEffect(() => {
    if (
      !isEmpty(frontendSpec) &&
      !isEmpty(lastEditedProjectValues) &&
      !internalLabelsValidatedRef.current
    ) {
      const parsedLabels = parseChipsData(
        projectStore.project.data?.metadata?.[LABELS],
        frontendSpec.internal_labels || []
      )

      formStateRef.current.form.change(LABELS, parsedLabels)
      setLastEditedProjectValues(state => ({
        ...state,
        [LABELS]: parsedLabels
      }))
      internalLabelsValidatedRef.current = true
    }
  }, [frontendSpec, projectStore.project.data, lastEditedProjectValues])

  useEffect(() => {
    return () => {
      dispatch(removeProjectData())
      setProjectIsInitialized(false)
    }
  }, [dispatch])

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
          showErrorNotification(dispatch, error, '', '', () =>
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
        !isEmpty(lastEditedProjectValues) &&
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
            [PARAMS]: generateObjectFromKeyValue(
              clearArrayFromEmptyObjectElements(formStateLocal.values[PARAMS])
            )
          },
          metadata: {
            ...newProjectData.metadata,
            [LABELS]: convertChipsData(formStateLocal.values[LABELS])
          }
        }

        if (areNodeSelectorsSupported) {
          newProjectData.spec[NODE_SELECTORS] = generateObjectFromKeyValue(
            clearArrayFromEmptyObjectElements(formStateLocal.values[NODE_SELECTORS])
          )
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
    <>
      {(projectStore.loading || projectStore.project.loading) && <Loader />}

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
                <>
                  <div className="settings__card-title">
                    <span>Project: {params.projectName || ''}</span>
                  </div>

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
                        <FormOnChange handler={updateProjectData} name={LOAD_SOURCE_ON_RUN} />
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
                          rows={5}
                          onBlur={updateProjectData}
                        />
                      </div>
                      <div className="settings__labels">
                        <FormChipCell
                          key={`${LABELS}_${internalLabelsValidatedRef.current}`}
                          chipOptions={getChipOptions('metrics')}
                          formState={formState}
                          initialValues={formState.initialValues}
                          isEditable={internalLabelsValidatedRef.current}
                          label="Labels"
                          name={LABELS}
                          shortChips
                          onExitEditModeCallback={updateProjectData}
                          visibleChipsMaxLength="all"
                          validationRules={{
                            key: getValidationRules(
                              'project.labels.key',
                              getInternalLabelsValidationRule(frontendSpec.internal_labels)
                            ),
                            value: getValidationRules('project.labels.value')
                          }}
                        />
                      </div>
                      {areNodeSelectorsSupported && (
                        <div>
                          <div className="settings__card-title">
                            <span>Node Selectors</span>
                            <Tip
                              text="Ensure that the node selectors you are configuring are compatible with the available nodes in your cluster. Incompatible node selectors will not be validated at the project level and might result in scheduling issues when running functions.
                          If there is a conflict with the function node selector you defined or if the pod cannot be scheduled for some reason, check the project/platform configuration Key:Value combinations to see if there is a node selection causing the issue. If, after consulting with the project/general admin, you want to delete a global setting, enter the Key here, but leave the Value empty."
                            />
                          </div>
                          <FormKeyValueTable
                            addNewItemLabel="Add node selector"
                            keyValidationRules={getValidationRules('nodeSelectors.key')}
                            valueValidationRules={getValidationRules('nodeSelectors.value')}
                            onExitEditModeCallback={updateProjectData}
                            fieldsPath={NODE_SELECTORS}
                            formState={formState}
                            isValueRequired={false}
                          />
                        </div>
                      )}
                    </div>
                    <div className="settings__card-content-col">
                      {!frontendSpec.ce?.version && (
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
                      )}
                      <div>
                        <p className="settings__card-title">Parameters</p>
                        <p className="settings__card-subtitle">
                          The parameters enable users to pass key/value to the project context that
                          can later be used for running jobs & pipelines
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
                </>
              )}
            </div>
          )
        }}
      </Form>
    </>
  )
}

ProjectSettingsGeneral.propTypes = {
  changeOwnerCallback: PropTypes.func.isRequired
}

export default ProjectSettingsGeneral
