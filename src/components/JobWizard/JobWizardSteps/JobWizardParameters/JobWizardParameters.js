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
import { get } from 'lodash'

import FormParametersTable from '../../../../elements/FormParametersTable/FormParametersTable'
import JobWizardResources from '../JobWizardResources/JobWizardResources'
import { FormInput, FormSelect } from 'igz-controls/components'

import { selectOptions } from './jobWizardParameters.util'

import './jobWizardParameters.scss'

const JobWizardParameters = ({ formState }) => {
  const paramFilePath = 'parameters.hyperParameters.paramFile'
  const tuningStrategyPath = 'parameters.hyperParameters.tuningStrategy'
  const resultPath = 'parameters.hyperParameters.result'
  const criteriaPath = 'parameters.hyperParameters.criteria'

  const [isParamFileDisabled, setIsParamFileDisabled] = useState(false)
  const [isHyperOptionDisabled, setIsHyperOptionDisabled] = useState(false)
  const [isParametersEditModeEnabled, setIsParametersEditModeEnabled] = useState(false)

  useEffect(() => {
    setIsParamFileDisabled(
      get(formState, 'values.parameters.parametersTable.custom', []).some(
        parameter => parameter.data.parameterType === 'Hyper'
      )
    )
  }, [formState])

  useEffect(() => {
    setIsHyperOptionDisabled(
      get(formState, 'values.parameters.hyperParameters.paramFile', '').length > 0
    )
  }, [formState])

  return (
    <div className="job-wizard__parameters form">
      <div className="form-row">
        <h5 className="form-step-title">Parameters</h5>
      </div>
      <div className="form-row">
        This is a paragraph explaining what the user will find here and what he or she should do
        next, here we can throw in all the jargon words that normal people would glaze over.
      </div>
      <FormParametersTable
        fieldsPath="parameters.parametersTable"
        formState={formState}
        isHyperOptionDisabled={isHyperOptionDisabled}
        setIsParametersEditModeEnabled={setIsParametersEditModeEnabled}
      />
      <div className="form-row hyper-parameters">
        <h6 className="form-step-subtitle">Hyper parameters</h6>
      </div>
      <div className="form-row">
        <div className="form-col-3">
          <FormInput
            disabled={isParamFileDisabled || isParametersEditModeEnabled}
            label="Read hyper params from a file"
            placeholder="v3io:///projects/my-proj/param.txt"
            type="text"
            name={paramFilePath}
          />
        </div>
        <div className="form-col-1">
          <FormSelect
            disabled={
              (!get(formState.values, paramFilePath.split('.')) && !isParamFileDisabled) ||
              isParametersEditModeEnabled
            }
            label="Tuning strategy"
            name={tuningStrategyPath}
            options={selectOptions.hyperStrategyType}
          />
        </div>
        <div className="form-col-3">
          <FormInput
            disabled={isParametersEditModeEnabled}
            label="Result"
            type="text"
            name={resultPath}
          />
        </div>
        <div className="form-col-1">
          <FormSelect
            disabled={isParametersEditModeEnabled}
            label="Criteria"
            name={criteriaPath}
            options={selectOptions.selectorCriteria}
          />
        </div>
      </div>
    </div>
  )
}

JobWizardResources.propTypes = {
  formState: PropTypes.shape({}).isRequired
}

export default JobWizardParameters
