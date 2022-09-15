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
    formRef.change('spec.build.functionSourceCode', sourceCodeInBase64[kind])
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
          label="Labels"
          name="labels"
          visibleChipsMaxLength="all"
          validationRules={{
            key: getValidationRules('common.tag'),
            value: getValidationRules('common.tag')
          }}
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
