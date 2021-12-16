import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { groupBy, forEach, map, concat } from 'lodash'

import MlReactFlow from '../../common/ReactFlow/MlReactFlow'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'
import CodeBlock from '../../common/CodeBlock/CodeBlock'
import RoundedIcon from '../../common/RoundedIcon/RoundedIcon'

import {
  ERROR_NODE,
  ML_NODE,
  PRIMARY_NODE,
  SECONDARY_NODE
} from '../../constants'
import { getLayoutedElements } from '../../common/ReactFlow/mlReactFlow.util'

import { ReactComponent as Back } from '../../images/back-arrow.svg'
import { ReactComponent as CloseIcon } from '../../images/close.svg'

import './pipeline.scss'

const Pipeline = ({ content, match }) => {
  const graphViewClassNames = classnames('graph-view')
  const [elements, setElements] = useState([])
  const [pipeline, setPipeline] = useState({})
  const [selectedStep, setSelectedStep] = useState({})
  const [selectedStepData, setSelectedStepData] = useState([])
  const [stepIsSelected, setStepIsSelected] = useState(false)

  useEffect(() => {
    setPipeline(
      content.find(contentItem => contentItem.hash === match.params.pipelineId)
    )
  }, [content, match.params.pipelineId])

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
      const nodes = []
      const edgesMap = {}
      const edgesRouterMap = []
      const errorsMap = {}

      if (graph.kind === 'router') {
        mainRouterStepId = graph.class_args?.name || 'router'

        nodes.push({
          id: mainRouterStepId,
          type: ML_NODE,
          data: {
            subType: PRIMARY_NODE,
            label: graph.class_args?.name ?? '',
            subLabel: '« router »'
          },
          position: { x: 0, y: 0 }
        })
      }

      forEach(steps, (step, stepName) => {
        const subLabel =
          step.kind === 'queue'
            ? '« queue »'
            : step.kind === 'router'
            ? '« router »'
            : ''

        nodes.push({
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

        if (step.after) {
          edgesMap[stepName] = step.after[0]
        }

        if (step.on_error) {
          errorsMap[stepName] = step.on_error
        }

        if (step.kind === 'router' && step.routes) {
          forEach(step.routes, (routeInner, routeInnerName) => {
            nodes.push({
              id: routeInnerName,
              type: ML_NODE,
              data: {
                subType: SECONDARY_NODE,
                label: routeInnerName,
                isSelectable: true,
                isOvalShape: true,
                isOpacity: true,
                customData: routeInner
              },
              className: classnames(
                selectedStep.id === routeInnerName && 'selected'
              ),
              position: { x: 0, y: 0 }
            })

            edgesRouterMap.push([routeInnerName, stepName])
            edgesRouterMap.push([stepName, routeInnerName])
          })
        }
      })

      const nodesRouterEdges = map(edgesRouterMap, ([source, target]) => {
        return {
          id: `e.${source}.${target}`,
          source: source,
          target: target,
          type: 'floating',
          animated: false,
          arrowHeadType: 'arrowclosed'
        }
      })

      const nodesEdges = map(edgesMap, (source, target) => {
        return {
          id: `e.${source}.${target}`,
          source: source,
          target: target,
          animated: false,
          arrowHeadType: 'arrowclosed'
        }
      })

      const errorEdges = map(errorsMap, (target, source) => {
        const errorHandlerElement = nodes.find(node => node.id === target)
        errorHandlerElement.data.subType = ERROR_NODE

        return {
          id: `e.${source}.${target}`,
          source: source,
          target: target,
          arrowHeadType: 'arrowclosed',
          animated: true
        }
      })

      const groupedNodesEdges = groupBy(nodesEdges, 'source')
      const sortedNodesEdges = []

      forEach(groupedNodesEdges, (edgesGroup, edgesSource) => {
        const filteredRouterEdges = nodesRouterEdges.filter(routerEdge => {
          return (
            routerEdge.source === edgesSource ||
            routerEdge.target === edgesSource
          )
        })

        if (filteredRouterEdges.length > 1) {
          const routerEdgesHalfLength = filteredRouterEdges.length / 2
          const routerEdgesFirstHalf = filteredRouterEdges.slice(
            0,
            routerEdgesHalfLength
          )
          const routerEdgesSecondHalf = filteredRouterEdges.slice(
            routerEdgesHalfLength
          )
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

      setElements(
        getLayoutedElements(concat(nodes, sortedNodesEdges, errorEdges))
      )
    }
  }, [pipeline, selectedStep])

  const linkBackTitle = pipeline?.nuclio_name || pipeline?.name

  return (
    <div className="pipeline-container">
      <div className="pipeline-header">
        <div className="link-back">
          <Link
            to={`/projects/${match.params.projectName}/models/${match.params.pageTab}`}
            className="link-back__icon"
          >
            <Tooltip template={<TextTooltipTemplate text="Back" />}>
              <Back />
            </Tooltip>
          </Link>
          <div className="link-back__title">
            <Tooltip template={<TextTooltipTemplate text={linkBackTitle} />}>
              {linkBackTitle}
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="graph-container pipeline-content">
        <div className={graphViewClassNames}>
          <MlReactFlow
            elements={elements}
            alignTriggerItem={stepIsSelected}
            onElementClick={(event, element) => {
              if (element.data?.customData) {
                setSelectedStep(element)
              }
            }}
          />
        </div>
        {stepIsSelected && (
          <div className="graph-pane">
            <div className="graph-pane__title">
              <span>{selectedStep.id}</span>
              <RoundedIcon
                onClick={() => setSelectedStep({})}
                tooltipText="Close"
              >
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
                    <div className="graph-pane__row-value">{rowData.value}</div>
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
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default React.memo(Pipeline)
