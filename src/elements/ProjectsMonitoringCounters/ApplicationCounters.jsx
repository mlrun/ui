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
import { useSelector } from 'react-redux'

import { APPLICATION } from '../../constants'
import StatsCard from '../../common/StatsCard/StatsCard'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from 'igz-controls/components'

import { generateMonitoringStats } from '../../utils/generateMonitoringData'

import './projectsMonitoringCounters.scss'

const ApplicationCounter = () => {
  const projectStore = useSelector(store => store.projectStore)
  const { projectName } = useParams()
  const navigate = useNavigate()

  const applicationData = projectName
    ? projectStore.projectSummary.data?.application_count || 0
    : projectStore.jobsMonitoringData?.application?.total || 0

  const data = useMemo(
    () => generateMonitoringStats(applicationData, navigate, APPLICATION, projectName),
    [applicationData, navigate, projectName]
  )

  return (
    <StatsCard className="monitoring-stats">
      <StatsCard.Header title="Application"></StatsCard.Header>
      <StatsCard.Row>
        <div
          className={data?.application?.className}
          data-testid="application_total_counter"
          onClick={data?.application?.link}
        >
          <div className="stats__counter">
            {projectStore?.projectsSummary?.loading ? (
              <Loader section small secondary />
            ) : (
              data?.application?.counter?.toLocaleString()
            )}
          </div>
        </div>
      </StatsCard.Row>
    </StatsCard>
  )
}

export default React.memo(ApplicationCounter)
