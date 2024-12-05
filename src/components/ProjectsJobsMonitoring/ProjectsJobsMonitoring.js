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
import React, { useLayoutEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { defaultsDeep } from 'lodash'

import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import { ConfirmDialog } from 'igz-controls/components'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ActionBar from '../ActionBar/ActionBar'
import JobsMonitoringFilters from './JobsMonitoring/JobsMonitoringFilters'
import ScheduledMonitoringFilters from './ScheduledMonitoring/ScheduledMonitoringFilters'
import WorkflowsMonitoringFilters from './WorkflowsMonitoring/WorkflowsMonitoringFilters'

import { STATS_TOTAL_CARD, tabs } from './projectsJobsMotinoring.util'
import {
  JOBS_MONITORING_JOBS_TAB,
  JOBS_MONITORING_PAGE,
  JOBS_MONITORING_SCHEDULED_TAB,
  JOBS_MONITORING_WORKFLOWS_TAB
} from '../../constants'
import { TERTIARY_BUTTON } from 'igz-controls/constants'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'

import './projectsJobsMonitoring.scss'
import {
  getJobsFiltersConfig,
  getScheduledFiltersConfig,
  getWorkflowsFiltersConfig,
  parseJobsQueryParamsCallback,
  parseScheduledQueryParamsCallback,
  parseWorkflowsQueryParamsCallback
} from '../../utils/jobs.util'
import { useJobsPageData } from '../../hooks/useJobsPageData'

export const ProjectJobsMonitoringContext = React.createContext({})

const ProjectsJobsMonitoring = () => {
  const [confirmData, setConfirmData] = useState(null)
  const [selectedTab, setSelectedTab] = useState(null)
  const { jobsMonitoringData } = useSelector(store => store.projectStore)
  const [selectedCard, setSelectedCard] = useState(
    jobsMonitoringData.filters?.status || STATS_TOTAL_CARD
  )
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const artifactsStore = useSelector(store => store.artifactsStore)
  const jobsStore = useSelector(store => store.jobsStore)

  const jobsFiltersConfig = useMemo(
    () => getJobsFiltersConfig(params.jobName, true),
    [params.jobName]
  )
  const scheduledFiltersConfig = useMemo(() => getScheduledFiltersConfig(true), [])
  const workflowsFiltersConfig = useMemo(() => getWorkflowsFiltersConfig(true), [])
  const initialTabData = useMemo(() => {
    return {
      [JOBS_MONITORING_JOBS_TAB]: {
        filtersConfig: jobsFiltersConfig,
        modalFilters: <JobsMonitoringFilters />,
        parseQueryParamsCallback: parseJobsQueryParamsCallback
      },
      [JOBS_MONITORING_WORKFLOWS_TAB]: {
        filtersConfig: workflowsFiltersConfig,
        modalFilters: <WorkflowsMonitoringFilters />,
        parseQueryParamsCallback: parseWorkflowsQueryParamsCallback
      },
      [JOBS_MONITORING_SCHEDULED_TAB]: {
        filtersConfig: scheduledFiltersConfig,
        modalFilters: <ScheduledMonitoringFilters />,
        parseQueryParamsCallback: parseScheduledQueryParamsCallback
      }
    }
  }, [jobsFiltersConfig, scheduledFiltersConfig, workflowsFiltersConfig])
  const {
    abortControllerRef,
    abortJobRef,
    abortingJobs,
    editableItem,
    getWorkflows,
    handleMonitoring,
    handleRefreshJobs,
    handleRerunJob,
    jobRuns,
    jobWizardIsOpened,
    jobWizardMode,
    jobs,
    paginatedJobs,
    paginationConfigJobsRef,
    refreshJobs,
    refreshScheduled,
    requestErrorMessage,
    scheduledJobs,
    searchParams,
    setAbortingJobs,
    setEditableItem,
    setJobRuns,
    setJobWizardIsOpened,
    setJobWizardMode,
    setJobs,
    setScheduledJobs,
    setSearchParams,
    terminateAbortTasksPolling
  } = useJobsPageData(initialTabData, selectedTab)

  const handleTabChange = tabName => {
    setSelectedCard(STATS_TOTAL_CARD)
    setSelectedTab(tabName)
    navigate(`/projects/*/${JOBS_MONITORING_PAGE}/${tabName}`)
  }

  useLayoutEffect(() => {
    setSelectedTab(
      location.pathname.includes(JOBS_MONITORING_WORKFLOWS_TAB)
        ? JOBS_MONITORING_WORKFLOWS_TAB
        : location.pathname.includes(JOBS_MONITORING_SCHEDULED_TAB)
          ? JOBS_MONITORING_SCHEDULED_TAB
          : JOBS_MONITORING_JOBS_TAB
    )
  }, [location.pathname])

  const tabData = useMemo(() => {
    return defaultsDeep(
      {
        [JOBS_MONITORING_JOBS_TAB]: {
          handleRefresh: handleRefreshJobs
        },
        [JOBS_MONITORING_WORKFLOWS_TAB]: {
          handleRefresh: getWorkflows
        },
        [JOBS_MONITORING_SCHEDULED_TAB]: {
          handleRefresh: refreshScheduled
        }
      },
      initialTabData
    )
  }, [getWorkflows, handleRefreshJobs, initialTabData, refreshScheduled])

  const filters = useFiltersFromSearchParams(
    tabData[selectedTab]?.filtersConfig,
    tabData[selectedTab]?.parseQueryParamsCallback
  )

  return (
    <>
      <div className="job-monitoring content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
        </div>
        {selectedTab && filters && (
          <div className="content">
            <div className="content__action-bar-wrapper">
              <ContentMenu
                activeTab={selectedTab}
                screen={JOBS_MONITORING_PAGE}
                onClick={handleTabChange}
                tabs={tabs}
              />

              <ActionBar
                autoRefreshIsEnabled={selectedTab === JOBS_MONITORING_JOBS_TAB}
                autoRefreshIsStopped={jobWizardIsOpened || jobsStore.loading}
                filters={filters}
                filtersConfig={tabData[selectedTab].filtersConfig}
                handleRefresh={tabData[selectedTab].handleRefresh}
                hidden={Boolean(params.jobId || params.workflowId)}
                key={selectedTab}
                page={JOBS_MONITORING_PAGE}
                setSearchParams={setSearchParams}
                tab={selectedTab}
                withRefreshButton
                withoutExpandButton
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
                  paginatedJobs,
                  paginationConfigJobsRef,
                  refreshJobs,
                  refreshScheduled,
                  requestErrorMessage,
                  scheduledFiltersConfig,
                  scheduledJobs,
                  searchParams,
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
                  tabData,
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

export default ProjectsJobsMonitoring
