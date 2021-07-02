import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import ReactFlow, { ReactFlowProvider } from 'react-flow-renderer'
import { map, forEach, find, reject, concat, cloneDeep } from 'lodash'

import ConfigFunctionTemplate from './ConfigFunctionTemplate/ConfigFunctionTemplate'
import ConfigSource from './ConfigSource/ConfigSource'
import ConfigSteps from './ConfigSteps/ConfigSteps'
import ConfigTargets from './ConfigTargets/ConfigTargets'
import { getLayoutedElements } from './detailsTransformations.util'
import './detailsTransformations.scss'

const DetailsTransformations = ({ selectedItem }) => {
  const [states, setStates] = useState({})
  const [targets, setTargets] = useState([])
  const [elements, setElements] = useState([])
  const [steps, setSteps] = useState([])
  const [afterSteps, setAfterSteps] = useState([])
  const [errorSteps, setErrorSteps] = useState([])
  const [selectedStep, setSelectedStep] = useState('')
  const [selectedAfterStep, setSelectedAfterStep] = useState('')
  const [selectedErrorStep, setSelectedErrorStep] = useState('')
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [selectedItemUid, setSelectedItemUid] = useState(null)

  const generateGraphData = useCallback(() => {
    let edgesMap = {}
    let errorsMap = {}
    let stepsList = []
    let nodes = map(states, (stepItem, stepName) => {
      let nodeItem = {
        id: stepName,
        data: { label: stepName },
        className: selectedStep === stepName ? 'selected' : '',
        position: { x: 0, y: 0 }
      }

      if (stepItem.after) {
        edgesMap[stepName] = stepItem.after[0]
      } else if (!find(states, ['on_error', stepName])) {
        edgesMap[stepName] = 'Source'
      }

      if (stepItem.on_error) {
        errorsMap[stepName] = stepItem.on_error
      }

      stepsList.push({
        id: stepName,
        label: stepName
      })

      return nodeItem
    })

    nodes.unshift({
      id: 'Source',
      data: { label: 'Source' },
      type: 'input',
      position: { x: 0, y: 0 }
    })

    let nodesEdges = map(edgesMap, (source, target) => {
      return {
        id: `e.${source}.${target}`,
        source: source,
        target: target,
        type: 'smoothstep',
        animated: false,
        arrowHeadType: 'arrowclosed'
      }
    })

    forEach(targets, target => {
      if (target.after_state) {
        nodes.push({
          id: target.name,
          data: { label: target.name },
          position: { x: 0, y: 0 },
          type: 'output'
        })
        nodesEdges.push({
          id: `e.${target.after_state}.${target.name}`,
          source: target.after_state,
          target: target.name,
          type: 'smoothstep',
          arrowHeadType: 'arrowclosed'
        })
      }
    })

    let errorEdges = map(errorsMap, (target, source) => {
      let errorHandlerElement = find(nodes, ['id', target])
      errorHandlerElement.className += ' error-handler'

      return {
        id: `e.${source}.${target}`,
        source: source,
        target: target,
        type: 'smoothstep',
        arrowHeadType: 'arrowclosed',
        animated: true
      }
    })

    setElements(getLayoutedElements(concat(nodes, nodesEdges, errorEdges)))
    setSteps(stepsList)
    setAfterSteps(stepsList)
    setErrorSteps(stepsList)
  }, [states, targets, selectedStep])

  const onLoad = reactFlowInstance => {
    setReactFlowInstance(reactFlowInstance)
  }

  useEffect(() => {
    setStates(cloneDeep(selectedItem.graph?.steps))
  }, [selectedItem.graph])

  useEffect(() => {
    setTargets(cloneDeep(selectedItem.targets))
  }, [selectedItem.targets])

  useEffect(() => {
    let stepsList = reject(steps, ['id', selectedStep])

    setErrorSteps(reject(stepsList, ['id', 'Source']))
    stepsList.unshift({
      id: 'Source',
      label: 'Source'
    })

    setAfterSteps(stepsList)
  }, [steps, selectedStep])

  useEffect(() => {
    setElements(elements => {
      return map(elements, el => {
        return {
          ...el,
          className:
            el.id === selectedStep
              ? el.className
                ? (el.className += ' selected')
                : 'selected'
              : el.className?.replace('selected', '')
        }
      })
    })
  }, [selectedStep])

  useEffect(() => {
    generateGraphData()
  }, [generateGraphData])

  useEffect(() => {
    if (selectedItem.uid !== selectedItemUid) {
      setSelectedItemUid(selectedItem.uid)
    }
  }, [selectedItem, selectedItemUid])

  useEffect(() => {
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView()
        const { position, zoom } = reactFlowInstance.toObject()

        reactFlowInstance.setTransform({ x: position[0], y: 50, zoom: zoom })
      }
    }, 100)
  }, [reactFlowInstance, selectedItemUid])

  return (
    <div className="transformations-tab">
      <div className="graph-view">
        <ReactFlowProvider>
          <ReactFlow
            elements={elements}
            onLoad={onLoad}
            elementsSelectable={false}
            nodesDraggable={false}
            nodesConnectable={false}
          />
        </ReactFlowProvider>
      </div>
      <div className="config-pane">
        <div className="config-pane__title">Configuration</div>
        <ConfigFunctionTemplate selectedItem={selectedItem} />
        <ConfigSource selectedItem={selectedItem} />
        <ConfigSteps
          states={states}
          setStates={setStates}
          steps={steps}
          afterSteps={afterSteps}
          errorSteps={errorSteps}
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
          selectedAfterStep={selectedAfterStep}
          setSelectedAfterStep={setSelectedAfterStep}
          selectedErrorStep={selectedErrorStep}
          setSelectedErrorStep={setSelectedErrorStep}
        />
        <ConfigTargets targets={targets} steps={steps} />
      </div>
    </div>
  )
}

DetailsTransformations.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsTransformations
