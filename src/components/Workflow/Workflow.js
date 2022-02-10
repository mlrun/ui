import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { forEach, isEmpty, intersectionWith } from 'lodash'

import Details from '../Details/Details'
import MlReactFlow from '../../common/ReactFlow/MlReactFlow'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'
import Table from '../Table/Table'
import TableTop from '../../elements/TableTop/TableTop'

import {
  getLayoutedElements,
  getWorkflowSourceHandle
} from '../../common/ReactFlow/mlReactFlow.util'
import { getWorkflowDetailsLink } from './workflow.util'
import functionsActions from '../../actions/functions'
import { page } from '../Jobs/jobs.util'
import { ACTIONS_MENU } from '../../types'
import {
  DEFAULT_EDGE,
  DETAILS_OVERVIEW_TAB,
  ML_EDGE,
  ML_NODE,
  PRIMARY_NODE
} from '../../constants'
import { getCloseDetailsLink } from '../../utils/getCloseDetailsLink'

import { ReactComponent as ListView } from '../../images/listview.svg'
import { ReactComponent as Pipelines } from '../../images/pipelines.svg'

import './workflow.scss'

const Workflow = ({
  actionsMenu,
  content,
  handleCancel,
  handleSelectItem,
  history,
  itemIsSelected,
  match,
  pageData,
  refresh,
  refreshJobs,
  selectedFunction,
  selectedJob,
  setWorkflowsViewMode,
  workflow,
  workflowJobsIds,
  workflowsViewMode
}) => {
  const [jobsContent, setJobsContent] = useState([])
  const [elements, setElements] = useState([])

  const graphViewClassNames = classnames(
    'graph-view',
    (selectedJob?.uid || selectedFunction?.hash) && 'with-selected-job'
  )

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
    const edges = []
    const nodes = []

    forEach(workflow.graph, job => {
      if (job.type === 'DAG') return

      let nodeItem = {
        id: job.id,
        type: ML_NODE,
        data: {
          subType: PRIMARY_NODE,
          label: job.name,
          isSelectable: Boolean(
            job.run_uid ||
              ((job.run_type === 'deploy' || job.run_type === 'build') &&
                job.function)
          ),
          sourceHandle: getWorkflowSourceHandle(job.phase),
          customData: {
            function: job.function,
            run_uid: job.run_uid,
            run_type: job.run_type
          }
        },
        className: classnames(
          ((job.run_uid && selectedJob.uid === job.run_uid) ||
            (job.run_type === 'deploy' &&
              job.function.includes(selectedFunction.hash)) ||
            (job.run_type === 'build' &&
              job.function.includes(selectedFunction.name))) &&
            'selected'
        ),
        position: { x: 0, y: 0 }
      }

      job.children.forEach(childId => {
        edges.push({
          id: `e.${job.id}.${childId}`,
          type: ML_EDGE,
          data: {
            subType: DEFAULT_EDGE,
            isSelectable: true
          },
          source: job.id,
          target: childId
        })
      })

      nodes.push(nodeItem)
    })

    setElements(getLayoutedElements(nodes.concat(edges)))
  }, [
    selectedFunction.hash,
    selectedFunction.name,
    selectedJob.uid,
    workflow.graph
  ])

  const onElementClick = (event, element) => {
    if (element.data?.customData?.run_uid) {
      history.push(
        getWorkflowDetailsLink(
          match.params,
          null,
          element.data.customData.run_uid
        )
      )
    } else if (
      (element.data?.customData?.run_type === 'deploy' ||
        element.data?.customData?.run_type === 'build') &&
      element.data?.customData?.function
    ) {
      const funcName = element.data.customData.function.includes('@')
        ? element.data.customData.function.match(/\/(.*?)@/i)[1]
        : element.data.customData.function.match(/\/(.*)/i)[1]
      const funcHash = element.data.customData.function.includes('@')
        ? element.data.customData.function.replace(/.*@/g, '')
        : 'latest'
      const link = `/projects/${
        match.params.projectName
      }/${page.toLowerCase()}/${match.params.pageTab}/workflow/${
        match.params.workflowId
      }/${funcName}/${funcHash}/${DETAILS_OVERVIEW_TAB}`

      history.push(link)
    }
  }

  return (
    <div className="workflow-container">
      <TableTop
        link={`/projects/${match.params.projectName}/jobs/${match.params.pageTab}`}
        text={workflow?.run?.name}
      >
        <div className="actions">
          <Tooltip
            template={
              <TextTooltipTemplate
                text={
                  workflowsViewMode === 'graph'
                    ? 'Switch to list view'
                    : 'Switch to graph view'
                }
              />
            }
          >
            <button
              className="toggle-view-btn"
              onClick={() =>
                setWorkflowsViewMode(
                  workflowsViewMode === 'graph' ? 'list' : 'graph'
                )
              }
            >
              {workflowsViewMode === 'graph' ? <ListView /> : <Pipelines />}
            </button>
          </Tooltip>
        </div>
      </TableTop>
      <div className="graph-container workflow-content">
        {workflowsViewMode === 'graph' ? (
          <>
            <div className={graphViewClassNames}>
              <MlReactFlow
                elements={elements}
                alignTriggerItem={itemIsSelected}
                onElementClick={onElementClick}
              />
              {itemIsSelected && (
                <Details
                  actionsMenu={actionsMenu}
                  detailsMenu={pageData.details.menu}
                  getCloseDetailsLink={() =>
                    getCloseDetailsLink(match, 'workflowId')
                  }
                  handleCancel={handleCancel}
                  match={match}
                  pageData={pageData}
                  retryRequest={refreshJobs}
                  selectedItem={
                    !isEmpty(selectedFunction) ? selectedFunction : selectedJob
                  }
                />
              )}
            </div>
          </>
        ) : (
          <Table
            actionsMenu={actionsMenu}
            content={jobsContent}
            getCloseDetailsLink={() => getCloseDetailsLink(match, 'workflowId')}
            handleCancel={handleCancel}
            handleSelectItem={handleSelectItem}
            match={match}
            pageData={pageData}
            retryRequest={refresh}
            selectedItem={selectedJob}
          />
        )}
      </div>
    </div>
  )
}

Workflow.defaultProps = {
  selectedFunction: {},
  selectedJob: {},
  workflow: {},
  workflowJobsIds: []
}

Workflow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  itemIsSelected: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  refresh: PropTypes.func.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  selectedFunction: PropTypes.shape({}),
  selectedJob: PropTypes.shape({}),
  setWorkflowsViewMode: PropTypes.func.isRequired,
  workflow: PropTypes.shape({}),
  workflowJobsIds: PropTypes.arrayOf(PropTypes.string),
  workflowsViewMode: PropTypes.string.isRequired
}

export default connect(null, { ...functionsActions })(React.memo(Workflow))
