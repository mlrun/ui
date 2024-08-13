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
import YamlModal from '../../common/YamlModal/YamlModal'
import JobsTableRow from '../JobsTableRow/JobsTableRow'
import Table from '../../components/Table/Table'
import NoData from '../../common/NoData/NoData'
import Loader from '../../common/Loader/Loader'

import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import { DANGER_BUTTON, FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { FILTERS_CONFIG } from '../../types'
import { JOB_KIND_WORKFLOW, JOBS_PAGE, PANEL_EDIT_MODE, SCHEDULE_TAB } from '../../constants'
import { getErrorMsg, openPopUp } from 'igz-controls/utils/common.util'
import { getJobFunctionData } from '../../components/Jobs/jobs.util'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { isRowRendered, useVirtualization } from '../../hooks/useVirtualization.hook'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { useYaml } from '../../hooks/yaml.hook'

import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'
import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'

import cssVariables from './scheduledJobsTable.scss'

const ScheduledJobsTable = ({
  context,
  filters = null,
  filtersConfig = null,
  filtersMenuName = '',
  jobs,
  refreshJobs,
  requestErrorMessage,
  tableContent
}) => {
  const dispatch = useDispatch()
  const params = useParams()
  const jobsStore = useSelector(store => store.jobsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
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

  const handleRunJob = useCallback(
    job => {
      dispatch(
        jobsActions.handleRunScheduledJob(
          {
            ...job.scheduled_object
          },
          job.project || params.projectName,
          job.name
        )
      )
        .then(response => {
          dispatch(
            setNotification({
              status: response.status,
              id: Math.random(),
              message: 'The batch run was started'
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
        jobsActions.removeScheduledJob(params.projectName || schedule.project, schedule.name)
      ).then(response => {
        refreshJobs(filtersStore)
        dispatch(
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Job is successfully deleted'
          })
        )
      })

      setConfirmData(null)
    },
    [filtersStore, params.projectName, refreshJobs, setConfirmData, dispatch]
  )

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
      const fetchJobFunction = (functionProject, functionName, functionHash) => {
        return dispatch(jobsActions.fetchJobFunction(functionProject, functionName, functionHash))
      }

      getJobFunctionData(
        editableItem,
        fetchJobFunction,
        dispatch,
        functionsActions.fetchFunctionTemplate,
        jobsActions.fetchJobFunctionSuccess
      ).then(functionData => {
        setEditableItem({
          ...editableItem,
          scheduled_object: {
            ...editableItem.scheduled_object,
            function: functionData
          }
        })

        setJobWizardMode(PANEL_EDIT_MODE)
      })
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
        onSuccessRequest: () => refreshJobs(filtersStore)
      })

      setJobWizardIsOpened(true)
    }
  }, [
    editableItem?.project,
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
            filtersStore,
            filtersConfig || filters,
            requestErrorMessage,
            JOBS_PAGE,
            SCHEDULE_TAB,
            filtersMenuName
          )}
        />
      ) : (
        <>
          <Table
            actionsMenu={actionsMenu}
            pageData={pageData}
            retryRequest={refreshJobs}
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
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
      )}
    </>
  )
}

ScheduledJobsTable.propTypes = {
  context: PropTypes.object.isRequired,
  filters: PropTypes.array,
  filtersConfig: FILTERS_CONFIG,
  filtersMenuName: PropTypes.string,
  jobs: PropTypes.array.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  tableContent: PropTypes.array.isRequired
}

export default ScheduledJobsTable
