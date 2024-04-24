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
import ReactFlow, { ReactFlowProvider, MiniMap, Controls } from 'reactflow'

import MlReactFlowNode from './MlReactFlowNode'
import MlReactFlowEdge from './MlReactFlowEdge'

import { ML_EDGE, ML_NODE } from '../../constants'
import { getNodeClassName } from './mlReactFlow.util'

import './mlReactFlow.scss'

const edgeTypes = {
  [ML_EDGE]: MlReactFlowEdge
}

const nodeTypes = {
  [ML_NODE]: MlReactFlowNode
}

const MlReactFlow = ({ alignTriggerItem, edges, nodes, onNodeClick }) => {
  const domChangeHandler = () => {
    const edgesWrapper = document.querySelector('.react-flow__edges > g')
    const selectedEdges = edgesWrapper.getElementsByClassName('selected')

    edgesWrapper.append(...selectedEdges)
  }

  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [observer] = useState(new MutationObserver(domChangeHandler))
  const [initialGraphViewGenerated, setInitialGraphViewGenerated] = useState(false)

  const handleFitGraphView = useCallback(() => {
    setTimeout(() => {
      const {
        viewport: { x, y, zoom }
      } = reactFlowInstance.toObject()

      reactFlowInstance.setViewport({ x, y, zoom: zoom })
      reactFlowInstance.fitView({ padding: 0.2, duration: 200 })
    }, 50)
  }, [reactFlowInstance])

  useEffect(() => {
    if (reactFlowInstance && !initialGraphViewGenerated && nodes.length > 0) {
      setInitialGraphViewGenerated(true)
    }
  }, [nodes.length, initialGraphViewGenerated, reactFlowInstance])

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

  return (
    <ReactFlowProvider>
      <ReactFlow
        edgeTypes={edgeTypes}
        edges={edges}
        elementsSelectable={false}
        multiSelectionKeyCode={null}
        nodeTypes={nodeTypes}
        nodes={nodes}
        nodesConnectable={false}
        nodesDraggable={false}
        onInit={onInit}
        onNodeClick={onNodeClick}
        proOptions={{ hideAttribution: true }}
        selectionKeyCode={null}
      />
      <Controls
        fitViewOptions={{ padding: 0.2, duration: 200 }}
        position="top-left"
        showInteractive={false}
        showZoom={false}
      />
      <MiniMap
        nodeStrokeWidth={3}
        nodeClassName={getNodeClassName}
        pannable
        position="bottom-left"
        zoomStep={1}
        zoomable
      />
    </ReactFlowProvider>
  )
}

MlReactFlow.defaultProps = {
  alignTriggerItem: '',
  onNodeClick: () => {}
}

MlReactFlow.propTypes = {
  alignTriggerItem: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  edges: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onNodeClick: PropTypes.func
}

export default React.memo(MlReactFlow)
