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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import arrayMutators from 'final-form-arrays'
import { Form } from 'react-final-form'
import { connect, useDispatch } from 'react-redux'
import { createForm } from 'final-form'
import { isEmpty } from 'lodash'
import { useLocation, useNavigate } from 'react-router-dom'

import FormDirtySpy from '../../common/FormDirtySpy/FormDirtySpy'
import JobWizardAdvanced from './JobWizardSteps/JobWizardAdvanced/JobWizardAdvanced'
import JobWizardDataInputs from './JobWizardSteps/JobWizardDataInputs/JobWizardDataInputs'
import JobWizardFunctionSelection from './JobWizardSteps/JobWizardFunctionSelection/JobWizardFunctionSelection'
import JobWizardHyperparameterStrategy from './JobWizardSteps/JobWizardHyperparameterStrategy/JobWizardHyperparameterStrategy'
import JobWizardParameters from './JobWizardSteps/JobWizardParameters/JobWizardParameters'
import JobWizardResources from './JobWizardSteps/JobWizardResources/JobWizardResources'
import JobWizardRunDetails from './JobWizardSteps/JobWizardRunDetails/JobWizardRunDetails'
import Loader from '../../common/Loader/Loader'
import { Wizard } from 'igz-controls/components'

import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import projectsAction from '../../actions/projects'
import { MODAL_MAX } from 'igz-controls/constants'
import { generateJobRequestData, getNewJobErrorMsg, getSaveJobErrorMsg } from './JobWizard.util'
import { resetModalFilter } from '../../reducers/filtersReducer'
import { scheduledJobsActionCreator } from '../Jobs/ScheduledJobs/scheduledJobs.util'
import { setFieldState } from 'igz-controls/utils/form.util'
import { setNotification } from '../../reducers/notificationReducer'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import {
  JOB_WIZARD_FILTERS,
  MONITOR_JOBS_TAB,
  PANEL_CREATE_MODE,
  PANEL_EDIT_MODE,
  PANEL_FUNCTION_CREATE_MODE,
  PANEL_RERUN_MODE,
  SCHEDULE_TAB
} from '../../constants'
import { JOB_WIZARD_MODE } from '../../types'

import './jobWizard.scss'

const JobWizard = ({
  defaultData,
  editJob,
  fetchFunctionTemplate,
  fetchHubFunction,
  frontendSpec,
  functionsStore,
  isBatchInference,
  isOpen,
  jobsStore,
  mode,
  onResolve,
  onSuccessRequest,
  onWizardClose,
  params,
  removeJobFunction,
  runNewJob,
  wizardTitle
}) => {
  const formRef = React.useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators, setFieldState },
      initialValues: {}
    })
  )
  const isEditMode = useMemo(() => mode === PANEL_EDIT_MODE || mode === PANEL_RERUN_MODE, [mode])
  const [selectedFunctionData, setSelectedFunctionData] = useState({})
  const [filteredFunctions, setFilteredFunctions] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [functions, setFunctions] = useState([])
  const [templatesCategories, setTemplatesCategories] = useState({})
  const [templates, setTemplates] = useState([])
  const [jobAdditionalData, setJobAdditionalData] = useState({})
  const [showSchedule, setShowSchedule] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const scheduleButtonRef = useRef()

  const closeModal = useCallback(() => {
    dispatch(resetModalFilter(JOB_WIZARD_FILTERS))
    removeJobFunction()
    onResolve()
    onWizardClose && onWizardClose()
  }, [dispatch, onResolve, onWizardClose, removeJobFunction])

  const { handleCloseModal, resolveModal } = useModalBlockHistory(closeModal, formRef.current)

  const getStepsConfig = formState => {
    return [
      {
        id: 'functionSelection',
        label: 'Function Selection',
        isHidden: isEditMode || isBatchInference || mode === PANEL_FUNCTION_CREATE_MODE,
        getActions: ({ handleSubmit }) => [
          {
            label: 'Back',
            disabled: true
          },
          {
            label: 'Next',
            disabled: isEmpty(selectedFunctionData),
            onClick: handleSubmit,
            variant: 'secondary'
          }
        ]
      },
      {
        id: 'runDetails',
        label: 'Run Details'
      },
      {
        id: 'dataInputs',
        label: 'Data Inputs'
      },
      {
        id: 'parameters',
        label: 'Parameters'
      },
      {
        id: 'hyperparameterStrategy',
        label: 'Hyperparameter strategy',
        isHidden: !formState.values.runDetails?.hyperparameter || isBatchInference
      },
      {
        id: 'resources',
        label: 'Resources'
      },
      {
        id: 'advanced',
        label: 'Advanced',
        getActions: ({ handleSubmit }) => [
          {
            label: isBatchInference ? 'Schedule Infer' : 'Schedule for later',
            onClick: () => {
              setShowSchedule(state => !state)
            },
            variant: 'tertiary',
            ref: scheduleButtonRef
          },
          {
            label: mode === PANEL_EDIT_MODE ? 'Save' : isBatchInference ? 'Infer now' : 'Run',
            onClick: () => handleSubmit(),
            variant: 'secondary'
          }
        ]
      }
    ]
  }

  useEffect(() => {
    if (isBatchInference) {
      fetchHubFunction('batch_inference').then(hubFunction => {
        const functionTemplatePath = `${hubFunction.spec.item_uri}${hubFunction.spec.assets.function}`

        fetchFunctionTemplate(functionTemplatePath).then(functionData => {
          setSelectedFunctionData(functionData)
        })
      })
    }
  }, [fetchFunctionTemplate, fetchHubFunction, isBatchInference])

  useEffect(() => {
    if (!isEmpty(jobsStore.jobFunc)) {
      if ([PANEL_EDIT_MODE, PANEL_RERUN_MODE].includes(mode)) {
        setSelectedFunctionData(jobsStore.jobFunc)
      } else if (mode === PANEL_FUNCTION_CREATE_MODE) {
        setSelectedFunctionData({
          name: jobsStore.jobFunc.metadata.name,
          functions: [jobsStore.jobFunc]
        })
      }
    }
  }, [editJob, jobsStore, mode])

  const runJobHandler = (formData, selectedFunctionData, params, isSchedule) => {
    const jobRequestData = generateJobRequestData(
      formData,
      selectedFunctionData,
      params,
      mode,
      isSchedule
    )

    runNewJob(jobRequestData)
      .then(() => {
        resolveModal()
        onSuccessRequest && onSuccessRequest()
        dispatch(
          setNotification({
            status: 200,
            id: Math.random(),
            message: 'Job started successfully'
          })
        )
      })
      .then(() => {
        return navigate(
          `/projects/${params.projectName}/jobs/${isSchedule ? SCHEDULE_TAB : MONITOR_JOBS_TAB}`
        )
      })
      .catch(error => {
        dispatch(
          setNotification({
            status: error.response.status || 400,
            id: Math.random(),
            message: getNewJobErrorMsg(error)
          })
        )
      })
  }

  const editJobHandler = (formData, selectedFunctionData, params) => {
    const jobRequestData = generateJobRequestData(
      formData,
      selectedFunctionData,
      params,
      mode,
      true
    )
    const credentials = jobRequestData.function?.metadata?.credentials

    delete jobRequestData.function.metadata

    editJob(
      {
        credentials,
        scheduled_object: jobRequestData,
        cron_trigger: jobRequestData.schedule
      },
      params.projectName
    )
      .then(() => {
        resolveModal()
        onSuccessRequest && onSuccessRequest()
        dispatch(
          setNotification({
            status: 200,
            id: Math.random(),
            message: 'Job saved successfully'
          })
        )
      })
      .then(() => {
        navigate(`/projects/${params.projectName}/jobs/${SCHEDULE_TAB}`)
      })
      .catch(error => {
        dispatch(
          setNotification({
            status: error.response.status || 400,
            id: Math.random(),
            message: getSaveJobErrorMsg(error)
          })
        )
      })
  }

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => {
        return (
          <>
            <Wizard
              className="form"
              formState={formState}
              id="jobWizard"
              isWizardOpen={isOpen}
              location={location}
              onWizardResolve={() => {
                handleCloseModal()
              }}
              onWizardSubmit={formData => {
                if (mode === PANEL_EDIT_MODE) {
                  editJobHandler(formData, selectedFunctionData, params)
                } else {
                  runJobHandler(formData, selectedFunctionData, params)
                }
              }}
              size={MODAL_MAX}
              stepsConfig={getStepsConfig(formState)}
              title={wizardTitle}
              subTitle={formState.values?.runDetails?.name}
            >
              {!isEditMode && !isBatchInference && mode !== PANEL_FUNCTION_CREATE_MODE && (
                <JobWizardFunctionSelection
                  defaultData={defaultData}
                  filteredFunctions={filteredFunctions}
                  filteredTemplates={filteredTemplates}
                  formState={formState}
                  frontendSpec={frontendSpec}
                  functions={functions}
                  isEditMode={isEditMode}
                  params={params}
                  selectedFunctionData={selectedFunctionData}
                  setFilteredFunctions={setFilteredFunctions}
                  setFilteredTemplates={setFilteredTemplates}
                  setFunctions={setFunctions}
                  setJobAdditionalData={setJobAdditionalData}
                  setSelectedFunctionData={setSelectedFunctionData}
                  setTemplates={setTemplates}
                  setTemplatesCategories={setTemplatesCategories}
                  templates={templates}
                  templatesCategories={templatesCategories}
                />
              )}
              <JobWizardRunDetails
                defaultData={defaultData}
                formState={formState}
                frontendSpec={frontendSpec}
                isBatchInference={isBatchInference}
                isEditMode={isEditMode}
                jobAdditionalData={jobAdditionalData}
                selectedFunctionData={selectedFunctionData}
                setJobAdditionalData={setJobAdditionalData}
              />
              <JobWizardDataInputs formState={formState} />
              <JobWizardParameters formState={formState} />
              {formState.values.runDetails?.hyperparameter && (
                <JobWizardHyperparameterStrategy formState={formState} />
              )}
              <JobWizardResources formState={formState} frontendSpec={frontendSpec} />
              <JobWizardAdvanced
                editJob={editJobHandler}
                formState={formState}
                mode={mode}
                params={params}
                runJob={runJobHandler}
                scheduleButtonRef={scheduleButtonRef}
                selectedFunctionData={selectedFunctionData}
                setShowSchedule={setShowSchedule}
                showSchedule={showSchedule}
              />
            </Wizard>
            <FormDirtySpy />
            {(functionsStore.loading || jobsStore.loading) && <Loader />}
          </>
        )
      }}
    </Form>
  )
}

JobWizard.defaultProps = {
  defaultData: {},
  isBatchInference: false,
  mode: PANEL_CREATE_MODE,
  onSuccessRequest: () => {},
  onWizardClose: () => {},
  wizardTitle: 'Batch run'
}

JobWizard.propTypes = {
  defaultData: PropTypes.shape({}),
  isBatchInference: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  mode: JOB_WIZARD_MODE,
  onResolve: PropTypes.func.isRequired,
  onSuccessRequest: PropTypes.func,
  onWizardClose: PropTypes.func,
  params: PropTypes.shape({}).isRequired,
  wizardTitle: PropTypes.string
}

export default connect(
  ({ appStore, functionsStore, jobsStore }) => ({
    frontendSpec: appStore.frontendSpec,
    functionsStore,
    jobsStore
  }),
  {
    ...functionsActions,
    ...jobsActions,
    ...projectsAction,
    editJob: scheduledJobsActionCreator.editJob
  }
)(JobWizard)
