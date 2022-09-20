import React, { useMemo, useRef, useState } from 'react'
// import PropTypes from 'prop-types'
import arrayMutators from 'final-form-arrays'
import { Form } from 'react-final-form'
import { connect } from 'react-redux'
import { createForm } from 'final-form'
import { isEmpty } from 'lodash'
import { useLocation } from 'react-router-dom'

import FormDirtySpy from '../../common/FormDirtySpy/FormDirtySpy'
import JobWizardAdvanced from './JobWizardSteps/JobWizardAdvanced/JobWizardAdvanced'
import JobWizardDataInputs from './JobWizardSteps/JobWizardDataInputs/JobWizardDataInputs'
import JobWizardFunctionSelection from './JobWizardSteps/JobWizardFunctionSelection/JobWizardFunctionSelection'
import JobWizardJobDetails from './JobWizardSteps/JobWizardJobDetails/JobWizardJobDetails'
import JobWizardParameters from './JobWizardSteps/JobWizardParameters/JobWizardParameters'
import JobWizardResources from './JobWizardSteps/JobWizardResources/JobWizardResources'
import { Wizard } from 'igz-controls/components'

import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import projectsAction from '../../actions/projects'
import { MODAL_FULL } from 'igz-controls/constants'
import { setFieldState } from 'igz-controls/utils/form.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { useMode } from '../../hooks/mode.hook'

import './jobWizard.scss'

const JobWizard = ({
  defaultData,
  frontendSpec,
  functionsStore,
  isEditMode,
  isOpen,
  onResolve,
  params
}) => {
  const formRef = React.useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators, setFieldState }
    })
  )
  const { handleCloseModal } = useModalBlockHistory(onResolve, formRef.current)
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
        getActions: ({ formState, handleOnClose }) => [
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
            onClick: formState.handleSubmit,
            variant: 'secondary'
          }
        ]
      }
    ]
  }, [selectedFunctionData])

  const submitForm = () => {}
  const onWizardSubmit = () => {}

  return (
    <Form form={formRef.current} initialValues={{}} onSubmit={submitForm}>
      {formState => {
        return (
          <>
            <Wizard
              formState={formState}
              id="jobWizard"
              isWizardOpen={isOpen}
              location={location}
              onWizardResolve={handleCloseModal}
              onWizardSubmit={onWizardSubmit}
              size={MODAL_FULL}
              stepsConfig={stepsConfig}
              title="New job"
            >
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
              <JobWizardJobDetails formState={formState} jobAdditionalData={jobAdditionalData} />
              <JobWizardDataInputs formState={formState} />
              <JobWizardParameters formState={formState} />
              <JobWizardResources formState={formState} frontendSpec={frontendSpec} />
              <JobWizardAdvanced
                formState={formState}
                scheduleButtonRef={scheduleButtonRef}
                setShowSchedule={setShowSchedule}
                showSchedule={showSchedule}
              />
            </Wizard>
            <FormDirtySpy />
          </>
        )
      }}
    </Form>
  )
}

JobWizard.defaultProps = {
  // defaultData: {},
  // isEditMode: false
}

JobWizard.propTypes = {
  // isOpen: PropTypes.bool.isRequired,
  // onResolve: PropTypes.func.isRequired,
  // defaultData: PropTypes.shape({}),
  // frontendSpec: PropTypes.shape({}).isRequired,
  // isEditMode: PropTypes.bool,
  // params: PropTypes.shape({}).isRequired
}

export default connect(
  ({ appStore, functionsStore, projectStore }) => ({
    frontendSpec: appStore.frontendSpec,
    functionsStore
  }),
  {
    ...functionsActions,
    ...jobsActions,
    ...projectsAction
  }
)(JobWizard)
