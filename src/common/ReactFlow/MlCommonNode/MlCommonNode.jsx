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

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import { SourceHandleComponent } from '../SmartHandle/SmartHandle'

import { REACT_FLOW_NODE_DATA } from '../../../types'

import ResponseIcon from 'igz-controls/images/response-indicator.svg?react'

import './mlCommonNode.scss'

const MlCommonNode = ({ data, isConnectable, hideHandles = false, id = '' }) => {
  return (
    <>
      <div className="react-flow__node-content">
        <div className="react-flow__node-content-icon">{data.badgeIcon || ''}</div>
        <div className="react-flow__node-content-title">
          <div className="react-flow__node-content-label">
            <Tooltip hidden={!data.label} template={<TextTooltipTemplate text={data.label} />}>
              {data.label}
            </Tooltip>
          </div>
          <div className="react-flow__node-content-sub-label">
            <Tooltip
              hidden={!data.customData?.class_name}
              template={<TextTooltipTemplate text={data.subLabel || data.customData?.class_name} />}
            >
              {data.subLabel || data.customData?.class_name}
            </Tooltip>
          </div>
        </div>
        {data.customData?.responder && (
          <div className="react-flow__node--content-response-icon">
            <Tooltip template={<TextTooltipTemplate text="Response indicator" />}>
              <ResponseIcon />
            </Tooltip>
          </div>
        )}
      </div>
      {!hideHandles && (
        <>
          {/* SOURCE HANDLES (Inputs) */}
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
            className={data.sourceHandle?.className}
            isConnectable={isConnectable}
            type="source"
            position={Position.Top}
            id="top-source"
            style={{ left: '40%', visibility: 'hidden' }}
            nodeId={id}
            cycleTo={!!data.cycleTo}
          />
          <SourceHandleComponent
            className={data.sourceHandle?.className}
            isConnectable={isConnectable}
            type="source"
            position={Position.Bottom}
            id="bottom-source"
            style={{ left: '40%', visibility: 'hidden' }}
            nodeId={id}
            cycleTo={!!data.cycleTo}
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
    </>
  )
}

MlCommonNode.propTypes = {
  data: REACT_FLOW_NODE_DATA.isRequired,
  hideHandles: PropTypes.bool,
  id: PropTypes.string,
  isConnectable: PropTypes.bool.isRequired
}

export default React.memo(MlCommonNode)
