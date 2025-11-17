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
import { groupBy, forEach, isEmpty, map, concat, mapValues } from 'lodash'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Tooltip, TextTooltipTemplate, RoundedIcon, Loader } from 'igz-controls/components'
import Accordion from '../../common/Accordion/Accordion'
import ArtifactPopUp from '../../elements/DetailsPopUp/ArtifactPopUp/ArtifactPopUp'
import CodeBlock from '../../common/CodeBlock/CodeBlock'
import MlReactFlow from '../../common/ReactFlow/MlReactFlow'
import ModelEndpointPopUp from '../../elements/DetailsPopUp/ModelEndpointPopUp/ModelEndpointPopUp'
import NoData from '../../common/NoData/NoData'

import {
  DEFAULT_EDGE,
  FLOATING_EDGE,
  GREY_NODE,
  ML_EDGE,
  ML_MODEL_RUNNER_NODE,
  ML_NODE,
  MODEL_RUNNER_STEP_KIND,
  PRIMARY_NODE,
  REAL_TIME_PIPELINES_TAB,
  ROUNDED_RECTANGLE_NODE_SHAPE,
  SECONDARY_NODE
} from '../../constants'
import { fetchAndParseFunction } from '../ModelsPage/RealTimePipelines/realTimePipelines.util'
import { getLayoutedElements } from '../../common/ReactFlow/mlReactFlow.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseUri } from '../../utils'
import { useModelsPage } from '../ModelsPage/ModelsPage.context'

import Arrow from 'igz-controls/images/arrow.svg?react'
import Back from 'igz-controls/images/back-arrow.svg?react'
import CloseIcon from 'igz-controls/images/close.svg?react'
import ConnectionIcon from 'igz-controls/images/connections-icon.svg?react'

import './pipeline.scss'

const Pipeline = ({ content }) => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [pipeline, setPipeline] = useState({})
  const [selectedStep, setSelectedStep] = useState({})
  const [selectedStepData, setSelectedStepData] = useState({})
  const [stepIsSelected, setStepIsSelected] = useState(false)
  const params = useParams()
  const dispatch = useDispatch()
  const functionsStore = useSelector(store => store.functionsStore)
  const { handleMonitoring, toggleConvertedYaml, frontendSpec } = useModelsPage()

  useEffect(() => {
    const selectedFunction = content.find(contentItem => contentItem.hash === params.pipelineId)

    if (selectedFunction) {
      fetchAndParseFunction(selectedFunction, dispatch).then(func => {
        return setPipeline(func)
      })
    }
  }, [content, dispatch, params.pipelineId])

  useEffect(() => {
    if (selectedStep.data) {
      const selectedStepCustomData = selectedStep.data.customData

      setSelectedStepData({
        general: [
          {
            label: 'Type:',
            value: selectedStepCustomData.kind
          },
          {
            label: 'Class name:',
            value: selectedStepCustomData.class_name
          },
          {
            label: 'Function name:',
            value: selectedStepCustomData.function
          },
          {
            label: 'Handler:',
            value: selectedStepCustomData.handler,
            hidden: selectedStepCustomData.kind === MODEL_RUNNER_STEP_KIND
          },
          {
            label: 'Arguments:',
            value: selectedStepCustomData.class_args,
            type: 'codeblock'
          },
          {
            label: 'Input path:',
            value: selectedStepCustomData.input_path
          },
          {
            label: 'Result path:',
            value: selectedStepCustomData.result_path
          }
        ],
        runningModels: mapValues(
          selectedStepCustomData?.class_args?.monitoring_data ?? {},
          (runningModelData, runningModelName) => {
            return [
              {
                label: 'Model endpoint:',
                value: runningModelData.model_endpoint_uid,
                additionalData: {
                  modelEndpointName: runningModelName
                },
                type: 'pop-up'
              },
              {
                label: 'Model artifact:',
                value: runningModelData.model_path,
                type: 'pop-up'
              },
              {
                label: 'Class name:',
                value: runningModelData.model_class
              },
              {
                label: 'Input path:',
                value: runningModelData.input_path
              },
              {
                label: 'Result path:',
                value: runningModelData.result_path
              },
              {
                label: 'Outputs:',
                value: runningModelData.outputs.join(', ')
              },
              {
                label: 'Execution mechanism:',
                value:
                  selectedStepCustomData?.class_args?.execution_mechanism_by_model_name?.[
                    runningModelName
                  ] ?? ''
              }
            ]
          }
        )
      })
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
        if (!step.kind) return

        let nodeType = step.kind === MODEL_RUNNER_STEP_KIND ? ML_MODEL_RUNNER_NODE : ML_NODE
        const subLabel =
          step.kind === 'queue' ? '« queue »' : step.kind === 'router' ? '« router »' : ''

        newNodes.push({
          id: stepName,
          type: nodeType,
          data: {
            subType: PRIMARY_NODE,
            label: stepName,
            subLabel: subLabel,
            isSelectable: true,
            customData: { ...step, track_models: graph.track_models }
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

  const openModelRunnerPopUp = modelRunnerRowData => {
    if (modelRunnerRowData.value.startsWith('store://')) {
      openPopUp(ArtifactPopUp, {
        artifactData: parseUri(modelRunnerRowData.value)
      })
    } else {
      openPopUp(ModelEndpointPopUp, {
        modelEndpointUid: modelRunnerRowData.value,
        modelEndpointName: modelRunnerRowData.additionalData.modelEndpointName,
        frontendSpec,
        handleMonitoring,
        toggleConvertedYaml
      })
    }
  }

  return (
    <div className="pipeline-container">
      <div className="pipeline-header">
        <div className="link-back">
          <Link
            to={`/projects/${params.projectName}/models/${
              params.pageTab ?? REAL_TIME_PIPELINES_TAB
            }${window.location.search}`}
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
      {!isEmpty(pipeline?.graph) ? (
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
              <div className="graph-pane-scroll-container">
                <div className="graph-pane__title">
                  {selectedStep.type === ML_MODEL_RUNNER_NODE && (
                    <div className="graph-pane__title-icon">
                      <ConnectionIcon />
                    </div>
                  )}
                  <Tooltip
                    className="graph-pane__title-label"
                    hidden={!selectedStep.id}
                    template={<TextTooltipTemplate text={selectedStep.id} />}
                  >
                    {selectedStep.id}
                  </Tooltip>
                  <RoundedIcon onClick={() => setSelectedStep({})} tooltipText="Close">
                    <CloseIcon />
                  </RoundedIcon>
                </div>
                <div className="graph-pane__section">
                  <div className="graph-pane__section-title">General</div>
                  {selectedStepData.general.map(
                    rowData =>
                      !rowData.hidden && (
                        <div
                          className={classnames(
                            'graph-pane__row',
                            rowData.type === 'codeblock' && 'graph-pane__row_wrap'
                          )}
                          key={rowData.label}
                        >
                          <div className="graph-pane__row-label">{rowData.label}</div>
                          {rowData.type === 'codeblock' ? (
                            <CodeBlock codeData={rowData.value} />
                          ) : (
                            <div className="graph-pane__row-value">
                              <Tooltip template={<TextTooltipTemplate text={rowData.value} />}>
                                {rowData.value}
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      )
                  )}
                </div>
                {Object.keys(selectedStepData.runningModels).length > 0 && (
                  <div className="graph-pane__section">
                    <div className="graph-pane__section-title">
                      Running models ({Object.keys(selectedStepData.runningModels).length})
                    </div>
                    {Object.entries(selectedStepData.runningModels).map(
                      ([modelRunnerName, modelRunnerData]) => (
                        <Accordion
                          key={modelRunnerName}
                          accordionClassName="graph-pane__expand-item"
                          icon={<Arrow />}
                          iconClassName="graph-pane__expand-icon"
                        >
                          <div className="graph-pane__expand-title">{modelRunnerName}</div>
                          <div className="graph-pane__expand-content">
                            {modelRunnerData.map(rowData => {
                              return (
                                <div className="graph-pane__row" key={rowData.label}>
                                  <div className="graph-pane__row-label">{rowData.label}</div>
                                  <div
                                    className="graph-pane__row-value"
                                    onClick={
                                      rowData.type === 'pop-up'
                                        ? () => openModelRunnerPopUp(rowData)
                                        : null
                                    }
                                  >
                                    <Tooltip
                                      template={<TextTooltipTemplate text={rowData.value} />}
                                      className={classnames({ link: rowData.type === 'pop-up' })}
                                    >
                                      {rowData.value}
                                    </Tooltip>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </Accordion>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : functionsStore.funcLoading ? (
        <Loader />
      ) : (
        <NoData message="The ingestion function has no steps and therefore no graph." />
      )}
    </div>
  )
}

Pipeline.propTypes = {
  content: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default React.memo(Pipeline)
