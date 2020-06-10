import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelResourcesView from './JobsPanelResourcesView'

import { panelActions } from '../JobsPanel/panelReducer'

const JobsPanelResources = ({ match, panelDispatch, panelState }) => {
  const requestsCpu = panelState.requests.cpu.match(/m/)
    ? panelState.requests.cpu.slice(0, panelState.requests.cpu.length - 1)
    : panelState.requests.cpu

  const requestsMemory = panelState.requests.memory.match(/[a-zA-Z]/)
    ? panelState.requests.memory.slice(
        0,
        panelState.requests.memory.match(/[a-zA-Z]/).index
      )
    : panelState.requests.memory

  const selectOptions = {
    unitCpu: [
      { label: 'cpu', id: 'cpu' },
      { label: 'millicpu', id: 'millicpu' }
    ],
    unitMemory: [
      { label: 'Bytes', id: 'Bytes' },
      { label: 'KB', id: 'KB' },
      { label: 'KiB', id: 'KiB' },
      { label: 'MB', id: 'MB' },
      { label: 'MiB', id: 'MiB' },
      { label: 'GB', id: 'GB' },
      { label: 'GiB', id: 'GiB' },
      { label: 'TB', id: 'TB' },
      { label: 'TiB', id: 'TiB' },
      { label: 'PB', id: 'PB' },
      { label: 'PiB', id: 'PiB' },
      { label: 'EB', id: 'EB' },
      { label: 'EiB', id: 'EiB' }
    ]
  }

  const handleSelectMemoryUnit = value => {
    if (panelState.requests.memory.length > 0 && value !== 'Bytes') {
      const unit = value.match(/i/)
        ? value.slice(0, value.match(/i/).index + 1)
        : value.slice(0, 1)

      panelDispatch({
        type: panelActions.SET_REQUESTS_MEMORY,
        payload: panelState.requests.memory + unit
      })
    }

    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: value
    })
  }

  const handleSelectСpuUnit = value => {
    if (panelState.requests.cpu > 0 && value.match(/m/)) {
      panelDispatch({
        type: panelActions.SET_REQUESTS_CPU,
        payload: panelState.requests.cpu + value.slice(0, 1)
      })
    }

    panelDispatch({
      type: panelActions.SET_CPU_UNIT,
      payload: value
    })
  }

  return (
    <JobsPanelResourcesView
      handleSelectMemoryUnit={handleSelectMemoryUnit}
      handleSelectСpuUnit={handleSelectСpuUnit}
      match={match}
      panelDispatch={panelDispatch}
      panelState={panelState}
      requestsCpu={requestsCpu}
      requestsMemory={requestsMemory}
      selectOptions={selectOptions}
    />
  )
}

JobsPanelResources.propTypes = {
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired
}

export default JobsPanelResources
