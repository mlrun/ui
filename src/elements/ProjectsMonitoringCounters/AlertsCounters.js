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
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useSelector } from 'react-redux'

import Loader from '../../common/Loader/Loader'
import StatsCard from '../../common/StatsCard/StatsCard'
import { ReactComponent as Alerts } from 'igz-controls/images/alerts.svg'
import { ReactComponent as ClockIcon } from 'igz-controls/images/clock.svg'

import { generateAlertsStats } from '../../utils/generateAlertsStats'

import './projectsMonitoringCounters.scss'

const AlertsCounters = () => {
  const { projectName: paramProjectName } = useParams()
  const navigate = useNavigate()
  const projectStore = useSelector(store => store.projectStore)

  const alertsData = useMemo(() => {
    const path = pathname === '/projects' ? '*' : paramProjectName
    const defaultAlertData = {
      endpoint: 0,
      jobs: 0,
      application: 0,
      total: 0
    }

    if (path !== '*') {
      const endpoint = projectStore.projectSummary.data.endpoint_alerts_count || 0
      const jobs = projectStore.projectSummary.data.job_alerts_count || 0
      const application = projectStore.projectSummary.data.other_alerts_count || 0

      return {
        projectName: path,
        data: {
          endpoint,
          jobs,
          application,
          total: endpoint + jobs + application
        }
      }
    }

    return {
      projectName: path,
      data: projectStore.jobsMonitoringData.alerts || defaultAlertData
    }
  }, [
    pathname,
    paramProjectName,
    projectStore.jobsMonitoringData.alerts,
    projectStore.projectSummary.data.endpoint_alerts_count,
    projectStore.projectSummary.data.job_alerts_count,
    projectStore.projectSummary.data.other_alerts_count
  ])

  const alertsStats = useMemo(
    () => generateAlertsStats(alertsData.data, navigate, alertsData.projectName),
    [navigate, alertsData]
  )

  return (
    <StatsCard className="monitoring-stats alerts-card">
      <StatsCard.Header title="Alerts" icon={<Alerts />} iconClass="stats-card__title-icon">
        <StatsCard.Col>
          <div className="project-card__info">
            <span className="stats__subtitle">Total</span>
            <div
              className="stats__counter"
              onClick={() => alertsStats.all.link()}
              data-testid="alerts_total_counter"
            >
              {projectStore.projectsSummary.loading ? (
                <Loader section small secondary />
              ) : (
                (projectStore.jobsMonitoringData.alerts.total || 0).toLocaleString()
              )}
            </div>
            <ClockIcon className="project-card__info-icon" />
            <span>Last 24 hours</span>
          </div>
        </StatsCard.Col>
      </StatsCard.Header>
      <StatsCard.Row>
        <StatsCard.Col>
          <div
            className="stats__link"
            onClick={alertsStats.endpoints.link}
            data-testid="alerts_endpoint_counter"
          >
            <div className="stats__counter">
              {projectStore.projectsSummary.loading ? (
                <Loader section small secondary />
              ) : (
                projectStore.jobsMonitoringData.alerts.endpoint
              )}
            </div>
            <h6 className="stats__subtitle">Endpoint</h6>
          </div>
        </StatsCard.Col>
        <StatsCard.Col>
          <div
            className="stats__link"
            onClick={alertsStats.job.link}
            data-testid="alerts_jobs_counter"
          >
            <div className="stats__counter">
              {projectStore.projectsSummary.loading ? (
                <Loader section small secondary />
              ) : (
                (projectStore.jobsMonitoringData.alerts.jobs || 0).toLocaleString()
              )}
            </div>
            <h6 className="stats__subtitle">Jobs</h6>
          </div>
        </StatsCard.Col>
        <StatsCard.Col>
          <div
            className="stats__link"
            onClick={alertsStats.application.link}
            data-testid="alerts_application_counter"
          >
            <div className="stats__counter">
              {projectStore.projectsSummary.loading ? (
                <Loader section small secondary />
              ) : (
                (projectStore.jobsMonitoringData.alerts.application || 0).toLocaleString()
              )}
            </div>
            <h6 className="stats__subtitle">Application</h6>
          </div>
        </StatsCard.Col>
      </StatsCard.Row>
    </StatsCard>
  )
}

export default React.memo(AlertsCounters)
