import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactFlow, { ReactFlowProvider } from 'react-flow-renderer'

import FloatingEdge from './FloatingEdge'

import './mlReactFlow.scss'

const MlReactFlow = ({ alignTriggerItem, elements, onElementClick }) => {
  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  const edgeTypes = {
    floating: FloatingEdge
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
        elements={elements}
        onLoad={onLoad}
        edgeTypes={edgeTypes}
        onElementClick={onElementClick}
        selectionKeyCode={null}
        multiSelectionKeyCode={null}
        elementsSelectable={false}
        nodesDraggable={false}
        nodesConnectable={false}
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
