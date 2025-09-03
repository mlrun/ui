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
import classNames from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { defaults } from 'lodash'

import { Loader, PopUpDialog } from 'igz-controls/components'
import StatsCard from '../../common/StatsCard/StatsCard'

import { generateAlertsStats } from '../../utils/generateAlertsStats'

import Alerts from 'igz-controls/images/alerts.svg?react'
import ClockIcon from 'igz-controls/images/clock.svg?react'

import './projectsMonitoringCounters.scss'

const AlertsCounters = () => {
  const anchorRef = useRef(null)
  const detailsRef = useRef(null)
  const [showPopup, setShowPopup] = useState(false)
  const { projectName: paramProjectName } = useParams()
  const navigate = useNavigate()
  const projectStore = useSelector(store => store.projectStore)

  const handleOpenPopUp = () => {
    const isHidden = !detailsRef.current?.offsetParent
    setShowPopup(isHidden)
  }

  const handleClosePopUp = () => {
    setShowPopup(false)
  }

  const alertsData = useMemo(() => {
    const projectName = paramProjectName ? paramProjectName : '*'
    const defaultAlertData = {
      endpoint: 0,
      jobs: 0,
      application: 0,
      total: 0
    }

    if (projectName !== '*') {
      const endpoint = projectStore.projectSummary.data?.endpoint_alerts_count || 0
      const jobs = projectStore.projectSummary.data?.job_alerts_count || 0
      const application = projectStore.projectSummary.data?.other_alerts_count || 0

      return {
        projectName,
        data: {
          endpoint,
          jobs,
          application,
          total: endpoint + jobs + application
        }
      }
    }

    return {
      projectName,
      data: defaults({}, projectStore.jobsMonitoringData.alerts, defaultAlertData)
    }
  }, [
    paramProjectName,
    projectStore.jobsMonitoringData?.alerts,
    projectStore.projectSummary.data?.endpoint_alerts_count,
    projectStore.projectSummary.data?.job_alerts_count,
    projectStore.projectSummary.data?.other_alerts_count
  ])

  const alertsStats = useMemo(
    () => generateAlertsStats(alertsData.data, navigate, alertsData.projectName),
    [navigate, alertsData]
  )

  const alertsCardClass = classNames(
    'monitoring-stats',
    'alerts-card',
    alertsData.data.total && 'alerts-card_not-empty'
  )

  return (
    <StatsCard className={alertsCardClass}>
      <div ref={anchorRef}>
        <StatsCard.Header title="Alerts" icon={<Alerts />} iconClass="stats-card__title-icon">
          <div className="project-card__info">
            <ClockIcon className="project-card__info-icon" />
            <span>Last 24 hrs</span>
          </div>
        </StatsCard.Header>
        <div onMouseEnter={handleOpenPopUp} onMouseLeave={handleClosePopUp}>
          <StatsCard.Row>
            <StatsCard.MainCounter
              className="stats__link"
              id="alerts_total_counter"
              onClick={alertsStats?.total?.link}
            >
              {projectStore?.projectsSummary?.loading ? (
                <Loader section small secondary />
              ) : (
                alertsData?.data?.total?.toLocaleString()
              )}
            </StatsCard.MainCounter>
          </StatsCard.Row>
          <StatsCard.Col></StatsCard.Col>
          <div ref={detailsRef} className="stats__details">
            <StatsCard.Row>
              <div
                onClick={alertsStats.endpoints.link}
                className="stats__line stats__link"
                data-testid="alerts_endpoints_counter"
              >
                <h6 className="stats__subtitle">Endpoint</h6>
                <StatsCard.SecondaryCounter>
                  {projectStore?.projectsSummary?.loading ? (
                    <Loader section small secondary />
                  ) : (
                    alertsData?.data?.endpoint?.toLocaleString()
                  )}
                </StatsCard.SecondaryCounter>
              </div>
            </StatsCard.Row>
            <StatsCard.Row>
              <div
                className="stats__line stats__link"
                data-testid="alerts_job_counter"
                onClick={alertsStats?.job?.link}
              >
                <h6 className="stats__subtitle">Jobs</h6>
                <StatsCard.SecondaryCounter>
                  {projectStore?.projectsSummary?.loading ? (
                    <Loader section small secondary />
                  ) : (
                    alertsData?.data?.jobs?.toLocaleString()
                  )}
                </StatsCard.SecondaryCounter>
              </div>
            </StatsCard.Row>
            <StatsCard.Row>
              <div
                onClick={alertsStats.application.link}
                className="stats__line stats__link"
                data-testid="alerts_application_counter"
              >
                <div className="stats__subtitle">Application</div>
                <StatsCard.SecondaryCounter>
                  {projectStore.projectsSummary.loading ? (
                    <Loader section small secondary />
                  ) : (
                    alertsData?.data?.application?.toLocaleString()
                  )}
                </StatsCard.SecondaryCounter>
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
              <div className="card-popup_text">
                <div className="card-popup_text_link" onClick={alertsStats?.endpoints?.link}>
                  Endpoint: {alertsData?.data?.endpoint}
                </div>
                <div className="card-popup_text_link" onClick={alertsStats?.job?.link}>
                  Jobs: {alertsData?.data?.jobs}
                </div>
                <div className="card-popup_text_link" onClick={alertsStats?.application?.link}>
                  Application: {alertsData?.data?.application}
                </div>
              </div>
            </PopUpDialog>
          )}
        </div>
      </div>
    </StatsCard>
  )
}

export default React.memo(AlertsCounters)
