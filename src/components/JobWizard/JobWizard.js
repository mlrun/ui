import React, { useMemo, useRef, useState } from 'react'
// import PropTypes from 'prop-types'
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

import { MONITOR_JOBS_TAB, PANEL_RERUN_MODE, PANEL_EDIT_MODE, SCHEDULE_TAB } from '../../constants'
import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import notificationActions from '../../actions/notification'
import projectsAction from '../../actions/projects'
import { MODAL_FULL } from 'igz-controls/constants'
import { generateRunPostData, getNewJobErrorMsg } from './JobWizard.util'
import { scheduledJobsActionCreator } from '../Jobs/ScheduledJobs/scheduledJobs.util'
import { setFieldState } from 'igz-controls/utils/form.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { useMode } from '../../hooks/mode.hook'

import './jobWizard.scss'

const JobWizard = ({
  defaultData,
  frontendSpec,
  functionsStore,
  isOpen,
  jobsStore,
  mode,
  onResolve,
  onSuccessRun,
  onWizardClose,
  params,
  runNewJob,
  wizardTitle,
  editJob,
  setNotification
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
  const { handleCloseModal, resolveModal } = useModalBlockHistory(onResolve, formRef.current)
  const [selectedFunctionData, setSelectedFunctionData] = useState({})
  const [filteredFunctions, setFilteredFunctions] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState({})
  const [functions, setFunctions] = useState([])
  const [templatesCategories, setTemplatesCategories] = useState(functionsStore.templatesCatalog)
  const [templates, setTemplates] = useState(functionsStore.templates)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [jobAdditionalData, setJobAdditionalData] = useState({})
  const [showSchedule, setShowSchedule] = useState(false)
  const location = useLocation()
  const { isStagingMode } = useMode()
  const scheduleButtonRef = useRef()

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
            label: 'Run',
            onClick: () => handleSubmit(),
            variant: 'secondary'
          }
        ]
      }
    ]
  }, [isEditMode, selectedFunctionData])

  const runJobHandler = (formData, selectedFunctionData, params, isEditMode, isSchedule) => {
    console.log('runJobHandler: ', formData)
    const postData = generateRunPostData(formData, selectedFunctionData, params, mode, isSchedule)
    runNewJob(postData)
      .then(() => {
        resolveModal()
        onSuccessRun && onSuccessRun(isSchedule ? SCHEDULE_TAB : MONITOR_JOBS_TAB)
        onWizardClose && onWizardClose()
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

  const editJobHandler = formData => {
    console.log('editJobHandler', formData)
    // todo: generate data

    // const generatedData = cloneDeep(formData)
    // delete generatedData.function.metadata

    // editJob(
    //   {
    //     credentials: formData.function.metadata.credentials,
    //     scheduled_object: generatedData,
    //     cron_trigger: generatedData.schedule
    //   },
    //   params.projectName
    // )
    //   .then(() => {
    //     navigate(`/projects/${params.projectName}/jobs/${SCHEDULE_TAB}`)
    //   })
    //   .catch(error => {
    //     setNotification({
    //       status: error.response.status || 400,
    //       id: Math.random(),
    //       message: getNewJobErrorMsg(error)
    //     })
    //   })
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
                onWizardClose && onWizardClose()
              }}
              onWizardSubmit={formData => {
                if (mode === PANEL_EDIT_MODE) {
                  editJobHandler(formData)
                } else {
                  runJobHandler(formData, selectedFunctionData, params, isEditMode)
                }
              }}
              size={MODAL_FULL}
              stepsConfig={stepsConfig}
              title={wizardTitle ?? 'New job'}
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
                isEditMode={isEditMode}
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
  // defaultData: {},
  // isEditMode: false,
  // mode: PANEL_CREATE_MODE
}

JobWizard.propTypes = {
  // defaultData: PropTypes.shape({}),
  // frontendSpec: PropTypes.shape({}).isRequired,
  // isEditMode: PropTypes.bool,
  // isOpen: PropTypes.bool.isRequired,
  // mode: PropTypes.string,
  // onResolve: PropTypes.func.isRequired,
  // params: PropTypes.shape({}).isRequired
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
