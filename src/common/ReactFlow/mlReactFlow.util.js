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
import dagre from 'dagre'
import { Position } from 'reactflow'

export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const elWidth = 300
  const elHeight = 80
  const dagreGraph = new dagre.graphlib.Graph()
  const isHorizontal = direction === 'LR'
  let layoutedNodes = []
  let layoutedEdges = []

  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: elWidth, height: elHeight })
  })

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const selectedNode = nodes.find(node => node.className?.includes('selected'))

  layoutedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.targetPosition = isHorizontal ? 'left' : 'top'
    node.sourcePosition = isHorizontal ? 'right' : 'bottom'

    node.className = getNodeClassName(node)

    node.style = {
      width: elWidth,
      height: elHeight,
      pointerEvents: 'all'
    }

    // unfortunately we need this little hack to pass a slighltiy different position
    // in order to notify react flow about the change
    node.position = {
      x: nodeWithPosition.x + Math.random() / 1000,
      y: nodeWithPosition.y
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

export const getNodeClassName = (node) => {
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
  } = intersectionNode.__rf
  const targetPosition = targetNode.__rf.position

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
  const n = { ...node.__rf.position, ...node.__rf }
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
  failed: 'Error',
  skipped: 'Skipped',
  error: 'Error',
  running: 'Running',
  omitted: 'Omitted'
}
