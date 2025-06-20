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

import { isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import DetailsPopUp from '../DetailsPopUp'

import { parseJob } from '../../../utils/parseJob'
import { generatePageData } from '../../JobsTable/jobsTable.util'
import { getJobLogs } from '../../../utils/getJobLogs.util'
import { enrichRunWithFunctionFields, monitorJob } from '../../../components/Jobs/jobs.util'
import { generateActionsMenu } from '../../../components/Jobs/MonitorJobs/monitorJobs.util'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { usePods } from '../../../hooks/usePods.hook'
import { toggleYaml } from '../../../reducers/appReducer'
import { fetchJob } from '../../../reducers/jobReducer'

const JobPopUp = ({ isOpen, jobData, onResolve }) => {
  const dispatch = useDispatch()
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const [selectedJob, setSelectedJob] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const fetchJobFunctionsPromiseRef = useRef()

  usePods(dispatch, selectedJob, true)

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const handleFetchJobLogs = useCallback(
    (item, projectName, setDetailsLogs, streamLogsRef) => {
      return getJobLogs(item.uid, projectName, streamLogsRef, setDetailsLogs, dispatch)
    },
    [dispatch]
  )

  const handleMonitoring = useCallback(
    item => {
      monitorJob(frontendSpec.jobs_dashboard_url, item, jobData.project)
    },
    [frontendSpec.jobs_dashboard_url, jobData.project]
  )

  const pageData = useMemo(
    () =>
      generatePageData(
        handleFetchJobLogs,
        selectedJob,
        frontendSpec.jobs_dashboard_url,
        handleMonitoring
      ),
    [handleFetchJobLogs, selectedJob, frontendSpec.jobs_dashboard_url, handleMonitoring]
  )

  const actionsMenu = useMemo(() => {
    return job =>
      generateActionsMenu(
        job,
        () => {},
        frontendSpec.jobs_dashboard_url,
        handleMonitoring,
        frontendSpec.abortable_function_kinds,
        () => {},
        toggleConvertedYaml,
        selectedJob,
        () => {},
        true
      )
  }, [
    frontendSpec.jobs_dashboard_url,
    frontendSpec.abortable_function_kinds,
    handleMonitoring,
    toggleConvertedYaml,
    selectedJob
  ])

  const handleFetchJob = useCallback(() => {
    setIsLoading(true)

    return dispatch(fetchJob({ project: jobData.project, jobId: jobData.uid, iter: jobData.iter }))
      .unwrap()
      .then(job => {
        if (job) {
          enrichRunWithFunctionFields(dispatch, parseJob(job), fetchJobFunctionsPromiseRef).then(
            jobRun => {
              setSelectedJob(jobRun)
              setIsLoading(false)
              fetchJobFunctionsPromiseRef.current = null
            }
          )
        } else {
          showErrorNotification(dispatch, {}, '', 'Failed to retrieve job data')
          onResolve()
        }
      })
      .catch(error => {
        showErrorNotification(dispatch, error, '', 'Failed to retrieve job data')
        onResolve()
      })
  }, [dispatch, jobData.iter, jobData.project, jobData.uid, onResolve])

  useEffect(() => {
    if (isEmpty(selectedJob)) {
      handleFetchJob()
    }
  }, [handleFetchJob, selectedJob])

  return (
    <DetailsPopUp
      actionsMenu={actionsMenu}
      handleRefresh={handleFetchJob}
      isLoading={isLoading}
      isOpen={isOpen}
      onResolve={onResolve}
      pageData={pageData}
      selectedItem={selectedJob}
    />
  )
}

JobPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  jobData: PropTypes.object.isRequired,
  onResolve: PropTypes.func.isRequired
}

export default JobPopUp
