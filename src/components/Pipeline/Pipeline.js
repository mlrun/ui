import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { find, forEach, map, concat } from 'lodash'

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
    const steps = pipeline?.graph?.routes || pipeline?.graph?.steps

    if (steps) {
      const nodes = []
      const edgesMap = {}
      const errorsMap = {}

      forEach(steps, (route, routeName) => {
        let subLabel =
          route.kind === 'queue'
            ? 'queue'
            : route.kind === 'router'
            ? 'router'
            : ''

        nodes.push({
          id: routeName,
          data: {
            label: routeName,
            subLabel: subLabel
          },
          position: { x: 0, y: 0 }
        })

        if (route.after) {
          edgesMap[routeName] = route.after[0]
        }

        if (route.on_error) {
          errorsMap[routeName] = route.on_error
        }

        if (route.kind === 'router' && route.routes) {
          forEach(route.routes, (routeInner, routeInnerName) => {
            nodes.push({
              id: routeInnerName,
              data: { label: routeInnerName },
              position: { x: 0, y: 0 }
            })

            edgesMap[routeInnerName] = routeName
          })
        }
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
    }
  }, [pipeline])

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
            <Tooltip
              template={
                <TextTooltipTemplate
                  text={pipeline?.nuclio_name || pipeline?.name}
                />
              }
            >
              {pipeline?.nuclio_name || pipeline?.name}
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
