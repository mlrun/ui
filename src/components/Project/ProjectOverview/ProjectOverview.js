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
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'

import { isEmpty } from 'lodash'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import Loader from '../../../common/Loader/Loader'
import NoData from '../../../common/NoData/NoData'
import ProjectAction from '../ProjectAction/ProjectAction'
import ProjectOverviewTableRow from '../ProjectOverviewTableRow/ProjectOverviewTableRow'
import {
  ConfirmDialog,
  FormCheckBox,
  // FormCheckBoxAll,
  FormInput,
  FormTextarea,
  FormRadio,
  FormSelect,
  Tooltip,
  TextTooltipTemplate,
  Wizard
} from 'igz-controls/components'

import projectActions from '../../../actions/projects'
import functionsActions from '../../../actions/functions'

import { handleClick, getInitialCards } from './ProjectOverview.util'
import { handleFetchProjectError } from '../project.utils'
import { parseFunctions } from '../../../utils/parseFunctions'
import { getDateAndTimeByFormat } from '../../../utils/'
import { openPopUp } from 'igz-controls/utils/common.util'
import { useModalBlockHistory } from '../../../hooks/useModalBlockHistory.hook'

import { ReactComponent as ArrowIcon } from 'igz-controls/images/arrow.svg'

import './ProjectOverview.scss'

const ProjectOverview = ({ fetchProject, fetchFunctions, project }) => {
  const [selectedActionsIndex, setSelectedActionsIndex] = useState(null)
  const [confirmData, setConfirmData] = useState(null)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const cards = useMemo(() => {
    return params.projectName ? getInitialCards(params.projectName, navigate) : {}
  }, [params, navigate])

  const handlePathExecution = handleClick(navigate, openPopUp)

  const handleActionsViewToggle = index => {
    if (selectedActionsIndex === index) {
      return setSelectedActionsIndex(null)
    }
    setSelectedActionsIndex(index)
  }

  useEffect(() => {
    fetchProject(params.projectName).catch(error =>
      handleFetchProjectError(error, navigate, setConfirmData)
    )
  }, [fetchProject, navigate, params.projectName])

  useEffect(() => {
    fetchFunctions(params.projectName).then(functions =>
      parseFunctions(functions, params.projectName)
    )
  }, [fetchFunctions, params.projectName])

  if (project.loading) {
    return <Loader />
  }

  if (project.error) {
    return (
      <div className="project__error-container">
        {confirmData ? (
          <ConfirmDialog
            closePopUp={confirmData.confirmHandler}
            confirmButton={{
              handler: confirmData.confirmHandler,
              label: confirmData.btnConfirmLabel,
              variant: confirmData.btnConfirmType
            }}
            isOpen={confirmData}
            message={confirmData.message}
            messageOnly={confirmData.messageOnly}
          />
        ) : (
          <h1>{project.error.message}</h1>
        )}
      </div>
    )
  }

  if (isEmpty(project.data)) {
    return <NoData />
  }

  const checkboxMock = [
    {
      label: 'Test mock 1',
      value: 'testmock1',
      disabled: true
    },
    {
      label: 'Test mock 2',
      value: 'testmock2'
    },
    {
      label: 'Test mock 3',
      value: 'testmock3'
    },
    {
      label: 'Test mock 3',
      value: 'testmock4'
    }
  ]

  const Test = ({ isOpen, onResolve }) => {
    const formRef = React.useRef(
      createForm({
        initialValues: { rangeInput: '4' },
        onSubmit: () => {}
      })
    )

    const { handleCloseModal } = useModalBlockHistory(onResolve, formRef.current)

    const stepsConfig = [
      {
        id: 'step1',
        label: 'Step 1'
      },
      {
        getActions: ({ goToNextStep, goToPreviousStep }) => [
          {
            label: 'Custom',
            onClick: goToPreviousStep
          },
          {
            label: 'Next',
            onClick: goToNextStep,
            variant: 'secondary'
          },
          {
            label: 'Custom 2',
            onClick: goToNextStep,
            variant: 'secondary'
          }
        ],
        id: 'step2',
        label: 'Step 2'
      },
      {
        getActions: ({ formState, handleOnClose }) => [
          {
            label: 'Cancel',
            onClick: handleOnClose,
            variant: 'danger'
          },
          {
            label: 'Submit form',
            onClick: formState.handleSubmit,
            variant: 'secondary'
          }
        ],
        id: 'step3',
        label: 'Final Step'
      }
    ]

    const submitForm = val => {
      console.log('submit', val)
    }

    return (
      <Form form={formRef.current} onSubmit={submitForm}>
        {formState => {
          return (
            <>
              <Wizard
                id="deployModal"
                initialValues={{}}
                isWizardOpen={isOpen}
                formState={formState}
                onWizardResolve={handleCloseModal}
                onWizardSubmit={formState.handleSubmit}
                location={location}
                size="md"
                title="Test modal"
                stepsConfig={stepsConfig}
              >
                <Wizard.Step>
                  <div className="form">
                    {/* <FormCheckBoxAll
                      listenTo="TestCheckBoxes2"
                      allCheckboxes={checkboxMock.map(checkbox => checkbox.value)}
                      label="Check all"
                    /> */}
                    <div className="form-row">
                      {checkboxMock.map(checkbox => (
                        <div className="form-col" key={checkbox.value}>
                          <FormCheckBox name="TestCheckBoxes2" {...checkbox} />
                        </div>
                      ))}
                    </div>
                    <FormInput
                      className="resources__range"
                      density="dense"
                      invalidText="Request must be less than or equal to Limit and not be less than 1"
                      label="Request"
                      name="rangeInput"
                      min="1"
                      type="number"
                      validator={value => value < 1}
                      required
                    />
                    <div className="form-row">
                      <FormSelect
                        multiple
                        label="Multi Choice"
                        name="selectTest"
                        options={[
                          {
                            id: 'general',
                            value: 'general',
                            label: 'General',

                            status: 'failed'
                          },
                          {
                            id: 'chart',
                            value: 'chart',
                            label: 'Chart',

                            status: 'sucsess'
                          },
                          {
                            id: 'plot',
                            value: 'plot',
                            label: 'Plot'
                          },
                          {
                            id: 'table',
                            value: 'table',
                            label: 'Table'
                          }
                        ]}
                      />
                    </div>
                    <div className="form-row">
                      <FormSelect
                        required
                        label="Select Choice"
                        name="selectTest2"
                        options={[
                          {
                            label: 'init_compute',
                            id: 'init_compute',
                            subLabel:
                              'Initialize Azure ML compute target to run experiment. Checks for\nexisting compute target and creates new if does not exist.'
                          },
                          {
                            label: 'register_dataset',
                            id: 'register_dataset',
                            subLabel:
                              'Register dataset object (can be also an Iguazio FeatureVector) in Azure ML.\nUploads parquet file to Azure blob storage and registers\nthat file as a dataset in Azure ML.'
                          },
                          {
                            label: 'download_model',
                            id: 'download_model',
                            subLabel: 'Download trained model from Azure ML to local filesystem.'
                          },
                          {
                            label: 'upload_model',
                            id: 'upload_model',
                            subLabel: 'Upload pre-trained model from local filesystem to Azure ML.'
                          },
                          {
                            label: 'submit_training_job',
                            id: 'submit_training_job',
                            subLabel:
                              'Submit training job to Azure AutoML and download trained model\nwhen completed. Uses previously registered dataset for training.'
                          },
                          {
                            label: 'train',
                            id: 'train',
                            subLabel:
                              'Whole training flow for Azure AutoML. Registers dataset/feature vector,\nsubmits training job to Azure AutoML, and downloads trained model\nwhen completed.'
                          }
                        ]}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-col">
                        <FormRadio name="sauces2" label="test 4" value="test4" disabled={true} />
                      </div>
                      <div className="form-col">
                        <FormRadio name="sauces2" label="test 6" value="test5" />
                      </div>
                      <div className="form-col">
                        <FormRadio name="sauces2" label="test 7" value="test6" />
                      </div>
                    </div>
                    <div className="form-row">
                      {/* <CheachAll /> */}
                      <FormInput name="inputText" label="write" />
                    </div>
                    <div className="form-row">
                      <FormTextarea name="inputTextarea" label="write2" />
                    </div>
                    <pre>{JSON.stringify(formState, null, 2)}</pre>
                  </div>
                </Wizard.Step>
                <Wizard.Step>
                  Step2
                  <pre>{JSON.stringify(formState, null, 2)}</pre>
                </Wizard.Step>
                <Wizard.Step>
                  Step3
                  <pre>{JSON.stringify(formState, null, 2)}</pre>
                </Wizard.Step>
              </Wizard>
            </>
          )
        }}
      </Form>
    )
  }

  const openModal = () =>
    openPopUp(Test)
      .then(() => {})
      .catch(() => {})

  return (
    <div className="project-overview">
      <button onClick={openModal}>Open me</button>
      {/* <div className="form-row">
        <FormCheckBoxAll listenTo="TestCheckBoxes" label="Check all" noform="true" />
        {checkboxMock.map(checkbox => (
          <div className="form-col" key={checkbox.value}>
            <FormCheckBox
              name="TestCheckBoxes"
              noform="true"
              onChange={e => console.log(e.target.id)}
              {...checkbox}
            />
          </div>
        ))}
      </div> */}
      <div className="project-overview__header">
        <div className="project-overview__header-title">
          {project.data.metadata.name}
          <Tooltip template={<TextTooltipTemplate text={project.data.status.state} />}>
            <i className={`state-${project.data.status.state}-job status-icon`} />
          </Tooltip>
        </div>
        <div className="project-overview__header-subtitle">
          <div>
            <span className="project-overview__header-subtitle-name">Created:</span>
            <span>
              {getDateAndTimeByFormat(project.data.metadata.created, 'YYYY-MM-DD, HH:mm:ss A')}
            </span>
          </div>
          <div>
            <span className="project-overview__header-subtitle-name">Owner:</span>
            <span>{project.data.spec.owner}</span>
          </div>
        </div>
        <p className="project-overview__header-description">
          {project.data.spec.description ?? ''}
        </p>
      </div>
      <div className="project-overview__content">
        {/* move to card */}
        {Object.keys(cards).map((card, index) => {
          const { additionalLinks, actions, subTitle, title } = cards[card]
          return (
            <div className="project-overview-card" key={card}>
              <div className="project-overview-card__top">
                <div className="project-overview-card__header">
                  <h3 className="project-overview-card__header-title">{title}</h3>
                  <p className="project-overview-card__header-subtitle">{subTitle ?? ''}</p>
                </div>
                <div className="project-overview-card__actions">
                  <ProjectAction
                    actions={actions.slice(0, 3)}
                    onClick={handlePathExecution}
                    showActions={true}
                  />
                  <ProjectAction
                    actions={actions.slice(3, actions.length)}
                    onClick={handlePathExecution}
                    showActions={selectedActionsIndex === index}
                  />
                  {actions.length > 3 && (
                    <p
                      className="project-overview-card__actions-toogler"
                      aria-expanded={selectedActionsIndex === index}
                      onClick={() => handleActionsViewToggle(index)}
                    >
                      <ArrowIcon />
                      <span>Additional Actions</span>
                    </p>
                  )}
                </div>
              </div>
              <div
                className="project-overview-card__center"
                aria-expanded={selectedActionsIndex === index}
              >
                <ProjectOverviewTableRow />
              </div>
              <div className="project-overview-card__bottom">
                <div className="additional-links">
                  {additionalLinks &&
                    additionalLinks.map(({ id, label, handleClick }) => (
                      <span
                        key={id}
                        className="link"
                        onClick={() => handlePathExecution(handleClick)}
                      >
                        {label}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const actionCreators = {
  fetchProject: projectActions.fetchProject,
  fetchFunctions: functionsActions.fetchFunctions
}

export default connect(
  ({ projectStore }) => ({
    project: projectStore.project
  }),
  { ...actionCreators }
)(ProjectOverview)
