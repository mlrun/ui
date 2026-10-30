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
import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  getConnectedEdges
} from 'reactflow'

import MlReactFlowNode from './MlReactFlowNode'
import MlNodeWithSubItems from './MlNodeWithSubItems/MlNodeWithSubItems'
import MlReactFlowEdge from './MlReactFlowEdge'
import MlQueueNode from './MlQueueNode/MlQueueNode'
import MlCommonNode from './MlCommonNode/MlCommonNode'
import MlGroupNode from './MlGroupNode/MlGroupNode'
import SmartStepEdge from './SmartStepEdge/SmartStepEdge.jsx'
import MlDefaultErrorPanel from './MlDefaultErrorPanel/MlDefaultErrorPanel'

import {
  ML_EDGE,
  ML_NODE_WITH_SUB_ITEMS,
  ML_NODE,
  ML_QUEUE_NODE,
  ML_COMMON_NODE,
  ML_GROUP_NODE,
  ML_SMART_STEP_EDGE
} from '../../constants'
import { getNodeClassName } from './mlReactFlow.util'

import './mlReactFlow.scss'

const edgeTypes = {
  [ML_EDGE]: MlReactFlowEdge,
  [ML_SMART_STEP_EDGE]: SmartStepEdge
}

const nodeTypes = {
  [ML_NODE]: MlReactFlowNode,
  [ML_NODE_WITH_SUB_ITEMS]: MlNodeWithSubItems,
  [ML_QUEUE_NODE]: MlQueueNode,
  [ML_COMMON_NODE]: MlCommonNode,
  [ML_GROUP_NODE]: MlGroupNode
}

const defaultEdgeOptions = {
  selectable: false,
  focusable: false,
  interactionWidth: 20
}

const MlReactFlow = ({
  alignTriggerItem = '',
  edges,
  nodes,
  onNodeClick = () => {},
  defaultErrorHandlerData = null,
  withBackground = false,
  withProvider = true,
  legend = null
}) => {
  const domChangeHandler = () => {
    const edgesWrapper = document.querySelector('.react-flow__edges > g')
    const selectedEdges = edgesWrapper.getElementsByClassName('selected')

    edgesWrapper.append(...selectedEdges)
  }

  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [observer] = useState(new MutationObserver(domChangeHandler))
  const [initialGraphViewGenerated, setInitialGraphViewGenerated] = useState(false)

  const onNodeMouseEnter = (_event, node) => {
    const connectedEdges = getConnectedEdges([node], edges)

    connectedEdges.forEach(edge => {
      const pathElement = document.getElementById(edge.id?.replace(' ', '_'))
      const edgeElement = pathElement?.parentElement

      if (edgeElement) {
        edgeElement.classList.add('forced-hover')

        if (edgeElement.parentNode && edgeElement.nextSibling) {
          edgeElement.parentNode.appendChild(edgeElement)
        }
      }
    })
  }

  const onNodeMouseLeave = (_event, node) => {
    const connectedEdges = getConnectedEdges([node], edges)

    connectedEdges.forEach(edge => {
      const pathElement = document.getElementById(edge.id?.replace(' ', '_'))
      const edgeElement = pathElement?.parentElement

      if (edgeElement) {
        edgeElement.classList.remove('forced-hover')
      }
    })
  }

  const handleFitGraphView = useCallback(() => {
    setTimeout(() => {
      const {
        viewport: { x, y, zoom }
      } = reactFlowInstance.toObject()

      reactFlowInstance.setViewport({ x, y, zoom: zoom })
      reactFlowInstance.fitView({ padding: 0.2, duration: 200 })
    }, 50)
  }, [reactFlowInstance])

  if (reactFlowInstance && !initialGraphViewGenerated && nodes.length > 0) {
    setInitialGraphViewGenerated(true)
  }

  useEffect(() => {
    if (reactFlowInstance && initialGraphViewGenerated) {
      handleFitGraphView()
    }
  }, [reactFlowInstance, alignTriggerItem, handleFitGraphView, initialGraphViewGenerated])

  useEffect(() => {
    return () => {
      if (observer instanceof MutationObserver) {
        observer.disconnect()
      }
    }
  }, [observer])

  const onInit = reactFlowInstance => {
    const edgesWrapper = document.querySelector('.react-flow__nodes')

    if (edgesWrapper) {
      observer.observe(edgesWrapper, {
        subtree: true,
        attributes: true
      })
    }

    setReactFlowInstance(reactFlowInstance)
  }

  const flow = (
    <ReactFlow
      edgeTypes={edgeTypes}
      edges={edges}
      elementsSelectable={withBackground}
      multiSelectionKeyCode={null}
      nodeTypes={nodeTypes}
      nodes={nodes}
      nodesConnectable={false}
      nodesDraggable={false}
      onInit={onInit}
      onNodeClick={onNodeClick}
      proOptions={{ hideAttribution: true }}
      selectionKeyCode={null}
      defaultEdgeOptions={defaultEdgeOptions}
      disableKeyboardA11y
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseLeave={onNodeMouseLeave}
    >
      {defaultErrorHandlerData && (
        <MlDefaultErrorPanel data={defaultErrorHandlerData} onNodeClick={onNodeClick} />
      )}
      <Controls
        fitViewOptions={{ padding: 0.2, duration: 200 }}
        position="top-left"
        showInteractive={false}
        showZoom={true}
        orientation="horizontal"
      >
        {legend}
      </Controls>
      <MiniMap
        nodeStrokeWidth={3}
        nodeClassName={getNodeClassName}
        pannable
        position="bottom-left"
        zoomStep={1}
        zoomable
      />
      {withBackground && <Background />}
    </ReactFlow>
  )

  return withProvider ? <ReactFlowProvider>{flow}</ReactFlowProvider> : flow
}

MlReactFlow.propTypes = {
  alignTriggerItem: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  edges: PropTypes.arrayOf(PropTypes.object).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onNodeClick: PropTypes.func,
  defaultErrorHandlerData: PropTypes.object,
  withBackground: PropTypes.bool,
  withProvider: PropTypes.bool,
  legend: PropTypes.node
}

export default React.memo(MlReactFlow)
