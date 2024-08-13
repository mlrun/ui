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
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import PanelSection from '../PanelSection/PanelSection'
import RangeInput from '../../common/RangeInput/RangeInput'
import Select from '../../common/Select/Select'

import {
  generateCpuValue,
  generateMemoryValue,
  getSelectedCpuOption,
  LIMITS,
  REQUESTS,
  selectMemoryOptions
} from '../../utils/panelResources.util'

import './panelResourcesUnits.scss'

const PanelResourcesUnits = ({
  data,
  gpuType,
  handleSelectCpuUnit,
  handleSelectMemoryUnit,
  isPanelEditMode = false,
  setCpuValue,
  setGpuValue,
  setMemoryValue,
  validation
}) => {
  return (
    <div className="resources__inputs">
      <PanelSection title="Memory" className="memory">
        <div className="resources__input">
          <RangeInput
            className="resources__range"
            density="dense"
            disabled={isPanelEditMode}
            invalid={!validation.isMemoryRequestValid}
            invalidText="Request must be less than or equal to Limit and not be less than 1"
            label="Request"
            labelType="labelAtTop"
            min={1}
            onChange={value => setMemoryValue(value, REQUESTS, 'isMemoryRequestValid')}
            required
            value={generateMemoryValue(data.requests.memory)}
          />
          <Select
            density="dense"
            disabled={isPanelEditMode}
            label="Unit"
            labelAtTop
            options={selectMemoryOptions.unitMemory}
            onClick={value => handleSelectMemoryUnit(value, REQUESTS)}
            selectedId={data.requests.memoryUnit}
          />
        </div>
        <div className="resources__input">
          <RangeInput
            className="resources__range"
            density="dense"
            disabled={isPanelEditMode}
            invalid={!validation.isMemoryLimitValid}
            invalidText="Limit must be bigger than or equal to Request and not be less than 1"
            label="Limit"
            labelType="labelAtTop"
            min={1}
            onChange={value => setMemoryValue(value, LIMITS, 'isMemoryLimitValid')}
            required
            value={generateMemoryValue(data.limits.memory)}
          />
          <Select
            density="dense"
            disabled={isPanelEditMode}
            label="Unit"
            labelAtTop
            options={selectMemoryOptions.unitMemory}
            onClick={value => handleSelectMemoryUnit(value, LIMITS)}
            selectedId={data.limits.memoryUnit}
          />
        </div>
      </PanelSection>
      <PanelSection title="Cpu" className="cpu">
        <div className="resources__input">
          <RangeInput
            className="resources__range"
            density="dense"
            disabled={isPanelEditMode}
            invalid={!validation.isCpuRequestValid}
            invalidText={`Request must be less than or equal to Limit and not be less than ${
              getSelectedCpuOption(data.requests.cpuUnit)?.minValue
            }`}
            label="Request"
            labelType="labelAtTop"
            min={getSelectedCpuOption(data.requests.cpuUnit)?.minValue}
            onChange={value => setCpuValue(value, REQUESTS, 'isCpuRequestValid')}
            required
            step={getSelectedCpuOption(data.requests.cpuUnit)?.step}
            value={generateCpuValue(data.requests.cpu)}
          />
          <Select
            density="dense"
            disabled={isPanelEditMode}
            label="Unit"
            labelAtTop
            options={selectMemoryOptions.unitCpu}
            onClick={value => handleSelectCpuUnit(value, REQUESTS)}
            selectedId={data.requests.cpuUnit}
          />
        </div>
        <div className="resources__input">
          <RangeInput
            className="resources__range"
            density="dense"
            disabled={isPanelEditMode}
            invalid={!validation.isCpuLimitValid}
            invalidText={`Limit must be bigger than or equal to Request and not be less than ${
              getSelectedCpuOption(data.limits.cpuUnit)?.minValue
            }`}
            label="Limit"
            labelType="labelAtTop"
            min={getSelectedCpuOption(data.limits.cpuUnit)?.minValue}
            onChange={value => setCpuValue(value, LIMITS, 'isCpuLimitValid')}
            required
            step={getSelectedCpuOption(data.limits.cpuUnit)?.step}
            value={generateCpuValue(data.limits.cpu)}
          />
          <Select
            density="dense"
            disabled={isPanelEditMode}
            label="Unit"
            labelAtTop
            options={selectMemoryOptions.unitCpu}
            onClick={value => handleSelectCpuUnit(value, LIMITS)}
            selectedId={data.limits.cpuUnit}
          />
        </div>
      </PanelSection>
      <PanelSection title="Gpu" className="section-gpu">
        <RangeInput
          density="dense"
          disabled={isPanelEditMode}
          invalid={!validation.isGpuLimitValid}
          invalidText="The minimum value must be 1"
          label="Limit"
          labelType="labelAtTop"
          min={1}
          onChange={setGpuValue}
          value={data.limits[gpuType] || ''}
        />
      </PanelSection>
    </div>
  )
}

PanelResourcesUnits.propTypes = {
  data: PropTypes.shape({}).isRequired,
  gpuType: PropTypes.string.isRequired,
  handleSelectCpuUnit: PropTypes.func.isRequired,
  handleSelectMemoryUnit: PropTypes.func.isRequired,
  isPanelEditMode: PropTypes.bool,
  setCpuValue: PropTypes.func.isRequired,
  setGpuValue: PropTypes.func.isRequired,
  setMemoryValue: PropTypes.func.isRequired,
  validation: PropTypes.shape({})
}

export default connect(({ functionsStore }) => ({
  functionsStore
}))(PanelResourcesUnits)
