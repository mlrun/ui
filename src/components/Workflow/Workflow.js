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
import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { forEach, isEmpty, intersectionWith } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Details from '../Details/Details'
import MlReactFlow from '../../common/ReactFlow/MlReactFlow'
import Table from '../Table/Table'
import TableTop from '../../elements/TableTop/TableTop'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import JobsTableRow from '../../elements/JobsTableRow/JobsTableRow'

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
  MONITOR_WORKFLOWS_TAB,
  PRIMARY_NODE,
  WORKFLOW_GRAPH_VIEW,
  WORKFLOW_LIST_VIEW
} from '../../constants'
import { getCloseDetailsLink } from '../../utils/getCloseDetailsLink'
import { createJobsWorkflowsTabContent } from '../../utils/createJobsContent'
import { useMode } from '../../hooks/mode.hook'

import { ReactComponent as ListView } from 'igz-controls/images/listview.svg'
import { ReactComponent as Pipelines } from 'igz-controls/images/pipelines.svg'

import './workflow.scss'

const Workflow = ({
  actionsMenu,
  content,
  handleCancel,
  handleSelectItem,
  itemIsSelected,
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
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { isStagingMode } = useMode()

  const graphViewClassNames = classnames(
    'graph-view',
    (selectedJob?.uid || selectedFunction?.hash) && 'with-selected-job'
  )

  const tableContent = useMemo(
    () =>
      createJobsWorkflowsTabContent(
        jobsContent,
        params.projectName,
        params.workflowId,
        isStagingMode,
        !isEmpty(selectedJob)
      ),
    [isStagingMode, jobsContent, params.projectName, params.workflowId, selectedJob]
  )

  useEffect(() => {
    if (workflowsViewMode === WORKFLOW_LIST_VIEW) {
      let closeDetailsPanel = false

      if (!isEmpty(selectedFunction)) {
        closeDetailsPanel = !tableContent.find(
          contentItem => contentItem.data?.hash === selectedFunction.hash
        )
      } else if (!isEmpty(selectedJob)) {
        closeDetailsPanel = !tableContent.find(
          contentItem => contentItem.data?.uid === selectedJob.uid
        )
      }

      if (closeDetailsPanel) {
        navigate(getCloseDetailsLink(location, params.workflowId))
      }
    }
  }, [
    location,
    navigate,
    params.workflowId,
    selectedFunction,
    selectedJob,
    tableContent,
    workflowsViewMode
  ])

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
      const sourceHandle = getWorkflowSourceHandle(job.phase)

      if (job.type === 'DAG') return

      let nodeItem = {
        id: job.id,
        type: ML_NODE,
        data: {
          customData: {
            function: job.function,
            run_uid: job.run_uid,
            run_type: job.run_type
          },
          isSelectable: Boolean(
            job.run_uid ||
              ((job.run_type === 'deploy' || job.run_type === 'build') &&
                job.function &&
                job.function.includes('@'))
          ),
          label: job.name,
          sourceHandle,
          subType: PRIMARY_NODE
        },
        className: classnames(
          ((job.run_uid && selectedJob.uid === job.run_uid) ||
            (job.run_type === 'deploy' && job.function.includes(selectedFunction.hash)) ||
            (job.run_type === 'build' && job.function.includes(selectedFunction.name))) &&
            `${sourceHandle.className} selected`
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
  }, [selectedFunction.hash, selectedFunction.name, selectedJob.uid, workflow.graph])

  const onElementClick = (event, element) => {
    if (element.data?.customData?.run_uid) {
      navigate(
        getWorkflowDetailsLink(
          params.projectName,
          params.workflowId,
          null,
          element.data.customData.run_uid,
          null,
          MONITOR_WORKFLOWS_TAB
        )
      )
    } else if (
      (element.data?.customData?.run_type === 'deploy' ||
        element.data?.customData?.run_type === 'build') &&
      element.data?.customData?.function &&
      element.data?.customData?.function.includes('@')
    ) {
      const funcName = element.data.customData.function.match(/\/(.*?)@/i)[1]
      const funcHash = element.data.customData.function.replace(/.*@/g, '')

      const link = `/projects/${
        params.projectName
      }/${page.toLowerCase()}/${MONITOR_WORKFLOWS_TAB}/workflow/${
        params.workflowId
      }/${funcName}/${funcHash}/${DETAILS_OVERVIEW_TAB}`

      navigate(link)
    }
  }

  return (
    <div className="workflow-container">
      <TableTop
        link={`/projects/${params.projectName}/jobs/${MONITOR_WORKFLOWS_TAB}`}
        text={workflow?.run?.name.replace(`${params.projectName}-`, '')}
      >
        <div className="actions">
          <Tooltip
            template={
              <TextTooltipTemplate
                text={
                  workflowsViewMode === WORKFLOW_GRAPH_VIEW
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
                  workflowsViewMode === WORKFLOW_GRAPH_VIEW ? WORKFLOW_LIST_VIEW : 'graph'
                )
              }
            >
              {workflowsViewMode === WORKFLOW_GRAPH_VIEW ? <ListView /> : <Pipelines />}
            </button>
          </Tooltip>
        </div>
      </TableTop>
      <div className="graph-container workflow-content">
        {workflowsViewMode === WORKFLOW_GRAPH_VIEW ? (
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
                  getCloseDetailsLink={() => getCloseDetailsLink(location, params.workflowId)}
                  handleCancel={handleCancel}
                  pageData={pageData}
                  retryRequest={refreshJobs}
                  selectedItem={!isEmpty(selectedFunction) ? selectedFunction : selectedJob}
                  tab={MONITOR_WORKFLOWS_TAB}
                />
              )}
            </div>
          </>
        ) : (
          <Table
            actionsMenu={actionsMenu}
            content={jobsContent}
            getCloseDetailsLink={() => getCloseDetailsLink(location, params.workflowId)}
            handleCancel={handleCancel}
            handleSelectItem={handleSelectItem}
            pageData={pageData}
            retryRequest={refresh}
            selectedItem={selectedJob}
            tableHeaders={tableContent[0]?.content ?? []}
          >
            {tableContent.map((tableItem, index) => (
              <JobsTableRow
                actionsMenu={actionsMenu}
                handleSelectJob={handleSelectItem}
                key={index}
                rowItem={tableItem}
                selectedJob={selectedJob}
              />
            ))}
          </Table>
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
  itemIsSelected: PropTypes.bool.isRequired,
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
