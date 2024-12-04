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
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import WorkflowsTable from '../../../elements/WorkflowsTable/WorkflowsTable'

import { MONITOR_WORKFLOWS_TAB, REQUEST_CANCELED } from '../../../constants'
import { fetchInitialWorkflows, monitorWorkflowsActionCreator } from './monitorWorkflows.util'
import { JobsContext } from '../Jobs'
import { createJobsWorkflowsTabContent } from '../../../utils/createJobsContent'
import { setFilters } from '../../../reducers/filtersReducer'
import { useMode } from '../../../hooks/mode.hook'
import { usePods } from '../../../hooks/usePods.hook'
import detailsActions from '../../../actions/details'

import './monitorWorkflows.scss'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { deleteWorkflows } from '../../../reducers/workflowReducer'

const MonitorWorkflows = ({ fetchFunctionLogs }) => {
  const [selectedFunction, setSelectedFunction] = useState({})
  const [workflowsAreLoaded, setWorkflowsAreLoaded] = useState(false)
  const [workflowIsLoaded, setWorkflowIsLoaded] = useState(false)
  const [itemIsSelected, setItemIsSelected] = useState(false)
  const [selectedJob, setSelectedJob] = useState({})
  const workflowsStore = useSelector(state => state.workflowsStore)
  const params = useParams()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
  const {
    abortControllerRef,
    abortJobRef,
    dateFilter,
    getWorkflows,
    requestErrorMessage,
    tabData,
    workflowsFiltersConfig
  } = React.useContext(JobsContext)
  const workflowsAreInitializedRef = useRef(false)

  const filters = useFiltersFromSearchParams(
    tabData[MONITOR_WORKFLOWS_TAB]?.filtersConfig,
    tabData[MONITOR_WORKFLOWS_TAB]?.parseQueryParamsCallback
  )

  usePods(dispatch, detailsActions.fetchJobPods, detailsActions.removePods, selectedJob)

  const tableContent = useMemo(
    () =>
      createJobsWorkflowsTabContent(
        workflowsStore.workflows.data,
        params.projectName,
        isStagingMode,
        !isEmpty(selectedJob)
      ),
    [isStagingMode, params.projectName, selectedJob, workflowsStore.workflows.data]
  )

  useEffect(() => {
    const abortControllerRefCurrent = abortControllerRef.current

    return () => {
      setWorkflowIsLoaded(false)
      setWorkflowsAreLoaded(false)
      setItemIsSelected(false)
      setSelectedJob({})
      setSelectedFunction({})
      abortControllerRefCurrent.abort(REQUEST_CANCELED)
      workflowsAreInitializedRef.current = false
    }
  }, [abortControllerRef, params.projectName, params.workflowId])

  useEffect(() => {
    return () => {
      dispatch(deleteWorkflows())
      setWorkflowsAreLoaded(false)
    }
  }, [dispatch])

  useEffect(() => {
    fetchInitialWorkflows(
      filters,
      params,
      getWorkflows,
      setFilters,
      dispatch,
      workflowsAreInitializedRef
    )
  }, [dispatch, getWorkflows, workflowsAreLoaded, params, dateFilter, filters])

  return (
    <>
      <div className="monitor-workflows">
        {!params.workflowId && (
          <p className="monitor-workflows__subtitle">
            View running workflows and previously executed workflows
          </p>
        )}
      </div>
      <WorkflowsTable
        backLink={`/projects/${params.projectName}/jobs/${MONITOR_WORKFLOWS_TAB}${window.location.search}`}
        context={JobsContext}
        fetchFunctionLogs={fetchFunctionLogs}
        filters={filters}
        filtersConfig={workflowsFiltersConfig}
        getWorkflows={getWorkflows}
        itemIsSelected={itemIsSelected}
        ref={{ abortJobRef }}
        requestErrorMessage={requestErrorMessage}
        selectedFunction={selectedFunction}
        selectedJob={selectedJob}
        setItemIsSelected={setItemIsSelected}
        setSelectedFunction={setSelectedFunction}
        setSelectedJob={setSelectedJob}
        setWorkflowIsLoaded={setWorkflowIsLoaded}
        tableContent={tableContent}
        workflowIsLoaded={workflowIsLoaded}
      />
    </>
  )
}

MonitorWorkflows.propTypes = {}

export default connect(null, {
  ...monitorWorkflowsActionCreator
})(React.memo(MonitorWorkflows))
