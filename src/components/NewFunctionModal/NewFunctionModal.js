import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { isEmpty } from 'lodash'

// import FunctionsPanelTitle from '../../elements/FunctionsPanelTitle/FunctionsPanelTitle'
import NewFunctionModalStep1 from './NewFunctionModalStep1/NewFunctionModalStep1'
import NewFunctionModalStep2 from './NewFunctionModalStep2/NewFunctionModalStep2'
import NewFunctionModalStep3 from './NewFunctionModalStep3/NewFunctionModalStep3'
import { Wizard } from 'igz-controls/components'

import { LABEL_BUTTON, MODAL_LG, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { FUNCTION_TYPE_JOB } from '../../constants'
import { setFieldState } from 'igz-controls/utils/form.util'
import { getModalTitle, getInitialValues } from './newFunctionModal.util'
import // generateFullCpuValue,
// generateFullMemoryValue,
// getSelectedCpuOption,
// setCpuValidation,
// setMemoryDropdownValidation,
// setMemoryInputValidation
'../../utils/panelResources.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { useMode } from '../../hooks/mode.hook'
import { FUNCTION_PANEL_MODE } from '../../types'

const NewFunctionModal = ({
  createFunctionSuccess,
  defaultData,
  handleDeployFunctionFailure,
  handleDeployFunctionSuccess,
  isOpen,
  isStandAlone,
  mode,
  onResolve,
  projectName,
  runtime
}) => {
  const location = useLocation()
  const { appStore, functionsStore } = useSelector(state => state)
  const { isStagingMode } = useMode()

  const formRef = React.useRef(
    createForm({
      initialValues: getInitialValues(appStore, defaultData?.ui?.originalContent, mode, runtime),
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )

  const { handleCloseModal } = useModalBlockHistory(onResolve, formRef.current)

  const stepsConfig = formState => [
    {
      id: 'general',
      label: 'General'
    },
    {
      id: 'code',
      label: 'Code'
    },
    {
      id: 'resources',
      label: 'Resources'
    },
    {
      id: 'environmentVariables',
      label: 'Environment variables'
    },
    {
      id: 'servingRuntimeConfig',
      label: 'Serving runtime configuration',
      isHidden: formState.values.kind === FUNCTION_TYPE_JOB
    },
    {
      id: 'advanced',
      label: 'Advanced',
      getActions: () => [
        {
          label: 'Cancel',
          onClick: handleCloseModal,
          variant: LABEL_BUTTON
        },
        {
          label: 'Save',
          onClick: () => handleSave(),
          variant: TERTIARY_BUTTON
        },
        {
          label: 'Deploy',
          onClick: () => handleSave(true),
          variant: SECONDARY_BUTTON
        }
      ],
      isHidden: formState.values.kind === FUNCTION_TYPE_JOB
    }
  ]

  const handleSave = deploy => {
    // console.log('save')
    // console.log(deploy)
  }

  const handleSubmit = values => {
    // console.log(values)
  }

  return (
    <Form form={formRef.current} onSubmit={handleSubmit}>
      {formState => {
        return (
          <Wizard
            className="form"
            formState={formState}
            isWizardOpen={isOpen}
            onWizardResolve={handleCloseModal}
            onWizardSubmit={formState.handleSubmit}
            location={location}
            size={MODAL_LG}
            stepsConfig={stepsConfig(formState)}
            subTitle={defaultData.name}
            title={getModalTitle(formState.values.kind, !isEmpty(defaultData))}
          >
            <Wizard.Step>
              <NewFunctionModalStep1
                formRef={formRef.current}
                formState={formState}
                functionsStore={functionsStore}
                isStandAlone={isStandAlone}
                isStagingMode={isStagingMode}
                mode={mode}
              />
              <pre>{JSON.stringify(formState, null, 2)}</pre>
            </Wizard.Step>
            <Wizard.Step>
              <NewFunctionModalStep2
                appStore={appStore}
                formRef={formRef.current}
                formState={formState}
                functionsStore={functionsStore}
                mode={mode}
                projectName={projectName}
              />
              <pre>{JSON.stringify(formState, null, 2)}</pre>
            </Wizard.Step>
            <Wizard.Step>
              <NewFunctionModalStep3 appStore={appStore} formState={formState} />
              <pre>{JSON.stringify(formState, null, 2)}</pre>
            </Wizard.Step>
            {formState.values.kind !== FUNCTION_TYPE_JOB && (
              <Wizard.Step>Environment variables</Wizard.Step>
            )}
            {formState.values.kind !== FUNCTION_TYPE_JOB && (
              <Wizard.Step>Serving runtime configuration</Wizard.Step>
            )}
            {formState.values.kind !== FUNCTION_TYPE_JOB && <Wizard.Step>Advanced</Wizard.Step>}
          </Wizard>
        )
      }}
    </Form>
  )
}

NewFunctionModal.defaultProps = {
  defaultData: {},
  isStandAlone: false,
  runtime: FUNCTION_TYPE_JOB
}

NewFunctionModal.propTypes = {
  // createFunctionSuccess: PropTypes.func.isRequired,
  defaultData: PropTypes.shape({}),
  // handleDeployFunctionFailure: PropTypes.func.isRequired,
  // handleDeployFunctionSuccess: PropTypes.func.isRequired,
  mode: FUNCTION_PANEL_MODE.isRequired,
  isStandAlone: PropTypes.bool,
  projectName: PropTypes.string.isRequired,
  runtime: PropTypes.string
}

export default NewFunctionModal
