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
        label="Unit"
        match={match}
        option="unitMemory"
        onClick={value => handleSelectMemoryUnit(value)}
        value={memoryUnit}
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
        option="unitCpu"
        onClick={value => handleSelectСpuUnit(value)}
        value={cpuUnit}
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
