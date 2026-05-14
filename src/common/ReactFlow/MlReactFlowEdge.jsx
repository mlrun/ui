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

import { getEdgeParams, getMarkerEnd, onEdgeHover } from './mlReactFlow.util'
import {
  DEFAULT_EDGE,
  FLOATING_EDGE,
  SMOOTH_STEP_EDGE,
  STEP_EDGE,
  STRAIGHT_EDGE
} from '../../constants'

const MlReactFlowEdge = ({
  data,
  id,
  markerEndId = null,
  source,
  sourceX,
  sourceY,
  sourcePosition,
  targetPosition,
  style = {},
  target,
  targetX,
  targetY,
  interactionWidth = 20
}) => {
  const nodes = useNodes()
  const markerEndIdConverted = useMemo(() => markerEndId?.replace(' ', '_'), [markerEndId])
  const idConverted = useMemo(() => id?.replace(' ', '_'), [id])
  const markerEnd = useMemo(
    () => getMarkerEnd(data.arrowHeadType ?? 'arrowclosed', markerEndIdConverted, idConverted),
    [data.arrowHeadType, idConverted, markerEndIdConverted]
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
        targetPosition,
        sourcePosition,
        borderRadius: data.subType === STEP_EDGE ? 0 : 12,
        offset: 20
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
  }, [
    data.subType,
    sourceNode,
    sourcePosition,
    sourceX,
    sourceY,
    targetNode,
    targetPosition,
    targetX,
    targetY
  ])

  const path = useMemo(() => getPath(), [getPath])

  if (!sourceNode || !targetNode) {
    return null
  }

  return (
    <>
      <defs>
        <marker
          className="react-flow__arrowhead_closed"
          id={`react-flow__ml-arrowclosed-${idConverted}`}
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
            style={{ strokeDasharray: 'none' }}
          />
        </marker>
        <marker
          className="react-flow__arrowhead"
          id={`react-flow__ml-arrow-${idConverted}`}
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
            style={{ strokeDasharray: 'none' }}
          />
        </marker>
      </defs>
      <BaseEdge
        id={idConverted}
        path={path[0]}
        markerEnd={markerEnd}
        style={{ ...style, fill: 'none', pointerEvents: 'none' }}
      />

      {/* Invisible wider edge for easier user interaction */}
      <path
        d={path[0]}
        fill="none"
        opacity={0}
        stroke="transparent"
        strokeWidth={interactionWidth}
        className="react-flow__edge-interaction"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{
          strokeWidth: interactionWidth,
          cursor: 'default',
          pointerEvents: 'stroke'
        }}
        onMouseDownCapture={event => {
          event.stopPropagation()
          event.preventDefault()
        }}
        onClickCapture={event => {
          event.stopPropagation()
          event.preventDefault()
        }}
        onMouseOver={onEdgeHover}
      />
    </>
  )
}

MlReactFlowEdge.propTypes = {
  data: PropTypes.shape({
    subType: PropTypes.oneOf([
      DEFAULT_EDGE,
      FLOATING_EDGE,
      STRAIGHT_EDGE,
      STEP_EDGE,
      SMOOTH_STEP_EDGE
    ]).isRequired,
    customData: PropTypes.object,
    isSelectable: PropTypes.bool,
    isHorizontalFlow: PropTypes.bool,
    arrowHeadType: PropTypes.oneOf(['arrow', 'arrowclosed', null, ''])
  }).isRequired,
  id: PropTypes.string.isRequired,
  markerEndId: PropTypes.string,
  source: PropTypes.string.isRequired,
  sourcePosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  style: PropTypes.object,
  target: PropTypes.string.isRequired,
  targetPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  interactionWidth: PropTypes.number
}

export default React.memo(MlReactFlowEdge)
