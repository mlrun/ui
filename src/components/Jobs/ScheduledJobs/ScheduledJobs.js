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
import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'

import ScheduledJobsView from './ScheduledJobsView'

import {
  GROUP_BY_NONE,
  JOBS_PAGE,
  LABELS_FILTER,
  NAME_FILTER,
  SCHEDULE_TAB
} from '../../../constants'
import { parseJob } from '../../../utils/parseJob'
import { useYaml } from '../../../hooks/yaml.hook'
import { JobsContext } from '../Jobs'
import { DANGER_BUTTON, FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { createJobsScheduleTabContent } from '../../../utils/createJobsContent'
import { scheduledJobsActionCreator } from './scheduledJobs.util'
import { setNotification } from '../../../reducers/notificationReducer'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

const ScheduledJobs = ({
  editJob,
  editJobFailure,
  fetchJobs,
  fetchScheduledJobAccessKey,
  handleRunScheduledJob,
  removeNewJob,
  removeScheduledJob,
  setFilters
}) => {
  const [jobs, setJobs] = useState([])
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [editableItem, setEditableItem] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  const filtersStore = useSelector(store => store.filtersStore)
  const jobsStore = useSelector(store => store.jobsStore)
  const { setConfirmData } = React.useContext(JobsContext)

  const tableContent = useMemo(() => createJobsScheduleTabContent(jobs), [jobs])

  const filters = useMemo(
    () => [
      { type: NAME_FILTER, label: 'Name:' },
      { type: LABELS_FILTER, label: 'Labels:' }
    ],
    []
  )
  const pageData = useMemo(() => {
    return {
      page: JOBS_PAGE
    }
  }, [])

  const refreshJobs = useCallback(
    filters => {
      fetchJobs(params.projectName, filters, true)
        .then(jobs => {
          setJobs(jobs.map(job => parseJob(job, SCHEDULE_TAB)))
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
    [fetchJobs, params.projectName, setNotification]
  )

  const handleRunJob = useCallback(
    job => {
      handleRunScheduledJob(
        {
          ...job.scheduled_object
        },
        params.projectName,
        job.name
      )
        .then(response => {
          dispatch(
            setNotification({
              status: response.status,
              id: Math.random(),
              message: 'Job started successfully'
            })
          )
        })
        .catch(error => {
          dispatch(
            setNotification({
              status: 400,
              id: Math.random(),
              retry: item => handleRunJob(item),
              message:
                error.response.status === FORBIDDEN_ERROR_STATUS_CODE
                  ? 'You are not permitted to run new job.'
                  : 'Job failed to start.'
            })
          )
        })
    },
    [handleRunScheduledJob, params.projectName, setNotification]
  )

  const handleRemoveScheduledJob = useCallback(
    schedule => {
      removeScheduledJob(params.projectName, schedule.name).then(() => {
        refreshJobs(filtersStore)
      })

      setConfirmData(null)
    },
    [filtersStore, params.projectName, refreshJobs, removeScheduledJob, setConfirmData]
  )

  const onEditJob = (event, postData) => {
    const generatedData = cloneDeep(postData)

    delete generatedData.function.metadata

    editJob(
      {
        credentials: postData.function.metadata.credentials,
        scheduled_object: generatedData,
        cron_trigger: generatedData.schedule
      },
      params.projectName
    )
      .then(() => {
        removeNewJob()

        navigate(`/projects/${params.projectName}/jobs/${SCHEDULE_TAB}`)
        setEditableItem(null)
        refreshJobs(filtersStore)
      })
      .catch(error => {
        dispatch(
          editJobFailure(
            error.response.status === FORBIDDEN_ERROR_STATUS_CODE
              ? 'You are not permitted to run new job.'
              : error.message
          )
        )
      })
  }

  const onRemoveScheduledJob = useCallback(
    scheduledJob => {
      setConfirmData({
        item: scheduledJob,
        header: 'Delete scheduled job?',
        message: `You try to delete scheduled job "${scheduledJob.name}". Deleted scheduled jobs can not be restored.`,
        btnConfirmLabel: 'Delete',
        btnConfirmType: DANGER_BUTTON,
        rejectHandler: () => {
          setConfirmData(null)
        },
        confirmHandler: () => {
          handleRemoveScheduledJob(scheduledJob)
        }
      })
    },
    [handleRemoveScheduledJob, setConfirmData]
  )

  const handleEditScheduleJob = useCallback(
    editableItem => {
      fetchScheduledJobAccessKey(params.projectName, editableItem.name)
        .then(result => {
          setEditableItem({
            ...editableItem,
            scheduled_object: {
              ...editableItem.scheduled_object,
              credentials: {
                access_key: result.data.credentials.access_key
              }
            }
          })
        })
        .catch(() => {
          dispatch(
            setNotification({
              status: 400,
              id: Math.random(),
              retry: () => handleEditScheduleJob(editableItem),
              message: 'Failed to fetch job access key'
            })
          )
        })
    },
    [fetchScheduledJobAccessKey, params.projectName, setNotification]
  )

  const handleSuccessRerunJob = useCallback(
    tab => {
      if (tab === SCHEDULE_TAB) {
        refreshJobs(filtersStore)
      }

      setEditableItem(null)
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Job started successfully'
        })
      )
    },
    [filtersStore, refreshJobs, setNotification]
  )

  const actionsMenu = useMemo(() => {
    return [
      {
        label: 'Run now',
        icon: <Run className="action_cell__run-icon" />,
        onClick: handleRunJob
      },
      {
        label: 'Edit',
        icon: <Edit />,
        onClick: handleEditScheduleJob
      },
      {
        label: 'Delete',
        icon: <Delete />,
        onClick: onRemoveScheduledJob
      },
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ]
  }, [handleEditScheduleJob, handleRunJob, onRemoveScheduledJob, toggleConvertedYaml])

  useEffect(() => {
    if (!dataIsLoaded) {
      refreshJobs()
      setDataIsLoaded(true)
    }
  }, [dataIsLoaded, refreshJobs])

  useEffect(() => {
    return () => {
      setJobs([])
      setDataIsLoaded(false)
    }
  }, [params.projectName])

  useEffect(() => {
    setFilters({ groupBy: GROUP_BY_NONE })
  }, [setFilters])

  return (
    <ScheduledJobsView
      actionsMenu={actionsMenu}
      convertedYaml={convertedYaml}
      editableItem={editableItem}
      filters={filters}
      filtersStore={filtersStore}
      handleSuccessRerunJob={handleSuccessRerunJob}
      jobs={jobs}
      jobsStore={jobsStore}
      onEditJob={onEditJob}
      pageData={pageData}
      refreshJobs={refreshJobs}
      removeNewJob={removeNewJob}
      setEditableItem={setEditableItem}
      tableContent={tableContent}
      toggleConvertedYaml={toggleConvertedYaml}
    />
  )
}

ScheduledJobs.propTypes = {}

export default connect(null, {
  ...scheduledJobsActionCreator
})(React.memo(ScheduledJobs))
