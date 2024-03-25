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
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ContentMenu from '../../elements/ContentMenu/ContentMenu'

import { tabs } from './projectsJobsMotinoring.util'
import { JOBS_MONITORING_PAGE } from '../../constants'

import './projectsJobsMonitoring.scss'

const ProjectsJobsMonitoring = () => {
  const { tabId } = useParams()
  const [selectedTab, setSelectedTab] = useState(tabId)
  const navigate = useNavigate()

  const handleTabChange = tabName => {
    setSelectedTab(tabName)
    navigate(`/projects/jobs-monitoring/${tabName}`)
  }

  return (
    <div className="job-monitoring content-wrapper">
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
        <div className="jobs-cards-wrapper">
          Cards
        </div>
      </div>
    </div>
  )
}

export default ProjectsJobsMonitoring
