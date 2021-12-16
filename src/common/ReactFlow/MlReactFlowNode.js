import React from 'react'
import PropTypes from 'prop-types'
import { Handle } from 'react-flow-renderer'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import {
  ERROR_NODE,
  INPUT_NODE,
  OUTPUT_NODE,
  PRIMARY_NODE,
  SECONDARY_NODE
} from '../../constants'

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
        <Tooltip
          hidden={!data.label}
          template={<TextTooltipTemplate text={data.label} />}
        >
          <div className="data-ellipsis">{data.label}</div>
        </Tooltip>
        {data.subLabel && (
          <div className="react-flow__node-sub-label">{data.subLabel}</div>
        )}
      </div>
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
  data: PropTypes.shape({
    subType: PropTypes.oneOf([
      INPUT_NODE,
      OUTPUT_NODE,
      PRIMARY_NODE,
      SECONDARY_NODE,
      ERROR_NODE
    ]).isRequired,
    label: PropTypes.string.isRequired,
    subLabel: PropTypes.string,
    isSelectable: PropTypes.bool,
    isOvalShape: PropTypes.bool,
    isOpacity: PropTypes.bool,
    sourceHandle: PropTypes.shape({
      tooltip: PropTypes.string,
      className: PropTypes.string
    }),
    targetHandle: PropTypes.shape({
      tooltip: PropTypes.string,
      className: PropTypes.string
    }),
    customData: PropTypes.shape({})
  }).isRequired,
  isConnectable: PropTypes.bool.isRequired
}

export default React.memo(MlReactFlowNode)
