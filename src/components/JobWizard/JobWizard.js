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
import { connect, useDispatch, useSelector } from 'react-redux'
import { createForm } from 'final-form'
import { isEmpty, get } from 'lodash'
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
import ScheduleWizard from '../SheduleWizard/ScheduleWizard'
import { Wizard } from 'igz-controls/components'

import {
  ADVANCED_STEP,
  DATA_INPUTS_STEP,
  FUNCTION_SELECTION_STEP,
  HYPERPARAMETER_STRATEGY_STEP,
  JOB_WIZARD_FILTERS,
  MONITOR_JOBS_TAB,
  PANEL_CREATE_MODE,
  PANEL_EDIT_MODE,
  PANEL_FUNCTION_CREATE_MODE,
  PANEL_RERUN_MODE,
  PARAMETERS_STEP,
  RESOURCES_STEP,
  RUN_DETAILS_STEP,
  SCHEDULE_TAB
} from '../../constants'
import {
  generateJobRequestData,
  generateJobWizardData,
  generateJobWizardDefaultData,
  getNewJobErrorMsg,
  getSaveJobErrorMsg
} from './JobWizard.util'
import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import projectsAction from '../../actions/projects'
import { FUNCTIONS_SELECTION_FUNCTIONS_TAB } from './JobWizardSteps/JobWizardFunctionSelection/jobWizardFunctionSelection.util'
import { JOB_WIZARD_MODE } from '../../types'
import { MODAL_MAX } from 'igz-controls/constants'
import { resetModalFilter } from '../../reducers/filtersReducer'
import { scheduledJobsActionCreator } from '../Jobs/ScheduledJobs/scheduledJobs.util'
import { setFieldState, isSubmitDisabled } from 'igz-controls/utils/form.util'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'

import './jobWizard.scss'

const JobWizard = ({
  defaultData = {},
  editJob,
  fetchFunctionTemplate,
  fetchHubFunction,
  frontendSpec,
  functionsStore,
  isBatchInference = false,
  isOpen,
  isTrain = false,
  jobsStore,
  mode = PANEL_CREATE_MODE,
  onResolve,
  onSuccessRequest = () => {},
  onWizardClose = null,
  params,
  prePopulatedData = {},
  removeJobFunction,
  removeHubFunctions,
  runNewJob,
  wizardTitle = 'Batch run'
}) => {
  const formRef = React.useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators, setFieldState },
      initialValues: {}
    })
  )
  const isEditMode = useMemo(() => mode === PANEL_EDIT_MODE || mode === PANEL_RERUN_MODE, [mode])
  const isRunMode = useMemo(() => mode === PANEL_FUNCTION_CREATE_MODE, [mode])
  const projectIsLoading = useSelector(store => store.projectStore.project.loading)
  const [currentProject, setCurrentProject] = useState(null)
  const [selectedFunctionData, setSelectedFunctionData] = useState({})
  const [filteredFunctions, setFilteredFunctions] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [functions, setFunctions] = useState([])
  const [templatesCategories, setTemplatesCategories] = useState([])
  const [templates, setTemplates] = useState([])
  const [jobAdditionalData, setJobAdditionalData] = useState({})
  const [showSchedule, setShowSchedule] = useState(false)
  const [activeTab, setActiveTab] = useState(FUNCTIONS_SELECTION_FUNCTIONS_TAB)
  const [selectedFunctionTab, setSelectedFunctionTab] = useState(FUNCTIONS_SELECTION_FUNCTIONS_TAB)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const scheduleButtonRef = useRef()
  const formStateRef = useRef(null)

  const closeModal = useCallback(() => {
    if (showSchedule) {
      setShowSchedule(false)
    }
    dispatch(resetModalFilter(JOB_WIZARD_FILTERS))
    removeJobFunction()
    onResolve()
    onWizardClose && onWizardClose()
  }, [dispatch, onResolve, onWizardClose, removeJobFunction, showSchedule])

  const { handleCloseModal, resolveModal } = useModalBlockHistory(closeModal, formRef.current)

  useEffect(() => {
    if (!isEditMode) {
      dispatch(projectsAction.fetchProject(params.projectName, { format: 'minimal' })).then(
        project => setCurrentProject(project)
      )
    }
  }, [dispatch, isEditMode, params.projectName])

  useEffect(() => {
    return () => {
      setFunctions([])
      setTemplatesCategories([])
      setTemplates([])
      setShowSchedule(false)

      removeHubFunctions()
    }
  }, [removeHubFunctions, setFunctions])

  useEffect(() => {
    if (isBatchInference || isTrain) {
      const hubFunctionName = isBatchInference ? 'batch_inference_v2' : 'auto-trainer'

      fetchHubFunction(hubFunctionName).then(hubFunction => {
        if (hubFunction) {
          const functionTemplatePath = `${hubFunction.spec.item_uri}${hubFunction.spec.assets.function}`

          fetchFunctionTemplate(functionTemplatePath).then(functionData => {
            setSelectedFunctionData(functionData)
          })
        } else {
          resolveModal()
        }
      })
    }
  }, [fetchFunctionTemplate, fetchHubFunction, isBatchInference, isTrain, resolveModal])

  useEffect(() => {
    if (!isEmpty(jobsStore.jobFunc)) {
      setSelectedFunctionData({
        name: jobsStore.jobFunc.metadata.name,
        functions: [jobsStore.jobFunc]
      })
    }
  }, [isEditMode, isRunMode, jobsStore.jobFunc])

  const setJobData = useCallback(
    (formState, jobFormData, jobAdditionalData) => {
      const newInitial = {
        ...formState.initialValues,
        ...jobFormData
      }

      formState.form.reset(newInitial)
      setJobAdditionalData(jobAdditionalData)
    },
    [setJobAdditionalData]
  )

  useEffect(() => {
    if (
      formStateRef.current &&
      isEditMode &&
      !isEmpty(selectedFunctionData) &&
      !isEmpty(defaultData) &&
      isEmpty(jobAdditionalData)
    ) {
      const [jobFormData, jobAdditionalData] = generateJobWizardDefaultData(
        frontendSpec,
        selectedFunctionData,
        defaultData,
        params.projectName,
        isEditMode,
        frontendSpec.internal_labels
      )
      setJobData(formStateRef.current, jobFormData, jobAdditionalData)
    } else if (
      formStateRef.current &&
      (isBatchInference || isTrain || isRunMode) &&
      !isEmpty(selectedFunctionData) &&
      isEmpty(jobAdditionalData) &&
      !isEmpty(currentProject)
    ) {
      const [jobFormData, jobAdditionalData] = generateJobWizardData(
        frontendSpec,
        selectedFunctionData,
        null,
        params.projectName,
        currentProject,
        isEditMode,
        isTrain,
        prePopulatedData,
        null
      )
      setJobData(formStateRef.current, jobFormData, jobAdditionalData)
    }
  }, [
    defaultData,
    frontendSpec,
    isBatchInference,
    isEditMode,
    isRunMode,
    isTrain,
    jobAdditionalData,
    params.projectName,
    prePopulatedData,
    currentProject,
    selectedFunctionData,
    setJobAdditionalData,
    setJobData
  ])

  const getStepsConfig = useCallback(
    formState => {
      if (isEmpty(formState)) return []

      const stepsConfig = [
        {
          id: FUNCTION_SELECTION_STEP,
          label: 'Function Selection',
          hidden: isEditMode || isRunMode || isBatchInference || isTrain,
          nextIsDisabled: isEmpty(selectedFunctionData)
        },
        {
          id: RUN_DETAILS_STEP,
          label: 'Run Details',
          disabled:
            isEmpty(selectedFunctionData) || isEmpty(get(formState.initialValues, RUN_DETAILS_STEP))
        },
        {
          id: DATA_INPUTS_STEP,
          label: 'Data Inputs'
        },
        {
          id: PARAMETERS_STEP,
          label: 'Parameters'
        },
        {
          id: HYPERPARAMETER_STRATEGY_STEP,
          label: 'Hyperparameter strategy',
          hidden: !formState.values[RUN_DETAILS_STEP]?.hyperparameter || isBatchInference
        },
        {
          id: RESOURCES_STEP,
          label: 'Resources'
        },
        {
          id: ADVANCED_STEP,
          label: 'Advanced'
        }
      ]

      if (isSubmitDisabled(formState)) {
        stepsConfig.forEach(stepConfig => {
          if (stepConfig.id in formState.errors) {
            stepConfig.invalid = true
          }
        })
      }

      return stepsConfig
    },
    [isBatchInference, isEditMode, isRunMode, isTrain, selectedFunctionData]
  )

  const runJobHandler = useCallback(
    (formData, selectedFunctionData, params, isSchedule) => {
      const jobRequestData = generateJobRequestData(
        formData,
        selectedFunctionData,
        params,
        mode,
        isSchedule
      )

      runNewJob(jobRequestData)
        .then(() => {
          if (isSchedule) {
            setShowSchedule(state => !state)
          }
          resolveModal()
          onSuccessRequest && onSuccessRequest()
          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: isSchedule ? 'The batch run was scheduled' : 'The batch run was started'
            })
          )
        })
        .then(() => {
          return navigate(
            `/projects/${params.projectName}/jobs/${isSchedule ? SCHEDULE_TAB : MONITOR_JOBS_TAB}`
          )
        })
        .catch(error => {
          showErrorNotification(dispatch, error, '', getNewJobErrorMsg(error))
        })
    },
    [dispatch, mode, navigate, onSuccessRequest, resolveModal, runNewJob]
  )

  const editJobHandler = useCallback(
    (formData, selectedFunctionData, params, isSchedule) => {
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
          if (isSchedule) {
            setShowSchedule(state => !state)
          }
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
          showErrorNotification(dispatch, error, '', getSaveJobErrorMsg(error))
        })
    },
    [dispatch, editJob, mode, navigate, onSuccessRequest, resolveModal]
  )

  const submitRequest = useCallback(
    (formState, isSchedule, goToFirstInvalidStep) => {
      formState.handleSubmit()

      if (formState.valid) {
        if (mode === PANEL_EDIT_MODE) {
          editJobHandler(formState.values, selectedFunctionData, params, isSchedule)
        } else {
          runJobHandler(formState.values, selectedFunctionData, params, isSchedule)
        }
      } else if (goToFirstInvalidStep) {
        goToFirstInvalidStep()
      }
    },
    [editJobHandler, mode, params, runJobHandler, selectedFunctionData]
  )

  const getActions = useCallback(
    ({ allStepsAreEnabled, goToFirstInvalidStep }, formState) => {
      const submitIsDisabled = isSubmitDisabled(formState)

      return [
        {
          id: 'schedule-btn',
          label: isBatchInference
            ? 'Schedule Infer'
            : isTrain
              ? 'Schedule training job'
              : 'Schedule for later',
          onClick: () => {
            formState.handleSubmit()

            if (formState.valid) {
              setShowSchedule(state => !state)
            } else {
              goToFirstInvalidStep()
            }
          },
          disabled: !allStepsAreEnabled || submitIsDisabled,
          variant: 'tertiary',
          ref: scheduleButtonRef
        },
        {
          id: 'run-btn',
          label:
            mode === PANEL_EDIT_MODE
              ? 'Save'
              : isBatchInference
                ? 'Infer now'
                : isTrain
                  ? 'Run training now'
                  : 'Run',
          onClick: () => {
            submitRequest(formState, false, goToFirstInvalidStep)
          },
          disabled: !allStepsAreEnabled || submitIsDisabled,
          variant: 'secondary'
        }
      ]
    },
    [isBatchInference, isTrain, mode, submitRequest]
  )

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => {
        formStateRef.current = formState

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
              previewText={isBatchInference ? 'Tech Preview' : ''}
              size={MODAL_MAX}
              stepsConfig={getStepsConfig(formState)}
              getActions={getActionsParams => getActions(getActionsParams, formState)}
              title={wizardTitle}
              subTitle={formState.values?.[RUN_DETAILS_STEP]?.runName}
            >
              <JobWizardFunctionSelection
                activeTab={activeTab}
                currentProject={currentProject}
                defaultData={defaultData}
                filteredFunctions={filteredFunctions}
                filteredTemplates={filteredTemplates}
                formState={formState}
                frontendSpec={frontendSpec}
                functions={functions}
                isEditMode={isEditMode}
                isTrain={isTrain}
                params={params}
                selectedFunctionData={selectedFunctionData}
                selectedFunctionTab={selectedFunctionTab}
                setActiveTab={setActiveTab}
                setFilteredFunctions={setFilteredFunctions}
                setFilteredTemplates={setFilteredTemplates}
                setFunctions={setFunctions}
                setJobAdditionalData={setJobAdditionalData}
                setSelectedFunctionData={setSelectedFunctionData}
                setSelectedFunctionTab={setSelectedFunctionTab}
                setShowSchedule={setShowSchedule}
                setTemplates={setTemplates}
                setTemplatesCategories={setTemplatesCategories}
                templates={templates}
                templatesCategories={templatesCategories}
              />
              <JobWizardRunDetails
                currentProject={currentProject}
                formState={formState}
                frontendSpec={frontendSpec}
                isBatchInference={isBatchInference}
                isEditMode={isEditMode}
                jobAdditionalData={jobAdditionalData}
                params={params}
                prePopulatedData={prePopulatedData}
                selectedFunctionData={selectedFunctionData}
                setJobData={setJobData}
              />
              <JobWizardDataInputs formState={formState} params={params} />
              <JobWizardParameters formState={formState} />
              <JobWizardHyperparameterStrategy formState={formState} />
              <JobWizardResources formState={formState} frontendSpec={frontendSpec} />
              <JobWizardAdvanced formState={formState} />
            </Wizard>
            {showSchedule && (
              <ScheduleWizard
                onSchedule={() => {
                  submitRequest(formState, true)
                }}
                scheduleButtonRef={scheduleButtonRef}
                scheduleData={formState.values.scheduleData}
                setFieldValue={formState.form.change}
                setShowSchedule={setShowSchedule}
              />
            )}
            <FormDirtySpy />
            {(functionsStore.loading ||
              functionsStore.funcLoading ||
              jobsStore.loading ||
              projectIsLoading) && <Loader />}
          </>
        )
      }}
    </Form>
  )
}

JobWizard.propTypes = {
  defaultData: PropTypes.shape({}),
  isBatchInference: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  isTrain: PropTypes.bool,
  mode: JOB_WIZARD_MODE,
  onResolve: PropTypes.func.isRequired,
  onSuccessRequest: PropTypes.func,
  onWizardClose: PropTypes.func,
  params: PropTypes.shape({}).isRequired,
  prePopulatedData: PropTypes.shape({}),
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
