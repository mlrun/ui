import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, concat, find, forEach, map, reject } from 'lodash'

import ConfigFunctionTemplate from './ConfigFunctionTemplate/ConfigFunctionTemplate'
import ConfigSource from './ConfigSource/ConfigSource'
import ConfigSteps from './ConfigSteps/ConfigSteps'
import ConfigTargets from './ConfigTargets/ConfigTargets'
import MlReactFlow from '../../common/ReactFlow/MlReactFlow'
import { getLayoutedElements } from '../../common/ReactFlow/mlReactFlow.util'
import {
  ERROR_NODE,
  INPUT_NODE,
  ML_NODE,
  OUTPUT_NODE,
  PRIMARY_NODE
} from '../../constants'

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
  const [selectedItemUid, setSelectedItemUid] = useState(null)

  const generateGraphData = useCallback(() => {
    let edgesMap = {}
    let errorsMap = {}
    let stepsList = []
    let nodes = map(states, (stepItem, stepName) => {
      let nodeItem = {
        id: stepName,
        type: ML_NODE,
        data: { subType: PRIMARY_NODE, label: stepName },
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
      type: ML_NODE,
      data: { subType: INPUT_NODE, label: 'Source' },
      position: { x: 0, y: 0 }
    })

    let nodesEdges = map(edgesMap, (source, target) => {
      return {
        id: `e.${source}.${target}`,
        source: source,
        target: target,
        animated: false,
        arrowHeadType: 'arrowclosed'
      }
    })

    forEach(targets, target => {
      if (target.after_state) {
        nodes.push({
          id: target.name,
          type: ML_NODE,
          data: { subType: OUTPUT_NODE, label: target.name },
          position: { x: 0, y: 0 }
        })
        nodesEdges.push({
          id: `e.${target.after_state}.${target.name}`,
          source: target.after_state,
          target: target.name,
          arrowHeadType: 'arrowclosed'
        })
      }
    })

    let errorEdges = map(errorsMap, (target, source) => {
      let errorHandlerElement = find(nodes, ['id', target])

      if (errorHandlerElement) {
        errorHandlerElement.data.subType = ERROR_NODE
      }

      return {
        id: `e.${source}.${target}`,
        source: source,
        target: target,
        arrowHeadType: 'arrowclosed',
        animated: true
      }
    })

    setElements(getLayoutedElements(concat(nodes, nodesEdges, errorEdges)))
    setSteps(stepsList)
    setAfterSteps(stepsList)
    setErrorSteps(stepsList)
  }, [states, targets, selectedStep])

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

  return (
    <div className="graph-container transformations-tab">
      <div className="graph-view">
        <MlReactFlow elements={elements} alignTriggerItem={selectedItemUid} />
      </div>
      <div className="graph-pane">
        <div className="graph-pane__title">Configuration</div>
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
