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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import FormResourcesUnits from '../../../../elements/FormResourcesUnits/FormResourcesUnits'
import FormVolumesTable from '../../../../elements/FormVolumesTable/FormVolumesTable'
import { FormSelect, FormKeyValueTable, Tip } from 'igz-controls/components'

import { RESOURCES_STEP } from '../../../../constants'
import { generateFunctionPriorityLabel } from '../../../../utils/generateFunctionPriorityLabel'
import { volumePreemptionModeOptions } from './JowWizardResources.util'
import { getValidationRules } from 'igz-controls/utils/validation.util'

import './jobWizardResources.scss'

const JobWizardResources = ({ formState, frontendSpec, stepIsActive }) => {
  const validFunctionPriorityClassNames = useMemo(() => {
    return (frontendSpec.valid_function_priority_class_names ?? []).map(className => ({
      id: className,
      label: generateFunctionPriorityLabel(className)
    }))
  }, [frontendSpec.valid_function_priority_class_names])

  return (
    <div className="job-wizard__resources">
      <div className="form-row">
        <h5 className="form-step-title">Resources</h5>
      </div>
      <div className="form-row">
        {validFunctionPriorityClassNames.length > 0 && (
          <div className="form-col-auto resources__select">
            <FormSelect
              label="Pods priority"
              name={`${RESOURCES_STEP}.jobPriorityClassName`}
              options={validFunctionPriorityClassNames}
            />
          </div>
        )}
        {frontendSpec.feature_flags?.preemption_nodes === 'enabled' && (
          <div className="form-col-auto resources__select">
            <FormSelect
              label="Spot Instances"
              name={`${RESOURCES_STEP}.preemptionMode`}
              options={volumePreemptionModeOptions}
            />
          </div>
        )}
      </div>
      <div className="form-row form-table-title">Node selection</div>
      <div className="form-row">
        <FormKeyValueTable
          actionButtonId="add-node-selector"
          addNewItemLabel="Add node selector"
          keyValidationRules={getValidationRules('nodeSelectors.key')}
          valueValidationRules={getValidationRules('nodeSelectors.value')}
          exitEditModeTriggerItem={stepIsActive}
          fieldsPath={`${RESOURCES_STEP}.nodeSelectorTable`}
          formState={formState}
          keyHeader="Key"
          keyLabel="Key"
        />
      </div>
      <FormResourcesUnits formState={formState} onChangeEnabled={stepIsActive} />
      <div className="form-row form-table-title">
        Volumes
        <Tip text="Volumes that define data paths and the required information for accessing the data from the function" />
      </div>
      <div className="form-row">
        <FormVolumesTable
          exitEditModeTriggerItem={stepIsActive}
          fieldsPath={`${RESOURCES_STEP}.volumesTable`}
          formState={formState}
        />
      </div>
    </div>
  )
}

JobWizardResources.defaultProps = {
  stepIsActive: false
}

JobWizardResources.propTypes = {
  formState: PropTypes.shape({}).isRequired,
  frontendSpec: PropTypes.shape({}).isRequired,
  stepIsActive: PropTypes.bool
}

export default JobWizardResources
