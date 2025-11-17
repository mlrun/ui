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
import { useDispatch, useSelector } from 'react-redux'
import { createForm } from 'final-form'
import { isEmpty, get } from 'lodash'
import { useNavigate } from 'react-router-dom'

import FormDirtySpy from '../../common/FormDirtySpy/FormDirtySpy'
import JobWizardAdvanced from './JobWizardSteps/JobWizardAdvanced/JobWizardAdvanced'
import JobWizardDataInputs from './JobWizardSteps/JobWizardDataInputs/JobWizardDataInputs'
import JobWizardFunctionSelection from './JobWizardSteps/JobWizardFunctionSelection/JobWizardFunctionSelection'
import JobWizardHyperparameterStrategy from './JobWizardSteps/JobWizardHyperparameterStrategy/JobWizardHyperparameterStrategy'
import JobWizardParameters from './JobWizardSteps/JobWizardParameters/JobWizardParameters'
import JobWizardResources from './JobWizardSteps/JobWizardResources/JobWizardResources'
import JobWizardRunDetails from './JobWizardSteps/JobWizardRunDetails/JobWizardRunDetails'
import ScheduleWizard from '../SheduleWizard/ScheduleWizard'
import { Wizard, Loader } from 'igz-controls/components'

import {
  ADVANCED_STEP,
  DATA_INPUTS_STEP,
  FUNCTION_SELECTION_STEP,
  HYPERPARAMETER_STRATEGY_STEP,
  JOB_WIZARD_FILTERS,
  JOBS_MONITORING_JOBS_TAB,
  JOBS_MONITORING_PAGE,
  JOBS_MONITORING_SCHEDULED_TAB,
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
import {
  fetchFunctionTemplate,
  fetchHubFunction,
  removeHubFunctions
} from '../../reducers/functionReducer'
import { FUNCTIONS_SELECTION_FUNCTIONS_TAB } from './JobWizardSteps/JobWizardFunctionSelection/jobWizardFunctionSelection.util'
import { JOB_WIZARD_MODE } from '../../types'
import { MODAL_MAX, PRIMARY_BUTTON } from 'igz-controls/constants'
import { editJob, removeJobFunction, runNewJob } from '../../reducers/jobReducer'
import { fetchProject } from '../../reducers/projectReducer'
import { resetModalFilter } from '../../reducers/filtersReducer'
import { setFieldState, isSubmitDisabled } from 'igz-controls/utils/form.util'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'

import './jobWizard.scss'

const JobWizard = ({
  defaultData = {},
  isBatchInference = false,
  isCrossProjects = false,
  isOpen,
  isTrain = false,
  mode = PANEL_CREATE_MODE,
  onResolve,
  onSuccessRequest = () => {},
  onWizardClose = null,
  params,
  prePopulatedData = {},
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
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const scheduleButtonRef = useRef()
  const formStateRef = useRef(null)
  const functionsStore = useSelector(store => store.functionsStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const jobsStore = useSelector(store => store.jobsStore)

  const closeModal = useCallback(() => {
    if (showSchedule) {
      setShowSchedule(false)
    }
    dispatch(resetModalFilter({ name: JOB_WIZARD_FILTERS }))
    dispatch(removeJobFunction())
    onResolve()
    onWizardClose && onWizardClose()
  }, [dispatch, onResolve, onWizardClose, showSchedule])

  const { handleCloseModal, resolveModal } = useModalBlockHistory(closeModal, formRef.current)

  useEffect(() => {
    if (!isEditMode) {
      dispatch(
        fetchProject({
          project: params.projectName,
          params: {
            format: 'minimal'
          }
        })
      )
        .unwrap()
        .then(response => setCurrentProject(response?.data))
        .catch(error => {
          showErrorNotification(dispatch, error, 'The project failed to load')
        })
    }
  }, [dispatch, isEditMode, params.projectName])

  useEffect(() => {
    return () => {
      setFunctions([])
      setTemplatesCategories([])
      setTemplates([])
      setShowSchedule(false)
      dispatch(removeHubFunctions())
    }
  }, [dispatch, setFunctions])

  useEffect(() => {
    if (isBatchInference || isTrain) {
      const hubFunctionName = isBatchInference ? 'batch_inference_v2' : 'auto-trainer'

      dispatch(fetchHubFunction({ hubFunctionName }))
        .unwrap()
        .then(hubFunction => {
          if (hubFunction) {
            const functionTemplatePath = `${hubFunction.spec.item_uri}${hubFunction.spec.assets.function}`

            dispatch(fetchFunctionTemplate({ path: functionTemplatePath }))
              .unwrap()
              .then(functionData => {
                setSelectedFunctionData(functionData)
              })
          } else {
            resolveModal()
          }
        })
    }
  }, [dispatch, isBatchInference, isTrain, resolveModal])

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
          label: 'Function selection',
          hidden: isEditMode || isRunMode || isBatchInference || isTrain,
          nextIsDisabled: isEmpty(selectedFunctionData)
        },
        {
          id: RUN_DETAILS_STEP,
          label: 'Run details',
          disabled:
            isEmpty(selectedFunctionData) || isEmpty(get(formState.initialValues, RUN_DETAILS_STEP))
        },
        {
          id: DATA_INPUTS_STEP,
          label: 'Data inputs'
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

      dispatch(runNewJob({ postData: jobRequestData }))
        .unwrap()
        .then(() => {
          if (isSchedule) {
            setShowSchedule(state => !state)
          }
          resolveModal()
          onSuccessRequest && onSuccessRequest(true, isSchedule)
          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: isSchedule ? 'The batch run was scheduled' : 'The batch run was started'
            })
          )
        })
        .then(() => {
          navigate(
            isCrossProjects
              ? `/projects/*/${JOBS_MONITORING_PAGE}/${isSchedule ? JOBS_MONITORING_SCHEDULED_TAB : JOBS_MONITORING_JOBS_TAB}`
              : `/projects/${params.projectName}/jobs/${isSchedule ? SCHEDULE_TAB : MONITOR_JOBS_TAB}`
          )
        })
        .catch(error => {
          showErrorNotification(dispatch, error, '', getNewJobErrorMsg(error))
        })
    },
    [dispatch, mode, navigate, onSuccessRequest, resolveModal, isCrossProjects]
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

      dispatch(
        editJob({
          postData: {
            credentials,
            scheduled_object: jobRequestData,
            cron_trigger: jobRequestData.schedule
          },
          project: params.projectName
        })
      )
        .unwrap()
        .then(() => {
          if (isSchedule) {
            setShowSchedule(state => !state)
          }

          resolveModal()

          return onSuccessRequest && onSuccessRequest(isSchedule, true)
        })
        .then(() => {
          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: 'Job saved successfully'
            })
          )
        })
        .catch(error => {
          showErrorNotification(dispatch, error, '', getSaveJobErrorMsg(error))
        })
    },
    [dispatch, mode, onSuccessRequest, resolveModal]
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
            ? 'Schedule infer'
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
          variant: PRIMARY_BUTTON
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
              onWizardResolve={handleCloseModal}
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
              Boolean(jobsStore.jobLoadingCounter) ||
              projectIsLoading) && <Loader />}
          </>
        )
      }}
    </Form>
  )
}

JobWizard.propTypes = {
  defaultData: PropTypes.object,
  isBatchInference: PropTypes.bool,
  isCrossProjects: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  isTrain: PropTypes.bool,
  mode: JOB_WIZARD_MODE,
  onResolve: PropTypes.func.isRequired,
  onSuccessRequest: PropTypes.func,
  onWizardClose: PropTypes.func,
  params: PropTypes.object.isRequired,
  prePopulatedData: PropTypes.object,
  wizardTitle: PropTypes.string
}

export default JobWizard
