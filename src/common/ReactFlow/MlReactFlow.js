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
import ReactFlow, { ReactFlowProvider } from 'react-flow-renderer'

import MlReactFlowNode from './MlReactFlowNode'
import MlReactFlowEdge from './MlReactFlowEdge'

import { ML_EDGE, ML_NODE } from '../../constants'

import './mlReactFlow.scss'

const edgeTypes = {
  [ML_EDGE]: MlReactFlowEdge
}

const nodeTypes = {
  [ML_NODE]: MlReactFlowNode
}

const MlReactFlow = ({ alignTriggerItem, elements, onElementClick }) => {
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
      reactFlowInstance.fitView()
      const { position, zoom } = reactFlowInstance.toObject()

      reactFlowInstance.setTransform({ x: position[0], y: 50, zoom: zoom })
    })
  }, [reactFlowInstance])

  useEffect(() => {
    if (reactFlowInstance && !initialGraphViewGenerated && elements.length > 0) {
      setInitialGraphViewGenerated(true)
    }
  }, [elements.length, handleFitGraphView, initialGraphViewGenerated, reactFlowInstance])

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

  const onLoad = reactFlowInstance => {
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
