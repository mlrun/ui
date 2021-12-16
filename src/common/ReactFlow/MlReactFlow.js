import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactFlow, { ReactFlowProvider } from 'react-flow-renderer'

import FloatingEdge from './FloatingEdge'
import MlReactFlowNode from './MlReactFlowNode'

import { ML_NODE } from '../../constants'

import './mlReactFlow.scss'

const MlReactFlow = ({ alignTriggerItem, elements, onElementClick }) => {
  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  const edgeTypes = {
    floating: FloatingEdge
  }

  const nodeTypes = {
    [ML_NODE]: MlReactFlowNode
  }

  useEffect(() => {
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView()
        const { position, zoom } = reactFlowInstance.toObject()

        reactFlowInstance.setTransform({ x: position[0], y: 50, zoom: zoom })
      }
    }, 100)
  }, [reactFlowInstance, alignTriggerItem])

  const onLoad = reactFlowInstance => {
    setReactFlowInstance(reactFlowInstance)
  }

  return (
    <ReactFlowProvider>
      <ReactFlow
        edgeTypes={edgeTypes}
        elements={elements}
        elementsSelectable={false}
        multiSelectionKeyCode={null}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        nodesDraggable={false}
        onElementClick={onElementClick}
        onLoad={onLoad}
        selectionKeyCode={null}
      />
    </ReactFlowProvider>
  )
}

MlReactFlow.defaultProps = {
  alignTriggerItem: '',
  onElementClick: () => {}
}

MlReactFlow.propTypes = {
  alignTriggerItem: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  elements: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onElementClick: PropTypes.func
}

export default React.memo(MlReactFlow)
