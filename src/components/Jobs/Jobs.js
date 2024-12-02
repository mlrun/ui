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
import React, { useEffect, useState, useMemo, useLayoutEffect, useCallback } from 'react'
import { connect, useSelector } from 'react-redux'
import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom'
import { defaultsDeep } from 'lodash'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import Loader from '../../common/Loader/Loader'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import { ConfirmDialog } from 'igz-controls/components'

import {
  INACTIVE_JOBS_TAB,
  JOBS_MONITORING_PAGE,
  JOBS_PAGE,
  JOBS_PAGE_PATH,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PANEL_CREATE_MODE,
  PROJECTS_PAGE_PATH,
  SCHEDULE_TAB
} from '../../constants'
import { TERTIARY_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'
import { actionButtonHeader, actionCreator, tabs } from './jobs.util'
import { isPageTabValid } from '../../utils/link-helper.util'
import {
  getJobsFiltersConfig,
  getScheduledFiltersConfig,
  getWorkflowsFiltersConfig,
  parseJobsQueryParamsCallback,
  parseScheduledQueryParamsCallback,
  parseWorkflowsQueryParamsCallback
} from '../../utils/jobs.util'
import ActionBar from '../ActionBar/ActionBar'
import JobsFilters from './MonitorJobs/JobsFilters'
import WorkflowsFilters from './MonitorWorkflows/WorkflowsFilters'
import ScheduledJobsFilters from './ScheduledJobs/ScheduledJobsFilters'
import { useJobsPageData } from '../../hooks/useJobsPageData'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'

export const JobsContext = React.createContext({})

const Jobs = ({ fetchAllJobRuns, fetchJobFunction, fetchJobs }) => {
  const [confirmData, setConfirmData] = useState(null)
  const [selectedTab, setSelectedTab] = useState(null)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const functionsStore = useSelector(store => store.functionsStore)
  const jobsStore = useSelector(store => store.jobsStore)
  const workflowsStore = useSelector(store => store.workflowsStore)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const appStore = useSelector(store => store.appStore)

  const initialTabData = useMemo(() => {
    return {
      [MONITOR_JOBS_TAB]: {
        filtersConfig: getJobsFiltersConfig(params.jobName),
        modalFilters: <JobsFilters />,
        parseQueryParamsCallback: parseJobsQueryParamsCallback
      },
      [MONITOR_WORKFLOWS_TAB]: {
        filtersConfig: getWorkflowsFiltersConfig(),
        modalFilters: <WorkflowsFilters />,
        parseQueryParamsCallback: parseWorkflowsQueryParamsCallback
      },
      [SCHEDULE_TAB]: {
        filtersConfig: getScheduledFiltersConfig(),
        modalFilters: <ScheduledJobsFilters />,
        parseQueryParamsCallback: parseScheduledQueryParamsCallback
      }
    }
  }, [params.jobName])

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
  } = useJobsPageData(fetchAllJobRuns, fetchJobFunction, fetchJobs, initialTabData, selectedTab)

  const handleActionsMenuClick = () => {
    setJobWizardMode(PANEL_CREATE_MODE)
  }

  const handleTabChange = useCallback(
    tabName => {
      setSelectedTab(tabName)
      navigate(`/projects/${params.projectName}/${JOBS_PAGE.toLowerCase()}/${tabName}`)
    },
    [navigate, params.projectName]
  )

  const tabData = useMemo(() => {
    return defaultsDeep(
      {
        [MONITOR_JOBS_TAB]: {
          handleRefresh: handleRefreshJobs
        },
        [MONITOR_WORKFLOWS_TAB]: {
          handleRefresh: getWorkflows
        },
        [SCHEDULE_TAB]: {
          handleRefresh: refreshScheduled
        }
      },
      initialTabData
    )
  }, [getWorkflows, handleRefreshJobs, initialTabData, refreshScheduled])

  useLayoutEffect(() => {
    setSelectedTab(
      location.pathname.includes(`${JOBS_PAGE_PATH}/${MONITOR_JOBS_TAB}`)
        ? MONITOR_JOBS_TAB
        : location.pathname.includes(`${JOBS_PAGE_PATH}/${SCHEDULE_TAB}`)
          ? SCHEDULE_TAB
          : MONITOR_WORKFLOWS_TAB
    )
  }, [location.pathname])

  useEffect(() => {
    const urlPathArray = location.pathname.split('/')
    const monitorJobsIndex = urlPathArray.indexOf(PROJECTS_PAGE_PATH) + 3

    if (urlPathArray[monitorJobsIndex] === INACTIVE_JOBS_TAB) {
      /*/!* Adding the next redirect for backwards compatability *!/*/
      urlPathArray[monitorJobsIndex] = MONITOR_JOBS_TAB
      navigate(urlPathArray.join('/'), { replace: true })
    } else {
      const pageTab = location.pathname.includes(`${JOBS_PAGE_PATH}/${MONITOR_WORKFLOWS_TAB}`)
        ? MONITOR_WORKFLOWS_TAB
        : location.pathname.includes(`${JOBS_PAGE_PATH}/${SCHEDULE_TAB}`)
          ? SCHEDULE_TAB
          : MONITOR_JOBS_TAB

      isPageTabValid(
        pageTab,
        tabs.map(tab => tab.id),
        navigate,
        location
      )
    }
  }, [navigate, params.pageTab, location])

  const filters = useFiltersFromSearchParams(
    tabData[selectedTab]?.filtersConfig,
    tabData[selectedTab]?.parseQueryParamsCallback
  )

  return (
    <>
      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
        </div>
        {selectedTab && filters && (
          <div className="content">
            <div className="content__action-bar-wrapper content__action-bar-wrapper_multi-row">
              <ContentMenu
                activeTab={selectedTab}
                onClick={handleTabChange}
                screen={JOBS_PAGE}
                tabs={tabs}
              />
              <ActionBar
                actionButtons={[
                  {
                    className: 'action-button',
                    hidden: selectedTab === MONITOR_WORKFLOWS_TAB,
                    label: actionButtonHeader,
                    onClick: handleActionsMenuClick,
                    variant: PRIMARY_BUTTON
                  },
                  {
                    className: 'action-button',
                    label: 'Resource monitoring',
                    hidden: selectedTab !== MONITOR_JOBS_TAB,
                    tooltip: !appStore.frontendSpec.jobs_dashboard_url
                      ? 'Grafana service unavailable'
                      : '',
                    variant: TERTIARY_BUTTON,
                    disabled: !appStore.frontendSpec.jobs_dashboard_url,
                    onClick: () => handleMonitoring()
                  }
                ]}
                autoRefreshIsEnabled={selectedTab === MONITOR_JOBS_TAB}
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
              <JobsContext.Provider
                value={{
                  abortControllerRef,
                  abortJobRef,
                  abortingJobs,
                  editableItem,
                  getWorkflows,
                  handleRerunJob,
                  jobRuns,
                  jobWizardIsOpened,
                  jobWizardMode,
                  jobs,
                  jobsFiltersConfig: tabData[MONITOR_JOBS_TAB].filtersConfig,
                  paginatedJobs,
                  paginationConfigJobsRef,
                  refreshJobs,
                  refreshScheduled,
                  requestErrorMessage,
                  scheduledFiltersConfig: tabData[SCHEDULE_TAB].filtersConfig,
                  scheduledJobs,
                  searchParams,
                  setAbortingJobs,
                  setConfirmData,
                  setEditableItem,
                  setJobRuns,
                  setJobWizardIsOpened,
                  setJobWizardMode,
                  setJobs,
                  setScheduledJobs,
                  tabData,
                  terminateAbortTasksPolling,
                  workflowsFiltersConfig: tabData[MONITOR_WORKFLOWS_TAB].filtersConfig
                }}
              >
                <Outlet />
              </JobsContext.Provider>
              {(jobsStore.loading ||
                workflowsStore.workflows.loading ||
                workflowsStore.activeWorkflow.loading ||
                functionsStore.loading ||
                functionsStore.funcLoading) && <Loader />}
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
})(React.memo(Jobs))
