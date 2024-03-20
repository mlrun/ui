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
  DEFAULT_EDGE,
  GREY_NODE,
  INPUT_NODE,
  ML_EDGE,
  ML_NODE,
  OUTPUT_NODE,
  PRIMARY_NODE
} from '../../constants'

import './detailsTransformations.scss'

const DetailsTransformations = ({ selectedItem }) => {
  const [states, setStates] = useState({})
  const [targets, setTargets] = useState([])
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [steps, setSteps] = useState([])
  const [afterSteps, setAfterSteps] = useState([])
  const [errorSteps, setErrorSteps] = useState([])
  const [selectedStep, setSelectedStep] = useState('')
  const [selectedAfterStep, setSelectedAfterStep] = useState('')
  const [selectedErrorStep, setSelectedErrorStep] = useState('')
  const [selectedItemUid, setSelectedItemUid] = useState(null)

  const generateGraphData = useCallback(() => {
    queueMicrotask(() => {
      let edgesMap = {}
      let errorsMap = {}
      let stepsList = []
      let newNodes = map(states, (stepItem, stepName) => {
        let nodeItem = {
          type: ML_NODE,
          data: { subType: PRIMARY_NODE, label: stepName },
          id: stepName,
          className: selectedStep === stepName ? 'selected' : '',
          position: { x: 0, y: 0 }
        }
        if (stepItem.after && Array.isArray(stepItem.after) && stepItem.after.length) {
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

      newNodes.unshift({
        type: ML_NODE,
        data: { subType: INPUT_NODE, label: 'Source' },
        id: 'Source',
        position: { x: 0, y: 0 }
      })

      let nodesEdges = map(edgesMap, (source, target) => {
        return {
          type: ML_EDGE,
          data: {
            subType: DEFAULT_EDGE
          },
          id: `e.${source}.${target}`,
          source: source,
          target: target
        }
      })

      forEach(targets, target => {
        if (target.after_state) {
          newNodes.push({
            type: ML_NODE,
            data: { subType: OUTPUT_NODE, label: target.name },
            id: target.name,
            position: { x: 0, y: 0 }
          })
          nodesEdges.push({
            type: ML_EDGE,
            data: {
              subType: DEFAULT_EDGE
            },
            id: `e.${target.after_state}.${target.name}`,
            source: target.after_state,
            target: target.name
          })
        }
      })

      let errorEdges = map(errorsMap, (target, source) => {
        let errorHandlerElement = find(newNodes, ['id', target])

        if (errorHandlerElement) {
          errorHandlerElement.data.subType = GREY_NODE
        }

        return {
          type: ML_EDGE,
          data: {
            subType: DEFAULT_EDGE
          },
          id: `e.${source}.${target}`,
          source: source,
          target: target,
          animated: true
        }
      })

      const [layoutedNodes, layoutedEdges] = getLayoutedElements(
        newNodes,
        concat(nodesEdges, errorEdges)
      )

      setNodes(layoutedNodes)
      setEdges(layoutedEdges)
      setSteps(stepsList)
      setAfterSteps(stepsList)
      setErrorSteps(stepsList)
    })
  }, [states, targets, selectedStep])

  useEffect(() => {
    setStates(cloneDeep(selectedItem.graph?.steps))
    setTargets(cloneDeep(selectedItem.targets))
  }, [selectedItem.graph, selectedItem.targets])

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
    setNodes(nodes => {
      return map(nodes, node => {
        return {
          ...node,
          className:
            node.id === selectedStep
              ? node.className
                ? (node.className += ' selected')
                : 'selected'
              : node.className?.replace('selected', '')
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
        <MlReactFlow nodes={nodes} edges={edges} alignTriggerItem={selectedItemUid} />
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
