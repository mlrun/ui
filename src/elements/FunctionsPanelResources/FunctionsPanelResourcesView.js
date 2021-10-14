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
import {
  LIMITS,
  REQUESTS,
  VOLUME_MOUNT_MANUAL_TYPE,
  volumeMountOptions
} from './functionsPanelResources.util'
import { PANEL_CREATE_MODE, PANEL_EDIT_MODE } from '../../constants'

import './functionsPanelResources.scss'

const FunctionsPanelResourcesView = ({
  data,
  handleAddNewVolume,
  handleDeleteVolume,
  handleEditVolume,
  handleSelectCpuUnit,
  handleSelectMemoryUnit,
  handleSelectVolumeMount,
  mode,
  setMemoryValue,
  setCpuValue,
  setGpuValue,
  validation
}) => {
  return (
    <div className="functions-panel__item resources new-item-side-panel__item">
      <FunctionsPanelSection title="Resources" />
      <FunctionsPanelSection
        title="Volumes"
        tip="Volumes that define data paths and the required information for accessing the data from the function"
      >
        {mode === PANEL_CREATE_MODE && (
          <Select
            className="volume-mount"
            floatingLabel
            label="Volume mount"
            options={volumeMountOptions}
            onClick={handleSelectVolumeMount}
            selectedId={data.volumeMount}
          />
        )}
        {(data.volumeMount === VOLUME_MOUNT_MANUAL_TYPE ||
          mode === PANEL_EDIT_MODE) && (
          <VolumesTable
            handleAddNewVolume={handleAddNewVolume}
            handleDelete={handleDeleteVolume}
            handleEdit={handleEditVolume}
            className="volumes"
            volumeMounts={data.volumeMounts}
            volumes={data.volumes}
          />
        )}
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
            invalid={!validation.isMemoryRequestValid}
            invalidText="Request must be less than or equal to Limit and not be less than 1"
            label="Request"
            labelType="labelAtTop"
            min={1}
            onChange={value =>
              setMemoryValue(value, REQUESTS, 'isMemoryRequestValid')
            }
            value={generateMemoryValue(data.requests.memory)}
          />
          <RangeInput
            density="dense"
            invalid={!validation.isMemoryLimitValid}
            invalidText="Limit must be bigger than or equal to Request and not be less than 1"
            label="Limit"
            labelType="labelAtTop"
            min={1}
            onChange={value =>
              setMemoryValue(value, LIMITS, 'isMemoryLimitValid')
            }
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
            invalid={!validation.isCpuRequestValid}
            invalidText="Request must be less than or equal to Limit and not be less than 1"
            label="Request"
            labelType="labelAtTop"
            min={1}
            onChange={value =>
              setCpuValue(value, REQUESTS, 'isCpuRequestValid')
            }
            value={generateCpuValue(data.requests.cpu)}
          />
          <RangeInput
            density="dense"
            invalid={!validation.isCpuLimitValid}
            invalidText="Limit must be bigger than or equal to Request and not be less than 1"
            label="Limit"
            labelType="labelAtTop"
            min={1}
            onChange={value => setCpuValue(value, LIMITS, 'isCpuLimitValid')}
            value={generateCpuValue(data.limits.cpu)}
          />
        </FunctionsPanelSection>
        <FunctionsPanelSection title="Gpu" className="section-gpu">
          <RangeInput
            density="dense"
            invalid={!validation.isGpuLimitValid}
            invalidText="The minimum value should be 1"
            label="Limit"
            labelType="labelAtTop"
            min={1}
            onChange={setGpuValue}
            value={data.limits['nvidia.com/gpu']}
          />
        </FunctionsPanelSection>
      </div>
    </div>
  )
}

FunctionsPanelResourcesView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleAddNewVolume: PropTypes.func.isRequired,
  handleDeleteVolume: PropTypes.func.isRequired,
  handleEditVolume: PropTypes.func.isRequired,
  handleSelectCpuUnit: PropTypes.func.isRequired,
  handleSelectMemoryUnit: PropTypes.func.isRequired,
  handleSelectVolumeMount: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  setMemoryValue: PropTypes.func.isRequired,
  setCpuValue: PropTypes.func.isRequired,
  setGpuValue: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FunctionsPanelResourcesView
