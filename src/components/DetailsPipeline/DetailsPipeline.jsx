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
import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { groupBy, forEach, isEmpty, isEqual, map, omit } from 'lodash-es'
import { useSelector } from 'react-redux'
import { Group, Panel } from 'react-resizable-panels'
import { Position, ReactFlowProvider, useStoreApi } from 'reactflow'

import { Tooltip, TextTooltipTemplate, RoundedIcon, CopyToClipboard } from 'igz-controls/components'
import Accordion from '../../common/Accordion/Accordion'
import ArtifactPopUp from '../../elements/DetailsPopUp/ArtifactPopUp/ArtifactPopUp'
import CodeBlock from '../../common/CodeBlock/CodeBlock'
import MlReactFlow from '../../common/ReactFlow/MlReactFlow'
import ModelEndpointPopUp from '../../elements/DetailsPopUp/ModelEndpointPopUp/ModelEndpointPopUp'
import NoData from '../../common/NoData/NoData'
import PipelineLegend from './PipelineLegend'
import RouterList from './RouterList'

import { getStepDescriptionFields, getStepsNodeData, STEP_FIELD_TYPES } from './pipeline.utils'

import {
  DEFAULT_EDGE,
  ML_EDGE,
  ERROR_STEP_KIND,
  SMOOTH_STEP_EDGE,
  PRIMARY_PIPELINE_NODE,
  ML_SMART_STEP_EDGE
} from '../../constants'
import {
  addVisualFramesForFunctions,
  getLayoutedElements
} from '../../common/ReactFlow/mlReactFlow.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseUri } from '../../utils'
import { useModelsPage } from '../ModelsPage/useModelsPage.hook'

import Arrow from 'igz-controls/images/arrow.svg?react'
import CloseIcon from 'igz-controls/images/close.svg?react'

import './detailsPipeline.scss'

const buildStepNodesAndConnections = (steps, graph, defaultErrorHandlerStepId) => {
  const nodes = []
  const edgesMap = {}
  const cyclicEdgesMap = {}
  const errorsMap = {}
  const nodesConnectionMap = {} // [after]: [step]
  let defaultErrorHandlerData = null

  forEach(steps, (step, stepName) => {
    if (!step.kind) return

    const stepData = { ...step, track_models: graph.track_models }
    const nodeTypeData = getStepsNodeData(stepData)

    if (step.kind === ERROR_STEP_KIND && stepName === defaultErrorHandlerStepId) {
      defaultErrorHandlerData = {
        ...nodeTypeData,
        id: stepName,
        subType: PRIMARY_PIPELINE_NODE,
        label: stepName,
        isSelectable: true,
        customData: stepData
      }

      return
    } else if (step.kind === ERROR_STEP_KIND && !step.function && step.base_step) {
      stepData.function = steps[step.base_step]?.function || ''
    }

    nodes.push({
      id: stepName,
      type: nodeTypeData.nodeType,
      data: {
        ...nodeTypeData,
        subType: PRIMARY_PIPELINE_NODE,
        label: stepName,
        isSelectable: true,
        customData: stepData
      },
      position: { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    })

    if (stepData.after && Array.isArray(stepData.after) && stepData.after.length) {
      const nonCyclicAfter = stepData.cycle_from?.length
        ? stepData.after.filter(stepName => !stepData.cycle_from.includes(stepName))
        : stepData.after

      if (nonCyclicAfter.length) {
        edgesMap[stepName] = nonCyclicAfter
        nonCyclicAfter.forEach(after => {
          ;(nodesConnectionMap[after] ??= []).push(stepName)
        })
      }
    }

    if (stepData.on_error) {
      errorsMap[stepName] = stepData.on_error
    }

    if (stepData.cycle_from?.length) {
      stepData.cycle_from.forEach(cycleFrom => {
        ;(cyclicEdgesMap[cycleFrom] ??= []).push(stepName)
      })
    }
  })

  return { nodes, edgesMap, cyclicEdgesMap, errorsMap, nodesConnectionMap, defaultErrorHandlerData }
}

const applyNodeConnectionFlags = (nodes, nodesConnectionMap, cyclicEdgesMap) => {
  nodes.forEach(node => {
    // hide right handle for nodes without connections
    if (!(node.id in nodesConnectionMap)) {
      node.data.isLastStep = true
    }

    if (node.id in cyclicEdgesMap) {
      node.data.cycleTo = cyclicEdgesMap[node.id]
    }
  })
}

const buildStepEdges = (edgesMap, errorsMap, cyclicEdgesMap) => {
  const nodesEdges = map(edgesMap, (sources, target) => {
    const sourcesArray = Array.isArray(sources) ? sources : [sources]

    return sourcesArray.map(source => ({
      type: ML_EDGE,
      data: {
        subType: SMOOTH_STEP_EDGE,
        isHorizontalFlow: true,
        arrowHeadType: 'arrow'
      },
      id: `e.${source}.${target}`,
      source,
      target,
      sourceHandle: 'right',
      targetHandle: 'left',
      weight: 10
    }))
  }).flat()

  const errorEdges = map(errorsMap, (target, source) => ({
    type: ML_EDGE,
    data: {
      subType: DEFAULT_EDGE,
      arrowHeadType: ''
    },
    id: `e.${source}.${target}`,
    source,
    target,
    sourceHandle: 'bottom-error-handler',
    targetHandle: 'top-error-handler',
    animated: true,
    weight: 1
  }))

  const cyclicEdges = map(cyclicEdgesMap, (targets, source) => {
    const targetsArray = Array.isArray(targets) ? targets : [targets]

    return targetsArray.map(target => ({
      type: ML_SMART_STEP_EDGE,
      data: {
        isBackward: true
      },
      id: `e.${source}.${target}`,
      source,
      target,
      sourceHandle: 'top',
      targetHandle: 'top',
      weight: 1
    }))
  }).flat()

  const sortedNodesEdges = Object.values(groupBy(nodesEdges, 'source')).flat()

  return { sortedNodesEdges, errorEdges, cyclicEdges }
}

const DetailsPipeline = ({ selectedItem }) => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedStep, setSelectedStep] = useState({})
  const [selectedStepData, setSelectedStepData] = useState({})
  const [stepIsSelected, setStepIsSelected] = useState(false)
  const [defaultErrorHandlerData, setDefaultErrorHandlerData] = useState(null)
  const isPipelineLoading = useSelector(store => store.artifactsStore.pipelines.loading)
  const { handleMonitoring, toggleConvertedYaml, frontendSpec } = useModelsPage()
  const reactFlowStoreApi = useStoreApi()

  if (selectedStep.data) {
    const nextSelectedStepData = getStepDescriptionFields(selectedStep, selectedItem.graph)

    if (!isEqual(selectedStepData, nextSelectedStepData)) {
      setSelectedStepData(nextSelectedStepData)
    }
  }

  const nextStepIsSelected = Boolean(selectedStep.id)

  if (stepIsSelected !== nextStepIsSelected) {
    setStepIsSelected(nextStepIsSelected)
  }

  const defaultErrorHandlerStepId = useMemo(
    () => selectedItem?.graph?.on_error,
    [selectedItem?.graph]
  )

  if (defaultErrorHandlerStepId && defaultErrorHandlerData) {
    const nextClassName = defaultErrorHandlerStepId === selectedStep?.id ? 'selected' : ''

    if (defaultErrorHandlerData.className !== nextClassName) {
      setDefaultErrorHandlerData(stepData => ({
        ...stepData,
        className: nextClassName
      }))
    }
  }

  useEffect(() => {
    if (isEmpty(selectedStep) || defaultErrorHandlerStepId === selectedStep?.id) {
      reactFlowStoreApi.getState().unselectNodesAndEdges()
    }
  }, [selectedStep, reactFlowStoreApi, defaultErrorHandlerStepId])

  const computedGraphElements = useMemo(() => {
    const graph = selectedItem?.graph
    const steps = graph?.steps || []

    if (!steps || !graph) {
      return { computedNodes: [], computedEdges: [], computedDefaultErrorHandlerData: null }
    }

    const {
      nodes,
      edgesMap,
      cyclicEdgesMap,
      errorsMap,
      nodesConnectionMap,
      defaultErrorHandlerData
    } = buildStepNodesAndConnections(steps, graph, defaultErrorHandlerStepId)

    applyNodeConnectionFlags(nodes, nodesConnectionMap, cyclicEdgesMap)

    const { sortedNodesEdges, errorEdges, cyclicEdges } = buildStepEdges(
      edgesMap,
      errorsMap,
      cyclicEdgesMap
    )

    const [layoutedNodes, layoutedEdges] = getLayoutedElements(
      nodes,
      sortedNodesEdges,
      'LR',
      defaultErrorHandlerStepId,
      errorEdges,
      cyclicEdges,
      true
    )

    const groupedNodes = addVisualFramesForFunctions(
      layoutedNodes,
      node => node.data?.customData?.function
    )

    return {
      computedNodes: groupedNodes,
      computedEdges: layoutedEdges,
      computedDefaultErrorHandlerData: defaultErrorHandlerData
    }
  }, [selectedItem, defaultErrorHandlerStepId])

  const { computedNodes, computedEdges, computedDefaultErrorHandlerData } = computedGraphElements

  if (!isEqual(nodes, computedNodes)) {
    setNodes(computedNodes)
  }

  if (!isEqual(edges, computedEdges)) {
    setEdges(computedEdges)
  }

  if (
    computedDefaultErrorHandlerData &&
    !isEqual(omit(defaultErrorHandlerData, 'className'), computedDefaultErrorHandlerData)
  ) {
    // `className` is derived separately (above) from the current selection, so it must be
    // excluded from this comparison and preserved across updates — otherwise this block and
    // the `className` sync above perpetually invalidate each other, causing an infinite
    // render loop ("Too many re-renders").
    setDefaultErrorHandlerData(stepData => ({
      ...computedDefaultErrorHandlerData,
      className: stepData?.className ?? ''
    }))
  }

  const openModelPopUp = rowData => {
    if (rowData.value.startsWith('store://')) {
      openPopUp(ArtifactPopUp, {
        artifactData: parseUri(rowData.value)
      })
    } else {
      openPopUp(ModelEndpointPopUp, {
        modelEndpointUid: rowData.value,
        modelEndpointName: rowData.additionalData.modelEndpointName,
        frontendSpec,
        handleMonitoring,
        toggleConvertedYaml
      })
    }
  }

  return (
    <div className="pipeline-container">
      {!isEmpty(selectedItem?.graph) ? (
        selectedItem.graph.kind === 'router' ? (
          <RouterList graph={selectedItem.graph} />
        ) : (
          <div className="graph-container pipeline-content">
            <Group direction="horizontal">
              <Panel id="graph-panel" data-testid="graph-panel" minSize="30%">
                <div className="graph-view">
                  <MlReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={(event, node) => {
                      if (node.data?.customData) {
                        setSelectedStep(node)
                      }
                    }}
                    defaultErrorHandlerData={defaultErrorHandlerData}
                    withBackground
                    withProvider={false}
                    legend={<PipelineLegend />}
                  />
                </div>
              </Panel>
              {stepIsSelected && (
                <Panel
                  id="graph-details-panel"
                  data-testid="graph-details-panel"
                  minSize={320}
                  defaultSize="30%"
                >
                  <div className="graph-pane">
                    <div className="graph-pane-scroll-container">
                      <div className="graph-pane__title">
                        {selectedStep.data?.badgeIcon && (
                          <div className="graph-pane__title-icon">
                            {selectedStep.data?.badgeIcon}
                          </div>
                        )}
                        <Tooltip
                          className="graph-pane__title-label"
                          hidden={!selectedStep.id}
                          template={<TextTooltipTemplate text={selectedStep.id || ''} />}
                        >
                          {selectedStep.id || ''}
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
                                  rowData.type === STEP_FIELD_TYPES.CODE_BLOCK &&
                                    'graph-pane__row_wrap'
                                )}
                                key={rowData.label}
                              >
                                <div className="graph-pane__row-label">{rowData.label}</div>
                                {rowData.type === STEP_FIELD_TYPES.CODE_BLOCK ? (
                                  <CodeBlock codeData={rowData.value} />
                                ) : (
                                  <div className="graph-pane__row-value">
                                    {rowData.type === STEP_FIELD_TYPES.COPY ? (
                                      <CopyToClipboard
                                        className="graph-pane__row-value__copy-to-clipboard"
                                        textToCopy={rowData.value}
                                        tooltipText="Click to copy"
                                      >
                                        {rowData.value}
                                      </CopyToClipboard>
                                    ) : (
                                      <Tooltip
                                        template={
                                          <TextTooltipTemplate text={rowData.value || ''} />
                                        }
                                      >
                                        {rowData.value || ''}
                                      </Tooltip>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                        )}
                      </div>
                      {Object.keys(selectedStepData.subItemsData?.items).length > 0 && (
                        <div className="graph-pane__section">
                          <div className="graph-pane__section-title">
                            {selectedStepData.subItemsData.itemsTitle} (
                            {Object.keys(selectedStepData.subItemsData.items).length})
                          </div>
                          {Object.entries(selectedStepData.subItemsData?.items).map(
                            ([itemName, itemData]) => (
                              <Accordion
                                key={itemName}
                                accordionClassName="graph-pane__expand-item"
                                icon={<Arrow />}
                                iconClassName="graph-pane__expand-icon"
                              >
                                <div className="graph-pane__expand-title">{itemName}</div>
                                <div className="graph-pane__expand-content">
                                  {itemData.map(rowData => {
                                    return (
                                      <div className="graph-pane__row" key={rowData.label}>
                                        <div className="graph-pane__row-label">{rowData.label}</div>
                                        <div
                                          className="graph-pane__row-value"
                                          onClick={
                                            rowData.type === STEP_FIELD_TYPES.POP_UP
                                              ? () => openModelPopUp(rowData)
                                              : null
                                          }
                                        >
                                          <Tooltip
                                            template={
                                              <TextTooltipTemplate text={rowData.value || ''} />
                                            }
                                            className={classnames({
                                              link: rowData.type === STEP_FIELD_TYPES.POP_UP
                                            })}
                                          >
                                            {rowData.value || ''}
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
                </Panel>
              )}
            </Group>
          </div>
        )
      ) : (
        !isPipelineLoading && (
          <NoData message="The ingestion function has no steps and therefore no graph" />
        )
      )}
    </div>
  )
}

DetailsPipeline.propTypes = {
  selectedItem: PropTypes.object.isRequired
}

// wrapped in provider to have access to react flow context in pipeline component
const PipelineWrapper = props => {
  return (
    <ReactFlowProvider>
      <DetailsPipeline {...props} />
    </ReactFlowProvider>
  )
}

export default React.memo(PipelineWrapper)
