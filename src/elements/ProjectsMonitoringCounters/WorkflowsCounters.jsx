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
import React, { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Loader, PopUpDialog, TextTooltipTemplate, Tooltip } from 'igz-controls/components'
import ClockIcon from 'igz-controls/images/clock.svg?react'

import StatsCard from '../../common/StatsCard/StatsCard'
import { generateMonitoringStats } from '../../utils/generateMonitoringData'
import { JOBS_MONITORING_WORKFLOWS_TAB, MONITOR_WORKFLOWS_TAB } from '../../constants'

import './projectsMonitoringCounters.scss'

const WorkflowsCounters = () => {
  const anchorRef = useRef(null)
  const detailsRef = useRef(null)
  const [showPopup, setShowPopup] = useState(false)
  const { projectName } = useParams()
  const navigate = useNavigate()
  const projectStore = useSelector(store => store.projectStore)

  const handleOpenPopUp = () => {
    const isHidden = !detailsRef.current?.offsetParent
    setShowPopup(isHidden)
  }

  const handleClosePopUp = () => {
    setShowPopup(false)
  }

  const workflowsData = useMemo(() => {
    if (projectName) {
      const completed = projectStore?.projectSummary.data?.pipelines_completed_recent_count || 0
      const failed = projectStore?.projectSummary.data?.pipelines_failed_recent_count || 0
      const running = projectStore?.projectSummary.data?.pipelines_running_count || 0

      return {
        completed,
        failed,
        running,
        total: completed + failed + running
      }
    }

    return (
      projectStore.jobsMonitoringData.workflows || {
        completed: 0,
        failed: 0,
        running: 0,
        total: 0
      }
    )
  }, [
    projectName,
    projectStore.projectSummary.data?.pipelines_completed_recent_count,
    projectStore.projectSummary.data?.pipelines_failed_recent_count,
    projectStore.projectSummary.data?.pipelines_running_count,
    projectStore.jobsMonitoringData.workflows
  ])

  const workflowsStats = useMemo(
    () =>
      generateMonitoringStats(
        workflowsData,
        navigate,
        projectName ? MONITOR_WORKFLOWS_TAB : JOBS_MONITORING_WORKFLOWS_TAB,
        projectName
      ),
    [navigate, projectName, workflowsData]
  )

  return (
    <StatsCard className="monitoring-stats">
      <div ref={anchorRef}>
        <StatsCard.Header title="Workflows">
          <div className="project-card__info">
            <ClockIcon className="project-card__info-icon" />
            <span>Last 24 hrs</span>
          </div>
        </StatsCard.Header>
        <div onMouseLeave={handleClosePopUp} onMouseEnter={handleOpenPopUp}>
          <StatsCard.Row>
            <StatsCard.MainCounter
              className="stats__link"
              id="wf_total_counter"
              onClick={workflowsStats?.total?.link}
            >
              {projectStore?.projectsSummary?.loading ? (
                <Loader section small secondary />
              ) : (
                workflowsStats?.total?.counter?.toLocaleString()
              )}
            </StatsCard.MainCounter>
          </StatsCard.Row>

          <div ref={detailsRef} className="stats__details">
            {workflowsStats.counters.map(
              ({ counter, className, counterClassName, label, link, statusClass, tooltip }) => {
                return (
                  <StatsCard.Row key={`${statusClass}-jobs`}>
                    <div
                      className={className}
                      onClick={link}
                      data-testid={`wf_${statusClass}_counter`}
                    >
                      <div data-testid={`wf_${statusClass}_status`} className="stats__status">
                        <Tooltip textShow template={<TextTooltipTemplate text={tooltip} />}>
                          <h6 className="stats__subtitle">{label}</h6>
                          <i className={`state-${statusClass}`} />
                        </Tooltip>
                      </div>
                      <StatsCard.SecondaryCounter className={counterClassName}>
                        {projectStore?.projectsSummary?.loading ? (
                          <Loader section small secondary />
                        ) : (
                          counter?.toLocaleString()
                        )}
                      </StatsCard.SecondaryCounter>
                    </div>
                  </StatsCard.Row>
                )
              }
            )}
          </div>

          {showPopup && (
            <PopUpDialog
              className="card-popup"
              customPosition={{
                element: anchorRef,
                position: 'bottom-right'
              }}
              headerIsHidden
            >
              <div className="card-popup_text">
                {workflowsStats?.counters?.map(({ link, counter, label, statusClass }) => (
                  <div onClick={link} key={label}>
                    <i className={`state-${statusClass}`} />{' '}
                    <span className="card-popup_text_link">
                      {label}: {counter}
                    </span>
                  </div>
                ))}
              </div>
            </PopUpDialog>
          )}
        </div>
      </div>
    </StatsCard>
  )
}

export default React.memo(WorkflowsCounters)
