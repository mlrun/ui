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

import { FormInput, FormSelect, FormCheckBox } from 'igz-controls/components'

import { selectOptions } from './jobWizardHyperparameterStrategy.util'

import './jobWizardHyperparametersStrategy.scss'

const JobWizardHyperparameterStrategy = ({ formState }) => {
  const strategiesPath = 'hyperparameterStrategy.strategy'
  const maxIterationsPath = 'hyperparameterStrategy.maxIterations'
  const maxErrorsPath = 'hyperparameterStrategy.maxErrors'
  const resultPath = 'hyperparameterStrategy.result'
  const criteriaPath = 'hyperparameterStrategy.criteria'
  const stopConditionPath = 'hyperparameterStrategy.stopCondition'
  const parallelRuns = 'hyperparameterStrategy.parallelRuns'
  const dashClusterUriPath = 'hyperparameterStrategy.daskClusterUri'
  const teardownDask = 'hyperparameterStrategy.teardownDask'

  return (
    <div className="job-wizard__hyperparameter-strategy form">
      <div className="form-row">
        <h5 className="form-step-title">Hyperparameter strategy</h5>
      </div>
      <div className="grid-container">
        <div className="strategy-grid-item">
          <FormSelect label="Strategy" name={strategiesPath} options={selectOptions.strategies} />
        </div>
        <div className="max-iterations-grid-item">
          <FormInput
            label="Max iterations"
            name={maxIterationsPath}
            type="number"
            disabled={formState.values?.hyperparameterStrategy?.strategy !== 'random'}
          />
        </div>
        <div className="max-errors-grid-item">
          <FormInput
            label="Max errors"
            name={maxErrorsPath}
            type="number"
            disabled={formState.values?.hyperparameterStrategy?.strategy !== 'random'}
          />
        </div>
        <div className="form-table-title ranking-title-grid-item">Ranking</div>
        <div className="result-grid-item">
          <FormInput label="Result" name={resultPath} />
        </div>
        <div className="criteria-grid-item">
          <FormSelect label="Criteria" name={criteriaPath} options={selectOptions.criteria} />
        </div>
        <div className="form-table-title stop-condition-title-grid-item">Stop condition</div>
        <div className="stop-condition-grid-item">
          <FormInput label="Stop condition" name={stopConditionPath} />
        </div>
        <div className="form-table-title parallelism-title-grid-item">Parallelism</div>
        <div className="parallel-runs-grid-item">
          <FormInput label="Parallel runs" name={parallelRuns} type="number" />
        </div>
        <div className="dask-cluster-uri-grid-item">
          <FormInput label="Dask clutter URL" name={dashClusterUriPath} />
        </div>
        <div className="teardown-dask-grid-item">
          <FormCheckBox label="Teardown" name={teardownDask} />
        </div>
      </div>
    </div>
  )
}

export default JobWizardHyperparameterStrategy
