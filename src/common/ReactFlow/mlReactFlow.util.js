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
import classnames from 'classnames'
import dagre from '@dagrejs/dagre'
import { Position } from 'reactflow'

import { ERROR_STATE, FAILED_STATE, ML_MODEL_RUNNER_NODE } from '../../constants'

const nodeWidthByType = {
  default: 300
}
const nodeHeightByType = {
  [ML_MODEL_RUNNER_NODE]: 120,
  default: 80
}
const dagreGraph = new dagre.graphlib.Graph()

export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR'
  let layoutedNodes = []
  let layoutedEdges = []

  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach(node => {
    const nodeHeight = nodeHeightByType[node.type] ?? nodeHeightByType.default
    const nodeWidth = nodeWidthByType[node.type] ?? nodeWidthByType.default
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const selectedNode = nodes.find(node => node.className?.includes('selected'))

  layoutedNodes = nodes.map(node => {
    const nodeHeight = nodeHeightByType[node.type] ?? nodeHeightByType.default
    const nodeWidth = nodeWidthByType[node.type] ?? nodeWidthByType.default
    const nodeWithPosition = dagreGraph.node(node.id)
    node.targetPosition = isHorizontal ? 'left' : 'top'
    node.sourcePosition = isHorizontal ? 'right' : 'bottom'

    node.className = getNodeClassName(node)

    node.style = {
      width: nodeWidth,
      height: nodeHeight,
      pointerEvents: 'all'
    }

    // We are shifting the dagre node position (anchor=center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2
    }

    return node
  })

  layoutedEdges = edges.map(edge => {
    const isSelected =
      edge.data.isSelectable &&
      selectedNode?.id &&
      (edge.source === selectedNode.id || edge.target === selectedNode.id)

    edge.className = classnames(edge.className, isSelected && 'selected')

    return edge
  })

  return [layoutedNodes, layoutedEdges]
}

export const getNodeClassName = node => {
  return classnames(
    node.className,
    node.data.subType,
    node.data.shape && node.data.shape,
    node.data.isSelectable && 'selectable',
    node.data.withOpacity && 'with-opacity'
  )
}

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
const getNodeIntersection = (intersectionNode, targetNode) => {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    position: intersectionNodePosition
  } = intersectionNode?.__rf || intersectionNode
  const targetPosition = targetNode?.__rf?.position || targetNode.position

  const w = intersectionNodeWidth / 2
  const h = intersectionNodeHeight / 2

  const x2 = intersectionNodePosition.x + w
  const y2 = intersectionNodePosition.y + h
  const x1 = targetPosition.x + w
  const y1 = targetPosition.y + h

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h)
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h)
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1))
  const xx3 = a * xx1
  const yy3 = a * yy1
  const x = w * (xx3 + yy3) + x2
  const y = h * (-xx3 + yy3) + y2

  return { x, y }
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
const getEdgePosition = (node, intersectionPoint) => {
  const n = { ...(node?.__rf?.position || node.position), ...(node?.__rf || node) }
  const nx = Math.round(n.x)
  const ny = Math.round(n.y)
  const px = Math.round(intersectionPoint.x)
  const py = Math.round(intersectionPoint.y)

  if (px <= nx + 1) {
    return Position.Left
  }
  if (px >= nx + n.width - 1) {
    return Position.Right
  }
  if (py <= ny + 1) {
    return Position.Top
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom
  }

  return Position.Top
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export const getEdgeParams = (source, target) => {
  const sourceIntersectionPoint = getNodeIntersection(source, target)
  const targetIntersectionPoint = getNodeIntersection(target, source)

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint)
  const targetPos = getEdgePosition(target, targetIntersectionPoint)

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos
  }
}

export const getMarkerEnd = (arrowHeadType, markerEndId, edgeId) => {
  if (typeof markerEndId !== 'undefined' && markerEndId) {
    return 'url(#' + markerEndId + ')'
  }
  return typeof arrowHeadType !== 'undefined'
    ? `url(#react-flow__ml-${arrowHeadType}-${edgeId})`
    : 'none'
}

export const getWorkflowSourceHandle = phase => {
  return {
    tooltip: nodeStates[phase?.toLowerCase()],
    className: classnames(`status-${phase?.toLowerCase()}`)
  }
}

const nodeStates = {
  succeeded: 'Completed',
  [FAILED_STATE]: 'Error',
  skipped: 'Skipped',
  [ERROR_STATE]: 'Error',
  running: 'Running',
  omitted: 'Omitted'
}
