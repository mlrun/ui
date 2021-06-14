import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import Select from '../../common/Select/Select'
import RangeInput from '../../common/RangeInput/RangeInput'
import { VolumesTable } from '../../elements/VolumesTable/VolumesTable'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'

import { panelActions } from '../JobsPanel/panelReducer'
import { selectMemoryOptions as selectTypeOptions } from '../../utils/panelResources.util'

const JobsPanelResourcesView = ({
  handleAddNewVolume,
  handleAddNewNodeSelector,
  handleDeleteNodeSelector,
  handleDeleteVolume,
  handleEditNodeSelector,
  handleEditVolume,
  handleSelectCpuUnit,
  handleSelectMemoryUnit,
  panelDispatch,
  panelState,
  resourcesData
}) => (
  <div className="job-panel__item resources new-item-side-panel__item">
    <JobsPanelSection title="Resources" />
    <JobsPanelSection title="Volumes">
      <VolumesTable
        handleAddNewVolume={handleAddNewVolume}
        handleDelete={handleDeleteVolume}
        handleEdit={handleEditVolume}
        className={'data-inputs volumes'}
        volumeMounts={panelState.tableData.volume_mounts}
        volumes={panelState.tableData.volumes}
      />
    </JobsPanelSection>
    <div className="inputs">
      <JobsPanelSection title="Memory" className="memory">
        <Select
          density="dense"
          label="Unit"
          labelAtTop
          onClick={value => handleSelectMemoryUnit(value)}
          options={selectTypeOptions.unitMemory}
          selectedId={panelState.memoryUnit}
        />
        <RangeInput
          density="dense"
          floatingLabel
          label="Request"
          labelAtTop
          onChange={value =>
            panelDispatch({
              type: panelActions.SET_REQUESTS_MEMORY,
              payload: `${value}${
                !panelState.memoryUnit.length ||
                panelState.memoryUnit === 'Bytes'
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
          density="dense"
          floatingLabel
          label="Limit"
          labelAtTop
          onChange={value =>
            panelDispatch({
              type: panelActions.SET_LIMITS_MEMORY,
              payload: `${value}${
                !panelState.memoryUnit.length ||
                panelState.memoryUnit === 'Bytes'
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
      <JobsPanelSection title="Cpu" className="cpu">
        <Select
          density="dense"
          label="Unit"
          labelAtTop
          options={selectTypeOptions.unitCpu}
          onClick={value => handleSelectCpuUnit(value)}
          selectedId={panelState.cpuUnit}
        />
        <RangeInput
          density="dense"
          floatingLabel
          label="Request"
          labelAtTop
          onChange={value =>
            panelDispatch({
              type: panelActions.SET_REQUESTS_CPU,
              payload: `${value}${panelState.cpuUnit === 'millicpu' ? 'm' : ''}`
            })
          }
          value={resourcesData.requestsCpu}
        />
        <RangeInput
          density="dense"
          floatingLabel
          label="Limit"
          labelAtTop
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
          density="dense"
          floatingLabel
          label="Limit"
          labelAtTop
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
    <JobsPanelSection title="Node selector">
      <KeyValueTable
        addNewItem={handleAddNewNodeSelector}
        addNewItemLabel="Add entry"
        className="node-selector"
        content={panelState.tableData.node_selector}
        deleteItem={handleDeleteNodeSelector}
        editItem={handleEditNodeSelector}
        keyHeader="Key"
        keyType="input"
        valueHeader="Value"
        withEditMode
      />
    </JobsPanelSection>
  </div>
)

JobsPanelResourcesView.propTypes = {
  handleAddNewNodeSelector: PropTypes.func.isRequired,
  handleDeleteNodeSelector: PropTypes.func.isRequired,
  handleAddNewVolume: PropTypes.func.isRequired,
  handleDeleteVolume: PropTypes.func.isRequired,
  handleEditNodeSelector: PropTypes.func.isRequired,
  handleEditVolume: PropTypes.func.isRequired,
  handleSelectCpuUnit: PropTypes.func.isRequired,
  handleSelectMemoryUnit: PropTypes.func.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  resourcesData: PropTypes.shape({}).isRequired
}

export default JobsPanelResourcesView
