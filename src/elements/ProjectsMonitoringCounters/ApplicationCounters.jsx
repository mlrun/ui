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
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { Loader, PopUpDialog } from 'igz-controls/components'

import { APPLICATION } from '../../constants'
import StatsCard from '../../common/StatsCard/StatsCard'
import { generateMonitoringStats } from '../../utils/generateMonitoringData'

import './projectsMonitoringCounters.scss'

const ApplicationCounter = () => {
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

  const applicationData = useMemo(() => {
    if (projectName) {
      const running = projectStore.projectSummary.data?.running_model_monitoring_functions || 0
      const failed = projectStore.projectSummary.data?.failed_model_monitoring_functions || 0

      return {
        running,
        failed,
        total: running + failed
      }
    }
    return (
      projectStore.jobsMonitoringData?.monitoring_app || {
        running: 0,
        failed: 0,
        total: 0
      }
    )
  }, [
    projectName,
    projectStore.projectSummary.data?.running_model_monitoring_functions,
    projectStore.projectSummary.data?.failed_model_monitoring_functions,
    projectStore.jobsMonitoringData?.monitoring_app
  ])

  const applicationStats = useMemo(
    () => generateMonitoringStats(applicationData, navigate, APPLICATION, projectName),
    [applicationData, navigate, projectName]
  )

  return (
    <StatsCard className="monitoring-stats application-card">
      <div ref={anchorRef}>
        <StatsCard.Header title="Monitoring apps"></StatsCard.Header>
        <div onMouseEnter={handleOpenPopUp} onMouseLeave={handleClosePopUp}>
          <StatsCard.Row>
            <StatsCard.MainCounter
              className={applicationStats.total.className}
              id="application_total_counter"
              onClick={applicationStats?.total?.link}
            >
              {projectStore.projectsSummary.loading ? (
                <Loader section small secondary />
              ) : (
                applicationStats?.total?.counter?.toLocaleString()
              )}
            </StatsCard.MainCounter>
          </StatsCard.Row>
          <div ref={detailsRef} className="stats__details">
            <StatsCard.Row>
              {applicationStats.counters.map(({ counter, className, label, statusClass, link }) => (
                <div key={`${statusClass}-app`} className="stats-card__col">
                  <StatsCard.MainCounter
                    id={`app_${statusClass}_counter`}
                    className={className}
                    onClick={link}
                  >
                    {projectStore?.projectsSummary?.loading ? (
                      <Loader section small secondary />
                    ) : (
                      counter.toLocaleString()
                    )}
                  </StatsCard.MainCounter>
                  <div className="stats__status">
                    <h6 className="stats__subtitle">{label}</h6>
                    <i className={`state-${statusClass}`} />
                  </div>
                </div>
              ))}
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
              <div className="card-popup_text">
                {applicationStats?.counters?.map(
                  ({ link, counter, label, statusClass, popUpClassName }) => (
                    <div onClick={link} key={label}>
                      <i className={`state-${statusClass}`} />{' '}
                      <span className={popUpClassName}>
                        {label}: {counter}
                      </span>
                    </div>
                  )
                )}
              </div>
            </PopUpDialog>
          )}
        </div>
      </div>
    </StatsCard>
  )
}

export default React.memo(ApplicationCounter)
