import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { forEach, map, concat } from 'lodash'

import MlReactFlow from '../../common/ReactFlow/MlReactFlow'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'

import { getLayoutedElements } from '../../common/ReactFlow/mlReactFlow.util'

import { ReactComponent as Back } from '../../images/back-arrow.svg'

import './pipeline.scss'

const Pipeline = ({ content, match }) => {
  const graphViewClassNames = classnames('graph-view')
  const [elements, setElements] = useState([])
  const [pipeline, setPipeline] = useState({})

  useEffect(() => {
    setPipeline(
      content.find(contentItem => contentItem.hash === match.params.pipelineId)
    )
  }, [content, match.params.pipelineId])

  useEffect(() => {
    const graph = pipeline?.graph
    const steps = graph?.routes || graph?.steps

    if (steps) {
      let mainRouterStepId = ''
      const nodes = []
      const edgesMap = {}
      const errorsMap = {}

      if (graph.kind === 'router') {
        mainRouterStepId = graph.class_args?.name || 'router'

        nodes.push({
          id: mainRouterStepId,
          data: {
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
          data: {
            label: stepName,
            subLabel: subLabel
          },
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
              data: { label: routeInnerName },
              position: { x: 0, y: 0 }
            })

            edgesMap[routeInnerName] = stepName
          })
        }
      })

      const nodesEdges = map(edgesMap, (source, target) => {
        return {
          id: `e.${source}.${target}`,
          source: source,
          target: target,
          type: 'smoothstep',
          animated: false,
          arrowHeadType: 'arrowclosed'
        }
      })

      const errorEdges = map(errorsMap, (target, source) => {
        const errorHandlerElement = nodes.find(node => node.id === target)
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
    }
  }, [pipeline])

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
      <div className="pipeline-content">
        <div className={graphViewClassNames}>
          <MlReactFlow elements={elements} />
        </div>
      </div>
    </div>
  )
}

Pipeline.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default React.memo(Pipeline)
