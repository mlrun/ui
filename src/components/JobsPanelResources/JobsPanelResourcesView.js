import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import Select from '../../common/Select/Select'

import { volumePreemptionModeOptions } from '../../utils/panelResources.util'
import JobsPanelNodeSelector from './JobsPanelNodeSelector/JobsPanelNodeSelector'
import JobsPanelVolumes from './JobsPanelVolumes/JobsPanelVolumes'
import PanelResourcesUnits from '../../elements/PanelResourcesUnits/PanelResourcesUnits'

const JobsPanelResourcesView = ({
  data,
  handleSelectCpuUnit,
  handleSelectMemoryUnit,
  handleSelectPreemptionMode,
  panelDispatch,
  panelState,
  setCpuValue,
  setGpuValue,
  setMemoryValue,
  setPriorityClassName,
  validation,
  validFunctionPriorityClassNames
}) => {
  return (
    <div className="job-panel__item resources new-item-side-panel__item">
      <JobsPanelSection title="Resources" />
      <div className="pods">
        {validFunctionPriorityClassNames.length > 0 && (
          <JobsPanelSection title="Pods priority">
            <Select
              className="pods-priority"
              onClick={setPriorityClassName}
              options={validFunctionPriorityClassNames}
              selectedId={panelState.priority_class_name}
              withSelectedIcon
            />
          </JobsPanelSection>
        )}
        {panelState.preemption_mode && (
          <JobsPanelSection title="Run On Spot Nodes">
            <Select
              className="volume-toleration"
              options={volumePreemptionModeOptions}
              onClick={handleSelectPreemptionMode}
              selectedId={panelState.preemption_mode}
              withSelectedIcon
            />
          </JobsPanelSection>
        )}
      </div>
      <JobsPanelSection
        title="Volumes"
        tip="Volumes that define data paths and the required information for accessing the data from the function"
      >
        <JobsPanelVolumes
          panelDispatch={panelDispatch}
          panelState={panelState}
        />
      </JobsPanelSection>
      <PanelResourcesUnits
        data={data}
        handleSelectCpuUnit={handleSelectCpuUnit}
        handleSelectMemoryUnit={handleSelectMemoryUnit}
        setCpuValue={setCpuValue}
        setGpuValue={setGpuValue}
        setMemoryValue={setMemoryValue}
        validation={validation}
      />
      <JobsPanelSection title="Node selector">
        <JobsPanelNodeSelector
          panelDispatch={panelDispatch}
          panelState={panelState}
        />
      </JobsPanelSection>
    </div>
  )
}

JobsPanelResourcesView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleSelectCpuUnit: PropTypes.func.isRequired,
  handleSelectMemoryUnit: PropTypes.func.isRequired,
  handleSelectPreemptionMode: PropTypes.func.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setCpuValue: PropTypes.func.isRequired,
  setGpuValue: PropTypes.func.isRequired,
  setMemoryValue: PropTypes.func.isRequired,
  setPriorityClassName: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired,
  validFunctionPriorityClassNames: PropTypes.arrayOf(PropTypes.object)
    .isRequired
}

export default JobsPanelResourcesView
