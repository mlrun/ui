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
import { ProjectJobsMonitoringContext } from '../ProjectsJobsMonitoring'
import Loader from '../../../common/Loader/Loader'

import {
  JOBS_MONITORING_PAGE,
  JOBS_MONITORING_WORKFLOWS_TAB,
  REQUEST_CANCELED
} from '../../../constants'
import { createWorkflowsMonitoringContent } from '../../../utils/createJobsContent'
import { useMode } from '../../../hooks/mode.hook'
import { usePods } from '../../../hooks/usePods.hook'
import detailsActions from '../../../actions/details'
import workflowsActions from '../../../actions/workflow'
import { actionCreator } from './workflowsMonitoring.util'

const WorkflowsMonitoring = ({ fetchFunctionLogs }) => {
  const [selectedFunction, setSelectedFunction] = useState({})
  const [workflowsAreLoaded, setWorkflowsAreLoaded] = useState(false)
  const [workflowIsLoaded, setWorkflowIsLoaded] = useState(false)
  const [itemIsSelected, setItemIsSelected] = useState(false)
  const [selectedJob, setSelectedJob] = useState({})
  const workflowsStore = useSelector(state => state.workflowsStore)
  const [workflowsFilterMenu, workflowsFilterMenuModal] = useSelector(state => [
    state.filtersStore.filterMenu[JOBS_MONITORING_WORKFLOWS_TAB],
    state.filtersStore.filterMenuModal[JOBS_MONITORING_WORKFLOWS_TAB]
  ])
  const jobIsLoading = useSelector(store => store.jobsStore.loading)
  const funcIsLoading = useSelector(store => store.functionsStore.funcLoading)
  const params = useParams()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
  const abortControllerRef = useRef(new AbortController())

  const { abortJobRef, getWorkflows, requestErrorMessage, workflowsFiltersConfig } =
    React.useContext(ProjectJobsMonitoringContext)

  usePods(dispatch, detailsActions.fetchJobPods, detailsActions.removePods, selectedJob)

  const tableContent = useMemo(
    () =>
      createWorkflowsMonitoringContent(
        workflowsStore.workflows.data,
        isStagingMode,
        !isEmpty(selectedJob)
      ),
    [isStagingMode, selectedJob, workflowsStore.workflows.data]
  )

  useEffect(() => {
    const abortControllerRefCurrent = abortControllerRef.current

    return () => {
      setWorkflowIsLoaded(false)
      setWorkflowsAreLoaded(false)
      setItemIsSelected(false)
      setSelectedJob({})
      setSelectedFunction({})
      abortControllerRefCurrent?.abort(REQUEST_CANCELED)
    }
  }, [params.workflowId])

  useEffect(() => {
    return () => {
      dispatch(workflowsActions.deleteWorkflows())
      setWorkflowsAreLoaded(false)
    }
  }, [dispatch])

  useEffect(() => {
    if (!workflowsAreLoaded && !params.workflowId) {
      getWorkflows({
        ...workflowsFilterMenu,
        ...workflowsFilterMenuModal.values
      })

      setWorkflowsAreLoaded(true)
    }
  }, [
    workflowsFilterMenu,
    workflowsFilterMenuModal,
    getWorkflows,
    params.workflowId,
    workflowsAreLoaded,
    workflowsStore.workflows.data.length
  ])

  return (
    <>
      {(jobIsLoading || funcIsLoading || workflowsStore.activeWorkflow.loading) && <Loader />}
      <WorkflowsTable
        backLink={`/projects/${JOBS_MONITORING_PAGE}/${JOBS_MONITORING_WORKFLOWS_TAB}`}
        context={ProjectJobsMonitoringContext}
        fetchFunctionLogs={fetchFunctionLogs}
        filterMenuName={JOBS_MONITORING_WORKFLOWS_TAB}
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

export default connect(null, { ...actionCreator })(WorkflowsMonitoring)
