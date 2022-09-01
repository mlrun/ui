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
