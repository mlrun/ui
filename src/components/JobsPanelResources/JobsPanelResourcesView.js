import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import Select from '../../common/Select/Select'
import RangeInput from '../../common/RangeInput/RangeInput'

import { panelActions } from '../JobsPanel/panelReducer'
import { JobsPanelVolumesTable } from '../../elements/JobsPanelVolumesTable/JobsPanelVolumesTable'
import { selectMemoryOptions as selectTypeOptions } from './jobsPanelResources.util'

const JobsPanelResourcesView = ({
  handleAddNewItem,
  handleDeleteItems,
  handleEditItems,
  handleSelectMemoryUnit,
  handleSelectCpuUnit,
  match,
  panelDispatch,
  panelState,
  resourcesData,
  resourcesDispatch,
  resourcesState
}) => (
  <div className="job-panel__item resources new-item-side-panel__item">
    <JobsPanelSection title="Resources" />
    <JobsPanelSection title="Volumes">
      <JobsPanelVolumesTable
        handleAddNewItem={handleAddNewItem}
        handleDeleteItems={handleDeleteItems}
        handleEditItems={handleEditItems}
        match={match}
        panelState={panelState}
        resourcesDispatch={resourcesDispatch}
        resourcesState={resourcesState}
      />
    </JobsPanelSection>
    <JobsPanelSection title="Memory">
      <Select
        density="chunky"
        label="Unit"
        onClick={value => handleSelectMemoryUnit(value)}
        options={selectTypeOptions.unitMemory}
        selectedId={panelState.memoryUnit}
      />
      <RangeInput
        density="chunky"
        floatingLabel
        label="Request"
        onChange={value =>
          panelDispatch({
            type: panelActions.SET_REQUESTS_MEMORY,
            payload: `${value}${
              !panelState.memoryUnit.length || panelState.memoryUnit === 'Bytes'
                ? ''
                : panelState.memoryUnit.match(/i/)
                ? panelState.memoryUnit.slice(0, 2)
                : panelState.memoryUnit.slice(0, 1)
            }`
          })
        }
        value={resourcesData.requestsMemory}
      />
      <RangeInput
        density="chunky"
        floatingLabel
        label="Limit"
        onChange={value =>
          panelDispatch({
            type: panelActions.SET_LIMITS_MEMORY,
            payload: `${value}${
              !panelState.memoryUnit.length || panelState.memoryUnit === 'Bytes'
                ? ''
                : panelState.memoryUnit.match(/i/)
                ? panelState.memoryUnit.slice(0, 2)
                : panelState.memoryUnit.slice(0, 1)
            }`
          })
        }
        value={resourcesData.limitsMemory}
      />
    </JobsPanelSection>
    <JobsPanelSection title="Cpu">
      <Select
        density="chunky"
        label="Unit"
        options={selectTypeOptions.unitCpu}
        onClick={value => handleSelectCpuUnit(value)}
        selectedId={panelState.cpuUnit}
      />
      <RangeInput
        density="chunky"
        floatingLabel
        label="Request"
        onChange={value =>
          panelDispatch({
            type: panelActions.SET_REQUESTS_CPU,
            payload: `${value}${panelState.cpuUnit === 'millicpu' ? 'm' : ''}`
          })
        }
        value={resourcesData.requestsCpu}
      />
      <RangeInput
        density="chunky"
        floatingLabel
        label="Limit"
        onChange={value =>
          panelDispatch({
            type: panelActions.SET_LIMITS_CPU,
            payload: `${value}${panelState.cpuUnit === 'millicpu' ? 'm' : ''}`
          })
        }
        value={resourcesData.limitsCpu}
      />
    </JobsPanelSection>
    <JobsPanelSection title="Gpu" className="section-gpu">
      <RangeInput
        density="chunky"
        floatingLabel
        label="Limit"
        onChange={value =>
          panelDispatch({
            type: panelActions.SET_LIMITS_NVIDIA_GPU,
            payload: `${value}`
          })
        }
        value={panelState.limits['nvidia.com/gpu']}
      />
    </JobsPanelSection>
  </div>
)

JobsPanelResourcesView.propTypes = {
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handleSelectMemoryUnit: PropTypes.func.isRequired,
  handleSelectCpuUnit: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  resourcesData: PropTypes.shape({}).isRequired,
  resourcesDispatch: PropTypes.func.isRequired,
  resourcesState: PropTypes.shape({}).isRequired
}

export default JobsPanelResourcesView
