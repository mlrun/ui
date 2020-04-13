import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelResourcesView from './JobsPanelResourcesView'

const JobsPanelResources = ({
  requests,
  setRequests,
  limits,
  setLimits,
  match,
  memoryUnit,
  setMemoryUnit,
  cpuUnit,
  setCpuUnit,
  edit
}) => {
  const requestsCpu = requests.cpu.match(/m/)
    ? requests.cpu.slice(0, requests.cpu.length - 1)
    : requests.cpu

  const requestsMemory = requests.memory.match(/[a-zA-Z]/)
    ? requests.memory.slice(0, requests.memory.match(/[a-zA-Z]/).index)
    : requests.memory

  const handleSelectMemoryUnit = value => {
    if (requests.memory.length > 0 && value !== 'Bytes') {
      const unit = value.match(/i/)
        ? value.slice(0, value.match(/i/) + 1)
        : value.slice(0, 1)

      setRequests({
        ...requests,
        memory: requests.memory + unit
      })
    }

    setMemoryUnit(value)
  }

  const handleSelectСpuUnit = value => {
    if (requests.cpu > 0 && value.match(/m/)) {
      setRequests({
        ...requests,
        cpu: requests.cpu + value.slice(0, 1)
      })
    }

    setCpuUnit(value)
  }

  return (
    <JobsPanelResourcesView
      cpuUnit={cpuUnit}
      edit={edit}
      handleSelectСpuUnit={handleSelectСpuUnit}
      handleSelectMemoryUnit={handleSelectMemoryUnit}
      limits={limits}
      match={match}
      memoryUnit={memoryUnit}
      requests={requests}
      requestsCpu={requestsCpu}
      requestsMemory={requestsMemory}
      setLimits={setLimits}
      setRequests={setRequests}
    />
  )
}

JobsPanelResources.propTypes = {
  requests: PropTypes.shape({}).isRequired,
  setRequests: PropTypes.func.isRequired
}

export default JobsPanelResources
