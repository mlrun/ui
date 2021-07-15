import React from 'react'
import dagre from 'dagre'
import { isNode } from 'react-flow-renderer'

export const getLayoutedElements = (elements, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  elements.forEach(el => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: 150, height: 50 })
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

      el.data.label = (
        <div className="react-flow__node-label" data-title={el.data.label}>
          <div className="data-ellipsis">{el.data.label}</div>
        </div>
      )
      el.style = {
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

export const kindList = [
  { label: 'Task', value: 'task' },
  { label: 'Router', value: 'router' },
  { label: 'Queue', value: 'queue' }
]
