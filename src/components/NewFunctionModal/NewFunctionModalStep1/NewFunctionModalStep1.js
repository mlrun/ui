import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { FormInput, FormSelect, FormTextarea } from 'igz-controls/components'

import { PANEL_CREATE_MODE } from '../../../constants'
import functionsActions from '../../../actions/functions'
import { runtimeOptions } from '../newFunctionModal.util'
import { getValidationRules } from 'igz-controls/utils/validation.util'

const NewFunctionModalStep1 = ({
  formState,
  functionsStore: { functions, newFunction },
  isStandAlone,
  isStagingMode,
  mode
}) => {
  const dispatch = useDispatch()

  const handleNameValidation = value => {
    if (functions.some(func => func.metadata.name === value)) {
      return { name: 'nameExists', label: 'Function name already exists' }
    }
    dispatch(functionsActions.setNewFunctionName(value))
  }

  const handleTagValidation = tag => {
    if (tag !== newFunction.metadata.tag) {
      dispatch(functionsActions.setNewFunctionTag(tag))
    }
  }

  const handleDescriptionValidation = description => {
    if (newFunction.spec.description !== description) {
      functionsActions.setNewFunctionDescription(description)
    }
  }

  const selectRuntime = runtime => dispatch(newFunction.setNewFunctionKind(runtime))

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
            name="name"
            required
            validator={handleNameValidation}
            validationRules={getValidationRules('common.name')}
          />
        </div>
        <div className="form-col">
          <FormInput
            disabled={mode !== PANEL_CREATE_MODE}
            label="Tag"
            name="tag"
            placeholder="latest"
            validator={handleTagValidation}
            validationRules={getValidationRules('common.tag')}
          />
        </div>
        <div className="form-col">
          <FormSelect
            disabled={isStandAlone || mode !== PANEL_CREATE_MODE}
            label="Runtime"
            name="kind"
            onChange={selectRuntime}
            options={runtimeOptions(isStagingMode)}
          />
        </div>
      </div>
      <div className="form-row">
        <FormTextarea
          label="Description"
          name="description"
          onChange={handleDescriptionValidation}
        />
      </div>
      <div className="form-row">PlaceHolder: Labels component</div>
      <pre>{JSON.stringify(formState, null, 2)}</pre>
    </>
  )
}

NewFunctionModalStep1.propTypes = {
  functionsStore: PropTypes.object.isRequired,
  isStandAlone: PropTypes.bool,
  isStagingMode: PropTypes.bool
}

export default NewFunctionModalStep1
