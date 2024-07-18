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
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { groupBy, forEach, map, concat } from 'lodash'
import { Link, useParams } from 'react-router-dom'

import MlReactFlow from '../../common/ReactFlow/MlReactFlow'
import CodeBlock from '../../common/CodeBlock/CodeBlock'
import { Tooltip, TextTooltipTemplate, RoundedIcon } from 'igz-controls/components'

import {
  DEFAULT_EDGE,
  FLOATING_EDGE,
  GREY_NODE,
  ML_EDGE,
  ML_NODE,
  PRIMARY_NODE,
  REAL_TIME_PIPELINES_TAB,
  ROUNDED_RECTANGLE_NODE_SHAPE,
  SECONDARY_NODE
} from '../../constants'
import { getLayoutedElements } from '../../common/ReactFlow/mlReactFlow.util'

import { ReactComponent as Back } from 'igz-controls/images/back-arrow.svg'
import { ReactComponent as CloseIcon } from 'igz-controls/images/close.svg'

import './pipeline.scss'

const Pipeline = ({ content }) => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [pipeline, setPipeline] = useState({})
  const [selectedStep, setSelectedStep] = useState({})
  const [selectedStepData, setSelectedStepData] = useState([])
  const [stepIsSelected, setStepIsSelected] = useState(false)
  const params = useParams()

  useEffect(() => {
    setPipeline(content.find(contentItem => contentItem.hash === params.pipelineId))
  }, [content, params.pipelineId])

  useEffect(() => {
    if (selectedStep.data) {
      const selectedStepData = selectedStep.data.customData

      setSelectedStepData([
        {
          label: 'Type:',
          value: selectedStepData.kind
        },
        {
          label: 'After:',
          value: selectedStepData.after?.[0]
        },
        {
          label: 'Class name:',
          value: selectedStepData.class_name
        },
        {
          label: 'Function name:',
          value: selectedStepData.function
        },
        {
          label: 'Handler:',
          value: selectedStepData.handler
        },
        {
          label: 'Arguments:',
          value: selectedStepData.class_args,
          type: 'codeblock'
        },
        {
          label: 'Input path:',
          value: ''
        },
        {
          label: 'Result path:',
          value: ''
        }
      ])
    }
    setStepIsSelected(Boolean(selectedStep.id))
  }, [selectedStep])

  useEffect(() => {
    const graph = pipeline?.graph
    const steps = graph?.routes || graph?.steps

    if (steps) {
      let mainRouterStepId = ''
      const newNodes = []
      const edgesMap = {}
      const edgesRouterMap = []
      const errorsMap = {}

      if (graph.kind === 'router') {
        mainRouterStepId = graph.class_args?.name || 'router'

        newNodes.push({
          id: mainRouterStepId,
          type: ML_NODE,
          data: {
            subType: PRIMARY_NODE,
            label: graph.class_args?.name ?? '',
            subLabel: '« router »',
            isSelectable: true,
            customData: graph
          },
          className: classnames(selectedStep.id === mainRouterStepId && 'selected'),
          position: { x: 0, y: 0 }
        })
      }

      forEach(steps, (step, stepName) => {
        const subLabel =
          step.kind === 'queue' ? '« queue »' : step.kind === 'router' ? '« router »' : ''

        newNodes.push({
          id: stepName,
          type: ML_NODE,
          data: {
            subType: PRIMARY_NODE,
            label: stepName,
            subLabel: subLabel,
            isSelectable: true,
            customData: step
          },
          className: classnames(selectedStep.id === stepName && 'selected'),
          position: { x: 0, y: 0 }
        })

        if (mainRouterStepId) {
          edgesMap[stepName] = mainRouterStepId
        }

        if (step.after && Array.isArray(step.after) && step.after.length) {
          edgesMap[stepName] = step.after[0]
        }

        if (step.on_error) {
          errorsMap[stepName] = step.on_error
        }

        if (step.kind === 'router' && step.routes) {
          forEach(step.routes, (routeInner, routeInnerName) => {
            newNodes.push({
              id: routeInnerName,
              type: ML_NODE,
              data: {
                subType: SECONDARY_NODE,
                label: routeInnerName,
                isSelectable: true,
                shape: ROUNDED_RECTANGLE_NODE_SHAPE,
                withOpacity: true,
                customData: routeInner
              },
              className: classnames(selectedStep.id === routeInnerName && 'selected'),
              position: { x: 0, y: 0 }
            })

            edgesRouterMap.push([stepName, routeInnerName])
          })
        }
      })

      const nodesRouterEdges = map(edgesRouterMap, ([source, target]) => {
        return {
          type: ML_EDGE,
          data: {
            subType: FLOATING_EDGE,
            isMarkerStart: true
          },
          id: `e.${source}.${target}`,
          source: source,
          target: target
        }
      })

      const nodesEdges = map(edgesMap, (source, target) => {
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

      const errorEdges = map(errorsMap, (target, source) => {
        const errorHandlerElement = newNodes.find(node => node.id === target)
        errorHandlerElement.data.subType = GREY_NODE

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

      const groupedNodesEdges = groupBy(nodesEdges, 'source')
      const sortedNodesEdges = []

      forEach(groupedNodesEdges, (edgesGroup, edgesSource) => {
        const filteredRouterEdges = nodesRouterEdges.filter(routerEdge => {
          return routerEdge.source === edgesSource || routerEdge.target === edgesSource
        })

        if (filteredRouterEdges.length > 1) {
          const routerEdgesHalfLength = filteredRouterEdges.length / 2
          const routerEdgesFirstHalf = filteredRouterEdges.slice(0, routerEdgesHalfLength)
          const routerEdgesSecondHalf = filteredRouterEdges.slice(routerEdgesHalfLength)
          const mergedRouterEdges = [
            ...routerEdgesFirstHalf,
            ...edgesGroup,
            ...routerEdgesSecondHalf
          ]

          sortedNodesEdges.push(...mergedRouterEdges)
        } else {
          sortedNodesEdges.push(...edgesGroup)
        }
      })

      const [layoutedNodes, layoutedEdges] = getLayoutedElements(
        newNodes,
        concat(sortedNodesEdges, errorEdges)
      )

      setNodes(layoutedNodes)
      setEdges(layoutedEdges)
    }
  }, [pipeline, selectedStep])

  return (
    <div className="pipeline-container">
      <div className="pipeline-header">
        <div className="link-back">
          <Link
            to={`/projects/${params.projectName}/models/${
              params.pageTab ?? REAL_TIME_PIPELINES_TAB
            }`}
            className="link-back__icon"
          >
            <RoundedIcon id="pipeline-back-btn" tooltipText="Back">
              <Back />
            </RoundedIcon>
          </Link>
          <div className="link-back__title">
            <Tooltip template={<TextTooltipTemplate text={pipeline?.name} />}>
              {pipeline?.name}
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="graph-container pipeline-content">
        <div className="graph-view">
          <MlReactFlow
            nodes={nodes}
            edges={edges}
            alignTriggerItem={stepIsSelected}
            onNodeClick={(event, node) => {
              if (node.data?.customData) {
                setSelectedStep(node)
              }
            }}
          />
        </div>
        {stepIsSelected && (
          <div className="graph-pane">
            <div className="graph-pane__title">
              <span>{selectedStep.id}</span>
              <RoundedIcon onClick={() => setSelectedStep({})} tooltipText="Close">
                <CloseIcon />
              </RoundedIcon>
            </div>
            {selectedStepData.map(rowData => (
              <div className="graph-pane__row" key={rowData.label}>
                {rowData.type === 'codeblock' ? (
                  <CodeBlock label="Arguments" codeData={rowData.value} />
                ) : (
                  <>
                    <div className="graph-pane__row-label">{rowData.label}</div>
                    <div className="graph-pane__row-value">
                      <Tooltip template={<TextTooltipTemplate text={rowData.value} />}>
                        {rowData.value}
                      </Tooltip>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

Pipeline.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default React.memo(Pipeline)
