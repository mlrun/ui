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

import { Loader, PopUpDialog } from 'igz-controls/components'
import StatsCard from '../../common/StatsCard/StatsCard'

import { generateMonitoringStats } from '../../utils/generateMonitoringData'
import { JOBS_MONITORING_SCHEDULED_TAB } from '../../constants'

import ClockIcon from 'igz-controls/images/clock.svg?react'

import './projectsMonitoringCounters.scss'

const ScheduledJobsCounters = () => {
  const navigate = useNavigate()
  const { projectName } = useParams()
  const projectStore = useSelector(store => store.projectStore)
  const [showPopup, setShowPopup] = useState(false)
  const anchorRef = useRef(null)
  const detailsRef = useRef(null)
  const timeLabel = projectName ? '24 hrs' : 'Next 24 hrs'

  const handleOpenPopUp = () => {
    const isHidden = !detailsRef.current?.offsetParent
    setShowPopup(isHidden)
  }

  const handleClosePopUp = () => {
    setShowPopup(false)
  }

  const scheduledData = useMemo(() => {
    if (projectName) {
      const jobs = projectStore.projectSummary?.data?.distinct_scheduled_jobs_pending_count || 0
      const workflows =
        projectStore.projectSummary?.data?.distinct_scheduled_pipelines_pending_count || 0

      return {
        jobs,
        workflows,
        total: jobs + workflows
      }
    }
    return (
      projectStore?.jobsMonitoringData.scheduled || {
        jobs: 0,
        workflows: 0,
        total: 0
      }
    )
  }, [
    projectName,
    projectStore.projectSummary?.data?.distinct_scheduled_jobs_pending_count,
    projectStore.projectSummary?.data?.distinct_scheduled_pipelines_pending_count,
    projectStore.jobsMonitoringData?.scheduled
  ])

  const scheduledStats = useMemo(
    () => generateMonitoringStats(scheduledData, navigate, JOBS_MONITORING_SCHEDULED_TAB),
    [navigate, scheduledData]
  )

  return (
    <div onMouseEnter={handleOpenPopUp} onMouseLeave={handleClosePopUp}>
      <StatsCard className="monitoring-stats">
        <div ref={anchorRef}>
          <StatsCard.Header title="Scheduled">
            <div className="project-card__info">
              <ClockIcon className="project-card__info-icon" />
              <span>{timeLabel}</span>
            </div>
          </StatsCard.Header>
          <StatsCard.Row>
            <div
              className="stats__counter_header stats__link"
              data-testid="scheduled_total_counter"
              onClick={scheduledStats?.total?.link}
            >
              <div className="stats__counter">
                {projectStore?.projectsSummary?.loading ? (
                  <Loader section small secondary />
                ) : (
                  scheduledStats.total.counter
                )}
              </div>
            </div>
          </StatsCard.Row>
          <div ref={detailsRef} className="stats__details">
            <StatsCard.Row>
              <div
                className="stats__link stats__line"
                onClick={scheduledStats?.jobs?.link}
                data-testid="scheduled_jobs_counter"
              >
                <h6 className="stats__subtitle">Jobs</h6>
                <div className="stats__counter">
                  {projectStore.projectsSummary.loading ? (
                    <Loader section small secondary />
                  ) : (
                    scheduledStats.jobs.counter.toLocaleString()
                  )}
                </div>
              </div>
            </StatsCard.Row>
            <StatsCard.Row>
              <div
                className="stats__link"
                onClick={scheduledStats.workflows.link}
                data-testid="scheduled_workflows_counter"
              >
                <h6 className="stats__subtitle">Workflows</h6>
                <div className="stats__counter">
                  {projectStore.projectsSummary.loading ? (
                    <Loader section small secondary />
                  ) : (
                    scheduledStats.workflows.counter.toLocaleString()
                  )}
                </div>
              </div>
            </StatsCard.Row>
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
              <div className={'card-popup_text'}>
                <div className="card-popup_text_link" onClick={scheduledStats.jobs.link}>
                  Runs: {scheduledStats.workflows.counter}
                </div>
                <div className="card-popup_text_link" onClick={scheduledStats.workflows.link}>
                  Workflows: {scheduledStats.workflows.counter}
                </div>
              </div>
            </PopUpDialog>
          )}
        </div>
      </StatsCard>
    </div>
  )
}

export default React.memo(ScheduledJobsCounters)
