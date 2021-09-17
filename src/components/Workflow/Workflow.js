import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { isEmpty, map } from 'lodash'

import Details from '../Details/Details'
import MlReactFlow from '../../common/ReactFlow/MlReactFlow'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'
import YamlModal from '../../common/YamlModal/YamlModal'

import { generateContentActionsMenu } from '../../layout/Content/content.util'
import { getLayoutedElements } from '../../common/ReactFlow/mlReactFlow.util'
import { getWorkflowDetailsLink } from './workflow.util'
import { useYaml } from '../../hooks/yaml.hook'

import { ReactComponent as Back } from '../../images/back-arrow.svg'
import { ReactComponent as ListView } from '../../images/listview.svg'
import { ReactComponent as Pipelines } from '../../images/pipelines.svg'
import { ReactComponent as Yaml } from '../../images/yaml.svg'

import './workflow.scss'

const Workflow = ({
  fetchWorkflow,
  handleCancel,
  history,
  match,
  pageData,
  refreshJobs,
  selectedJob
}) => {
  const graphViewClassNames = classnames(
    'graph-view',
    selectedJob.uid && 'with-selected-job'
  )
  const workflowContainerClassNames = classnames(
    'workflow-container',
    selectedJob.uid && 'with-selected-job'
  )
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [workflow, setWorkflow] = useState({})
  const [elements, setElements] = useState([])
  const [viewMode, setViewMode] = useState('graph')

  const actionsMenu = useMemo(() => {
    return generateContentActionsMenu(pageData.actionsMenu, [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ])
  }, [pageData.actionsMenu, toggleConvertedYaml])

  useEffect(() => {
    if (!workflow.graph) {
      fetchWorkflow(match.params.workflowId).then(workflow => {
        setWorkflow(workflow)
      })
    }
  }, [fetchWorkflow, match.params.workflowId, workflow.graph])

  useEffect(() => {
    const edges = []
    const nodes = map(workflow.graph, job => {
      let nodeItem = {
        id: job.id,
        data: {
          label: job.name,
          run_uid: job.run_uid
        },
        className: classnames(
          job.run_uid && selectedJob.uid === job.run_uid && 'selected',
          job.run_uid && 'selectable'
        ),
        position: { x: 0, y: 0 }
      }

      job.children.forEach(childId => {
        edges.push({
          id: `e.${job.id}.${childId}`,
          source: job.id,
          target: childId,
          type: 'smoothstep',
          animated: false,
          arrowHeadType: 'arrowclosed'
        })
      })

      return nodeItem
    })

    setElements(getLayoutedElements(nodes.concat(edges)))
  }, [selectedJob.uid, workflow])

  return (
    <div className={workflowContainerClassNames}>
      <div className="workflow-header">
        <div className="link-back">
          <Link
            to={`/projects/${match.params.projectName}/jobs/${match.params.pageTab}`}
            className="link-back__icon"
          >
            <Back />
          </Link>
          <div className="link-back__title">
            <Tooltip
              template={<TextTooltipTemplate text={workflow?.run?.name} />}
            >
              {workflow?.run?.name}
            </Tooltip>
          </div>
        </div>
        <div className="actions">
          <Tooltip
            template={
              <TextTooltipTemplate
                text={
                  viewMode === 'graph'
                    ? 'Switch to list view'
                    : 'Switch to graph view'
                }
              />
            }
          >
            <button
              className="toggle-view-btn"
              onClick={() =>
                setViewMode(viewMode === 'graph' ? 'list' : 'graph')
              }
            >
              {viewMode === 'graph' ? <ListView /> : <Pipelines />}
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="workflow-content">
        {viewMode === 'graph' ? (
          <div className={graphViewClassNames}>
            <MlReactFlow
              elements={elements}
              alignTriggerItem={match.params.jobId}
              onElementClick={(event, element) => {
                if (element?.data.run_uid) {
                  history.push(
                    getWorkflowDetailsLink({
                      match,
                      id: element.data.run_uid,
                      tab: { id: match.params.tab || 'overview' }
                    })
                  )
                }
              }}
            />
          </div>
        ) : (
          <div className="list-view">
            {Object.entries(workflow.graph).map(([id, jobData]) => {
              const listViewRowClassNames = classnames(
                'list-view__row',
                jobData.run_uid &&
                  selectedJob.uid === jobData.run_uid &&
                  'list-view__row_selected',
                jobData.run_uid && 'list-view__row_selectable'
              )

              return (
                <div
                  key={id}
                  className={listViewRowClassNames}
                  onClick={(event, element) => {
                    if (jobData.run_uid) {
                      history.push(
                        getWorkflowDetailsLink({
                          match,
                          id: jobData.run_uid,
                          tab: { id: match.params.tab || 'overview' }
                        })
                      )
                    }
                  }}
                >
                  <Tooltip
                    template={<TextTooltipTemplate text={jobData.name} />}
                  >
                    {jobData.name}
                  </Tooltip>
                </div>
              )
            })}
          </div>
        )}
        {!isEmpty(selectedJob) && (
          <Details
            actionsMenu={actionsMenu}
            detailsMenu={pageData.detailsMenu}
            handleCancel={handleCancel}
            match={match}
            pageData={pageData}
            retryRequest={refreshJobs}
            selectedItem={selectedJob}
          />
        )}
        <YamlModal
          convertedYaml={convertedYaml}
          toggleConvertToYaml={toggleConvertedYaml}
        />
      </div>
    </div>
  )
}

Workflow.propTypes = {
  fetchWorkflow: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  refreshJobs: PropTypes.func.isRequired,
  selectedJob: PropTypes.shape({}).isRequired
}

export default React.memo(Workflow)
