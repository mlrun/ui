import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  useStoreState,
  getBezierPath,
  getSmoothStepPath
} from 'react-flow-renderer'

import { getEdgeParams, getMarkerEnd } from './mlReactFlow.util'
import {
  DEFAULT_EDGE,
  FLOATING_EDGE,
  SMOOTH_STEP_EDGE,
  STEP_EDGE,
  STRAIGHT_EDGE
} from '../../constants'

const MlReactFlowEdge = ({
  arrowHeadType,
  data,
  id,
  markerEndId,
  source,
  sourceX,
  sourceY,
  style,
  target,
  targetX,
  targetY
}) => {
  const nodes = useStoreState(state => state.nodes)
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId, id)

  const sourceNode = useMemo(() => nodes.find(n => n.id === source), [
    source,
    nodes
  ])
  const targetNode = useMemo(() => nodes.find(n => n.id === target), [
    target,
    nodes
  ])

  const getPath = () => {
    let d = null

    if (data.subType === FLOATING_EDGE) {
      const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
        sourceNode,
        targetNode
      )

      d = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        targetX: tx,
        targetY: ty
      })
    } else if (
      data.subType === STEP_EDGE ||
      data.subType === SMOOTH_STEP_EDGE
    ) {
      d = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        borderRadius: data.subType === STEP_EDGE ? 0 : 5
      })
    } else if (data.subType === STRAIGHT_EDGE) {
      d = 'M' + sourceX + ',' + sourceY + ' ' + targetX + ',' + targetY
    } else {
      d = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY
      })
    }

    return d
  }

  if (!sourceNode || !targetNode) {
    return null
  }

  return (
    <>
      <defs>
        <marker
          className="react-flow__arrowhead_closed"
          id={`react-flow__ml-arrowclosed-${id}`}
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="0"
          refY="0"
        >
          <polyline
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            points="-5,-4 0,0 -5,4 -5,-4"
          />
        </marker>
        <marker
          className="react-flow__arrowhead"
          id={`react-flow__ml-arrow-${id}`}
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="0"
          refY="0"
        >
          <polyline
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            fill="none"
            points="-5,-4 0,0 -5,4"
          />
        </marker>
      </defs>
      <g className="react-flow__connection">
        <path
          id={id}
          className="react-flow__edge-path"
          d={getPath()}
          markerEnd={markerEnd}
          markerStart={data.isMarkerStart ? markerEnd : null}
          style={style}
        />
      </g>
    </>
  )
}

MlReactFlowEdge.defaultProps = {
  arrowHeadType: 'arrowclosed',
  markerEndId: null,
  style: {}
}

MlReactFlowEdge.propTypes = {
  arrowHeadType: PropTypes.oneOf(['arrow', 'arrowclosed']),
  data: PropTypes.shape({
    subType: PropTypes.oneOf([
      DEFAULT_EDGE,
      FLOATING_EDGE,
      STRAIGHT_EDGE,
      STEP_EDGE,
      SMOOTH_STEP_EDGE
    ]).isRequired,
    customData: PropTypes.shape({}),
    isSelectable: PropTypes.bool
  }).isRequired,
  id: PropTypes.string.isRequired,
  markerEndId: PropTypes.string,
  source: PropTypes.string.isRequired,
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  style: PropTypes.object,
  target: PropTypes.string.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired
}

export default React.memo(MlReactFlowEdge)
