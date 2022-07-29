import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'

// import FunctionsPanelTitle from '../../elements/FunctionsPanelTitle/FunctionsPanelTitle'
import NewFunctionModalStep1 from './NewFunctionModalStep1/NewFunctionModalStep1'

import { Wizard } from 'igz-controls/components'

import { MODAL_LG } from 'igz-controls/constants'
import { FUNCTION_TYPE_JOB } from '../../constants'
import { getModalTitle } from './newFunctionModal.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { useMode } from '../../hooks/mode.hook'
import { parseKeyValues } from '../../utils'
import { FUNCTION_PANEL_MODE } from '../../types'

const NewFunctionModal = ({ defaultData, isOpen, isStandAlone, mode, onResolve, runtime }) => {
  const { functionsStore } = useSelector(state => state)
  const formRef = React.useRef(
    createForm({
      initialValues: {
        description: defaultData.description ?? '',
        kind: defaultData.type ?? runtime ?? functionsStore.newFunction.kind,
        labels: parseKeyValues(defaultData.labels) ?? [],
        name: defaultData.name ?? functionsStore.newFunction.metadata.name,
        tag: defaultData.tag ?? functionsStore.newFunction.metadata.tag
      },
      onSubmit: () => {}
    })
  )

  const location = useLocation()
  const { isStagingMode } = useMode()
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
            className="form"
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
              <NewFunctionModalStep1
                formState={formState}
                functionsStore={functionsStore}
                isStandAlone={isStandAlone}
                isStagingMode={isStagingMode}
                mode={mode}
              />
            </Wizard.Step>
            <Wizard.Step>
              <div className="form-row">
                <h5 className="form__step-title">Code</h5>
              </div>
              <div className="form-row"></div>
            </Wizard.Step>
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
  defaultData: PropTypes.shape({}),
  mode: FUNCTION_PANEL_MODE.isRequired,
  isStandAlone: PropTypes.bool,
  runtime: PropTypes.string
}

export default NewFunctionModal
