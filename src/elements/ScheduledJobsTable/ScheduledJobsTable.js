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
import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import JobWizard from '../../components/JobWizard/JobWizard'
import JobsTableRow from '../JobsTableRow/JobsTableRow'
import Table from '../../components/Table/Table'
import NoData from '../../common/NoData/NoData'
import Loader from '../../common/Loader/Loader'

import functionsActions from '../../actions/functions'
import { DANGER_BUTTON, FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { FILTERS_CONFIG } from '../../types'
import { JOB_KIND_WORKFLOW, JOBS_PAGE, PANEL_EDIT_MODE, SCHEDULE_TAB } from '../../constants'
import { getErrorMsg, openPopUp } from 'igz-controls/utils/common.util'
import { getJobFunctionData } from '../../components/Jobs/jobs.util'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { isRowRendered, useVirtualization } from '../../hooks/useVirtualization.hook'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { toggleYaml } from '../../reducers/appReducer'
import { handleRunScheduledJob, removeScheduledJob } from '../../reducers/jobReducer'

import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'
import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'

import cssVariables from './scheduledJobsTable.scss'

const ScheduledJobsTable = ({
  context,
  createTableContent,
  filters = null,
  filtersConfig = null,
  jobs,
  refreshJobs,
  requestErrorMessage
}) => {
  const dispatch = useDispatch()
  const params = useParams()
  const jobsStore = useSelector(store => store.jobsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const {
    editableItem,
    jobWizardIsOpened,
    jobWizardMode,
    setConfirmData,
    setEditableItem,
    setJobWizardIsOpened,
    setJobWizardMode
  } = React.useContext(context)

  const pageData = useMemo(() => {
    return {
      page: JOBS_PAGE
    }
  }, [])
  const tableContent = useMemo(() => {
    return createTableContent()
  }, [createTableContent])

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const handleRunJob = useCallback(
    job => {
      dispatch(
        handleRunScheduledJob({
          postData: {
            ...job.scheduled_object
          },
          project: job.project || params.projectName,
          job: job.name
        })
      )
        .unwrap()
        .then(response => {
          dispatch(
            setNotification({
              status: response.status,
              id: Math.random(),
              message: 'Job started'
            })
          )
        })
        .catch(error => {
          const customErrorMsg =
            error.response.status === FORBIDDEN_ERROR_STATUS_CODE
              ? 'You do not have permission to run a new job.'
              : getErrorMsg(error, 'Failed to start job')

          showErrorNotification(dispatch, error, '', customErrorMsg, () => handleRunJob(job))
        })
    },
    [dispatch, params.projectName]
  )

  const handleRemoveScheduledJob = useCallback(
    schedule => {
      dispatch(
        removeScheduledJob({
          projectName: params.projectName || schedule.project,
          scheduleName: schedule.name
        })
      )
        .unwrap()
        .then(response => {
          refreshJobs(filters)
          dispatch(
            setNotification({
              status: response.status,
              id: Math.random(),
              message: 'Job is successfully deleted'
            })
          )
        })
        .catch(error => {
          showErrorNotification(dispatch, error)
        })

      setConfirmData(null)
    },
    [filters, params.projectName, refreshJobs, setConfirmData, dispatch]
  )

  const handleRefreshWithFilters = useCallback(() => {
    refreshJobs(filters)
  }, [filters, refreshJobs])

  const onRemoveScheduledJob = useCallback(
    scheduledJob => {
      setConfirmData({
        item: scheduledJob,
        header: 'Delete scheduled job?',
        message: `Are you sure you want to delete the scheduled job "${scheduledJob.name}"? Deleted scheduled jobs can not be restored.`,
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
      getJobFunctionData(editableItem, dispatch, functionsActions.fetchFunctionTemplate).then(
        functionData => {
          setEditableItem({
            ...editableItem,
            scheduled_object: {
              ...editableItem.scheduled_object,
              function: functionData
            }
          })

          setJobWizardMode(PANEL_EDIT_MODE)
        }
      )
    },
    [dispatch, setEditableItem, setJobWizardMode]
  )

  const actionsMenu = useMemo(
    () => job => [
      [
        {
          label: 'Run now',
          icon: <Run className="action_cell__run-icon" />,
          onClick: handleRunJob
        },
        {
          label: 'Edit',
          icon: <Edit />,
          onClick: handleEditScheduleJob,
          hidden: job?.type === JOB_KIND_WORKFLOW
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
    ],
    [handleEditScheduleJob, handleRunJob, onRemoveScheduledJob, toggleConvertedYaml]
  )

  useEffect(() => {
    if (jobWizardMode && !jobWizardIsOpened) {
      openPopUp(JobWizard, {
        params: {
          ...params,
          projectName: editableItem?.project || params.projectName
        },
        onWizardClose: () => {
          setEditableItem(null)
          setJobWizardMode(null)
          setJobWizardIsOpened(false)
        },
        defaultData: jobWizardMode === PANEL_EDIT_MODE ? editableItem?.scheduled_object : {},
        mode: jobWizardMode,
        wizardTitle: jobWizardMode === PANEL_EDIT_MODE ? 'Edit job' : undefined,
        onSuccessRequest: () => refreshJobs(filters)
      })

      setJobWizardIsOpened(true)
    }
  }, [
    editableItem?.project,
    editableItem?.scheduled_object,
    filters,
    jobWizardIsOpened,
    jobWizardMode,
    params,
    refreshJobs,
    setEditableItem,
    setJobWizardIsOpened,
    setJobWizardMode
  ])

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: tableContent
    },
    heightData: {
      headerRowHeight: cssVariables.scheduledJobsHeaderRowHeight,
      rowHeight: cssVariables.scheduledJobsRowHeight,
      rowHeightExtended: cssVariables.scheduledJobsRowHeightExtended
    }
  })

  return (
    <>
      {jobsStore.loading && <Loader />}
      {jobsStore.loading ? null : jobs.length === 0 ? (
        <NoData
          message={getNoDataMessage(
            filters,
            filtersConfig,
            requestErrorMessage,
            JOBS_PAGE,
            SCHEDULE_TAB,
            filtersStore
          )}
        />
      ) : (
        <>
          <Table
            actionsMenu={actionsMenu}
            pageData={pageData}
            retryRequest={handleRefreshWithFilters}
            tab={SCHEDULE_TAB}
            tableClassName="scheduled-jobs-table"
            tableHeaders={tableContent[0]?.content ?? []}
            virtualizationConfig={virtualizationConfig}
          >
            {tableContent.map(
              (tableItem, index) =>
                isRowRendered(virtualizationConfig, index) && (
                  <JobsTableRow actionsMenu={actionsMenu} key={index} rowItem={tableItem} />
                )
            )}
          </Table>
        </>
      )}
    </>
  )
}

ScheduledJobsTable.propTypes = {
  context: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filtersConfig: FILTERS_CONFIG.isRequired,
  jobs: PropTypes.array.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  requestErrorMessage: PropTypes.string.isRequired
}

export default ScheduledJobsTable
