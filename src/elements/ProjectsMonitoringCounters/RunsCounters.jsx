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
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import StatsCard from '../../common/StatsCard/StatsCard'
import { Loader, PopUpDialog, TextTooltipTemplate, Tooltip } from 'igz-controls/components'

import { generateMonitoringStats } from '../../utils/generateMonitoringData'
import { JOBS_MONITORING_JOBS_TAB } from '../../constants'

import ClockIcon from 'igz-controls/images/clock.svg?react'

import './projectsMonitoringCounters.scss'

const RunCounter = () => {
  const anchorRef = useRef(null)
  const detailsRef = useRef(null)
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()
  const projectStore = useSelector(store => store.projectStore)

  const handleOpenPopUp = () => {
    const isHidden = !detailsRef.current?.offsetParent
    setShowPopup(isHidden)
  }

  const handleClosePopUp = () => {
    setShowPopup(false)
  }
  const jobStats = useMemo(
    () =>
      generateMonitoringStats(
        projectStore.jobsMonitoringData.jobs,
        navigate,
        JOBS_MONITORING_JOBS_TAB
      ),
    [navigate, projectStore.jobsMonitoringData.jobs]
  )

  return (
    <StatsCard className="monitoring-stats">
      <div ref={anchorRef}>
        <StatsCard.Header
          title="Runs"
          tip="Number of Job runs, clicking on the counters navigates to jobs screen."
        >
          <div className="project-card__info">
            <ClockIcon className="project-card__info-icon" />
            <span>Last 24 hrs</span>
          </div>
        </StatsCard.Header>
        <div onMouseLeave={handleClosePopUp} onMouseEnter={handleOpenPopUp}>
          <StatsCard.Row>
            <div
              className="stats__link stats__counter_header"
              data-testid="scheduled_total_counter"
              onClick={jobStats.total.link}
            >
              <div className="stats__counter">
                {projectStore.projectsSummary.loading ? (
                  <Loader section small secondary />
                ) : (
                  jobStats.total.counter.toLocaleString()
                )}
              </div>
            </div>
          </StatsCard.Row>

          <div ref={detailsRef} className="stats__details">
            {jobStats?.counters?.map(
              ({ counter, className, counterClassName, label, link, statusClass, tooltip }) => {
                return (
                  <StatsCard.Row key={`${statusClass}-runs`}>
                    <div
                      className={className}
                      onClick={link}
                      data-testid={`run_${statusClass}_counter`}
                    >
                      <div data-testid={`run_${statusClass}_status`} className="stats__status">
                        <Tooltip textShow template={<TextTooltipTemplate text={tooltip} />}>
                          <h6 className="stats__subtitle">{label}</h6>
                          <i className={`state-${statusClass}`} />
                        </Tooltip>
                      </div>
                      <div className={counterClassName}>
                        {projectStore?.projectsSummary?.loading ? (
                          <Loader section small secondary />
                        ) : (
                          counter.toLocaleString()
                        )}
                      </div>
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
                {jobStats?.counters?.map(({ link, counter, label, statusClass }) => (
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

export default React.memo(RunCounter)
