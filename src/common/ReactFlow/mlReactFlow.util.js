import classnames from 'classnames'
import dagre from 'dagre'
import { isNode, Position } from 'react-flow-renderer'

export const getLayoutedElements = (elements, direction = 'TB') => {
  const elWidth = 130
  const elHeight = 50
  const dagreGraph = new dagre.graphlib.Graph()
  const isHorizontal = direction === 'LR'

  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction })

  elements.forEach(el => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: elWidth, height: elHeight })
    } else {
      dagreGraph.setEdge(el.source, el.target)
    }
  })

  dagre.layout(dagreGraph)

  return elements.map(el => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id)
      el.targetPosition = isHorizontal ? 'left' : 'top'
      el.sourcePosition = isHorizontal ? 'right' : 'bottom'

      el.className = classnames(
        el.className,
        el.data.subType,
        el.data.isSelectable && 'selectable',
        el.data.isOvalShape && 'oval-shape',
        el.data.isOpacity && 'with-opacity'
      )

      el.style = {
        width: elWidth,
        height: elHeight,
        pointerEvents: 'all'
      }

      // unfortunately we need this little hack to pass a slighltiy different position
      // in order to notify react flow about the change
      el.position = {
        x: nodeWithPosition.x + Math.random() / 1000,
        y: nodeWithPosition.y
      }
    }

    return el
  })
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

export const getWorkflowSourceHandle = phase => {
  return {
    tooltip: nodeStates[phase?.toLowerCase()],
    className: classnames(`status-${phase?.toLowerCase()}`)
  }
}

const nodeStates = {
  succeeded: 'Succeeded',
  failed: 'Failed',
  pending: 'Pending',
  running: 'Running',
  unknown: 'Unknown'
}
