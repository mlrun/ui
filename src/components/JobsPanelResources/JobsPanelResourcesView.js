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
  handleSelectСpuUnit,
  match,
  panelDispatch,
  panelState,
  requestsCpu,
  requestsMemory,
  resourcesState,
  resourcesDispatch
}) => (
  <div className="job-panel__item resources">
    <JobsPanelSection title="Resources" />
    <JobsPanelSection title="Volumes">
      <JobsPanelVolumesTable
        handleAddNewItem={handleAddNewItem}
        handleEditItems={handleEditItems}
        handleDeleteItems={handleDeleteItems}
        resourcesDispatch={resourcesDispatch}
        resourcesState={resourcesState}
        match={match}
        panelState={panelState}
      />
    </JobsPanelSection>
    <JobsPanelSection title="Memory">
      <Select
        label="Unit"
        match={match}
        options={selectTypeOptions.unitMemory}
        onClick={value => handleSelectMemoryUnit(value)}
        selectedId={panelState.memoryUnit}
      />
      <RangeInput
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
        value={requestsMemory}
      />
      <RangeInput
        floatingLabel
        label="Limit"
        onChange={value =>
          panelDispatch({
            type: panelActions.SET_LIMITS_MEMORY,
            payload: `${value}`
          })
        }
        value={panelState.limits.memory}
      />
    </JobsPanelSection>
    <JobsPanelSection title="Cpu">
      <Select
        label="Unit"
        match={match}
        options={selectTypeOptions.unitCpu}
        onClick={value => handleSelectСpuUnit(value)}
        selectedId={panelState.cpuUnit}
      />
      <RangeInput
        floatingLabel
        label="Request"
        onChange={value =>
          panelDispatch({
            type: panelActions.SET_REQUESTS_CPU,
            payload: `${value}${panelState.cpuUnit === 'millicpu' ? 'm' : ''}`
          })
        }
        value={requestsCpu}
      />
      <RangeInput
        floatingLabel
        label="Limit"
        onChange={value =>
          panelDispatch({
            type: panelActions.SET_LIMITS_CPU,
            payload: `${value}`
          })
        }
        value={panelState.limits.cpu}
      />
    </JobsPanelSection>
    <JobsPanelSection title="Gpu" className="section-gpu">
      <RangeInput
        floatingLabel
        label="Limit"
        onChange={value =>
          panelDispatch({
            type: panelActions.SET_LIMITS_NVIDIA_GPU,
            payload: `${value}`
          })
        }
        value={panelState.limits.nvidia_gpu}
      />
    </JobsPanelSection>
  </div>
)

JobsPanelResourcesView.propTypes = {
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handleSelectMemoryUnit: PropTypes.func.isRequired,
  handleSelectСpuUnit: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  requestsCpu: PropTypes.string.isRequired,
  requestsMemory: PropTypes.string.isRequired,
  resourcesState: PropTypes.shape({}).isRequired,
  resourcesDispatch: PropTypes.func.isRequired
}

export default JobsPanelResourcesView
