import React from 'react'
import PropTypes from 'prop-types'

import Select from '../../common/Select/Select'
import RangeInput from '../../common/RangeInput/RangeInput'
import { VolumesTable } from '../VolumesTable/VolumesTable'
import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'

import {
  generateCpuValue,
  generateMemoryValue,
  selectMemoryOptions
} from '../../utils/panelResources.util'

import './functionsPanelResources.scss'

const FunctionsPanelResourcesView = ({
  data,
  handleAddNewVolume,
  handleDeleteVolume,
  handleEditVolume,
  handleSelectMemoryUnit,
  handleSelectCpuUnit,
  setMemoryValue,
  setCpuValue,
  setGpuValue
}) => (
  <div className="functions-panel__item resources new-item-side-panel__item">
    <FunctionsPanelSection title="Resources" />
    <FunctionsPanelSection
      title="Volumes"
      tip="Volumes that define data paths and the required information for accessing the data from the function"
    >
      <VolumesTable
        handleAddNewVolume={handleAddNewVolume}
        handleDelete={handleDeleteVolume}
        handleEdit={handleEditVolume}
        className="volumes"
        volumeMounts={data.volumeMounts}
        volumes={data.volumes}
      />
    </FunctionsPanelSection>
    <div className="resources__inputs">
      <FunctionsPanelSection title="Memory" className="memory">
        <Select
          density="dense"
          label="Unit"
          labelAtTop
          options={selectMemoryOptions.unitMemory}
          onClick={value => handleSelectMemoryUnit(value)}
          selectedId={data.memoryUnit}
        />
        <RangeInput
          density="dense"
          label="Request"
          labelAtTop
          onChange={value => setMemoryValue(value, 'requests')}
          value={generateMemoryValue(data.requests.memory)}
        />
        <RangeInput
          density="dense"
          label="Limit"
          labelAtTop
          onChange={value => setMemoryValue(value, 'limits')}
          value={generateMemoryValue(data.limits.memory)}
        />
      </FunctionsPanelSection>
      <FunctionsPanelSection title="Cpu" className="cpu">
        <Select
          density="dense"
          label="Unit"
          labelAtTop
          options={selectMemoryOptions.unitCpu}
          onClick={value => handleSelectCpuUnit(value)}
          selectedId={data.cpuUnit}
        />
        <RangeInput
          density="dense"
          label="Request"
          labelAtTop
          onChange={value => setCpuValue(value, 'requests')}
          value={generateCpuValue(data.requests.cpu)}
        />
        <RangeInput
          density="dense"
          label="Limit"
          labelAtTop
          onChange={value => setCpuValue(value, 'limits')}
          value={generateCpuValue(data.limits.cpu)}
        />
      </FunctionsPanelSection>
      <FunctionsPanelSection title="Gpu" className="section-gpu">
        <RangeInput
          density="dense"
          label="Limit"
          labelAtTop
          onChange={setGpuValue}
          value={data.limits['nvidia.com/gpu']}
        />
      </FunctionsPanelSection>
    </div>
  </div>
)

FunctionsPanelResourcesView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleAddNewVolume: PropTypes.func.isRequired,
  handleDeleteVolume: PropTypes.func.isRequired,
  handleEditVolume: PropTypes.func.isRequired,
  handleSelectMemoryUnit: PropTypes.func.isRequired,
  handleSelectCpuUnit: PropTypes.func.isRequired,
  setMemoryValue: PropTypes.func.isRequired,
  setCpuValue: PropTypes.func.isRequired,
  setGpuValue: PropTypes.func.isRequired
}

export default FunctionsPanelResourcesView
