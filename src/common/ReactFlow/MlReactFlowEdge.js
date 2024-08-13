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
import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { BaseEdge, useNodes, getBezierPath, getSmoothStepPath } from 'reactflow'

import { getEdgeParams, getMarkerEnd } from './mlReactFlow.util'
import {
  DEFAULT_EDGE,
  FLOATING_EDGE,
  SMOOTH_STEP_EDGE,
  STEP_EDGE,
  STRAIGHT_EDGE
} from '../../constants'

const MlReactFlowEdge = ({
  arrowHeadType = 'arrowclosed',
  data,
  id,
  markerEndId = null,
  source,
  sourceX,
  sourceY,
  style = {},
  target,
  targetX,
  targetY
}) => {
  const nodes = useNodes()
  const markerEnd = useMemo(
    () => getMarkerEnd(arrowHeadType, markerEndId, id),
    [arrowHeadType, id, markerEndId]
  )
  const sourceNode = useMemo(() => nodes.find(n => n.id === source), [source, nodes])
  const targetNode = useMemo(() => nodes.find(n => n.id === target), [target, nodes])

  const getPath = useCallback(() => {
    let d = []

    if (data.subType === FLOATING_EDGE) {
      const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode)

      d = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        targetX: tx,
        targetY: ty
      })
    } else if (data.subType === STEP_EDGE || data.subType === SMOOTH_STEP_EDGE) {
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
  }, [data.subType, sourceNode, sourceX, sourceY, targetNode, targetX, targetY])

  const path = useMemo(() => getPath(), [getPath])

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
      <BaseEdge id={id} path={path[0]} markerEnd={markerEnd} style={style} />
    </>
  )
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
