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
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { OnChange } from 'react-final-form-listeners'

import FormEnvironmentVariablesTable from '../../../../elements/FormEnvironmentVariablesTable/FormEnvironmentVariablesTable'
import ScheduleWizard from '../../../SheduleWizard/ScheduleWizard'
import { FormCheckBox, FormInput, FormKeyValueTable } from 'igz-controls/components'

import { PANEL_EDIT_MODE } from '../../../../constants'
import { secretsKindOptions } from './JobWizardAdvanced.util'

import './jobWizardAdvanced.scss'

const JobWizardAdvanced = ({
  editJob,
  formState,
  mode,
  params,
  runJob,
  scheduleButtonRef,
  selectedFunctionData,
  setShowSchedule,
  showSchedule
}) => {
  const [showSecrets] = useState(false)

  useEffect(() => {
    return () => {
      setShowSchedule(false)
    }
  }, [setShowSchedule])

  return (
    <div className="job-wizard__advanced">
      <div className="form-row">
        <h5 className="form-step-title">Advanced</h5>
      </div>
      <div className="form-row form-table-title">Environment variables</div>
      <div className="form-row">
        <FormEnvironmentVariablesTable
          fieldsPath="advanced.environmentVariablesTable"
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
              fieldsPath="advanced.secretSourcesTable"
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
          <FormInput name="advanced.inputPath" label="Default input path" />
        </div>
        <div className="form-col-1">
          <FormInput name="advanced.outputPath" label="Default artifact path" required />
        </div>
      </div>
      <div className="form-row align-stretch">
        <div className="access-key-checkbox">
          <FormCheckBox label="Auto-generate access key" name="advanced.accessKey" />
        </div>
        {!formState.values.advanced.accessKey && (
          <div className="form-col-1">
            <FormInput name="advanced.accessKeyInput" label="Access key" required />
          </div>
        )}
      </div>
      {showSchedule && (
        <ScheduleWizard
          onSchedule={() => {
            formState.handleSubmit()

            if (formState.valid) {
              if (mode === PANEL_EDIT_MODE) {
                editJob(formState.values, selectedFunctionData, params)
              } else {
                runJob(formState.values, selectedFunctionData, params, true)
              }
            }
          }}
          scheduleButtonRef={scheduleButtonRef}
          scheduleData={formState.values.scheduleData}
          setFieldValue={formState.form.change}
          setShowSchedule={setShowSchedule}
        />
      )}
      <OnChange name="advanced.accessKey">
        {() => formState.form.change('advanced.accessKeyInput', '')}
      </OnChange>
    </div>
  )
}

JobWizardAdvanced.propTypes = {
  editJob: PropTypes.func.isRequired,
  formState: PropTypes.shape({}).isRequired,
  mode: PropTypes.string.isRequired,
  params: PropTypes.shape({}).isRequired,
  runJob: PropTypes.func.isRequired,
  scheduleButtonRef: PropTypes.shape({}).isRequired,
  selectedFunctionData: PropTypes.shape({}).isRequired,
  setShowSchedule: PropTypes.func.isRequired,
  showSchedule: PropTypes.bool.isRequired
}

export default JobWizardAdvanced
