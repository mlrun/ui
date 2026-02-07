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

import { TextTooltipTemplate, Tooltip } from 'igz-controls/components'

import { REACT_FLOW_NODE_DATA } from '../../../types'

import V3ioIcon from 'igz-controls/images/v3io-icon.svg?react'
import KafkaIcon from 'igz-controls/images/kafka-icon.svg?react'

import './MlQueueNode.scss'

function MlQueueNode({ data, isConnectable }) {
  const label = data?.label || ''

  return (
    <>
      <div className="pipe-node">
        <div className="pipe__cap" />
        <div className="pipe">
          <div className="pipe__content">
            <div className="pipe__icon">
              {data?.customData?.path &&
                (data.customData.path.startsWith('v3io://') ? (
                  <Tooltip template={<TextTooltipTemplate text="v3io" />}>
                    <V3ioIcon />
                  </Tooltip>
                ) : data.customData.path.startsWith('kafka://') ? (
                  <Tooltip template={<TextTooltipTemplate text="kafka" />}>
                    <KafkaIcon />
                  </Tooltip>
                ) : null)}
            </div>
            <Tooltip template={<TextTooltipTemplate text={label} />}>
              <span className="pipe__label">{label}</span>
            </Tooltip>
          </div>
        </div>
        <div className="pipe__cap pipe__cap_back" />
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
        style={{ left: '60%', visibility: 'hidden', top: 0 }}
      />
      <Handle
        className={data.targetHandle?.className}
        isConnectable={isConnectable}
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{ left: '60%', visibility: 'hidden', bottom: 0 }}
      />
      <Handle
        className={data.targetHandle?.className}
        isConnectable={isConnectable}
        type="target"
        position={Position.Top}
        id="top-error-handler"
        style={{ visibility: 'hidden', top: 0 }}
      />
      {/* SOURCE HANDLES (Outputs) */}
      <Handle
        className={data.sourceHandle?.className}
        isConnectable={isConnectable}
        type="source"
        position={Position.Right}
        id="right"
        style={{ right: '-5px', zIndex: 10, visibility: data.isLastStep ? 'hidden' : 'visible' }}
      />
      <Handle
        className={data.sourceHandle?.className}
        isConnectable={isConnectable}
        type="source"
        position={Position.Top}
        id="top-source"
        style={{ left: '40%', visibility: 'hidden', top: 0 }}
      />
      <Handle
        className={data.sourceHandle?.className}
        isConnectable={isConnectable}
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{ left: '40%', visibility: 'hidden', bottom: 0 }}
      />
      <Handle
        className={data.sourceHandle?.className}
        isConnectable={isConnectable}
        type="source"
        position={Position.Bottom}
        id="bottom-error-handler"
        style={{ visibility: 'hidden', bottom: 0 }}
      />
    </>
  )
}

MlQueueNode.propTypes = {
  data: REACT_FLOW_NODE_DATA.isRequired,
  isConnectable: PropTypes.bool.isRequired
}

export default MlQueueNode
