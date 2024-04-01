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
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'

import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'

import projectsAction from '../../actions/projects'

import { STATS_TOTAL_CARD, tabs } from './projectsJobsMotinoring.util'
import {
  JOBS_MONITORING_JOBS_TAB,
  JOBS_MONITORING_PAGE,
  JOBS_MONITORING_SCHEDULED_TAB,
  JOBS_MONITORING_WORKFLOWS_TAB
} from '../../constants'

export const ProjectJobsMonitoringContext = React.createContext({})

const ProjectsJobsMonitoring = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { jobsMonitoringData } = useSelector(store => store.projectStore)
  const [selectedCard, setSelectedCard] = useState(
    jobsMonitoringData.filters?.status || STATS_TOTAL_CARD
  )

  // TODO: add group by;
  //  add name filter;
  //  change time filter if the user changed the date filter in projects page
  const [filters] = useState({
    dates: {
      value: [new Date(moment().add(-1, 'days'))]
    }
  })
  const tabId = useMemo(() => {
    return location.pathname.includes(JOBS_MONITORING_SCHEDULED_TAB)
      ? JOBS_MONITORING_SCHEDULED_TAB
      : location.pathname.includes(JOBS_MONITORING_WORKFLOWS_TAB)
      ? JOBS_MONITORING_WORKFLOWS_TAB
      : JOBS_MONITORING_JOBS_TAB
  }, [location.pathname])
  const [selectedTab, setSelectedTab] = useState(tabId)

  useEffect(() => {
    dispatch(projectsAction.removeJobsMonitoringFilters())
  }, [dispatch])

  const handleTabChange = tabName => {
    setSelectedCard(STATS_TOTAL_CARD)
    setSelectedTab(tabName)
    navigate(`/projects/jobs-monitoring/${tabName}`)
  }

  return (
    <div className="job-monitoring content-wrapper">
      <div className="content__header">
        <Breadcrumbs />
      </div>
      <div className="content">
        <div className="content__action-bar-wrapper">
          <ContentMenu
            activeTab={selectedTab}
            screen={JOBS_MONITORING_PAGE}
            onClick={handleTabChange}
            tabs={tabs}
          />
          <div className="action-bar">Filter menu</div>
        </div>
        <div>
          <ProjectJobsMonitoringContext.Provider
            value={{
              filters,
              jobsMonitoringData,
              selectedCard,
              setSelectedCard
            }}
          >
            <Outlet />
          </ProjectJobsMonitoringContext.Provider>
        </div>
      </div>
    </div>
  )
}

export default ProjectsJobsMonitoring
