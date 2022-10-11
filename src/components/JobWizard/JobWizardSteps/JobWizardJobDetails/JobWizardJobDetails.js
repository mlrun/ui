import React, { useState, useEffect } from 'react'
import { OnChange } from 'react-final-form-listeners'
import { isEmpty, omit } from 'lodash'

import { FormInput, FormSelect, ConfirmDialog } from 'igz-controls/components'
import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { areFormValuesChanged } from 'igz-controls/utils/form.util'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { openPopUp } from 'igz-controls/utils/common.util'

import {
  parseDataInputs,
  getFunctionParameters,
  parsePredefinedParameters,
  generateJobWizardDefaultData
} from '../../JobWizard.util'

import './jobWizardJobDetails.scss'

const JobWizardJobDetails = ({
  formState,
  jobAdditionalData,
  selectedFunctionData,
  isEditMode,
  frontendSpec,
  defaultData,
  isStagingMode,
  setJobAdditionalData
}) => {
  const methodPath = 'jobDetails.method'
  const [spyOnMethodChange, setSpyOnMethodChange] = useState(true)

  useEffect(() => {
    if (isEditMode && !isEmpty(defaultData) && isEmpty(jobAdditionalData)) {
      const [jobFormData, jobAdditionalData] = generateJobWizardDefaultData(
        frontendSpec,
        defaultData,
        isEditMode,
        isStagingMode
      )
      const newInitial = {
        ...formState.initialValues,
        ...jobFormData
      }

      formState.form.reset(newInitial)
      setJobAdditionalData(jobAdditionalData)
    }
  }, [
    defaultData,
    formState.form,
    formState.initialValues,
    frontendSpec,
    isEditMode,
    isStagingMode,
    jobAdditionalData,
    setJobAdditionalData
  ])

  const onMethodChange = (value, prevValue) => {
    if (
      !areFormValuesChanged(
        omit(formState.initialValues, methodPath),
        omit(formState.values, methodPath)
      )
    ) {
      setSpyOnMethodChange(false)

      openPopUp(ConfirmDialog, {
        cancelButton: {
          label: 'Cancel',
          variant: TERTIARY_BUTTON,
          handler: () => {
            formState.form.change(methodPath, prevValue)
            setSpyOnMethodChange(true)
          }
        },
        confirmButton: {
          label: 'OK',
          variant: SECONDARY_BUTTON,
          handler: () => {
            setSpyOnMethodChange(true)

            const functionParameters = getFunctionParameters(selectedFunctionData.functions, value)

            formState.form.change('dataInputs.dataInputsTable', parseDataInputs(functionParameters))
            formState.form.change(
              'parameters.parametersTable.predefined',
              parsePredefinedParameters(functionParameters)
            )
          }
        },
        header: 'Are you sure?',
        message: 'Some changes might be lost'
      })
    }
  }

  return (
    <div className="job-wizard__job-details form">
      <div className="form-row">
        <h5 className="form-step-title">Job Details</h5>
      </div>
      <div className="form-row">
        This is a paragraph explaining what the user will find here and what he or she should do
        next, here we can throw in all the jargon words that normal people would glaze over.
      </div>
      <div className="form-row">
        <div className="form-col-2">
          <FormInput
            label="Name"
            name="jobDetails.name"
            disabled={isEditMode}
            required
            validationRules={getValidationRules('common.name')}
          />
        </div>
        {jobAdditionalData.versionOptions?.length !== 0 && (
          <div className="form-col-1">
            <FormSelect
              name="jobDetails.version"
              label="Version"
              options={jobAdditionalData.versionOptions || []}
            />
          </div>
        )}
        {jobAdditionalData.methodOptions?.length !== 0 && (
          <div className="form-col-1">
            <FormSelect
              name={methodPath}
              label="Method"
              options={jobAdditionalData.methodOptions || []}
            />
          </div>
        )}
      </div>
      {spyOnMethodChange && <OnChange name={methodPath}>{onMethodChange}</OnChange>}
    </div>
  )
}

JobWizardJobDetails.defaultProps = {}

JobWizardJobDetails.propTypes = {}

export default JobWizardJobDetails
