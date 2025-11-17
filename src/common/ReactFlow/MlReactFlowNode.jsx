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
import { Handle } from 'reactflow'

import { Tooltip, TextTooltipTemplate, Tip } from 'igz-controls/components'

import { REACT_FLOW_NODE_DATA } from '../../types'

const MlReactFlowNode = ({ data, isConnectable }) => {
  return (
    <>
      <Tooltip
        hidden={!data.targetHandle?.tooltip}
        template={<TextTooltipTemplate text={data.targetHandle?.tooltip} />}
      >
        <Handle
          className={data.targetHandle?.className}
          type="target"
          position="top"
          isConnectable={isConnectable}
        />
      </Tooltip>
      <div className="react-flow__node-label">
        <Tooltip hidden={!data.label} template={<TextTooltipTemplate text={data.label} />}>
          {data.label}
        </Tooltip>
        {data.subLabel && <div className="react-flow__node-sub-label">{data.subLabel}</div>}
      </div>
      {data.tip && <Tip className="react-flow__node-tip" text={data.tip} withExclamationMark />}
      <Tooltip
        hidden={!data.sourceHandle?.tooltip}
        template={<TextTooltipTemplate text={data.sourceHandle?.tooltip} />}
      >
        <Handle
          className={data.sourceHandle?.className}
          type="source"
          position="bottom"
          isConnectable={isConnectable}
        />
      </Tooltip>
    </>
  )
}

MlReactFlowNode.propTypes = {
  data: REACT_FLOW_NODE_DATA.isRequired,
  isConnectable: PropTypes.bool.isRequired
}

export default React.memo(MlReactFlowNode)
