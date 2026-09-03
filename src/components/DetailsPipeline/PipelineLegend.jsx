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
*/
import React, { useState } from 'react'
import { ControlButton } from 'reactflow'

import EventsStepIcon from 'igz-controls/images/events-step-badge.svg?react'
import BatchStepIcon from 'igz-controls/images/batch-step-badge.svg?react'
import FilterStepIcon from 'igz-controls/images/filter-step-badge.svg?react'
import ConnectionIcon from 'igz-controls/images/connections-icon.svg?react'
import ChoiceStepIcon from 'igz-controls/images/choice-step-badge.svg?react'
import RemoteStepIcon from 'igz-controls/images/remote-step-badge.svg?react'
import CustomStepIcon from 'igz-controls/images/custom-step-badge.svg?react'
import MonitoringIcon from 'igz-controls/images/monitoring-icon.svg?react'
import LegendIcon from 'igz-controls/images/legend.svg?react'
import ResponseIcon from 'igz-controls/images/response-indicator.svg?react'
import QueueLegendIcon from 'igz-controls/images/legend-queue-icon.svg?react'
import HubStepIcon from 'igz-controls/images/mlrun-hub-step-badge.svg?react'
import RouterStepIcon from 'igz-controls/images/router-step-badge.svg?react'
import ModelServerStepIcon from 'igz-controls/images/model-server-step-badge.svg?react'

const legendItems = [
  { id: 'event', label: 'Event Operation', icon: <EventsStepIcon /> },
  { id: 'batch', label: 'Batch Operation', icon: <BatchStepIcon /> },
  { id: 'filter', label: 'Filter Operation', icon: <FilterStepIcon /> },
  { id: 'model-runner', label: 'Model runner', icon: <ConnectionIcon /> },
  { id: 'model-server', label: 'Model server', icon: <ModelServerStepIcon /> },
  { id: 'router', label: 'Router', icon: <RouterStepIcon /> },
  { id: 'hub', label: 'MLRun hub', icon: <HubStepIcon /> },
  { id: 'choice', label: 'Choice', icon: <ChoiceStepIcon /> },
  { id: 'remote', label: 'Remote', icon: <RemoteStepIcon /> },
  { id: 'custom', label: 'Custom', icon: <CustomStepIcon /> },
  { id: 'queue', label: 'Queue', icon: <QueueLegendIcon /> },
  { id: 'connector', label: 'Connector', icon: null, shape: 'connector' },
  { id: 'function', label: 'Function', icon: null, shape: 'function' },
  { id: 'in-monitoring', label: 'In monitoring', icon: <MonitoringIcon /> },
  { id: 'response', label: 'Response', icon: <ResponseIcon /> }
]

const PipelineLegend = () => {
  const [legendIsOpen, setLegendIsOpen] = useState(false)

  return (
    <>
      <ControlButton
        className="ml-react-flow-legend-button"
        onClick={() => setLegendIsOpen(isOpen => !isOpen)}
      >
        <LegendIcon />
      </ControlButton>
      {legendIsOpen && (
        <div className="ml-react-flow-legend">
          <div className="ml-react-flow-legend-panel">
            <div className="ml-react-flow-legend-title">Legend</div>
            <ul className="ml-react-flow-legend-list">
              {legendItems.map(item => (
                <li key={item.id} className="ml-react-flow-legend-item">
                  <span className="ml-react-flow-legend-icon">
                    {item.icon ? (
                      item.icon
                    ) : (
                      <span
                        className={`ml-react-flow-legend-shape ml-react-flow-legend-shape_${item.shape}`}
                      />
                    )}
                  </span>
                  <span className="ml-react-flow-legend-label">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default PipelineLegend
