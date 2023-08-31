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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classnames from 'classnames'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import JobWizard from '../../JobWizard/JobWizard'
import Details from '../../Details/Details'
import FilterMenu from '../../FilterMenu/FilterMenu'
import JobsTableRow from '../../../elements/JobsTableRow/JobsTableRow'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import TableTop from '../../../elements/TableTop/TableTop'
import YamlModal from '../../../common/YamlModal/YamlModal'

import { DANGER_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { GROUP_BY_NONE, JOBS_PAGE, MONITOR_JOBS_TAB, PANEL_RERUN_MODE } from '../../../constants'
import {
  generateActionsMenu,
  generateFilters,
  generatePageData,
  monitorJobsActionCreator
} from './monitorJobs.util'
import { JobsContext } from '../Jobs'
import { createJobsMonitorTabContent } from '../../../utils/createJobsContent'
import { datePickerOptions, PAST_WEEK_DATE_OPTION } from '../../../utils/datePicker.util'
import { getCloseDetailsLink } from '../../../utils/getCloseDetailsLink'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { enrichRunWithFunctionFields, handleAbortJob } from '../jobs.util'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { openPopUp } from 'igz-controls/utils/common.util'
import { getJobLogs } from '../../../utils/getJobLogs.util'
import { parseJob } from '../../../utils/parseJob'
import { setNotification } from '../../../reducers/notificationReducer'
import { useMode } from '../../../hooks/mode.hook'
import { usePods } from '../../../hooks/usePods.hook'
import { useYaml } from '../../../hooks/yaml.hook'
import { setFilters } from '../../../reducers/filtersReducer'

const MonitorJobs = ({
  abortJob,
  fetchAllJobRuns,
  fetchJob,
  fetchJobFunctions,
  fetchJobLogs,
  fetchJobPods,
  fetchJobs,
  removePods
}) => {
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [jobRuns, setJobRuns] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState({})
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [dateFilter, setDateFilter] = useState(['', ''])
  const appStore = useSelector(store => store.appStore)
  const jobsStore = useSelector(store => store.jobsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
  const fetchJobFunctionsPromiseRef = useRef()
  const {
    editableItem,
    handleMonitoring,
    handleRerunJob,
    jobWizardIsOpened,
    jobWizardMode,
    setConfirmData,
    setEditableItem,
    setJobWizardIsOpened,
    setJobWizardMode
  } = React.useContext(JobsContext)
  const filters = useMemo(() => {
    return generateFilters(params.jobName)
  }, [params.jobName])
  const filterMenuClassNames = classnames(
    'content__action-bar-wrapper',
    params.jobId && 'content__action-bar-wrapper_hidden'
  )

  usePods(fetchJobPods, removePods, selectedJob)

  const tableContent = useMemo(
    () =>
      createJobsMonitorTabContent(params.jobName ? jobRuns : jobs, params.jobName, isStagingMode),
    [isStagingMode, jobRuns, jobs, params.jobName]
  )

  const handleFetchJobLogs = useCallback(
    (item, projectName, setDetailsLogs, streamLogsRef) => {
      return getJobLogs(item.uid, projectName, streamLogsRef, setDetailsLogs, fetchJobLogs)
    },
    [fetchJobLogs]
  )

  const pageData = useMemo(
    () =>
      generatePageData(
        handleFetchJobLogs,
        selectedJob,
        appStore.frontendSpec.jobs_dashboard_url,
        handleMonitoring
      ),
    [handleFetchJobLogs, selectedJob, appStore.frontendSpec.jobs_dashboard_url, handleMonitoring]
  )

  const refreshJobs = useCallback(
    filters => {
      if (filters.dates) {
        setDateFilter(filters.dates.value)
      }

      const fetchData = params.jobName ? fetchAllJobRuns : fetchJobs

      fetchData(params.projectName, filters, params.jobName ?? false)
        .then(jobs => {
          const parsedJobs = jobs.map(job => parseJob(job, MONITOR_JOBS_TAB))

          if (params.jobName) {
            setJobRuns(parsedJobs)
          } else {
            setJobs(parsedJobs)
          }
        })
        .catch(error => {
          dispatch(
            setNotification({
              status: error?.response?.status || 400,
              id: Math.random(),
              message: 'Failed to fetch jobs',
              retry: () => refreshJobs(filters)
            })
          )
        })
    },
    [dispatch, fetchAllJobRuns, fetchJobs, params.jobName, params.projectName]
  )

  const onAbortJob = useCallback(
    job => {
      handleAbortJob(
        abortJob,
        params.projectName,
        job,
        filtersStore,
        setNotification,
        refreshJobs,
        setConfirmData,
        dispatch
      )
    },
    [abortJob, dispatch, filtersStore, params.projectName, refreshJobs, setConfirmData]
  )

  const handleConfirmAbortJob = useCallback(
    job => {
      setConfirmData({
        item: job,
        header: 'Abort job?',
        message: `You try to abort job "${job.name}".`,
        btnConfirmLabel: 'Abort',
        btnConfirmType: DANGER_BUTTON,
        rejectHandler: () => {
          setConfirmData(null)
        },
        confirmHandler: () => {
          onAbortJob(job)
        }
      })
    },
    [onAbortJob, setConfirmData]
  )

  const actionsMenu = useMemo(() => {
    return job =>
      generateActionsMenu(
        job,
        handleRerunJob,
        appStore.frontendSpec.jobs_dashboard_url,
        handleMonitoring,
        appStore.frontendSpec.abortable_function_kinds,
        handleConfirmAbortJob,
        toggleConvertedYaml,
        selectedJob
      )
  }, [
    handleRerunJob,
    appStore.frontendSpec.jobs_dashboard_url,
    appStore.frontendSpec.abortable_function_kinds,
    handleMonitoring,
    handleConfirmAbortJob,
    toggleConvertedYaml,
    selectedJob
  ])

  const modifyAndSelectRun = useCallback(
    jobRun => {
      return enrichRunWithFunctionFields(
        dispatch,
        jobRun,
        fetchJobFunctions,
        fetchJobFunctionsPromiseRef
      ).then(jobRun => {
        setSelectedJob(jobRun)
      })
    },
    [dispatch, fetchJobFunctions]
  )

  const handleSelectRun = useCallback(
    item => {
      if (params.jobName) {
        if (document.getElementsByClassName('view')[0]) {
          document.getElementsByClassName('view')[0].classList.remove('view')
        }

        modifyAndSelectRun(item)
      }
    },
    [modifyAndSelectRun, params.jobName]
  )

  const fetchRun = useCallback(() => {
    fetchJob(params.projectName, params.jobId)
      .then(job => {
        return modifyAndSelectRun(parseJob(job))
      })
      .catch(() =>
        navigate(`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`, { replace: true })
      )
      .finally(() => {
        fetchJobFunctionsPromiseRef.current = null
      })
  }, [fetchJob, modifyAndSelectRun, navigate, params.jobId, params.projectName])

  const isJobDataEmpty = useCallback(
    () => jobs.length === 0 && ((!params.jobName && jobRuns.length === 0) || params.jobName),
    [jobRuns.length, jobs.length, params.jobName]
  )

  useEffect(() => {
    if (selectedJob.name) {
      const urlPathArray = location.pathname.split('/')
      const jobNameIndex = urlPathArray.indexOf(selectedJob.uid) - 1

      if (urlPathArray[jobNameIndex] !== selectedJob.name && jobNameIndex > 0) {
        navigate(
          [
            ...urlPathArray.slice(0, jobNameIndex + 1),
            selectedJob.name,
            ...urlPathArray.slice(jobNameIndex + 1)
          ].join('/'),
          { replace: true }
        )
      }
    }
  }, [navigate, selectedJob.name, selectedJob.uid, location])

  useEffect(() => {
    if (params.jobId && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, pageData.details.menu, location, params.jobId, params.tab])

  useEffect(() => {
    if (
      !fetchJobFunctionsPromiseRef.current &&
      params.jobId &&
      (isEmpty(selectedJob) || params.jobId !== selectedJob.uid)
    ) {
      fetchRun()
    }
  }, [fetchRun, params.jobId, selectedJob])

  useEffect(() => {
    if (!params.jobId && !isEmpty(selectedJob)) {
      setSelectedJob({})
    }
  }, [params.jobId, selectedJob])

  useEffect(() => {
    if (isEmpty(selectedJob) && !params.jobId && !dataIsLoaded) {
      let filters = {}

      if (isJobDataEmpty()) {
        const pastWeekOption = datePickerOptions.find(option => option.id === PAST_WEEK_DATE_OPTION)

        filters = {
          dates: {
            value: pastWeekOption.handler(),
            isPredefined: pastWeekOption.isPredefined
          }
        }
      } else {
        filters = {
          dates: {
            value: dateFilter,
            isPredefined: false
          }
        }
      }

      refreshJobs(filters)
      dispatch(setFilters(filters))
      setDataIsLoaded(true)
    }
  }, [
    dataIsLoaded,
    dateFilter,
    dispatch,
    isJobDataEmpty,
    params.jobId,
    params.jobName,
    params.projectName,
    refreshJobs,
    selectedJob
  ])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch])

  useEffect(() => {
    return () => {
      setJobs([])
      setJobRuns([])
    }
  }, [params.projectName])

  useEffect(() => {
    return () => {
      setDataIsLoaded(false)
    }
  }, [params.projectName, params.jobName])

  useEffect(() => {
    if (
      jobWizardMode &&
      !jobWizardIsOpened &&
      ((jobWizardMode === PANEL_RERUN_MODE && editableItem?.rerun_object) ||
        jobWizardMode !== PANEL_RERUN_MODE)
    ) {
      openPopUp(JobWizard, {
        params,
        onWizardClose: () => {
          setEditableItem(null)
          setJobWizardMode(null)
          setJobWizardIsOpened(false)
        },
        defaultData: jobWizardMode === PANEL_RERUN_MODE ? editableItem?.rerun_object : {},
        mode: jobWizardMode,
        wizardTitle: jobWizardMode === PANEL_RERUN_MODE ? 'Batch re-run' : undefined,
        onSuccessRequest: () => refreshJobs(filtersStore)
      })

      setJobWizardIsOpened(true)
    }
  }, [
    editableItem?.rerun_object,
    filtersStore,
    jobWizardIsOpened,
    jobWizardMode,
    params,
    refreshJobs,
    setEditableItem,
    setJobWizardIsOpened,
    setJobWizardMode
  ])

  return (
    <>
      {params.jobName && (
        <TableTop
          link={`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
          text={params.jobName}
        />
      )}
      <div className={filterMenuClassNames}>
        <div className="action-bar">
          <FilterMenu
            actionButton={{
              label: 'Resource monitoring',
              tooltip: !appStore.frontendSpec.jobs_dashboard_url
                ? 'Grafana service unavailable'
                : '',
              variant: TERTIARY_BUTTON,
              disabled: !appStore.frontendSpec.jobs_dashboard_url,
              onClick: () => handleMonitoring()
            }}
            filters={filters}
            hidden={Boolean(params.jobId)}
            onChange={refreshJobs}
            page={JOBS_PAGE}
            withoutExpandButton
          />
        </div>
      </div>

      {jobsStore.loading ? null : (params.jobName && jobRuns.length === 0) ||
        (jobs.length === 0 && !params.jobName) ? (
        <NoData message={getNoDataMessage(filtersStore, filters, JOBS_PAGE, MONITOR_JOBS_TAB)} />
      ) : (
        isEmpty(selectedJob) && (
          <Table
            actionsMenu={actionsMenu}
            content={params.jobName ? jobRuns : jobs}
            handleCancel={() => setSelectedJob({})}
            handleSelectItem={handleSelectRun}
            pageData={pageData}
            retryRequest={refreshJobs}
            selectedItem={selectedJob}
            tab={MONITOR_JOBS_TAB}
            tableHeaders={tableContent[0]?.content ?? []}
          >
            {tableContent.map((tableItem, index) => (
              <JobsTableRow
                actionsMenu={actionsMenu}
                handleSelectJob={handleSelectRun}
                key={index}
                rowItem={tableItem}
                selectedJob={selectedJob}
              />
            ))}
          </Table>
        )
      )}
      {!isEmpty(selectedJob) && (
        <Details
          actionsMenu={actionsMenu}
          detailsMenu={pageData.details.menu}
          getCloseDetailsLink={() => getCloseDetailsLink(location, params.jobName)}
          handleCancel={() => setSelectedJob({})}
          handleRefresh={fetchRun}
          isDetailsScreen
          pageData={pageData}
          selectedItem={selectedJob}
          tab={MONITOR_JOBS_TAB}
        />
      )}
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
      )}
    </>
  )
}

export default connect(null, {
  ...monitorJobsActionCreator
})(React.memo(MonitorJobs))
