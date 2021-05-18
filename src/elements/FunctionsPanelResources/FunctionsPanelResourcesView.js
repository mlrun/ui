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
  handleSelectСpuUnit,
  setMemoryValue,
  setCpuValue,
  setGpuValue
}) => (
  <div className="functions-panel__item resources new-item-side-panel__item">
    <FunctionsPanelSection title="Resources" />
    <FunctionsPanelSection title="Volumes">
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
          label="Unit"
          options={selectMemoryOptions.unitMemory}
          onClick={value => handleSelectMemoryUnit(value)}
          selectedId={data.memoryUnit}
        />
        <RangeInput
          floatingLabel
          label="Request"
          onChange={value => setMemoryValue(value, 'requests')}
          value={generateMemoryValue(data.requests.memory)}
        />
        <RangeInput
          floatingLabel
          label="Limit"
          onChange={value => setMemoryValue(value, 'limits')}
          value={generateMemoryValue(data.limits.memory)}
        />
      </FunctionsPanelSection>
      <FunctionsPanelSection title="Cpu" className="cpu">
        <Select
          label="Unit"
          options={selectMemoryOptions.unitCpu}
          onClick={value => handleSelectСpuUnit(value)}
          selectedId={data.cpuUnit}
        />
        <RangeInput
          floatingLabel
          label="Request"
          onChange={value => setCpuValue(value, 'requests')}
          value={generateCpuValue(data.requests.cpu)}
        />
        <RangeInput
          floatingLabel
          label="Limit"
          onChange={value => setCpuValue(value, 'limits')}
          value={generateCpuValue(data.limits.cpu)}
        />
      </FunctionsPanelSection>
      <FunctionsPanelSection title="Gpu" className="section-gpu">
        <RangeInput
          floatingLabel
          label="Limit"
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
  handleSelectСpuUnit: PropTypes.func.isRequired,
  setMemoryValue: PropTypes.func.isRequired,
  setCpuValue: PropTypes.func.isRequired,
  setGpuValue: PropTypes.func.isRequired
}

export default FunctionsPanelResourcesView
