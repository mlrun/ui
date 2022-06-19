import React from 'react'
import PropTypes from 'prop-types'

import PanelSection from '../../elements/PanelSection/PanelSection'
import Select from '../../common/Select/Select'

import { volumePreemptionModeOptions } from '../../utils/panelResources.util'
import JobsPanelNodeSelector from './JobsPanelNodeSelector/JobsPanelNodeSelector'
import JobsPanelVolumes from './JobsPanelVolumes/JobsPanelVolumes'
import PanelResourcesUnits from '../../elements/PanelResourcesUnits/PanelResourcesUnits'

const JobsPanelResourcesView = ({
  data,
  gpuType,
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
      <PanelSection title="Resources" />
      <div className="pods">
        {validFunctionPriorityClassNames.length > 0 && (
          <PanelSection title="Pods priority">
            <Select
              disabled={panelState.editMode}
              className="pods-priority"
              onClick={setPriorityClassName}
              options={validFunctionPriorityClassNames}
              selectedId={panelState.priority_class_name}
              withSelectedIcon
            />
          </PanelSection>
        )}
        {panelState.preemption_mode && (
          <PanelSection title="Run On Spot Nodes">
            <Select
              className="volume-toleration"
              disabled={panelState.editMode}
              options={volumePreemptionModeOptions}
              onClick={handleSelectPreemptionMode}
              selectedId={panelState.preemption_mode}
              withSelectedIcon
            />
          </PanelSection>
        )}
      </div>
      <PanelSection
        title="Volumes"
        tip="Volumes that define data paths and the required information for accessing the data from the function"
      >
        <JobsPanelVolumes panelDispatch={panelDispatch} panelState={panelState} />
      </PanelSection>
      <PanelResourcesUnits
        data={data}
        gpuType={gpuType}
        handleSelectCpuUnit={handleSelectCpuUnit}
        handleSelectMemoryUnit={handleSelectMemoryUnit}
        isPanelEditMode={panelState.editMode}
        setCpuValue={setCpuValue}
        setGpuValue={setGpuValue}
        setMemoryValue={setMemoryValue}
        validation={validation}
      />
      <PanelSection title="Node selector">
        <JobsPanelNodeSelector panelDispatch={panelDispatch} panelState={panelState} />
      </PanelSection>
    </div>
  )
}

JobsPanelResourcesView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  gpuType: PropTypes.string.isRequired,
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
  validFunctionPriorityClassNames: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default JobsPanelResourcesView
