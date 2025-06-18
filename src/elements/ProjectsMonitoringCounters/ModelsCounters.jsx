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
import React from 'react'
import { useSelector } from 'react-redux'

import StatsCard from '../../common/StatsCard/StatsCard'
import { Loader } from 'igz-controls/components'
import { useNavigate, useParams } from 'react-router-dom'
import classNames from 'classnames'

import './projectsMonitoringCounters.scss'

const ModelsAndApplication = () => {
  const projectStore = useSelector(store => store.projectStore)
  const { projectName } = useParams()
  const navigate = useNavigate()

  const modelsData = projectName
    ? projectStore.projectSummary.data?.models_count || 0
    : projectStore.jobsMonitoringData?.models?.total || 0

  return (
    <StatsCard className="monitoring-stats">
      <StatsCard.Header title="Models"></StatsCard.Header>
      <StatsCard.Row>
        <div
          className={classNames('stats__counter_header', {
            stats__link: projectName
          })}
          data-testid="scheduled_total_counter"
          onClick={() => {
            projectName && navigate(`/projects/${projectName}/models`)
          }}
        >
          <div className="stats__counter">
            {projectStore.projectsSummary.loading ? (
              <Loader section small secondary />
            ) : (
              modelsData.toLocaleString()
            )}
          </div>
        </div>
      </StatsCard.Row>
    </StatsCard>
  )
}

export default React.memo(ModelsAndApplication)
