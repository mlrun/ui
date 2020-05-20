import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import Select from '../../common/Select/Select'
import RangeInput from '../../common/RangeInput/RangeInput'

const JobsPanelResourcesView = ({
  cpuUnit,
  handleSelectMemoryUnit,
  handleSelectСpuUnit,
  limits,
  match,
  memoryUnit,
  requests,
  requestsCpu,
  requestsMemory,
  selectOptions,
  setLimits,
  setRequests
}) => (
  <div className="job-panel__item resources">
    <JobsPanelSection title="Resources" />
    <JobsPanelSection title="Memory">
      <Select
        label="Unit"
        match={match}
        options={selectOptions.unitMemory}
        onClick={value => handleSelectMemoryUnit(value)}
        selectedId={memoryUnit}
      />
      <RangeInput
        floatingLabel
        label="Request"
        onChange={value =>
          setRequests({
            ...requests,
            memory: `${value}${
              memoryUnit.length === 0 || memoryUnit === 'Bytes'
                ? ''
                : memoryUnit.match(/i/)
                ? memoryUnit.slice(0, 2)
                : memoryUnit.slice(0, 1)
            }`
          })
        }
        value={requestsMemory}
      />
      <RangeInput
        floatingLabel
        label="Limit"
        onChange={value => setLimits({ ...limits, memory: `${value}` })}
        value={limits.memory}
      />
    </JobsPanelSection>
    <JobsPanelSection title="Cpu">
      <Select
        label="Unit"
        match={match}
        options={selectOptions.unitCpu}
        onClick={value => handleSelectСpuUnit(value)}
        selectedId={cpuUnit}
      />
      <RangeInput
        floatingLabel
        label="Request"
        onChange={value =>
          setRequests({
            ...requests,
            cpu: `${value}${cpuUnit === 'millicpu' ? 'm' : ''}`
          })
        }
        value={requestsCpu}
      />
      <RangeInput
        floatingLabel
        label="Limit"
        onChange={value => setLimits({ ...limits, cpu: `${value}` })}
        value={limits.cpu}
      />
    </JobsPanelSection>
    <JobsPanelSection title="Gpu" className="section-gpu">
      <RangeInput
        floatingLabel
        label="Limit"
        onChange={value => setLimits({ ...limits, nvidia_gpu: `${value}` })}
        value={limits.nvidia_gpu}
      />
    </JobsPanelSection>
  </div>
)

JobsPanelResourcesView.propTypes = {
  cpuUnit: PropTypes.string.isRequired,
  handleSelectMemoryUnit: PropTypes.func.isRequired,
  handleSelectСpuUnit: PropTypes.func.isRequired,
  limits: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  memoryUnit: PropTypes.string.isRequired,
  requests: PropTypes.shape({}).isRequired,
  requestsCpu: PropTypes.string.isRequired,
  requestsMemory: PropTypes.string.isRequired,
  selectOptions: PropTypes.shape({}).isRequired,
  setLimits: PropTypes.func.isRequired,
  setRequests: PropTypes.func.isRequired
}

export default JobsPanelResourcesView
