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
import classNames from 'classnames'
import { useParams } from 'react-router-dom'

import AlertsCounters from '../../../elements/ProjectsMonitoringCounters/AlertsCounters'
import ApplicationCounter from '../../../elements/ProjectsMonitoringCounters/ApplicationCounters'
import DataAndArtifactsCounter from '../../../elements/ProjectsMonitoringCounters/ArtifactsCounters'
import ModelsAndApplication from '../../../elements/ProjectsMonitoringCounters/ModelsCounters'
import PageHeader from '../../../elements/PageHeader/PageHeader'
import RunCounter from '../../../elements/ProjectsMonitoringCounters/RunsCounters'
import ScheduledJobsCounters from '../../../elements/ProjectsMonitoringCounters/ScheduledJobsCounters'
import WorkflowsCounters from '../../../elements/ProjectsMonitoringCounters/WorkflowsCounters'

import { COUNTERS_GENERAL_MESSAGE } from '../../../constants'

import './projectsMonitoring.scss'

const ProjectsMonitoring = () => {
  const { projectName } = useParams()
  const monitoringStatsClassName = classNames(
    'projects-monitoring-stats',
    projectName ? 'projects-monitoring-stats_narrow' : 'projects-monitoring-stats_wide'
  )

  return (
    <div className="projects-monitoring-container">
      {!projectName && <PageHeader title="Monitoring" tip={COUNTERS_GENERAL_MESSAGE} />}
      <div className={monitoringStatsClassName}>
        <DataAndArtifactsCounter />
        {!projectName && <RunCounter />}
        {/* Todo: Delete WorkflowsCounters after ML-5460 is impplemented */}
        <WorkflowsCounters />
        <ScheduledJobsCounters />
        <div className="card__small-container">
          <ModelsAndApplication />
          {projectName && <ApplicationCounter />}
        </div>
        <AlertsCounters />
        {/* Todo: implement as part of ML-5460
        <ModelEndpointsCounters /> */}
      </div>
    </div>
  )
}

export default ProjectsMonitoring
