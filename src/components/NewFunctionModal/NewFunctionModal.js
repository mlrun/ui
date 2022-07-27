import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'

// import FunctionsPanelTitle from '../../elements/FunctionsPanelTitle/FunctionsPanelTitle'
import { FormInput, FormSelect, FormTextarea, Wizard } from 'igz-controls/components'

import { MODAL_LG } from 'igz-controls/constants'
import { FUNCTION_TYPE_JOB } from '../../constants'
import { getModalTitle, runtimeOptions } from './newFunctionModal.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { useMode } from '../../hooks/mode.hook'

const NewFunctionModal = ({ isOpen, isStandAlone, onResolve, runtime }) => {
  const formRef = React.useRef(
    createForm({
      initialValues: { runtime },
      onSubmit: () => {}
    })
  )

  const { functions, newFunction } = useSelector(state => state.functionsStore)
  const location = useLocation()
  const { isStagingMode } = useMode()
  const { handleCloseModal } = useModalBlockHistory(onResolve, formRef.current)

  const handleNameValidation = value => {
    if (
      functions.some(func => func.metadata.name === value || newFunction.metadata.name === value)
    ) {
      return { name: 'nameExists', label: 'Function name already exists' }
    }
  }

  const handleTagValidation = value => {
    if (newFunction.metadata.tag === value) {
      return { name: 'tagExists', label: 'Tag already exists' }
    }
  }

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
      id: 'volumes',
      label: 'Volumes'
    },
    {
      id: 'environmentVariables',
      label: 'Environment variables'
    }
  ]

  const handleSubmit = values => {
    if (!values.tag) {
      values.tag = 'latest'
    }
    console.log(values)
  }

  return (
    <Form form={formRef.current} onSubmit={handleSubmit}>
      {formState => {
        return (
          <Wizard
            data-testid="new-function-modal"
            className="new-function-form form"
            formState={formState}
            isWizardOpen={isOpen}
            onWizardResolve={handleCloseModal}
            onWizardSubmit={formState.handleSubmit}
            location={location.pathname}
            size={MODAL_LG}
            stepsConfig={stepsConfig(formState)}
            title={getModalTitle(formState.values.runtime)}
          >
            <Wizard.Step>
              <div className="form-row">
                {/* <FunctionsPanelTitle />  to be used after FunctionPanel is deprecated */}
                <div className="form-col">
                  <h5 className="form__step-title">General</h5>
                  <p>
                    This wizard takes you through the process of deploying a new MLRun function in
                    your project. <br />
                    Functions can be used for data preparation, model training, model serving,
                    notification & alerts and etc.
                  </p>
                  <a
                    href="https://docs.mlrun.org/en/latest/tutorial/01-mlrun-basics.html#gs-tutorial-1-step-create-basic-function"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    Read more about MLRun functions
                  </a>
                </div>
              </div>
              <div className="form-row">
                <div className="form-col-4">
                  <FormInput
                    label="Name"
                    name="name"
                    required
                    validator={handleNameValidation}
                    validationRules={getValidationRules('common.name')}
                  />
                </div>
                <div className="form-col">
                  <FormInput
                    label="Tag"
                    name="tag"
                    placeholder="latest"
                    validator={handleTagValidation}
                    validationRules={getValidationRules('common.tag')}
                  />
                </div>
                <div className="form-col">
                  <FormSelect
                    disabled={isStandAlone}
                    label="Runtime"
                    name="runtime"
                    options={runtimeOptions(isStagingMode)}
                  />
                </div>
              </div>
              <div className="form-row">
                <FormTextarea label="Description" name="description" />
              </div>
              <div className="form-row">Labels</div>
              <pre>{JSON.stringify(formState, null, 2)}</pre>
            </Wizard.Step>
            <Wizard.Step>
              <div className="form">
                <div className="form-row">
                  <h5 className="form__step-title">Code</h5>
                </div>
                <div className="form-row"></div>
              </div>
            </Wizard.Step>
          </Wizard>
        )
      }}
    </Form>
  )
}

NewFunctionModal.defaultProps = {
  isStandAlone: false,
  runtime: FUNCTION_TYPE_JOB
}

NewFunctionModal.propTypes = {
  isStandAlone: PropTypes.bool,
  runtime: PropTypes.string
}

export default NewFunctionModal
