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
import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, omit, set } from 'lodash'
import { OnChange } from 'react-final-form-listeners'

import {
  FormInput,
  FormSelect,
  ConfirmDialog,
  FormChipCell,
  FormCheckBox
} from 'igz-controls/components'

import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { areFormValuesChanged } from 'igz-controls/utils/form.util'
import { getChipOptions } from '../../../../utils/getChipOptions'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import {
  generateJobWizardData,
  generateJobWizardDefaultData,
  getFunctionParameters,
  parseDataInputs,
  parsePredefinedParameters
} from '../../JobWizard.util'

import './jobWizardRunDetails.scss'

const JobWizardRunDetails = ({
  defaultData,
  formState,
  frontendSpec,
  isBatchInference,
  isEditMode,
  jobAdditionalData,
  selectedFunctionData,
  setJobAdditionalData
}) => {
  const methodPath = 'runDetails.method'
  const [spyOnMethodChange, setSpyOnMethodChange] = useState(true)

  const setJobData = useCallback(
    (jobFormData, jobAdditionalData) => {
      const newInitial = {
        ...formState.initialValues,
        ...jobFormData
      }

      formState.form.reset(newInitial)
      setJobAdditionalData(jobAdditionalData)
    },
    [formState.form, formState.initialValues, setJobAdditionalData]
  )

  useEffect(() => {
    if (
      isEditMode &&
      !isEmpty(selectedFunctionData) &&
      !isEmpty(defaultData) &&
      isEmpty(jobAdditionalData)
    ) {
      const [jobFormData, jobAdditionalData] = generateJobWizardDefaultData(
        frontendSpec,
        selectedFunctionData,
        defaultData,
        isEditMode
      )
      setJobData(jobFormData, jobAdditionalData)
    } else if (!isEmpty(selectedFunctionData) && isEmpty(jobAdditionalData)) {
      const [jobFormData, jobAdditionalData] = generateJobWizardData(
        frontendSpec,
        selectedFunctionData,
        null,
        isEditMode
      )
      setJobData(jobFormData, jobAdditionalData)
    }
  }, [
    defaultData,
    formState.form,
    formState.initialValues,
    frontendSpec,
    isEditMode,
    jobAdditionalData,
    selectedFunctionData,
    setJobAdditionalData,
    setJobData
  ])

  const changePredefinedParameters = method => {
    setSpyOnMethodChange(true)

    const functionParameters = getFunctionParameters(selectedFunctionData.functions, method)
    const dataInputs = parseDataInputs(functionParameters)
    const predefinedParameters = parsePredefinedParameters(functionParameters)

    set(formState.initialValues, 'dataInputs.dataInputsTable', dataInputs)
    set(formState.initialValues, 'parameters.parametersTable.predefined', predefinedParameters)
    formState.form.change('dataInputs.dataInputsTable', dataInputs)
    formState.form.change('parameters.parametersTable.predefined', predefinedParameters)
  }

  const onMethodChange = (value, prevValue) => {
    setSpyOnMethodChange(false)

    if (
      areFormValuesChanged(
        omit(formState.initialValues, methodPath),
        omit(formState.values, methodPath)
      )
    ) {
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
            changePredefinedParameters(value)
          }
        },
        header: 'Are you sure?',
        message: 'Some changes might be lost'
      })
    } else {
      changePredefinedParameters(value)
    }
  }

  return (
    !isEmpty(jobAdditionalData) && (
      <div className="job-wizard__run-details">
        <div className="form-row">
          <h5 className="form-step-title">Run Details</h5>
        </div>
        {!isBatchInference && (
          <div className="form-row">
            <FormCheckBox label="Hyperparameter" name="runDetails.hyperparameter" />
          </div>
        )}
        <div className="form-row">
          <div className="form-col-2">
            <FormInput
              label="Name"
              name="runDetails.name"
              disabled={isEditMode}
              required
              validationRules={getValidationRules('common.name')}
            />
          </div>
          {jobAdditionalData.versionOptions?.length !== 0 && (
            <div className="form-col-1">
              <FormSelect
                name="runDetails.version"
                label="Version"
                options={jobAdditionalData.versionOptions || []}
              />
            </div>
          )}
          {!isBatchInference ? (
            jobAdditionalData.methodOptions?.length !== 0 ? (
              <div className="form-col-1">
                <FormSelect
                  label="Method"
                  name={methodPath}
                  options={jobAdditionalData.methodOptions || []}
                  scrollToView={false}
                />
              </div>
            ) : (
              <div className="form-col-1">
                <FormInput label="Method" name={methodPath} disabled={isEditMode} />
              </div>
            )
          ) : null}
        </div>
        <div className="form-row">
          <FormChipCell
            chipOptions={getChipOptions('metrics')}
            formState={formState}
            initialValues={formState.initialValues}
            isEditable
            label="labels"
            name="runDetails.labels"
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
  )
}

JobWizardRunDetails.propTypes = {
  defaultData: PropTypes.shape({}).isRequired,
  formState: PropTypes.shape({}).isRequired,
  frontendSpec: PropTypes.shape({}).isRequired,
  isBatchInference: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  jobAdditionalData: PropTypes.shape({}).isRequired,
  selectedFunctionData: PropTypes.shape({}).isRequired,
  setJobAdditionalData: PropTypes.func.isRequired
}

export default JobWizardRunDetails
