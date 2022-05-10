import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import JobsTableRow from '../JobsTableRow/JobsTableRow'

import {
  createJobsMonitorTabContent,
  createJobsScheduleTabContent,
  createJobsWorkflowsTabContent
} from '../../utils/createJobsContent'
import { useMode } from '../../hooks/mode.hook'
import { MONITOR_JOBS_TAB, SCHEDULE_TAB } from '../../constants'
import { ACTIONS_MENU } from '../../types'

const JobsTable = ({ actionsMenu, content, handleSelectJob, selectedJob, tab }) => {
  const params = useParams()
  const { isStagingMode } = useMode()

  const monitorTabContent = useMemo(
    () => createJobsMonitorTabContent(content, params, isStagingMode),
    [content, isStagingMode, params]
  )

  const scheduleTabContent = useMemo(
    () => createJobsScheduleTabContent(content, params, isStagingMode),
    [content, isStagingMode, params]
  )

  const workflowsTabContent = useMemo(
    () => createJobsWorkflowsTabContent(content, params, isStagingMode, !isEmpty(selectedJob)),
    [content, isStagingMode, params, selectedJob]
  )

  const tableContent = useMemo(
    () =>
      tab === MONITOR_JOBS_TAB
        ? monitorTabContent
        : tab === SCHEDULE_TAB
        ? scheduleTabContent
        : workflowsTabContent,
    [monitorTabContent, scheduleTabContent, tab, workflowsTabContent]
  )

  return (
    <>
      <div className="table-head">
        {tableContent[0]?.content?.map((tableItem, index) =>
          tableItem.type !== 'hidden' ? (
            <div
              className={`table-head__item ${tableItem.class}`}
              key={`${tableItem.header}${index}`}
            >
              <Tooltip template={<TextTooltipTemplate text={tableItem.header} />}>
                {tableItem.header}
              </Tooltip>
            </div>
          ) : null
        )}
        <div className="table-body__cell action_cell" />
      </div>
      <div className="table-body">
        {tableContent.map((tableItem, index) => (
          <JobsTableRow
            actionsMenu={actionsMenu}
            content={content}
            handleSelectJob={handleSelectJob}
            selectedJob={selectedJob}
            key={index}
            rowItem={tableItem}
            tab={tab}
          />
        ))}
      </div>
    </>
  )
}

JobsTable.defaultProps = {
  handleSelectJob: () => {},
  selectedJob: {}
}

JobsTable.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSelectJob: PropTypes.func,
  selectedJob: PropTypes.shape({}),
  tab: PropTypes.string.isRequired
}

export default JobsTable
