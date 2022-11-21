import React, { useCallback, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import arrayMutators from 'final-form-arrays'
import { Form } from 'react-final-form'
import { connect } from 'react-redux'
import { createForm } from 'final-form'
import { isEmpty } from 'lodash'
import { useLocation, useNavigate } from 'react-router-dom'

import FormDirtySpy from '../../common/FormDirtySpy/FormDirtySpy'
import JobWizardAdvanced from './JobWizardSteps/JobWizardAdvanced/JobWizardAdvanced'
import JobWizardDataInputs from './JobWizardSteps/JobWizardDataInputs/JobWizardDataInputs'
import JobWizardFunctionSelection from './JobWizardSteps/JobWizardFunctionSelection/JobWizardFunctionSelection'
import JobWizardJobDetails from './JobWizardSteps/JobWizardJobDetails/JobWizardJobDetails'
import JobWizardParameters from './JobWizardSteps/JobWizardParameters/JobWizardParameters'
import JobWizardResources from './JobWizardSteps/JobWizardResources/JobWizardResources'
import Loader from '../../common/Loader/Loader'
import { Wizard } from 'igz-controls/components'

import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import notificationActions from '../../actions/notification'
import projectsAction from '../../actions/projects'
import { MODAL_MAX } from 'igz-controls/constants'
import { generateJobRequestData, getNewJobErrorMsg, getSaveJobErrorMsg } from './JobWizard.util'
import { scheduledJobsActionCreator } from '../Jobs/ScheduledJobs/scheduledJobs.util'
import { setFieldState } from 'igz-controls/utils/form.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { useMode } from '../../hooks/mode.hook'
import {
  MONITOR_JOBS_TAB,
  PANEL_CREATE_MODE,
  PANEL_EDIT_MODE,
  PANEL_RERUN_MODE,
  SCHEDULE_TAB
} from '../../constants'

import './jobWizard.scss'

const JobWizard = ({
  defaultData,
  editJob,
  frontendSpec,
  functionsStore,
  isOpen,
  jobsStore,
  mode,
  onResolve,
  onSuccessRequest,
  onWizardClose,
  params,
  runNewJob,
  setNotification,
  wizardTitle
}) => {
  const formRef = React.useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators, setFieldState },
      initialValues: {}
    })
  )
  const navigate = useNavigate()
  const isEditMode = useMemo(() => mode === PANEL_EDIT_MODE || mode === PANEL_RERUN_MODE, [mode])
  const [selectedFunctionData, setSelectedFunctionData] = useState({})
  const [filteredFunctions, setFilteredFunctions] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [functions, setFunctions] = useState([])
  const [templatesCategories, setTemplatesCategories] = useState(functionsStore.templatesCatalog)
  const [templates, setTemplates] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [jobAdditionalData, setJobAdditionalData] = useState({})
  const [showSchedule, setShowSchedule] = useState(false)
  const location = useLocation()
  const { isStagingMode } = useMode()
  const scheduleButtonRef = useRef()

  const closeModal = useCallback(() => {
    onResolve()
    onWizardClose && onWizardClose()
  }, [onResolve, onWizardClose])

  const { handleCloseModal, resolveModal } = useModalBlockHistory(closeModal, formRef.current)

  const stepsConfig = useMemo(() => {
    return [
      {
        id: 'functionSelection',
        label: 'Function Selection',
        isHidden: isEditMode,
        getActions: ({ formState, handleOnClose, handleSubmit }) => [
          {
            label: 'Back',
            disabled: true,
            onClick: () => {}
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
        id: 'jobDetails',
        label: 'Job Details'
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
        id: 'resources',
        label: 'Resources'
      },
      {
        id: 'advanced',
        label: 'Advanced',
        getActions: ({ handleSubmit }) => [
          {
            label: 'Schedule for later',
            onClick: () => {
              setShowSchedule(state => !state)
            },
            variant: 'tertiary',
            ref: scheduleButtonRef
          },
          {
            label: mode === PANEL_EDIT_MODE ? 'Save' : 'Run',
            onClick: () => handleSubmit(),
            variant: 'secondary'
          }
        ]
      }
    ]
  }, [isEditMode, mode, selectedFunctionData])

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
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Job started successfully'
        })
      })
      .then(() => {
        return navigate(
          `/projects/${params.projectName}/jobs/${isSchedule ? SCHEDULE_TAB : MONITOR_JOBS_TAB}`
        )
      })
      .catch(error => {
        setNotification({
          status: error.response.status || 400,
          id: Math.random(),
          message: getNewJobErrorMsg(error)
        })
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
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Job saved successfully'
        })
      })
      .then(() => {
        navigate(`/projects/${params.projectName}/jobs/${SCHEDULE_TAB}`)
      })
      .catch(error => {
        setNotification({
          status: error.response.status || 400,
          id: Math.random(),
          message: getSaveJobErrorMsg(error)
        })
      })
  }

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => {
        return (
          <>
            <Wizard
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
              stepsConfig={stepsConfig}
              title={wizardTitle}
            >
              {!isEditMode && (
                <JobWizardFunctionSelection
                  defaultData={defaultData}
                  filteredFunctions={filteredFunctions}
                  filteredTemplates={filteredTemplates}
                  formState={formState}
                  frontendSpec={frontendSpec}
                  functions={functions}
                  isEditMode={isEditMode}
                  isStagingMode={isStagingMode}
                  params={params}
                  selectedCategory={selectedCategory}
                  selectedFunctionData={selectedFunctionData}
                  setFilteredFunctions={setFilteredFunctions}
                  setFilteredTemplates={setFilteredTemplates}
                  setFunctions={setFunctions}
                  setJobAdditionalData={setJobAdditionalData}
                  setSelectedCategory={setSelectedCategory}
                  setSelectedFunctionData={setSelectedFunctionData}
                  setTemplates={setTemplates}
                  setTemplatesCategories={setTemplatesCategories}
                  templates={templates}
                  templatesCategories={templatesCategories}
                />
              )}
              <JobWizardJobDetails
                defaultData={defaultData}
                formState={formState}
                frontendSpec={frontendSpec}
                isEditMode={isEditMode}
                isStagingMode={isStagingMode}
                jobAdditionalData={jobAdditionalData}
                selectedFunctionData={selectedFunctionData}
                setJobAdditionalData={setJobAdditionalData}
              />
              <JobWizardDataInputs formState={formState} />
              <JobWizardParameters formState={formState} />
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
  mode: PANEL_CREATE_MODE,
  onSuccessRun: () => {},
  wizardTitle: 'New job'
}

JobWizard.propTypes = {
  defaultData: PropTypes.shape({}),
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.string,
  onResolve: PropTypes.func.isRequired,
  onSuccessRun: PropTypes.func,
  onWizardClose: PropTypes.func.isRequired,
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
    editJob: scheduledJobsActionCreator.editJob,
    setNotification: notificationActions.setNotification
  }
)(JobWizard)
