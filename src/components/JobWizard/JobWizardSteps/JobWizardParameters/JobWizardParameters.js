import React, { useEffect, useState } from 'react'
import { get } from 'lodash'

import FormParametersTable from '../../../../elements/FormParametersTable/FormParametersTable'
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

JobWizardParameters.defaultProps = {}

JobWizardParameters.propTypes = {}

export default JobWizardParameters
