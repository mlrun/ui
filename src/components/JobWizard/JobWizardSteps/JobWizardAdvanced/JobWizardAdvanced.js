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
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import FormEnvironmentVariablesTable from '../../../../elements/FormEnvironmentVariablesTable/FormEnvironmentVariablesTable'
import { FormCheckBox, FormInput, FormKeyValueTable, FormOnChange } from 'igz-controls/components'

import { ADVANCED_STEP } from '../../../../constants'
import { secretsKindOptions } from './JobWizardAdvanced.util'

import './jobWizardAdvanced.scss'

const JobWizardAdvanced = ({ formState, stepIsActive = false }) => {
  const [showSecrets] = useState(false)

  return (
    <div className="job-wizard__advanced">
      <div className="form-row">
        <h5 className="form-step-title">Advanced</h5>
      </div>
      <div className="form-row form-table-title">Environment variables</div>
      <div className="form-row">
        <FormEnvironmentVariablesTable
          exitEditModeTriggerItem={stepIsActive}
          fieldsPath={`${ADVANCED_STEP}.environmentVariablesTable`}
          formState={formState}
        />
      </div>
      {/* secretSourcesTable - currently not shown*/}
      {showSecrets && (
        <>
          <div className="form-row form-table-title">Secrets</div>
          <div className="form-row">
            <FormKeyValueTable
              addNewItemLabel="Add secret"
              defaultKey="file"
              exitEditModeTriggerItem={stepIsActive}
              fieldsPath={`${ADVANCED_STEP}.secretSourcesTable`}
              formState={formState}
              keyHeader="Kind"
              keyLabel="Kind"
              keyOptions={secretsKindOptions}
            />
          </div>
        </>
      )}
      <div className="form-row">
        <div className="form-col-1">
          <FormInput name={`${ADVANCED_STEP}.inputPath`} label="Default input path" />
        </div>
        <div className="form-col-1">
          <FormInput name={`${ADVANCED_STEP}.outputPath`} label="Default artifact path" required />
        </div>
      </div>
      <div className="form-row align-stretch">
        <div className="access-key-checkbox">
          <FormCheckBox label="Auto-generate access key" name={`${ADVANCED_STEP}.accessKey`} />
        </div>
        {!formState.values?.[ADVANCED_STEP]?.accessKey && (
          <div className="form-col-1">
            <FormInput name={`${ADVANCED_STEP}.accessKeyInput`} label="Access key" required />
          </div>
        )}
      </div>
      {stepIsActive && (
        <FormOnChange
          handler={() => formState.form.change(`${ADVANCED_STEP}.accessKeyInput`, '')}
          name={`${ADVANCED_STEP}.accessKey`}
        />
      )}
    </div>
  )
}

JobWizardAdvanced.propTypes = {
  formState: PropTypes.shape({}).isRequired,
  stepIsActive: PropTypes.bool
}

export default JobWizardAdvanced
