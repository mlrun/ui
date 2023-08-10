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
import { useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'

import FilterMenu from '../../FilterMenu/FilterMenu'
import JobWizard from '../../JobWizard/JobWizard'
import JobsTableRow from '../../../elements/JobsTableRow/JobsTableRow'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import YamlModal from '../../../common/YamlModal/YamlModal'

import {
  GROUP_BY_NONE,
  JOBS_PAGE,
  LABELS_FILTER,
  NAME_FILTER,
  PANEL_EDIT_MODE,
  SCHEDULE_TAB
} from '../../../constants'
import { DANGER_BUTTON, FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { JobsContext } from '../Jobs'
import { createJobsScheduleTabContent } from '../../../utils/createJobsContent'
import { getJobFunctionData } from '../jobs.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseJob } from '../../../utils/parseJob'
import { scheduledJobsActionCreator } from './scheduledJobs.util'
import { setFilters } from '../../../reducers/filtersReducer'
import { setNotification } from '../../../reducers/notificationReducer'
import { useYaml } from '../../../hooks/yaml.hook'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

const ScheduledJobs = ({
  fetchFunctionTemplate,
  fetchJobFunction,
  fetchJobFunctionSuccess,
  fetchJobs,
  handleRunScheduledJob,
  removeScheduledJob
}) => {
  const [jobs, setJobs] = useState([])
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [editableItem, setEditableItem] = useState(null)
  const dispatch = useDispatch()
  const params = useParams()
  const filtersStore = useSelector(store => store.filtersStore)
  const jobsStore = useSelector(store => store.jobsStore)
  const {
    jobWizardIsOpened,
    jobWizardMode,
    setConfirmData,
    setJobWizardIsOpened,
    setJobWizardMode
  } = React.useContext(JobsContext)

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
              retry: () => refreshJobs(filters),
              error
            })
          )
        })
    },
    [dispatch, fetchJobs, params.projectName]
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
                  : 'Job failed to start.',
              error
            })
          )
        })
    },
    [dispatch, handleRunScheduledJob, params.projectName]
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
      getJobFunctionData(
        editableItem,
        fetchJobFunction,
        dispatch,
        fetchFunctionTemplate,
        fetchJobFunctionSuccess
      )
        .then(functionData => {
          setEditableItem({
            ...editableItem,
            scheduled_object: {
              ...editableItem.scheduled_object,
              function: functionData
            }
          })

          setJobWizardMode(PANEL_EDIT_MODE)
        })
        .catch(error => {
          dispatch(
            setNotification({
              status: 400,
              id: Math.random(),
              retry: () => handleEditScheduleJob(editableItem),
              message: 'Failed to fetch job data',
              error
            })
          )
        })
    },
    [fetchJobFunction, dispatch, fetchFunctionTemplate, fetchJobFunctionSuccess, setJobWizardMode]
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
        className: 'danger',
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
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch])

  useEffect(() => {
    if (jobWizardMode && !jobWizardIsOpened) {
      openPopUp(JobWizard, {
        params,
        onWizardClose: () => {
          setEditableItem(null)
          setJobWizardMode(null)
          setJobWizardIsOpened(false)
        },
        defaultData: jobWizardMode === PANEL_EDIT_MODE ? editableItem?.scheduled_object : {},
        mode: jobWizardMode,
        wizardTitle: jobWizardMode === PANEL_EDIT_MODE ? 'Edit job' : undefined,
        onSuccessRequest: () => refreshJobs(filtersStore)
      })

      setJobWizardIsOpened(true)
    }
  }, [
    editableItem?.scheduled_object,
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
      <div className="content__action-bar-wrapper">
        <div className="action-bar">
          <FilterMenu
            filters={filters}
            onChange={refreshJobs}
            page={JOBS_PAGE}
            withoutExpandButton
          />
        </div>
      </div>
      {jobsStore.loading ? null : jobs.length === 0 ? (
        <NoData message={getNoDataMessage(filtersStore, filters, JOBS_PAGE, SCHEDULE_TAB)} />
      ) : (
        <>
          <Table
            actionsMenu={actionsMenu}
            content={jobs}
            pageData={pageData}
            retryRequest={refreshJobs}
            tab={SCHEDULE_TAB}
            tableHeaders={tableContent[0]?.content ?? []}
          >
            {tableContent.map((tableItem, index) => (
              <JobsTableRow actionsMenu={actionsMenu} key={index} rowItem={tableItem} />
            ))}
          </Table>
        </>
      )}
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
      )}
    </>
  )
}

ScheduledJobs.propTypes = {}

export default connect(null, {
  ...scheduledJobsActionCreator
})(React.memo(ScheduledJobs))
