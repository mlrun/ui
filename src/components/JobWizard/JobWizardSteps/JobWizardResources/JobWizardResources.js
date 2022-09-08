import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { FormSelect, FormKeyValueTable, Tip } from 'igz-controls/components'
import FormResourcesUnits from '../../../../elements/FormResourcesUnits/FormResourcesUnits'
import FormVolumesTable from '../../../../elements/FormVolumesTable/FormVolumesTable'

import { generateFunctionPriorityLabel } from '../../../../utils/generateFunctionPriorityLabel'
import { volumePreemptionModeOptions } from './JowWizardResources.util'

import './jobWizardResources.scss'

const JobWizardResources = ({ formState, frontendSpec }) => {
  const validFunctionPriorityClassNames = useMemo(() => {
    return (frontendSpec.valid_function_priority_class_names ?? []).map(className => ({
      id: className,
      label: generateFunctionPriorityLabel(className)
    }))
  }, [frontendSpec.valid_function_priority_class_names])

  return (
    <div className="job-wizard__resources form">
      <div className="form-row">
        <h5 className="form-step-title">Resources</h5>
      </div>
      <div className="form-row">
        {validFunctionPriorityClassNames.length > 0 && (
          <div className="form-col-auto resources__select">
            <FormSelect
              label="Pods priority"
              name="resources.jobPriorityClassName"
              options={validFunctionPriorityClassNames}
            />
          </div>
        )}
        {formState.values.preemptionMode && (
          <div className="form-col-auto resources__select">
            <FormSelect
              label="Spot Instances"
              name="resources.preemptionMode"
              options={volumePreemptionModeOptions}
            />
          </div>
        )}
      </div>
      <div className="form-row form-table-title">Node selection</div>
      <div className="form-row">
        <FormKeyValueTable
          keyHeader="Key"
          keyLabel="Key"
          addNewItemLabel="Add a node"
          fieldsPath="resources.nodeSelector"
          formState={formState}
          className="form-col-1"
        />
      </div>
      <FormResourcesUnits formState={formState} />
      <div className="form-row form-table-title">
        Volumes
        <Tip text="Volumes that define data paths and the required information for accessing the data from the function" />
      </div>
      <div className="form-row">
        <FormVolumesTable formState={formState} fieldsPath="resources.volumesTable" />
      </div>
    </div>
  )
}

JobWizardResources.propTypes = {
  formState: PropTypes.shape({}).isRequired,
  frontendSpec: PropTypes.shape({}).isRequired
}

export default JobWizardResources
