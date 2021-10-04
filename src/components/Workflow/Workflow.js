import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { isEmpty, map, intersectionWith } from 'lodash'

import Details from '../Details/Details'
import MlReactFlow from '../../common/ReactFlow/MlReactFlow'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'
import YamlModal from '../../common/YamlModal/YamlModal'
import Table from '../Table/Table'

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
  content,
  fetchWorkflow,
  handleCancel,
  handleSelectItem,
  history,
  match,
  pageData,
  refresh,
  refreshJobs,
  selectedJob,
  setLoading
}) => {
  const graphViewClassNames = classnames(
    'graph-view',
    selectedJob.uid && 'with-selected-job'
  )
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [jobIsSelected, setJobIsSelected] = useState(false)
  const [jobsContent, setJobsContent] = useState([])
  const [workflow, setWorkflow] = useState({})
  const [workflowJobsIds, setWorkflowJobsIds] = useState([])
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
        setWorkflowJobsIds(
          Object.values(workflow.graph).map(jobData => jobData.run_uid)
        )
      })
    }
  }, [fetchWorkflow, match.params.workflowId, workflow.graph])

  useEffect(() => {
    if (workflowJobsIds.length > 0 && content.length > 0) {
      setJobsContent(
        intersectionWith(
          content,
          workflowJobsIds,
          (contentItem, jobId) => contentItem.uid === jobId
        )
      )
    }
  }, [content, workflowJobsIds])

  useEffect(() => {
    setJobIsSelected(Boolean(match.params.jobId))
  }, [match.params.jobId])

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

  const getCloseDetailsLink = location => {
    const urlArray = location.pathname.split('/')
    return urlArray.slice(0, -2).join('/')
  }

  return (
    <div className="workflow-container">
      <div className="workflow-header">
        <div className="link-back">
          <Link
            to={`/projects/${match.params.projectName}/jobs/${match.params.pageTab}`}
            className="link-back__icon"
          >
            <Tooltip template={<TextTooltipTemplate text="Back" />}>
              <Back />
            </Tooltip>
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
          <>
            <div className={graphViewClassNames}>
              <MlReactFlow
                elements={elements}
                alignTriggerItem={jobIsSelected}
                onElementClick={(event, element) => {
                  if (element?.data.run_uid) {
                    history.push(
                      getWorkflowDetailsLink(
                        match.params,
                        null,
                        element.data.run_uid
                      )
                    )
                  }
                }}
              />
              {!isEmpty(selectedJob) && (
                <Details
                  actionsMenu={actionsMenu}
                  detailsMenu={pageData.detailsMenu}
                  getCloseDetailsLink={getCloseDetailsLink}
                  handleCancel={handleCancel}
                  match={match}
                  pageData={pageData}
                  retryRequest={refreshJobs}
                  selectedItem={selectedJob}
                />
              )}
            </div>
          </>
        ) : (
          <Table
            actionsMenu={actionsMenu}
            content={jobsContent}
            getCloseDetailsLink={getCloseDetailsLink}
            handleCancel={handleCancel}
            handleSelectItem={handleSelectItem}
            match={match}
            pageData={pageData}
            retryRequest={refresh}
            selectedItem={selectedJob}
            setLoading={setLoading}
          />
        )}

        {convertedYaml.length > 0 && (
          <YamlModal
            convertedYaml={convertedYaml}
            toggleConvertToYaml={toggleConvertedYaml}
          />
        )}
      </div>
    </div>
  )
}

Workflow.defaultProps = {
  setLoading: null
}

Workflow.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchWorkflow: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  refresh: PropTypes.func.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  selectedJob: PropTypes.shape({}).isRequired,
  setLoading: PropTypes.func
}

export default React.memo(Workflow)
