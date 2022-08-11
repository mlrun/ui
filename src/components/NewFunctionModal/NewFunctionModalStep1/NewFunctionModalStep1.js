import React from 'react'
import PropTypes from 'prop-types'
import { OnChange } from 'react-final-form-listeners'

import { FormChipCell, FormInput, FormSelect, FormTextarea } from 'igz-controls/components'

import { PANEL_CREATE_MODE, TAG_LATEST } from '../../../constants'

import { runtimeOptions, sourceCodeInBase64 } from '../newFunctionModal.util'
import { getChipOptions } from '../../../utils/getChipOptions'
import { getValidationRules } from 'igz-controls/utils/validation.util'

const NewFunctionModalStep1 = ({
  formState,
  formRef,
  functionsStore,
  isStandAlone,
  isStagingMode,
  mode
}) => {
  const handleNameValidation = value => {
    if (functionsStore.functions.some(func => func.metadata.name === value)) {
      return { name: 'nameExists', label: 'Function name already exists' }
    }
  }

  const onSelectedFunctionKindChange = kind => {
    formRef.current.change('spec.build.functionSourceCode', sourceCodeInBase64[kind])
  }

  return (
    <>
      <div className="form-row">
        {/* <FunctionsPanelTitle />  to be used after FunctionPanel is deprecated */}
        <div className="form-col">
          <h5 className="form__step-title">General</h5>
          <p>
            This wizard takes you through the process of deploying a new MLRun function in your
            project. <br />
            Functions can be used for data preparation, model training, model serving, notification
            & alerts and etc.
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
            disabled={mode !== PANEL_CREATE_MODE}
            label="Name"
            name="metadata.name"
            required
            validator={handleNameValidation}
            validationRules={getValidationRules('common.name')}
          />
        </div>
        <div className="form-col">
          <FormInput
            disabled={mode !== PANEL_CREATE_MODE}
            label="Tag"
            name="metadata.tag"
            placeholder={TAG_LATEST}
            validationRules={getValidationRules('common.tag')}
          />
        </div>
        <div className="form-col">
          <FormSelect
            disabled={isStandAlone || mode !== PANEL_CREATE_MODE}
            label="Runtime"
            name="kind"
            options={runtimeOptions(isStagingMode)}
          />
          <OnChange name="kind">{onSelectedFunctionKindChange}</OnChange>
        </div>
      </div>
      <div className="form-row">
        <FormTextarea label="Description" name="spec.description" />
      </div>
      <div className="form-row">
        <FormChipCell
          chipOptions={getChipOptions('metrics')}
          formState={formState}
          initialValues={formState.initialValues}
          isEditMode
          name="metadata.labels"
          visibleChipsMaxLength="all"
        />
      </div>
    </>
  )
}

NewFunctionModalStep1.propTypes = {
  functionsStore: PropTypes.object.isRequired,
  isStagingMode: PropTypes.bool
}

export default NewFunctionModalStep1
