import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import Select from '../../common/Select/Select'
import RangeInput from '../../common/RangeInput/RangeInput'
import { VolumesTable } from '../../elements/VolumesTable/VolumesTable'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'

import { selectMemoryOptions as selectTypeOptions } from '../../utils/panelResources.util'
import { LIMITS, REQUESTS } from '../JobsPanel/jobsPanel.util'

const JobsPanelResourcesView = ({
  handleAddNewVolume,
  handleAddNewNodeSelector,
  handleDeleteNodeSelector,
  handleDeleteVolume,
  handleEditNodeSelector,
  handleEditVolume,
  handleSelectCpuUnit,
  handleSelectMemoryUnit,
  panelState,
  resourcesData,
  setCpuValue,
  setGpuValue,
  setMemoryValue,
  validation
}) => {
  return (
    <div className="job-panel__item resources new-item-side-panel__item">
      <JobsPanelSection title="Resources" />
      <JobsPanelSection
        title="Volumes"
        tip="Volumes that define data paths and the required information for accessing the data from the function"
      >
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
            invalid={!validation.isMemoryRequestValid}
            invalidText="Request must be less than or equal to Limit and not be less than 1"
            label="Request"
            labelType="labelAtTop"
            min={1}
            onChange={value =>
              setMemoryValue(
                value,
                resourcesData,
                REQUESTS,
                'isMemoryRequestValid'
              )
            }
            value={resourcesData.requestsMemory}
          />
          <RangeInput
            density="dense"
            invalid={!validation.isMemoryLimitValid}
            invalidText="Limit must be bigger than or equal to Request and not be less than 1"
            label="Limit"
            labelType="labelAtTop"
            min={1}
            onChange={value =>
              setMemoryValue(value, resourcesData, LIMITS, 'isMemoryLimitValid')
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
            invalid={!validation.isCpuRequestValid}
            invalidText="Request must be less than or equal to Limit and not be less than 1"
            label="Request"
            labelType="labelAtTop"
            min={1}
            onChange={value =>
              setCpuValue(value, resourcesData, REQUESTS, 'isCpuRequestValid')
            }
            value={resourcesData.requestsCpu}
          />
          <RangeInput
            density="dense"
            invalid={!validation.isCpuLimitValid}
            invalidText="Limit must be bigger than or equal to Request and not be less than 1"
            label="Limit"
            labelType="labelAtTop"
            min={1}
            onChange={value =>
              setCpuValue(value, resourcesData, LIMITS, 'isCpuLimitValid')
            }
            value={resourcesData.limitsCpu}
          />
        </JobsPanelSection>
        <JobsPanelSection title="Gpu" className="section-gpu">
          <RangeInput
            density="dense"
            invalid={!validation.isGpuLimitValid}
            invalidText="The minimum value should be 1"
            label="Limit"
            labelType="labelAtTop"
            min={1}
            onChange={setGpuValue}
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
          isKeyRequired
          keyHeader="Key"
          keyType="input"
          valueHeader="Value"
          withEditMode
        />
      </JobsPanelSection>
    </div>
  )
}

JobsPanelResourcesView.propTypes = {
  handleAddNewNodeSelector: PropTypes.func.isRequired,
  handleDeleteNodeSelector: PropTypes.func.isRequired,
  handleAddNewVolume: PropTypes.func.isRequired,
  handleDeleteVolume: PropTypes.func.isRequired,
  handleEditNodeSelector: PropTypes.func.isRequired,
  handleEditVolume: PropTypes.func.isRequired,
  handleSelectCpuUnit: PropTypes.func.isRequired,
  handleSelectMemoryUnit: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  resourcesData: PropTypes.shape({}).isRequired,
  setCpuValue: PropTypes.func.isRequired,
  setGpuValue: PropTypes.func.isRequired,
  setMemoryValue: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default JobsPanelResourcesView
