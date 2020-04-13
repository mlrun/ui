import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import Select from '../../common/Select/Select'
import RangeInput from '../../common/RangeInput/RangeInput'

const JobsPanelResourcesView = ({
  cpuUnit,
  edit,
  handleSelectСpuUnit,
  handleSelectMemoryUnit,
  limits,
  match,
  memoryUnit,
  requests,
  requestsCpu,
  requestsMemory,
  setLimits,
  setRequests
}) => (
  <div className="job-panel__item resources">
    {!edit && <div className="item__overlay" />}
    <JobsPanelSection title="Resources" />
    <JobsPanelSection title="Memory">
      <Select
        match={match}
        option="unitMemory"
        onClick={value => handleSelectMemoryUnit(value)}
        label="Unit"
        value={memoryUnit}
      />
      <RangeInput
        onChange={value =>
          setRequests({
            ...requests,
            memory: `${value}${
              memoryUnit.length > 0 && memoryUnit !== 'Bytes'
                ? memoryUnit.match(/i/)
                  ? memoryUnit.slice(0, 2)
                  : memoryUnit.slice(0, 1)
                : ''
            }`
          })
        }
        value={requestsMemory}
        label="Request"
      />
      <RangeInput
        onChange={value => setLimits({ ...limits, memory: `${value}` })}
        value={limits.memory}
        label="Limit"
      />
    </JobsPanelSection>
    <JobsPanelSection title="Cpu">
      <Select
        match={match}
        option="unitCpu"
        onClick={value => handleSelectСpuUnit(value)}
        label="Unit"
        value={cpuUnit}
      />
      <RangeInput
        onChange={value =>
          setRequests({
            ...requests,
            cpu: `${value}${cpuUnit === 'millicpu' ? 'm' : ''}`
          })
        }
        value={requestsCpu}
        label="Request"
      />
      <RangeInput
        onChange={value => setLimits({ ...limits, cpu: `${value}` })}
        value={limits.cpu}
        label="Limit"
      />
    </JobsPanelSection>
    <JobsPanelSection title="Gpu" className="section-gpu">
      <RangeInput
        onChange={value => setLimits({ ...limits, nvidia_gpu: `${value}` })}
        value={limits.nvidia_gpu}
        label="Limit"
      />
    </JobsPanelSection>
  </div>
)

JobsPanelResourcesView.propTypes = {
  cpuUnit: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  handleSelectСpuUnit: PropTypes.func.isRequired,
  handleSelectMemoryUnit: PropTypes.func.isRequired,
  limits: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  memoryUnit: PropTypes.string.isRequired,
  requests: PropTypes.shape({}).isRequired,
  requestsCpu: PropTypes.string.isRequired,
  requestsMemory: PropTypes.string.isRequired,
  setLimits: PropTypes.func.isRequired,
  setRequests: PropTypes.func.isRequired
}

export default JobsPanelResourcesView
