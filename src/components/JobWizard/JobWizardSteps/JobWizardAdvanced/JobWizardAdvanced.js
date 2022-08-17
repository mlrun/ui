import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { OnChange } from 'react-final-form-listeners'

import { FormCheckBox, FormInput, FormKeyValueTable } from 'igz-controls/components'
import ScheduleWizard from '../../../SheduleWizard/ScheduleWizard'

import { secretsKindOptions } from './JobWizardAdvanced.util'
import { useMode } from '../../../../hooks/mode.hook'

import './jobWizardAdvanced.scss'

const JobWizardAdvanced = ({ formState, scheduleButtonRef, setShowSchedule, showSchedule }) => {
  const { isStagingMode } = useMode()

  useEffect(() => {
    return () => {
      setShowSchedule(false)
    }
  }, [setShowSchedule])

  return (
    <div className="job-wizard__advanced form">
      <div className="form-row">
        <h5 className="form-step-title">Advanced</h5>
      </div>
      <div className="form-row">
        This is a paragraph explaining what the user will find here and what he or she should do
        next, here we can throw in all the jargon words that normal people would glaze over.
      </div>
      <div className="form-row form-table-title">Environment variables</div>
      <div className="form-row">
        <FormKeyValueTable
          addNewItemLabel="Add environment variable"
          className="form-col-1"
          fieldsPath="advanced.environmentVariables"
          formState={formState}
          keyHeader="Name"
          keyLabel="Name"
        />
      </div>

      {isStagingMode && (
        <>
          <div className="form-row form-table-title">Secrets</div>
          <div className="form-row">
            <FormKeyValueTable
              addNewItemLabel="Add secret"
              className="form-col-1"
              defaultKey="file"
              fieldsPath="advanced.secretSources"
              formState={formState}
              keyHeader="Kind"
              keyLabel="Kind"
              keyOptions={secretsKindOptions}
            />
          </div>
        </>
      )}
      <div className="form-row align-stretch">
        <div className="access-key-checkbox">
          <FormCheckBox label="Auto-generate access key" name="advanced.access_key" />
        </div>
        {!formState.values.advanced.access_key && (
          <div className="form-col-1">
            <FormInput name="advanced.access_key_input" label="Access key" required />
          </div>
        )}
      </div>
      {showSchedule && (
        <ScheduleWizard
          onSchedule={formState.handleSubmit}
          scheduleButtonRef={scheduleButtonRef}
          scheduleData={formState.values.scheduleData}
          setFieldValue={formState.form.change}
          setShowSchedule={setShowSchedule}
        />
      )}
      <OnChange name="advanced.access_key">
        {() => formState.form.change('advanced.access_key_input', '')}
      </OnChange>
    </div>
  )
}

JobWizardAdvanced.propTypes = {
  formState: PropTypes.shape({}).isRequired,
  scheduleButtonRef: PropTypes.shape({}).isRequired,
  setShowSchedule: PropTypes.func.isRequired,
  showSchedule: PropTypes.bool.isRequired
}

export default JobWizardAdvanced
