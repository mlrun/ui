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
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, omit } from 'lodash'
import { OnChange } from 'react-final-form-listeners'

import { FormInput, FormSelect, ConfirmDialog, FormChipCell } from 'igz-controls/components'

import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { areFormValuesChanged } from 'igz-controls/utils/form.util'
import { getChipOptions } from '../../../../utils/getChipOptions'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import {
  generateJobWizardDefaultData,
  getFunctionParameters,
  parseDataInputs,
  parsePredefinedParameters
} from '../../JobWizard.util'

import './jobWizardJobDetails.scss'

const JobWizardJobDetails = ({
  defaultData,
  formState,
  frontendSpec,
  isEditMode,
  isStagingMode,
  jobAdditionalData,
  selectedFunctionData,
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
      areFormValuesChanged(
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
      <div className="form-row">
        <FormChipCell
          chipOptions={getChipOptions('metrics')}
          formState={formState}
          initialValues={formState.initialValues}
          isEditable
          label="labels"
          name="jobDetails.labels"
          shortChips
          visibleChipsMaxLength="all"
          validationRules={{
            key: getValidationRules('common.tag'),
            value: getValidationRules('common.tag')
          }}
        />
      </div>
      {spyOnMethodChange && <OnChange name={methodPath}>{onMethodChange}</OnChange>}
    </div>
  )
}

JobWizardJobDetails.propTypes = {
  defaultData: PropTypes.shape({}).isRequired,
  formState: PropTypes.shape({}).isRequired,
  frontendSpec: PropTypes.shape({}).isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isStagingMode: PropTypes.bool.isRequired,
  jobAdditionalData: PropTypes.shape({}).isRequired,
  selectedFunctionData: PropTypes.shape({}).isRequired,
  setJobAdditionalData: PropTypes.func.isRequired
}

export default JobWizardJobDetails
