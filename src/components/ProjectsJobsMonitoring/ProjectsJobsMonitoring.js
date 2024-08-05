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
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import { ConfirmDialog } from 'igz-controls/components'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ActionBar from '../ActionBar/ActionBar'
import JobsMonitoringFilters from './JobsMonitoring/JobsMonitoringFilters'
import ScheduledMonitoringFilters from './ScheduledMonitoring/ScheduledMonitoringFilters'
import WorkflowsMonitoringFilters from './WorkflowsMonitoring/WorkflowsMonitoringFilters'

import { actionCreator, STATS_TOTAL_CARD, tabs } from './projectsJobsMotinoring.util'
import {
  DATES_FILTER,
  FILTER_ALL_ITEMS,
  GROUP_BY_WORKFLOW,
  JOB_KIND_LOCAL,
  JOBS_MONITORING_JOBS_TAB,
  JOBS_MONITORING_PAGE,
  JOBS_MONITORING_SCHEDULED_TAB,
  JOBS_MONITORING_WORKFLOWS_TAB,
  LABELS_FILTER,
  NAME_FILTER,
  PROJECT_FILTER,
  SCHEDULE_TAB,
  STATUS_FILTER,
  TYPE_FILTER
} from '../../constants'
import { monitorJob, pollAbortingJobs, rerunJob } from '../Jobs/jobs.util'
import { TERTIARY_BUTTON } from 'igz-controls/constants'
import { parseJob } from '../../utils/parseJob'
import jobsActions from '../../actions/jobs'
import workflowActions from '../../actions/workflow'

import './projectsJobsMonitoring.scss'

export const ProjectJobsMonitoringContext = React.createContext({})

const ProjectsJobsMonitoring = ({ fetchAllJobRuns, fetchJobFunction, fetchJobs }) => {
  const [abortingJobs, setAbortingJobs] = useState({})
  const [editableItem, setEditableItem] = useState(null)
  const [jobWizardMode, setJobWizardMode] = useState(null)
  const [jobWizardIsOpened, setJobWizardIsOpened] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const [selectedTab, setSelectedTab] = useState(null)
  const [scheduledJobs, setScheduledJobs] = useState([])
  const [jobRuns, setJobRuns] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedRunProject, setSelectedRunProject] = useState('')
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const { jobsMonitoringData } = useSelector(store => store.projectStore)
  const [selectedCard, setSelectedCard] = useState(
    jobsMonitoringData.filters?.status || STATS_TOTAL_CARD
  )
  const abortJobRef = useRef(null)
  const abortControllerRef = useRef(new AbortController())
  const dispatch = useDispatch()
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const appStore = useSelector(store => store.appStore)
  const artifactsStore = useSelector(store => store.artifactsStore)

  const jobsFiltersConfig = useMemo(() => {
    return {
      [NAME_FILTER]: { label: 'Name:', hidden: Boolean(params.jobName) },
      [DATES_FILTER]: { label: 'Start time:' },
      [PROJECT_FILTER]: { label: 'Project:' },
      [STATUS_FILTER]: { label: 'Status:' },
      [TYPE_FILTER]: { label: 'Type:' },
      [LABELS_FILTER]: { label: 'Labels:' }
    }
  }, [params.jobName])

  const workflowsFiltersConfig = useMemo(() => {
    return {
      [NAME_FILTER]: { label: 'Name:' },
      [DATES_FILTER]: { label: 'Created at:' },
      [PROJECT_FILTER]: { label: 'Project:' },
      [STATUS_FILTER]: { label: 'Status:' },
      [LABELS_FILTER]: { label: 'Labels:' }
    }
  }, [])

  const scheduledFiltersConfig = useMemo(() => {
    return {
      [NAME_FILTER]: { label: 'Name:' },
      [DATES_FILTER]: { label: 'Scheduled at:', isFuture: true },
      [PROJECT_FILTER]: { label: 'Project:' },
      [TYPE_FILTER]: { label: 'Type:' },
      [LABELS_FILTER]: { label: 'Labels:' }
    }
  }, [])

  const handleTabChange = tabName => {
    setSelectedCard(STATS_TOTAL_CARD)
    setSelectedTab(tabName)
    navigate(`/projects/${JOBS_MONITORING_PAGE}/${tabName}`)
  }

  const handleRerunJob = useCallback(
    async job => await rerunJob(job, fetchJobFunction, setEditableItem, setJobWizardMode, dispatch),
    [fetchJobFunction, dispatch]
  )

  const handleMonitoring = useCallback(
    item => {
      monitorJob(appStore.frontendSpec.jobs_dashboard_url, item, params.projectName)
    },
    [appStore.frontendSpec.jobs_dashboard_url, params.projectName]
  )

  const terminateAbortTasksPolling = useCallback(() => {
    abortJobRef?.current?.()
    setAbortingJobs({})
  }, [])

  const refreshJobs = useCallback(
    filters => {
      if (params.jobName) {
        setJobRuns([])
      } else {
        setJobs([])
      }

      abortControllerRef.current = new AbortController()

      terminateAbortTasksPolling()

      const fetchData = params.jobName ? fetchAllJobRuns : fetchJobs
      const newParams = !params.jobName && {
        'partition-by': 'project_and_name',
        'partition-sort-by': 'updated'
      }

      fetchData(
        params.jobName ? selectedRunProject || '*' : '*',
        filters,
        {
          ui: {
            controller: abortControllerRef.current,
            setRequestErrorMessage
          },
          params: { ...newParams }
        },
        params.jobName ?? false
      ).then(jobs => {
        if (jobs) {
          const parsedJobs = jobs
            .map(job => parseJob(job))
            .filter(job => {
              const type =
                job.labels?.find(label => label.includes('kind:'))?.replace('kind: ', '') ??
                JOB_KIND_LOCAL

              return (
                (!filters.type || filters.type === FILTER_ALL_ITEMS || type === filters.type) &&
                (!filters.project || job.project.includes(filters.project.toLowerCase()))
              )
            })
          const responseAbortingJobs = parsedJobs.reduce((acc, job) => {
            if (job.state.value === 'aborting' && job.abortTaskId) {
              acc[job.abortTaskId] = {
                uid: job.uid,
                name: job.name
              }
            }

            return acc
          }, {})

          if (Object.keys(responseAbortingJobs).length > 0) {
            setAbortingJobs(responseAbortingJobs)
            pollAbortingJobs(
              '*',
              abortJobRef,
              responseAbortingJobs,
              () => refreshJobs(filters),
              dispatch
            )
          }

          if (params.jobName) {
            setJobRuns(parsedJobs)
          } else {
            setJobs(parsedJobs)
          }
        }
      })
    },
    [
      dispatch,
      fetchAllJobRuns,
      fetchJobs,
      params.jobName,
      selectedRunProject,
      terminateAbortTasksPolling
    ]
  )

  const refreshScheduled = useCallback(
    filters => {
      setScheduledJobs([])
      abortControllerRef.current = new AbortController()

      dispatch(
        jobsActions.fetchScheduledJobs('*', filters, {
          ui: {
            controller: abortControllerRef.current,
            setRequestErrorMessage
          }
        })
      ).then(jobs => {
        if (jobs) {
          const parsedJobs = jobs
            .map(job => parseJob(job, SCHEDULE_TAB))
            .filter(job => {
              let inDateRange = true

              if (filters.dates) {
                const timeTo = filters.dates.value[1]?.getTime?.() || ''
                const timeFrom = filters.dates.value[0]?.getTime?.() || ''
                const nextRun = job.nextRun.getTime()

                if (timeFrom) {
                  inDateRange = nextRun >= timeFrom
                }

                if (timeTo && inDateRange) {
                  inDateRange = nextRun <= timeTo
                }
              }

              return (
                inDateRange &&
                (!filters.type || filters.type === FILTER_ALL_ITEMS || job.type === filters.type) &&
                (!filters.project || job.project.includes(filters.project.toLowerCase()))
              )
            })

          setScheduledJobs(parsedJobs)
        }
      })
    },
    [dispatch]
  )

  useLayoutEffect(() => {
    setSelectedTab(
      location.pathname.includes(JOBS_MONITORING_WORKFLOWS_TAB)
        ? JOBS_MONITORING_WORKFLOWS_TAB
        : location.pathname.includes(JOBS_MONITORING_SCHEDULED_TAB)
          ? JOBS_MONITORING_SCHEDULED_TAB
          : JOBS_MONITORING_JOBS_TAB
    )
  }, [location.pathname])

  const getWorkflows = useCallback(
    filter => {
      abortControllerRef.current = new AbortController()

      dispatch(
        workflowActions.fetchWorkflows(
          '*',
          { ...filter, groupBy: GROUP_BY_WORKFLOW },
          {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            }
          },
          true
        )
      )
    },
    [dispatch]
  )

  const tabData = useMemo(() => {
    return {
      [JOBS_MONITORING_JOBS_TAB]: {
        filtersConfig: jobsFiltersConfig,
        handleRefresh: refreshJobs,
        modalFilters: <JobsMonitoringFilters />
      },
      [JOBS_MONITORING_WORKFLOWS_TAB]: {
        filtersConfig: workflowsFiltersConfig,
        handleRefresh: getWorkflows,
        modalFilters: <WorkflowsMonitoringFilters />
      },
      [JOBS_MONITORING_SCHEDULED_TAB]: {
        filtersConfig: scheduledFiltersConfig,
        handleRefresh: refreshScheduled,
        modalFilters: <ScheduledMonitoringFilters />
      }
    }
  }, [
    getWorkflows,
    jobsFiltersConfig,
    refreshJobs,
    refreshScheduled,
    scheduledFiltersConfig,
    workflowsFiltersConfig
  ])

  return (
    <>
      <div className="job-monitoring content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
        </div>
        {selectedTab && (
          <div className="content">
            <div className="content__action-bar-wrapper">
              <ContentMenu
                activeTab={selectedTab}
                screen={JOBS_MONITORING_PAGE}
                onClick={handleTabChange}
                tabs={tabs}
              />
              <ActionBar
                filterMenuName={selectedTab}
                filtersConfig={tabData[selectedTab].filtersConfig}
                handleRefresh={tabData[selectedTab].handleRefresh}
                hidden={Boolean(params.jobId || params.workflowId)}
                page={JOBS_MONITORING_PAGE}
                tab={selectedTab}
                withRefreshButton={false}
                key={selectedTab}
              >
                {tabData[selectedTab].modalFilters}
              </ActionBar>
            </div>
            <div className="table-container">
              <ProjectJobsMonitoringContext.Provider
                value={{
                  abortControllerRef,
                  abortJobRef,
                  abortingJobs,
                  editableItem,
                  getWorkflows,
                  handleMonitoring,
                  handleRerunJob,
                  jobRuns,
                  jobWizardIsOpened,
                  jobWizardMode,
                  jobs,
                  jobsFiltersConfig,
                  jobsMonitoringData,
                  requestErrorMessage,
                  refreshJobs,
                  refreshScheduled,
                  scheduledFiltersConfig,
                  scheduledJobs,
                  selectedCard,
                  setAbortingJobs,
                  setConfirmData,
                  setEditableItem,
                  setJobRuns,
                  setJobWizardIsOpened,
                  setJobWizardMode,
                  setJobs,
                  setScheduledJobs,
                  setSelectedCard,
                  setSelectedRunProject,
                  terminateAbortTasksPolling,
                  workflowsFiltersConfig
                }}
              >
                <Outlet />
              </ProjectJobsMonitoringContext.Provider>
            </div>
          </div>
        )}
      </div>
      {confirmData && (
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: 'Cancel',
            variant: TERTIARY_BUTTON
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: () => confirmData.confirmHandler(confirmData.item),
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmType
          }}
          header={confirmData.header}
          isOpen={confirmData}
          message={confirmData.message}
        />
      )}
      {artifactsStore?.preview?.isPreview && (
        <PreviewModal artifact={artifactsStore?.preview?.selectedItem} />
      )}
    </>
  )
}

export default connect(null, {
  ...actionCreator
})(ProjectsJobsMonitoring)
