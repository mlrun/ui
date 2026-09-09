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
import PropTypes from 'prop-types'
import { Handle, Position } from 'reactflow'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import { Tooltip, TextTooltipTemplate, FormChipCell } from 'igz-controls/components'
import { SourceHandleComponent } from '../SmartHandle/SmartHandle'

import { REACT_FLOW_NODE_DATA } from '../../../types'
import { createForm } from 'final-form'
import { getChipOptions } from 'igz-controls/utils/chips.util'
import { setFieldState } from 'igz-controls/utils/form.util'

import ConnectionIcon from 'igz-controls/images/connections-icon.svg?react'
import MonitoringIcon from 'igz-controls/images/monitoring-icon.svg?react'

import './MlNodeWithSubItems.scss'

const MlNodeWithSubItems = ({ data, isConnectable, id = '' }) => {
  const [formRef] = React.useState(() =>
    createForm({
      initialValues: {
        subItems:
          data.subItems?.map(runningModelName => {
            return {
              isKeyOnly: true,
              key: runningModelName,
              id: runningModelName
            }
          }) || []
      },
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )

  return (
    <Form form={formRef} onSubmit={() => {}}>
      {formState => (
        <>
          <div className="react-flow__node-header">
            <div className="react-flow__node-header-icon">
              {data.badgeIcon || <ConnectionIcon />}
            </div>
            <div className="react-flow__node-header-title">
              <div className="react-flow__node-header-label">
                <Tooltip hidden={!data.label} template={<TextTooltipTemplate text={data.label} />}>
                  {data.label}
                </Tooltip>
              </div>
              <div className="react-flow__node-header-sub-label">{data.subLabel}</div>
            </div>
            {data.inMonitoring && (
              <div className="react-flow__node-header-monitoring-icon">
                <Tooltip className="" template={<TextTooltipTemplate text="In monitoring" />}>
                  <MonitoringIcon />
                </Tooltip>
              </div>
            )}
          </div>
          <div className="react-flow__node-chips-title">{data.subItemsTitle}</div>
          <div className="react-flow__node-chips">
            <FormChipCell
              chipOptions={getChipOptions('metrics')}
              formState={formState}
              initialValues={formState.initialValues}
              name="subItems"
              withInitialParentWidth
            />
          </div>
          <Handle
            className={data.targetHandle?.className}
            isConnectable={isConnectable}
            type="target"
            position={Position.Left}
            id="left"
          />
          <Handle
            className={data.targetHandle?.className}
            isConnectable={isConnectable}
            type="target"
            position={Position.Top}
            id="top"
            style={{ left: '60%', visibility: 'hidden' }}
          />
          <Handle
            className={data.targetHandle?.className}
            isConnectable={isConnectable}
            type="target"
            position={Position.Bottom}
            id="bottom"
            style={{ left: '60%', visibility: 'hidden' }}
          />
          <Handle
            className={data.targetHandle?.className}
            isConnectable={isConnectable}
            type="target"
            position={Position.Top}
            id="top-error-handler"
            style={{ visibility: 'hidden' }}
          />
          {/* SOURCE HANDLES (Outputs) */}
          <Handle
            className={data.sourceHandle?.className}
            isConnectable={isConnectable}
            type="source"
            position={Position.Right}
            id="right"
            style={{ visibility: data.isLastStep ? 'hidden' : 'visible' }}
          />
          <SourceHandleComponent
            nodeId={id}
            cycleTo={!!data.cycleTo}
            className={data.sourceHandle?.className}
            isConnectable={isConnectable}
            type="source"
            position={Position.Top}
            id="top-source"
            style={{ left: '40%', visibility: 'hidden' }}
          />
          <SourceHandleComponent
            nodeId={id}
            cycleTo={!!data.cycleTo}
            className={data.sourceHandle?.className}
            isConnectable={isConnectable}
            type="source"
            position={Position.Bottom}
            id="bottom-source"
            style={{ left: '40%', visibility: 'hidden' }}
          />
          <Handle
            className={data.sourceHandle?.className}
            isConnectable={isConnectable}
            type="source"
            position={Position.Bottom}
            id="bottom-error-handler"
            style={{ visibility: 'hidden' }}
          />
        </>
      )}
    </Form>
  )
}

MlNodeWithSubItems.propTypes = {
  data: REACT_FLOW_NODE_DATA.isRequired,
  id: PropTypes.string,
  isConnectable: PropTypes.bool.isRequired
}

export default React.memo(MlNodeWithSubItems)
